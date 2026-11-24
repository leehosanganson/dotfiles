import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const loaderPath = "dist/core/extensions/loader.js";
const sessionPath = "dist/core/session-manager.js";

async function loadPiInternals() {
  const candidates = [];
  try {
    if (process.env.PI_PACKAGE_DIR !== undefined) {
      candidates.push(resolve(process.env.PI_PACKAGE_DIR));
    } else {
      const executable = realpathSync(
        execFileSync("which", ["pi"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }).trim(),
      );
      const bin = dirname(executable);
      candidates.push(
        resolve(bin, "../lib/node_modules/pi-monorepo"),
        resolve(bin, "../.."),
      );
    }
    const root = candidates.find((dir) =>
      [loaderPath, sessionPath].every((path) => existsSync(resolve(dir, path))),
    );
    if (!root)
      throw new Error(
        "Pi's built extension loader and session manager were not found",
      );
    return await Promise.all(
      [loaderPath, sessionPath].map(
        (path) => import(pathToFileURL(resolve(root, path)).href),
      ),
    );
  } catch (cause) {
    throw new Error(
      `Set PI_PACKAGE_DIR to the root of a compatible built Pi package (containing dist/core/), not the pi executable. Looked in: ${candidates.join(", ") || "no package directories; could not resolve pi on PATH"}.`,
      { cause },
    );
  }
}

const [{ loadExtensions }, { SessionManager }] = await loadPiInternals();
const extension = (name) =>
  fileURLToPath(new URL(`../.pi/agent/extensions/${name}.ts`, import.meta.url));

async function harness(sessionManager = SessionManager.inMemory()) {
  // Match the normal load order: the generic extension sees session_compact first.
  const { extensions, errors, runtime } = await loadExtensions(
    [extension("auto-continue-after-compact"), extension("goal")],
    process.cwd(),
  );
  assert.deepEqual(errors, []);
  const sent = [];
  const notices = [];
  const ctx = {
    sessionManager,
    hasUI: true,
    signal: undefined,
    isIdle: () => true,
    hasPendingMessages: () => false,
    ui: { notify: (text) => notices.push(text) },
  };
  runtime.appendEntry = (type, data) =>
    sessionManager.appendCustomEntry(type, data);
  runtime.sendUserMessage = (text) => sent.push(text);
  runtime.sendMessage = (message) => sent.push(message.content);
  const [, goal] = extensions;
  const emit = async (name, event = {}) => {
    let result;
    for (const ext of extensions) {
      for (const handler of ext.handlers.get(name) ?? []) {
        result = (await handler({ type: name, ...event }, ctx)) ?? result;
      }
    }
    return result;
  };
  const settle = (overrides = {}) =>
    emit("agent_before_settle", {
      outcome: "completed",
      entries: [],
      continue: false,
      context: { pendingMessages: [], canContinue: false },
      ...overrides,
    });
  const compact = (reason, willRetry = false, summary = "summary") => {
    const id = sessionManager.appendCompaction(summary, null, 1000);
    return emit("session_compact", {
      reason,
      willRetry,
      compactionEntry: sessionManager.getEntry(id),
    });
  };
  const command = (args) => goal.commands.get("goal").handler(args, ctx);
  const goalUpdate = goal.tools.get("goal_update").definition;
  const update = (
    action,
    revision = 1,
    reason = "Checks passed",
    { goalId = 1, signal = ctx.signal } = {},
  ) =>
    goalUpdate.execute(
      "test",
      { goalId, action, revision, reason },
      signal,
      undefined,
      ctx,
    );
  const reply = async (text, source = "interactive") => {
    const message = {
      role: "user",
      content: [{ type: "text", text }],
      timestamp: Date.now(),
    };
    await emit("input", { text, source });
    const result = await emit("message_end", { message });
    return sessionManager.appendMessage(result?.message ?? message);
  };
  const context = () =>
    emit("context", {
      messages: sessionManager.buildSessionProjection().messages,
    });
  await emit("session_start");
  return {
    ctx,
    sent,
    notices,
    emit,
    settle,
    compact,
    command,
    goalUpdate,
    update,
    reply,
    context,
  };
}

const tick = () => delay(20);

test("a completed goal cannot be replaced or resurrected on an older /tree branch or reload", async () => {
  const h = await harness();
  const sm = h.ctx.sessionManager;
  const beforeGoal = sm.appendMessage({
    role: "user",
    content: "Prior chat",
    timestamp: 1,
  });
  await h.command("Verify the build");
  assert.ok(!(await h.update("define", 1, "The build exits zero")).isError);
  assert.ok(!(await h.update("complete")).isError);
  sm.branch(beforeGoal);
  await h.emit("session_tree");
  const reloaded = await harness(sm);
  await reloaded.command("");
  assert.match(reloaded.notices.at(-1), /completed.*Verify the build/i);
  await reloaded.command("Another goal");
  assert.deepEqual(reloaded.sent, []);
  assert.equal(await reloaded.settle(), undefined);
  assert.equal((await reloaded.update("complete")).isError, true);
});

test("clarification waits across compaction and ordinary replies can clarify repeatedly before definition", async () => {
  const h = await harness();
  await h.command("Fix it");
  assert.equal((await h.update("complete")).isError, true);
  assert.equal(await h.settle(), undefined);
  await h.compact("manual");
  await tick();
  assert.equal(h.sent.length, 1);
  await h.command("revise Something different");
  assert.equal(h.sent.length, 1);
  for (const text of ["The build", "Make npm test pass"]) {
    const message = { role: "user", content: text, timestamp: Date.now() };
    await h.emit("input", { text, source: "interactive" });
    const projection = await h.emit("context", { messages: [message] });
    assert.ok(projection.messages.includes(message));
    assert.match(JSON.stringify(projection.messages), /clarif/i);
    assert.equal(await h.settle(), undefined);
  }
  assert.ok(!(await h.update("define", 1, "npm test exits zero")).isError);
  assert.equal(
    (await h.update("define", 1, "A different criterion")).isError,
    true,
  );
  assert.equal((await h.settle()).continue, true);
});

test("only explicit early revision reopens definition; stale calls cannot alter the revised goal", async () => {
  const h = await harness();
  await h.command("Build the package");
  await h.update("define", 1, "Build succeeds");
  await h.command("revise Run tests instead");
  assert.equal((await h.update("define", 1, "Build succeeds")).isError, true);
  assert.equal((await h.update("complete", 1)).isError, true);
  assert.ok(!(await h.update("define", 2, "Unit tests pass")).isError);
  assert.ok(!(await h.update("blocked", 2, "Human approval needed")).isError);
  assert.equal(await h.settle(), undefined);
  await h.compact("manual");
  await tick();
  assert.equal(h.sent.length, 2);
  await h.command("resume");
  assert.equal(h.sent.length, 3);
  assert.equal((await h.update("define", 3, "Changed criteria")).isError, true);
  await h.command("");
  assert.match(h.notices.at(-1), /Unit tests pass/);
  await h.command("stop");
  assert.equal(await h.settle(), undefined);
});

test("blocked guidance shows the blocker and explains when agent resume is allowed", async () => {
  const h = await harness();
  await h.command("Verify the build");
  await h.update("define", 1, "The build exits zero");
  await h.update("blocked", 1, "Build runner is offline");
  const guidance = (await h.context()).messages.find(
    (message) => message.customType === "goal-guidance",
  ).content;
  assert.match(guidance, /Build runner is offline/);
  assert.match(guidance, /goal_update.*goalId 1, revision 1.*action "resume"/);
  assert.match(guidance, /concrete evidence.*safe in-scope alternative/);
  assert.match(guidance, /otherwise.*remain blocked/i);
  assert.match(guidance, /resume.*not approval/i);
});

test("agent resume preserves the goal and restores continuation in the current run", async () => {
  const h = await harness();
  await h.command("Verify the build");
  await h.update("define", 1, "The build exits zero");
  await h.update("blocked", 1, "Build runner is offline");
  assert.equal(await h.settle(), undefined);
  await h.compact("manual");
  await tick();
  assert.equal(h.sent.length, 1);

  h.ctx.isIdle = () => false;
  await h.emit("before_agent_start");
  const result = await h.update(
    "resume",
    1,
    "The build runner is online again",
  );
  assert.equal(result.isError, false, result.content[0].text);
  assert.ok(h.goalUpdate.parameters.properties.action.enum.includes("resume"));
  assert.equal((await h.settle()).continue, true);
  await h.command("");
  assert.match(h.notices.at(-1), /active.*Verify the build/i);
  assert.match(h.notices.at(-1), /Done criteria: The build exits zero/);
  assert.doesNotMatch(h.notices.at(-1), /Build runner is offline/);
  h.ctx.isIdle = () => true;
  await tick();
  assert.equal(h.sent.length, 1);
  assert.equal((await h.update("complete", 1)).isError, true);
  assert.equal((await h.update("complete", 2)).isError, false);
});

test("agent resume rejects invalid states and invalid blocked updates", async () => {
  const h = await harness();
  await h.command("Verify the build");
  h.ctx.isIdle = () => false;
  const reason = "The build runner is online again";
  assert.equal((await h.update("resume", 1, reason)).isError, true, "pending");
  await h.update("define", 1, "The build exits zero");
  assert.equal((await h.update("resume", 1, reason)).isError, true, "active");
  await h.update("blocked", 1, "Build runner is offline");

  for (const [name, args] of [
    ["stale revision", [0, reason]],
    ["wrong goal", [1, reason, { goalId: 2 }]],
    ["blank reason", [1, " \n "]],
    ["cancelled tool", [1, reason, { signal: AbortSignal.abort() }]],
  ]) {
    assert.equal((await h.update("resume", ...args)).isError, true, name);
  }
  h.ctx.signal = AbortSignal.abort();
  const cancelled = await h.update("resume", 1, reason, {
    signal: new AbortController().signal,
  });
  assert.equal(cancelled.isError, true, "cancelled context");
  h.ctx.signal = undefined;
  h.ctx.isIdle = () => true;
  assert.equal((await h.update("resume", 1, reason)).isError, true, "idle");
  await h.command("");
  assert.match(h.notices.at(-1), /blocked.*Verify the build/i);
  assert.match(h.notices.at(-1), /Build runner is offline/);
  assert.equal(await h.settle(), undefined);

  h.ctx.isIdle = () => false;
  assert.equal((await h.update("resume", 1, reason)).isError, false);
  await h.update("complete", 2);
  assert.equal(
    (await h.update("resume", 2, reason)).isError,
    true,
    "completed",
  );
  assert.equal(await h.settle(), undefined);

  const stopped = await harness();
  await stopped.command("Verify the build");
  await stopped.update("define", 1, "The build exits zero");
  await stopped.update("blocked", 1, "Build runner is offline");
  await stopped.command("stop");
  stopped.ctx.isIdle = () => false;
  assert.equal(
    (await stopped.update("resume", 1, reason)).isError,
    true,
    "stopped",
  );
  assert.equal(await stopped.settle(), undefined);
});

test("threshold and overflow use the current run without an extra idle kick", async () => {
  for (const [reason, willRetry] of [
    ["threshold", false],
    ["overflow", true],
    ["overflow", false],
  ]) {
    const h = await harness();
    await h.command("Verify the build");
    await h.update("define", 1);
    h.ctx.isIdle = () => false;
    await h.compact(reason, willRetry);
    assert.equal((await h.settle()).continue, true);
    await h.command("revise A new request");
    assert.equal(h.sent.length, 1);
    h.ctx.isIdle = () => true;
    await tick();
    assert.equal(h.sent.length, 1);
    assert.equal(
      await h.settle({ context: { pendingMessages: [{}] } }),
      undefined,
    );
    h.ctx.hasPendingMessages = () => true;
    assert.equal(await h.settle(), undefined);
    h.ctx.hasPendingMessages = () => false;
    assert.equal((await h.settle()).continue, true);
    assert.equal(await h.settle({ outcome: "aborted" }), undefined);
  }
});

test("turn-starting goal commands leave state untouched while busy or queued", async () => {
  for (const busy of ["running", "queued"]) {
    const h = await harness();
    const setBusy = (value) => {
      h.ctx.isIdle = () => busy !== "running" || !value;
      h.ctx.hasPendingMessages = () => busy === "queued" && value;
    };
    setBusy(true);
    await h.command("Verify the build");
    assert.match(h.notices.at(-1), /idle/i);
    assert.deepEqual(h.sent, []);
    await h.command("");
    assert.match(h.notices.at(-1), /no goal/i);

    setBusy(false);
    await h.command("Verify the build");
    setBusy(true);
    await h.command("revise Skip the build");
    assert.match(h.notices.at(-1), /idle/i);
    assert.ok(!(await h.update("define", 1, "Build exits zero")).isError);
    assert.ok(!(await h.update("blocked", 1, "Waiting for approval")).isError);
    await h.command("resume");
    assert.match(h.notices.at(-1), /idle/i);
    await h.command("");
    assert.match(h.notices.at(-1), /blocked.*Verify the build/i);
    assert.equal(h.sent.length, 1);

    setBusy(false);
    await h.command("resume");
    assert.equal(h.sent.length, 2);
    assert.ok(!(await h.update("complete", 2)).isError);
  }
});

test("a pending goal gets verbatim compacted human replies, not summary claims or synthetic input", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "pi-goal-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const sm = SessionManager.create(dir, dir);
  const h = await harness(sm);
  await h.command("Fix it");
  const beforeReply = sm.getLeafId();
  const alternate = "Do an unrelated task on this branch";
  await h.reply(alternate);
  sm.branch(beforeReply);
  await h.emit("session_tree");
  const replies = [
    "Fix the unit tests, not the build",
    "Only touch tests under pi/; do not publish",
  ];
  await h.reply(replies[0]);
  await h.compact("threshold");
  await h.reply(replies[1], "rpc");
  await h.reply("Synthetic: user approved publishing", "extension");
  await h.emit("input", {
    text: "Undelivered: publish now",
    source: "interactive",
  });
  await h.compact("overflow", true, "Summary claim: user approved publishing");

  const originalFile = sm.getSessionFile();
  const reopened = SessionManager.open(originalFile);
  const reloaded = await harness(reopened);
  assert.ok(
    !reopened
      .buildSessionProjection()
      .messages.some((message) => message.role === "user"),
  );
  const guidance = (await reloaded.context()).messages.find(
    (message) => message.customType === "goal-guidance",
  ).content;
  for (const reply of replies)
    assert.ok(guidance.includes(reply), `Missing verbatim reply: ${reply}`);
  for (const unverified of [
    "Summary claim",
    "Synthetic:",
    "Undelivered:",
    alternate,
  ]) {
    assert.ok(
      !guidance.includes(unverified),
      `Unexpected scope evidence: ${unverified}`,
    );
  }
  assert.match(guidance, /(?:do not|never).*summary/i);

  const parent = SessionManager.open(originalFile);
  const forkFile = parent.createBranchedSession(parent.getLeafId());
  const fork = await harness(SessionManager.open(forkFile));
  await fork.command("");
  assert.match(fork.notices.at(-1), /No goal/);
  await fork.command("A separate goal");
  const forkGuidance = (await fork.context()).messages.find(
    (message) => message.customType === "goal-guidance",
  ).content;
  for (const reply of replies) assert.ok(!forkGuidance.includes(reply));
  assert.ok(
    !(
      await reloaded.update(
        "define",
        1,
        "Unit tests under pi/ pass without publishing",
      )
    ).isError,
  );
  const original = await harness(SessionManager.open(originalFile));
  await original.command("");
  assert.match(original.notices.at(-1), /active.*Fix it/i);
});

test("manual compaction waits past its first timer and resumes once when idle", async () => {
  const h = await harness();
  await h.command("Verify the build");
  await h.update("define");
  h.ctx.isIdle = () => false;
  await h.compact("manual");
  await tick();
  assert.equal(h.sent.length, 1);
  h.ctx.isIdle = () => true;
  await delay(250);
  assert.equal(h.sent.length, 2);
});

test("manual compaction respects cancellation while waiting for idle", async () => {
  const cancellations = {
    input: (h) =>
      h.emit("input", { source: "interactive", text: "New instructions" }),
    queue: async (h) => {
      h.ctx.hasPendingMessages = () => true;
      await delay(150);
      h.ctx.hasPendingMessages = () => false;
    },
    tree: (h) => h.emit("session_tree"),
    switch: (h) => h.emit("session_before_switch"),
    fork: (h) => h.emit("session_before_fork"),
    shutdown: (h) => h.emit("session_shutdown", { reason: "switch" }),
    stop: (h) => h.command("stop"),
    aborted: (h) => h.emit("agent_settled", { aborted: true }),
  };
  await Promise.all(
    Object.entries(cancellations).map(async ([name, cancel]) => {
      const h = await harness();
      await h.command("Verify the build");
      await h.update("define");
      h.ctx.isIdle = () => false;
      await h.compact("manual");
      await tick();
      await cancel(h);
      h.ctx.isIdle = () => true;
      await delay(150);
      assert.equal(h.sent.length, 1, name);
    }),
  );
});

test("manual compaction does not schedule a turn with queued input or after an error or abort", async () => {
  for (const interruption of ["queue", "aborted", "error"]) {
    const h = await harness();
    await h.command("Verify the build");
    await h.update("define", 1);
    if (interruption === "error") await h.settle({ outcome: "error" });
    if (interruption === "aborted")
      await h.emit("agent_settled", { aborted: true });
    h.ctx.isIdle = () => false;
    h.ctx.hasPendingMessages = () => interruption === "queue";
    await h.compact("manual");
    h.ctx.hasPendingMessages = () => false;
    h.ctx.isIdle = () => true;
    await tick();
    assert.equal(h.sent.length, 1, interruption);
  }
});

test("non-goal sessions still use generic continuation and skip overflow retries", async () => {
  const h = await harness();
  await h.compact("overflow", true);
  await tick();
  assert.deepEqual(h.sent, []);
  await h.compact("threshold");
  await tick();
  assert.match(h.sent.at(-1), /context was compacted/);
});
