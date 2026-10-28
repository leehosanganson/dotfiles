import assert from "node:assert/strict";
import { readFile, readdir, realpath } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import registerAgentSelector from "../extensions/agents.ts";

const here = dirname(fileURLToPath(import.meta.url));
const agentDir = resolve(here, "..");
const promptsDir = join(agentDir, "agents");
const configDir = join(agentDir, "agent-config");

async function loadConfiguredAgents() {
  const files = (await readdir(promptsDir)).filter((name) => name.endsWith(".md"));
  const loaded = [];
  for (const file of files) {
    const [prompt, rawConfig] = await Promise.all([
      readFile(join(promptsDir, file), "utf8"),
      readFile(join(configDir, file.replace(/\.md$/, ".json")), "utf8"),
    ]);
    loaded.push({ id: file.replace(/\.md$/, ""), prompt: prompt.trim(), ...JSON.parse(rawConfig) });
  }
  return loaded;
}

test("tracked Pi agent discovery link resolves to shared vendor-neutral prompt files", async () => {
  assert.equal(await realpath(promptsDir), resolve(agentDir, "../../../ai/.config/ai/agents"));
  const agents = await loadConfiguredAgents();
  assert.deepEqual(agents.map(({ id }) => id).sort(), ["coder", "content", "evaluator", "explorer", "homelab", "worker"]);
  assert.ok(agents.every(({ prompt }) => {
    const withoutFrontmatter = prompt.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "");
    return withoutFrontmatter.startsWith("# ");
  }));
  assert.ok(agents.every(({ prompt }) => !prompt.includes("permission:") && !prompt.includes("model:")));
});

test("primary-agent extension discovers only configured primary prompts", async () => {
  const priorChildFlag = process.env.PI_SUBAGENT_CHILD;
  delete process.env.PI_SUBAGENT_CHILD;
  let command;
  try {
    await registerAgentSelector({
      on: () => {},
      registerCommand: (name, config) => { command = { name, config }; },
    });
  } finally {
    if (priorChildFlag === undefined) delete process.env.PI_SUBAGENT_CHILD;
    else process.env.PI_SUBAGENT_CHILD = priorChildFlag;
  }
  assert.equal(command.name, "agent");
  assert.deepEqual(command.config.getArgumentCompletions("").map(({ value }) => value).sort(), [
    "clear", "coder", "content", "homelab",
  ]);
});

test("Pi metadata selects primary and subagents and preserves Luna worker/explorer models", async () => {
  const agents = await loadConfiguredAgents();
  const primary = agents.filter((agent) => agent.mode === "primary").map(({ id }) => id).sort();
  const subagents = agents.filter((agent) => agent.mode === "subagent").map(({ id }) => id).sort();
  assert.deepEqual(primary, ["coder", "content", "homelab"]);
  assert.deepEqual(subagents, ["evaluator", "explorer", "worker"]);
  for (const id of ["worker", "explorer"]) {
    assert.equal(agents.find((agent) => agent.id === id)?.model, "litellm/openrouter/gpt-6-luna");
  }
});
