import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { discoverAgents } from "../npm/node_modules/pi-subagents/src/agents/agents.js";

const agentDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sharedAgentDirectory = resolve(
  agentDirectory,
  "../../../ai/.config/ai/agents",
);
const evaluatorGuardExtension =
  "~/dotfiles/pi/system-one/src/evaluator-file-guard.ts";

test("Pi user agent discovery includes worker, explorer, and evaluator", () => {
  const settings = JSON.parse(
    readFileSync(join(agentDirectory, "settings.json"), "utf8"),
  );
  const overrides = settings.subagents.agentOverrides;
  assert.equal(overrides.worker?.disabled, undefined);
  assert.equal(overrides.explorer?.disabled, undefined);
  assert.equal(overrides.evaluator?.disabled, undefined);
  assert.deepEqual(overrides.explorer?.tools, ["read", "ls"]);
  assert.deepEqual(overrides.evaluator?.tools, ["read", "ls"]);
  assert.deepEqual(overrides.explorer?.subagentOnlyExtensions, [
    evaluatorGuardExtension,
  ]);
  assert.deepEqual(overrides.evaluator?.subagentOnlyExtensions, [
    evaluatorGuardExtension,
  ]);

  const tempAgentDirectory = mkdtempSync(join(tmpdir(), "pi-agent-discovery-"));
  const previousAgentDirectory = process.env.PI_CODING_AGENT_DIR;
  try {
    writeFileSync(
      join(tempAgentDirectory, "settings.json"),
      JSON.stringify({ subagents: { agentOverrides: overrides } }),
    );
    symlinkSync(sharedAgentDirectory, join(tempAgentDirectory, "agents"));
    process.env.PI_CODING_AGENT_DIR = tempAgentDirectory;

    const agents = discoverAgents(process.cwd(), "user").agents;
    for (const name of ["worker", "explorer", "evaluator"]) {
      const agent = agents.find((candidate) => candidate.name === name);
      assert.ok(agent, `${name} must be available to user-scope launches`);
      assert.equal(agent.source, "user");
    }

    const explorer = agents.find((agent) => agent.name === "explorer");
    const evaluator = agents.find((agent) => agent.name === "evaluator");
    assert.deepEqual(explorer?.tools, ["read", "ls"]);
    assert.deepEqual(explorer?.subagentOnlyExtensions, [
      evaluatorGuardExtension,
    ]);
    assert.deepEqual(evaluator?.tools, ["read", "ls"]);
    assert.deepEqual(evaluator?.subagentOnlyExtensions, [
      evaluatorGuardExtension,
    ]);
  } finally {
    if (previousAgentDirectory === undefined) {
      delete process.env.PI_CODING_AGENT_DIR;
    } else {
      process.env.PI_CODING_AGENT_DIR = previousAgentDirectory;
    }
    rmSync(tempAgentDirectory, { recursive: true, force: true });
  }
});
