import assert from "node:assert/strict";
import test from "node:test";
import registerTodo from "../extensions/todo.ts";

function createTodoTool() {
  let tool: any;
  const pi = {
    on: () => {},
    registerCommand: () => {},
    registerTool: (registered: unknown) => {
      tool = registered;
    },
  };
  registerTodo(pi as never);
  const ctx = {
    sessionManager: { getBranch: () => [] },
    ui: {
      setStatus: () => {},
      theme: { fg: (_color: string, text: string) => text },
    },
  } as never;
  return {
    execute: async (params: Record<string, unknown>) => {
      const result = await tool.execute("test", params, undefined, undefined, ctx);
      return result;
    },
  };
}

test("toggle changes multiple selected todos and preserves single-id behavior", async () => {
  const todo = createTodoTool();
  await todo.execute({ action: "add", text: "first" });
  await todo.execute({ action: "add", text: "second" });
  await todo.execute({ action: "add", text: "third" });

  const result = await todo.execute({ action: "toggle", ids: [1, 3] });
  assert.equal(result.isError, false);
  assert.deepEqual(result.details.todos.map(({ done }: { done: boolean }) => done), [true, false, true]);

  await todo.execute({ action: "toggle", id: 1 });
  assert.deepEqual(
    (await todo.execute({ action: "list" })).content[0].text,
    "[ ] #1: first\n[ ] #2: second\n[x] #3: third",
  );
});

test("toggle rejects a missing id without partially changing selected todos", async () => {
  const todo = createTodoTool();
  await todo.execute({ action: "add", text: "first" });
  await todo.execute({ action: "add", text: "second" });

  const result = await todo.execute({ action: "toggle", ids: [1, 99] });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /#99 not found/);
  assert.deepEqual(result.details.todos.map(({ done }: { done: boolean }) => done), [false, false]);
});

test("toggle requires at least one id", async () => {
  const result = await createTodoTool().execute({ action: "toggle" });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /id or ids required/);
});
