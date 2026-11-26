import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import piSystemOneExtension from "../src/extension.ts";
import { WORKER_MODEL_PRIORITY } from "../src/subagent-policy.ts";

function response(score: number) {
  const probabilities = Object.fromEntries(
    WORKER_MODEL_PRIORITY.map((model, index) => [model, index === 0 ? 1 : 0]),
  );
  return {
    answers: {
      risk: {
        type: "score",
        score,
        confidence: 0.95,
        probabilities: { "0": 1, "1": 0 },
        legend: { "0": "Routine", "1": "High" },
      },
      worker_model: {
        type: "choice",
        choice: WORKER_MODEL_PRIORITY[0],
        confidence: 0.95,
        probabilities,
      },
    },
  };
}

function registerHandlers() {
  const handlers: Record<string, ((event: never, ctx: never) => unknown)[]> =
    {};
  piSystemOneExtension({
    registerTool: () => {},
    registerCommand: () => {},
    on: (name: string, handler: (event: never, ctx: never) => unknown) => {
      handlers[name] ??= [];
      handlers[name].push(handler);
    },
  } as never);
  return handlers;
}

describe("System One subagent tool gate", () => {
  it("scores direct launches with the configured Jev endpoint and patches the child call", async () => {
    const dir = mkdtempSync(join(tmpdir(), "so-subagent-gate-"));
    const originalDir = process.env.PI_CODING_AGENT_DIR;
    const originalFetch = globalThis.fetch;
    try {
      const keyPath = join(dir, "router.key");
      writeFileSync(keyPath, "test-key\n");
      writeFileSync(
        join(dir, "pi-system-one.json"),
        JSON.stringify({
          mode: "model",
          default: { provider: "litellm", model: "openrouter/jev-1.14" },
          providers: {
            litellm: {
              baseUrl: "https://router.example/v1",
              apiKeyFile: keyPath,
              models: [{ id: "openrouter/jev-1.14" }],
            },
          },
        }),
      );
      process.env.PI_CODING_AGENT_DIR = dir;

      const handlers = registerHandlers();
      let calls = 0;
      globalThis.fetch = (async (url, options) => {
        calls++;
        assert.equal(String(url), "https://router.example/v1/systemone");
        assert.equal(
          new Headers(options?.headers).get("authorization"),
          "Bearer test-key",
        );
        return new Response(JSON.stringify(response(0.2)), { status: 200 });
      }) as typeof fetch;

      const input = { agent: "worker", task: "Read and summarize one file." };
      const result = await handlers.tool_call.at(-1)?.(
        { toolName: "subagent", input } as never,
        {
          cwd: "/repo",
          model: { id: "main", provider: "litellm" },
          modelRegistry: {},
          signal: undefined,
        } as never,
      );

      assert.equal(result, undefined);
      assert.equal(calls, 1);
      assert.equal(input.model, WORKER_MODEL_PRIORITY[0]);
      assert.equal(input.async, true);
      assert.equal(
        (input.options as Record<string, unknown>).agentScope,
        "user",
      );
      assert.equal((input.options as Record<string, unknown>).context, "fresh");
    } finally {
      globalThis.fetch = originalFetch;
      if (originalDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
      else process.env.PI_CODING_AGENT_DIR = originalDir;
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("blocks workflow child starts that do not pass through direct risk scoring", async () => {
    const handlers = registerHandlers();
    const result = (await handlers.tool_call.at(-1)?.(
      { toolName: "subagent_launch", input: { agent: "worker" } } as never,
      {} as never,
    )) as { block?: boolean; reason?: string } | undefined;

    assert.equal(result?.block, true);
    assert.match(result?.reason ?? "", /individually scored direct children/);
  });

  it("blocks launches when Jev cannot answer, without starting a child", async () => {
    const dir = mkdtempSync(join(tmpdir(), "so-subagent-gate-fail-"));
    const originalDir = process.env.PI_CODING_AGENT_DIR;
    const originalFetch = globalThis.fetch;
    try {
      const keyPath = join(dir, "router.key");
      writeFileSync(keyPath, "test-key\n");
      writeFileSync(
        join(dir, "pi-system-one.json"),
        JSON.stringify({
          mode: "model",
          default: { provider: "litellm", model: "openrouter/jev-1.14" },
          providers: {
            litellm: {
              baseUrl: "https://router.example/v1",
              apiKeyFile: keyPath,
              models: [{ id: "openrouter/jev-1.14" }],
            },
          },
        }),
      );
      process.env.PI_CODING_AGENT_DIR = dir;

      const handlers = registerHandlers();
      globalThis.fetch = (async () =>
        new Response("unavailable", { status: 429 })) as typeof fetch;

      const result = (await handlers.tool_call.at(-1)?.(
        {
          toolName: "subagent",
          input: { agent: "worker", task: "Do work" },
        } as never,
        {
          cwd: "/repo",
          model: { id: "main", provider: "litellm" },
          modelRegistry: {},
          signal: undefined,
        } as never,
      )) as { block?: boolean; reason?: string } | undefined;

      assert.equal(result?.block, true);
      assert.match(result?.reason ?? "", /No child was started/);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
      else process.env.PI_CODING_AGENT_DIR = originalDir;
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
