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
  const { extensions, errors, runtime } = await loadExtensions(
    [extension("auto-continue-after-compact"), extension("goal")],
    process.cwd(),
  );
  assert.deepEqual(errors, []);
  const sent = [];
  const notices = [];
  const statuses = new Map();
  const completions = [];
  const ctx = {
    sessionManager,
    model: { id: "test-model" },
    modelRegistry: {
      complete: async (model, context, options) => {
        completions.push({ model, context, options });
        return {
          stopReason: "stop",
          content: [{ type: "text", text: "Complete the requested work" }],
        };
      },
    },
    hasUI: true,
    isIdle: () => true,
    hasPendingMessages: () => false,
    ui: {
      notify: (text) => notices.push(text),
      setStatus: (key, text) => statuses.set(key, text),
    },
  };
  runtime.appendEntry = (type, data) =>
    sessionManager.appendCustomEntry(type, data);
  runtime.sendUserMessage = (text) => sent.push(text);
  runtime.sendMessage = (message) => sent.push(message.content);
  runtime.getActiveTools = () => [];
  const [generic, goal] = extensions;
  const command = (args) => goal.commands.get("goal").handler(args, ctx);
  const emit = async (ext, name, event) => {
    let result;
    for (const handler of ext.handlers.get(name) ?? []) {
      result = (await handler({ type: name, ...event }, ctx)) ?? result;
    }
    return result;
  };
  return {
    ctx,
    sent,
    command,
    show: async () => {
      await command("");
      return notices.at(-1);
    },
    toggle: (args) => generic.commands.get("auto-continue").handler(args, ctx),
    context: async (
      messages = sessionManager.buildSessionProjection().messages,
    ) => (await emit(goal, "context", { messages }))?.messages ?? messages,
    goalTools: goal.tools,
    statuses,
    completions,
    input: (text, source = "interactive") =>
      emit(goal, "input", { text, source }),
    start: () => emit(goal, "session_start", {}),
    tree: () => emit(goal, "session_tree", {}),
    settle: () =>
      emit(goal, "agent_before_settle", {
        outcome: "completed",
        entries: [],
        continue: false,
        context: { pendingMessages: [], canContinue: false },
      }),
    compact: async (reason, willRetry = false) => {
      const id = sessionManager.appendCompaction(
        "Earlier chat summary",
        null,
        1000,
      );
      const event = {
        reason,
        willRetry,
        compactionEntry: sessionManager.getEntry(id),
      };
      await emit(generic, "session_compact", event);
      await emit(goal, "session_compact", event);
    },
  };
}

const tick = () => delay(20);
const user = (content) => ({ role: "user", content, timestamp: Date.now() });

async function assertFocus(h, text) {
  assert.match(await h.show(), new RegExp(text));
  const messages = h.ctx.sessionManager.buildSessionProjection().messages;
  const context = await h.context(messages);
  const focus = context.filter((message) => message.role === "custom");
  assert.equal(focus.length, 1);
  assert.match(focus[0].content, new RegExp(text));
  assert.match(focus[0].content, /background.*current request/i);
  assert.equal(focus[0].display, false);
  assert.deepEqual(context.slice(1), messages);
}

async function assertNoFocus(h) {
  assert.match(await h.show(), /no goal/i);
  const messages = h.ctx.sessionManager.buildSessionProjection().messages;
  assert.deepEqual(await h.context(messages), messages);
}

test("the goal status is always shown and follows set, clear, and session navigation", async () => {
  const h = await harness();
  await h.start();
  assert.equal(h.statuses.get("goal-focus"), "Goal: none");

  await h.command("Review the build");
  assert.equal(h.statuses.get("goal-focus"), "Goal: Review the build");
  await h.tree();
  assert.equal(h.statuses.get("goal-focus"), "Goal: Review the build");
  await h.command("clear");
  assert.equal(h.statuses.get("goal-focus"), "Goal: none");
});

test("a missing goal is generated from the first user request and persisted", async () => {
  const h = await harness();
  await h.input("Please review this build and report any risks");

  assert.equal(h.completions.length, 1);
  assert.match(
    JSON.stringify(h.completions[0].context.messages),
    /Please review this build and report any risks/,
  );
  await assertFocus(h, "Complete the requested work");
  assert.equal(
    h.statuses.get("goal-focus"),
    "Goal: Complete the requested work",
  );
  await h.input("A follow-up request");
  assert.equal(h.completions.length, 1);
  assert.deepEqual(h.sent, []);
});

test("overlapping requests share one goal completion based on the first request", async () => {
  const h = await harness();
  let finish;
  h.ctx.modelRegistry.complete = async (_model, context) => {
    h.completions.push(context);
    await new Promise((resolve) => {
      finish = resolve;
    });
    return {
      stopReason: "stop",
      content: [{ type: "text", text: "Goal from the first request" }],
    };
  };

  const first = h.input("First request sets the session goal");
  await Promise.resolve();
  const second = h.input("Second request should not replace it");
  finish();
  await Promise.all([first, second]);

  assert.equal(h.completions.length, 1);
  assert.match(
    JSON.stringify(h.completions[0].messages),
    /First request sets the session goal/,
  );
  await assertFocus(h, "Goal from the first request");
});

test("clearing a goal disables automatic generation for later requests", async () => {
  const h = await harness();
  await h.command("clear");
  await h.input("Please do this work");

  assert.equal(h.completions.length, 0);
  await assertNoFocus(h);
  assert.equal(h.statuses.get("goal-focus"), "Goal: none");
});

test("failed goal generation does not block the user request", async () => {
  const h = await harness();
  h.ctx.modelRegistry.complete = async () => {
    throw new Error("completion unavailable");
  };

  assert.equal(await h.input("Please review this change"), undefined);
  await assertNoFocus(h);
});

test("an existing goal and non-user input do not trigger automatic generation", async () => {
  const h = await harness();
  await h.command("Keep my manually selected goal");
  await h.input("Do something else");
  await h.input("Extension-generated text", "extension");

  assert.equal(h.completions.length, 0);
  await assertFocus(h, "Keep my manually selected goal");
});

test("goal commands set, replace, show and clear without sending a message", async () => {
  const h = await harness();
  await assertNoFocus(h);
  h.ctx.isIdle = () => false;
  h.ctx.hasPendingMessages = () => true;
  const request = user("Answer this current question");
  h.ctx.sessionManager.appendMessage(request);
  await h.command("  Review the build  ");
  assert.deepEqual(h.sent, []);
  await assertFocus(h, "Review the build");
  await h.command("Review the tests");
  await assertFocus(h, "Review the tests");
  assert.equal(h.goalTools.size, 0);
  h.ctx.isIdle = () => true;
  h.ctx.hasPendingMessages = () => false;
  assert.equal(await h.settle(), undefined);
  await h.command("clear");
  await assertNoFocus(h);
  assert.deepEqual(h.ctx.sessionManager.buildSessionProjection().messages, [
    request,
  ]);
  assert.deepEqual(h.sent, []);
});

test("goal survives repeated compaction and reopen; tree uses append order and fork starts empty", async (t) => {
  const dir = mkdtempSync(join(tmpdir(), "pi-goal-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const sm = SessionManager.create(dir, dir);
  const h = await harness(sm);
  const origin = sm.appendMessage(user("Earlier chat"));
  await h.command("First focus");
  const oldLeaf = sm.getLeafId();
  await h.command("Latest focus");
  const latestFocusId = sm.getLeafId();
  await h.toggle("off");
  for (let i = 0; i < 2; i++) {
    await h.compact("manual");
    assert.deepEqual(
      sm.buildSessionProjection().messages.map(({ role }) => role),
      ["compactionSummary"],
    );
    sm.appendMessage(user("A new request"));
    const entries = sm.getEntries();
    await assertFocus(h, "Latest focus");
    await assertFocus(h, "Latest focus");
    assert.deepEqual(sm.getEntries(), entries);
  }
  await tick();
  assert.deepEqual(h.sent, []);

  const file = sm.getSessionFile();
  const reopened = SessionManager.open(file);
  const restored = await harness(reopened);
  await assertFocus(restored, "Latest focus");
  const forkFile = SessionManager.open(file).createBranchedSession(
    reopened.getLeafId(),
  );
  const fork = SessionManager.open(forkFile);
  assert.notEqual(fork.getSessionId(), reopened.getSessionId());
  assert.ok(fork.getEntry(latestFocusId), "the fork copied the parent's entry");
  await assertNoFocus(await harness(fork));

  reopened.branch(oldLeaf);
  await assertFocus(restored, "Latest focus");
  await restored.command("clear");
  reopened.branch(origin);
  await assertNoFocus(restored);
  await assertNoFocus(await harness(SessionManager.open(file)));
});

test("only the latest legacy goal counts, and only its text becomes focus", async () => {
  const sm = SessionManager.inMemory();
  const h = await harness(sm);
  const sessionId = sm.getSessionId();
  const legacy = (status) =>
    sm.appendCustomEntry("goal-state", {
      sessionId,
      status,
      text: `Legacy ${status} request`,
      revision: 1,
      criteria: "Old criteria",
      reason: "Old reason",
    });
  for (const status of ["pending", "active", "blocked"]) {
    legacy(status);
    await assertFocus(h, `Legacy ${status} request`);
    assert.doesNotMatch(
      (await h.context())[0].content,
      /Old criteria|Old reason/,
    );
  }
  for (const status of ["completed", "stopped"]) {
    legacy("active");
    legacy(status);
    await assertNoFocus(h);
  }
  legacy("pending");
  await h.command("clear");
  await assertNoFocus(await harness(sm));
});

test("generic continuation follows its own toggle with a goal present", async () => {
  const h = await harness();
  await h.command("Passive focus");
  await assertFocus(h, "Passive focus");
  await h.toggle("off");
  await h.compact("threshold");
  await tick();
  assert.deepEqual(h.sent, []);
  await h.toggle("on");
  await h.compact("threshold");
  await tick();
  assert.equal(h.sent.length, 1);
  assert.match(h.sent[0], /context was compacted/);
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
