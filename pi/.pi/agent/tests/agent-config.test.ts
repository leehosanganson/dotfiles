import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { mergeAgentMetadata, readAgentConfig, readAgentConfigSync } from "../lib/agent-config.ts";
import { resolveAgentConfigDir } from "../lib/agent-config.ts";

test("config directory honors deployment overrides and defaults beside the Pi config", () => {
  const extension = "/install/.pi/agent/extensions/agents.ts";
  assert.equal(resolveAgentConfigDir(extension, "/shared/pi-agent-config"), "/shared/pi-agent-config");
  assert.equal(resolveAgentConfigDir(extension), "/install/.pi/agent/agent-config");
});

test("nested extensions can resolve the shared config directory from their own location", () => {
  const subagentExtension = "/install/.pi/agent/extensions/subagent/agents.ts";
  assert.equal(
    resolveAgentConfigDir(subagentExtension, undefined, "../../agent-config"),
    "/install/.pi/agent/agent-config",
  );
});

test("metadata sidecars override frontmatter but retain unspecified fallback fields", () => {
  assert.deepEqual(
    mergeAgentMetadata({ mode: "primary", description: "frontmatter", name: "agent" }, { description: "Pi", model: "model-x" }),
    { mode: "primary", description: "Pi", name: "agent", model: "model-x" },
  );
});

test("async and sync loaders find a matching JSON sidecar and tolerate missing or invalid config", async () => {
  const dir = await mkdtemp(join(tmpdir(), "pi-agent-config-"));
  try {
    await writeFile(join(dir, "worker.json"), JSON.stringify({ mode: "subagent", model: "luna" }));
    assert.deepEqual(await readAgentConfig(dir, "worker.md"), { mode: "subagent", model: "luna" });
    assert.deepEqual(readAgentConfigSync(dir, "worker.md"), { mode: "subagent", model: "luna" });
    assert.deepEqual(await readAgentConfig(dir, "missing.md"), {});
    await writeFile(join(dir, "broken.json"), "{");
    assert.deepEqual(readAgentConfigSync(dir, "broken.md"), {});
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
