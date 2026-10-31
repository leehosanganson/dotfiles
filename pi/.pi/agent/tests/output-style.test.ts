import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import outputStyleExtension from "../extensions/output-style.ts";

async function withAgentDir(run: (agentDir: string) => Promise<void>): Promise<void> {
  const agentDir = await mkdtemp(join(tmpdir(), "pi-output-style-"));
  const previousAgentDir = process.env.PI_CODING_AGENT_DIR;
  try {
    await mkdir(join(agentDir, "output-styles"));
    process.env.PI_CODING_AGENT_DIR = agentDir;
    await run(agentDir);
  } finally {
    if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
    else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
    await rm(agentDir, { recursive: true, force: true });
  }
}

function startExtension(settings: Record<string, unknown>) {
  let beforeAgentStart:
    | ((event: { systemPromptOptions: { sections: Record<string, string> } }, ctx: unknown) => Promise<void>)
    | undefined;
  const notifications: string[] = [];
  outputStyleExtension({
    on: (event: string, handler: typeof beforeAgentStart) => {
      if (event === "before_agent_start") beforeAgentStart = handler;
    },
    getSettings: () => settings,
  } as never);
  return {
    notifications,
    async start() {
      const systemPromptOptions: { sections: Record<string, string> } = {
        sections: { base: "Keep the base prompt." },
      };
      await beforeAgentStart?.(
        { systemPromptOptions },
        { ui: { notify: (message: string) => notifications.push(message) } },
      );
      return systemPromptOptions;
    },
  };
}

test("selected output style is added as its own prompt section without replacing the base prompt", async () => {
  await withAgentDir(async (agentDir) => {
    await writeFile(join(agentDir, "output-styles", "concise.md"), "Prefer concise answers.");
    const extension = startExtension({ outputStyle: "concise.md" });
    assert.deepEqual((await extension.start()).sections, {
      base: "Keep the base prompt.",
      "output-style": "Prefer concise answers.",
    });
    assert.deepEqual(extension.notifications, []);
  });
});

test("an unset outputStyle leaves prompt sections unchanged", async () => {
  const extension = startExtension({});
  assert.deepEqual((await extension.start()).sections, { base: "Keep the base prompt." });
});

test("style contents are re-read for each request", async () => {
  await withAgentDir(async (agentDir) => {
    const path = join(agentDir, "output-styles", "live.md");
    await writeFile(path, "First version.");
    const extension = startExtension({ outputStyle: "live.md" });
    assert.equal((await extension.start()).sections["output-style"], "First version.");
    await writeFile(path, "Updated version.");
    assert.equal((await extension.start()).sections["output-style"], "Updated version.");
  });
});

test("invalid or unavailable styles fail nonfatally and diagnostics are throttled", async () => {
  await withAgentDir(async () => {
    const extension = startExtension({ outputStyle: "../outside.md" });
    assert.deepEqual((await extension.start()).sections, { base: "Keep the base prompt." });
    assert.deepEqual((await extension.start()).sections, { base: "Keep the base prompt." });
    assert.equal(extension.notifications.length, 1);
    assert.doesNotMatch(extension.notifications[0], /outside|\.\./);
  });
});

test("a symlink cannot load a style from outside the canonical directory", async () => {
  await withAgentDir(async (agentDir) => {
    const outside = join(agentDir, "secret.md");
    await writeFile(outside, "Must not be loaded.");
    await symlink(outside, join(agentDir, "output-styles", "escape.md"));
    const extension = startExtension({ outputStyle: "escape.md" });
    assert.deepEqual((await extension.start()).sections, { base: "Keep the base prompt." });
    assert.ok(extension.notifications.length <= 1, "diagnostics are throttled across failures");
  });
});
