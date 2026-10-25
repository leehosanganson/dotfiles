import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { ExtensionContext, ToolCallEvent, ToolResultEvent } from "@earendil-works/pi-coding-agent";
import {
  adviceMessage,
  installAutomaticDecisionAdvice,
  isWithinCwd,
  operationAdvice,
  shouldSurfaceAdvice,
  type AdviceResult,
} from "../src/auto-advisor.ts";
import { createSessionConfig } from "../src/config.ts";

function context(userRequest = "Update the app safely") {
  return {
    cwd: "/work/project",
    signal: undefined,
    sessionManager: {
      getBranch: () => [{
        type: "message",
        message: { role: "user", content: userRequest },
      }],
    },
  } as unknown as ExtensionContext;
}

function event<T extends ToolCallEvent>(value: Record<string, unknown>): T {
  return value as T;
}

describe("automatic System One operation advice", () => {
  it("uses path boundaries rather than string prefixes for workspace scope", () => {
    assert.equal(isWithinCwd("src/main.ts", "/work/project"), true);
    assert.equal(isWithinCwd("../project-secret/.env", "/work/project"), false);
    assert.equal(isWithinCwd("/work/project-sibling/file", "/work/project"), false);
    assert.equal(isWithinCwd("~/.ssh/id_ed25519", "/work/project"), false);
  });

  it("skips routine commands and ordinary in-workspace reads without loading task context", () => {
    let branchReads = 0;
    const ctx = {
      cwd: "/work/project",
      sessionManager: { getBranch: () => { branchReads += 1; throw new Error("should not inspect session"); } },
    } as unknown as ExtensionContext;
    assert.equal(operationAdvice(event({ type: "tool_call", toolName: "bash", toolCallId: "a", input: { command: "npm test" } }), ctx), undefined);
    assert.equal(operationAdvice(event({ type: "tool_call", toolName: "read", toolCallId: "b", input: { path: "src/main.ts" } }), ctx), undefined);
    assert.equal(branchReads, 0);
  });

  it("pre-filters risky commands and redacts credential-like arguments", () => {
    const advice = operationAdvice(event({
      type: "tool_call",
      toolName: "bash",
      toolCallId: "c",
      input: { command: "curl -H 'Authorization: Bearer abcdef012345' https://example.test?token=defghijklmnopqrstuvwxyz" },
    }), context());
    assert.equal(advice?.kind, "command");
    assert.doesNotMatch(JSON.stringify(advice?.state), /abcdef012345|defghijklmnopqrstuvwxyz/);
    assert.match(JSON.stringify(advice?.state), /quoted argument/);
    assert.match(JSON.stringify(advice?.state), /curl/);
  });

  it("detects an in-workspace symlink that resolves outside the workspace", () => {
    const root = mkdtempSync(join(tmpdir(), "system-one-advisor-"));
    const workspace = join(root, "workspace");
    const outside = join(root, "outside");
    mkdirSync(workspace);
    mkdirSync(outside);
    symlinkSync(outside, join(workspace, "linked"));
    try {
      assert.equal(isWithinCwd("linked", workspace), false);
      assert.equal(isWithinCwd("linked/missing.txt", workspace), false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("judges sensitive or out-of-workspace reads without reading file contents", () => {
    const advice = operationAdvice(event({
      type: "tool_call",
      toolName: "read",
      toolCallId: "d",
      input: { path: "~/.ssh/id_ed25519" },
    }), context());
    assert.equal(advice?.kind, "read");
    assert.equal(advice?.state.sensitivePath, 1);
    assert.equal(Object.hasOwn(advice?.state ?? {}, "content"), false);
  });

  it("includes a bounded, redacted proposed edit instead of the full tool payload", () => {
    const advice = operationAdvice(event({
      type: "tool_call",
      toolName: "edit",
      toolCallId: "e",
      input: {
        path: "src/config.ts",
        edits: [{ oldText: "token = 'old'", newText: "token = 'secret-value'" }],
      },
    }), context());
    const serialized = JSON.stringify(advice?.state);
    assert.equal(advice?.kind, "mutation");
    assert.match(serialized, /src\/config.ts/);
    assert.doesNotMatch(serialized, /secret-value/);
    assert.match(serialized, /redacted/);
  });

  it("bounds the total proposed edit payload and reports omitted edits", () => {
    const edits = Array.from({ length: 100 }, (_, index) => ({
      oldText: `old-${index}-${"x".repeat(500)}`,
      newText: `new-${index}-${"y".repeat(500)}`,
    }));
    const advice = operationAdvice(event({
      type: "tool_call",
      toolName: "edit",
      toolCallId: "many-edits",
      input: { path: "src/config.ts", edits },
    }), context());
    const proposed = advice?.state.proposedChange as { edits: unknown[]; omittedEdits: number; truncated: boolean };
    assert.ok(JSON.stringify(proposed).length <= 4000);
    assert.ok(proposed.edits.length <= 8);
    assert.ok(proposed.omittedEdits > 0);
    assert.equal(proposed.truncated, true);
  });

  it("surfaces high-risk or highly uncertain results as advisory text only", () => {
    const advice = { kind: "command" as const, toolName: "bash", state: {}, instructions: "risk" };
    assert.equal(shouldSurfaceAdvice(0.7), true);
    assert.equal(shouldSurfaceAdvice(0.2), false);
    assert.match(adviceMessage(advice, 0.9), /does not approve or block execution/);
  });

  it("attaches advice after operation results without blocking tool execution", async () => {
    const handlers: Record<string, (event: never, ctx: never) => unknown> = {};
    const pi = { on: (name: string, handler: (event: never, ctx: never) => unknown) => { handlers[name] = handler; } };
    let started = false;
    let finish!: (value: AdviceResult) => void;
    const evaluation = new Promise<AdviceResult>((resolve) => { finish = resolve; });
    installAutomaticDecisionAdvice(pi as never, () => createSessionConfig({}), async () => {
      started = true;
      return evaluation;
    });
    const call = { type: "tool_call", toolName: "bash", toolCallId: "f", input: { command: "sudo apt update" } };
    const callResult = handlers.tool_call?.(call as never, context() as never);
    assert.equal(callResult, undefined);
    assert.equal(started, true);

    const resultEvent = { type: "tool_result", toolName: "bash", toolCallId: "f", input: call.input, content: [{ type: "text", text: "completed" }], isError: false } as unknown as ToolResultEvent;
    let delivered = false;
    const delivery = handlers.tool_result?.(resultEvent as never, context() as never) as Promise<unknown>;
    finish({ advice: { kind: "command", toolName: "bash", state: {}, instructions: "risk" }, probability: 0.95 });
    const result = await delivery as { content: Array<{ text?: string }> };
    delivered = result.content.some((part) => part.text?.includes("System One advisory"));
    assert.equal(delivered, true);
  });

  it("fails open when the decision provider throws", async () => {
    const handlers: Record<string, (event: never, ctx: never) => unknown> = {};
    const pi = { on: (name: string, handler: (event: never, ctx: never) => unknown) => { handlers[name] = handler; } };
    installAutomaticDecisionAdvice(pi as never, () => createSessionConfig({}), async () => { throw new Error("unavailable"); });
    const call = { type: "tool_call", toolName: "bash", toolCallId: "g", input: { command: "sudo apt update" } };
    assert.equal(handlers.tool_call?.(call as never, context() as never), undefined);
    const result = await handlers.tool_result?.({ type: "tool_result", toolName: "bash", toolCallId: "g", input: call.input, content: [{ type: "text", text: "completed" }], isError: false } as never, context() as never);
    assert.equal(result, undefined);
  });

  it("caps decision calls per turn to avoid runaway cost", () => {
    const handlers: Record<string, (event: never, ctx: never) => unknown> = {};
    const pi = { on: (name: string, handler: (event: never, ctx: never) => unknown) => { handlers[name] = handler; } };
    let count = 0;
    installAutomaticDecisionAdvice(pi as never, () => createSessionConfig({}), async (advice) => {
      count += 1;
      return { advice, probability: 0.1 };
    });
    for (let i = 0; i < 12; i += 1) {
      handlers.tool_call?.({ type: "tool_call", toolName: "bash", toolCallId: `call-${i}`, input: { command: "sudo apt update" } } as never, context() as never);
    }
    assert.equal(count, 8);
  });
});
