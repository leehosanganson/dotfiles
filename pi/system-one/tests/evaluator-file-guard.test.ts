import assert from "node:assert/strict";
import {
  linkSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import evaluatorFileGuardExtension, {
  guardEvaluatorFileToolCall,
} from "../src/evaluator-file-guard.ts";

function withProject(run: (root: string, outside: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "evaluator-file-guard-"));
  const outside = mkdtempSync(join(tmpdir(), "evaluator-file-guard-outside-"));
  try {
    run(root, outside);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
}

test("allows reads of ordinary files under the project root", () => {
  withProject((root) => {
    writeFileSync(join(root, "src.ts"), "safe source");
    assert.equal(
      guardEvaluatorFileToolCall("read", { path: "src.ts" }, root),
      undefined,
    );
  });
});

test("blocks outside paths, symlink escapes, and hard-linked files", () => {
  withProject((root, outside) => {
    writeFileSync(join(outside, "private.json"), "not read");
    writeFileSync(join(root, "ordinary.json"), "safe text");
    symlinkSync(join(outside, "private.json"), join(root, "linked.json"));
    linkSync(join(root, "ordinary.json"), join(root, "hardlinked.json"));

    assert.ok(
      guardEvaluatorFileToolCall(
        "read",
        { path: join(outside, "private.json") },
        root,
      ),
    );
    assert.ok(
      guardEvaluatorFileToolCall("read", { path: "../outside.json" }, root),
    );
    assert.ok(
      guardEvaluatorFileToolCall("read", { path: "linked.json" }, root),
    );
    assert.ok(
      guardEvaluatorFileToolCall("read", { path: "hardlinked.json" }, root),
    );
  });
});

test("blocks sensitive files and private configuration", () => {
  withProject((root) => {
    mkdirSync(join(root, "secrets"));
    mkdirSync(join(root, "pi", ".pi", "agent"), { recursive: true });
    writeFileSync(join(root, ".env"), "not read");
    writeFileSync(join(root, "secrets", "service.json"), "not read");
    writeFileSync(join(root, "auth.json"), "not read");

    for (const path of [
      ".env",
      "secrets/service.json",
      "auth.json",
      "sessions/run.jsonl",
      "pi/.pi/agent/pi-system-one.json",
      "pi/.pi/agent/settings.json",
    ]) {
      assert.ok(guardEvaluatorFileToolCall("read", { path }, root), path);
    }
  });
});

test("blocks recursive search tools and private configuration listings", () => {
  withProject((root) => {
    mkdirSync(join(root, "pi", ".pi", "agent"), { recursive: true });
    writeFileSync(join(root, "source.ts"), "safe source");
    writeFileSync(join(root, ".env"), "not read");

    assert.ok(
      guardEvaluatorFileToolCall("grep", { path: ".", pattern: "token" }, root),
    );
    assert.ok(
      guardEvaluatorFileToolCall("find", { path: ".", pattern: "**/*" }, root),
    );
    assert.ok(guardEvaluatorFileToolCall("ls", { path: "pi/.pi/agent" }, root));
    assert.equal(
      guardEvaluatorFileToolCall("ls", { path: "." }, root),
      undefined,
    );
  });
});

test("allows safe directory listings", () => {
  withProject((root) => {
    mkdirSync(join(root, "src"));
    writeFileSync(join(root, "src", "source.ts"), "safe source");
    assert.equal(
      guardEvaluatorFileToolCall("ls", { path: "src" }, root),
      undefined,
    );
    assert.equal(
      guardEvaluatorFileToolCall(
        "read",
        { path: resolve(root, "src/source.ts") },
        root,
      ),
      undefined,
    );
  });
});

test("blocks out-of-root reads whenever the child-only guard is loaded", () => {
  let handler:
    | ((
        event: { toolName: string; input: unknown },
        context: { cwd: string },
      ) => unknown)
    | undefined;
  evaluatorFileGuardExtension({
    on: (_event, callback) => {
      handler = callback;
    },
  });
  assert.ok(handler);

  const event = { toolName: "read", input: { path: "/etc/passwd" } };
  assert.ok(handler(event, { cwd: "/tmp" }));
});
