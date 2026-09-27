import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoDetails {
  todos: Todo[];
  nextId: number;
}

const TodoParams = Type.Object({
  action: StringEnum(["list", "add", "toggle", "clear"] as const),
  text: Type.Optional(Type.String({ description: "Todo text (for add)" })),
  id: Type.Optional(Type.Number({ description: "Todo ID (for toggle)" })),
});

export default function (pi: ExtensionAPI) {
  let todos: Todo[] = [];
  let nextId = 1;

  const reconstructState = (ctx: ExtensionContext) => {
    todos = [];
    nextId = 1;

    for (const entry of ctx.sessionManager.getBranch()) {
      if (entry.type !== "message") continue;
      const message = entry.message;
      if (message.role !== "toolResult" || message.toolName !== "todo") continue;

      const details = message.details as TodoDetails | undefined;
      if (details) {
        todos = details.todos;
        nextId = details.nextId;
      }
    }
  };

  pi.on("session_start", async (_event, ctx) => reconstructState(ctx));
  pi.on("session_tree", async (_event, ctx) => reconstructState(ctx));

  pi.registerTool({
    name: "todo",
    label: "Todo",
    description: "Manage this session's todo list: list, add (text), toggle (id), or clear",
    parameters: TodoParams,
    async execute(_toolCallId, params) {
      let message: string;

      switch (params.action) {
        case "list":
          message = todos.length
            ? todos.map((todo) => `[${todo.done ? "x" : " "}] #${todo.id}: ${todo.text}`).join("\n")
            : "No todos";
          break;
        case "add": {
          if (!params.text?.trim()) {
            message = "Error: text required for add";
            break;
          }
          const todo = { id: nextId++, text: params.text.trim(), done: false };
          todos.push(todo);
          message = `Added todo #${todo.id}: ${todo.text}`;
          break;
        }
        case "toggle": {
          if (params.id === undefined) {
            message = "Error: id required for toggle";
            break;
          }
          const todo = todos.find((item) => item.id === params.id);
          if (!todo) {
            message = `Todo #${params.id} not found`;
            break;
          }
          todo.done = !todo.done;
          message = `Todo #${todo.id} ${todo.done ? "completed" : "uncompleted"}`;
          break;
        }
        case "clear": {
          const count = todos.length;
          todos = [];
          nextId = 1;
          message = `Cleared ${count} todos`;
          break;
        }
      }

      return {
        content: [{ type: "text", text: message }],
        details: { todos: todos.map((todo) => ({ ...todo })), nextId } satisfies TodoDetails,
      };
    },
  });

  pi.registerCommand("todos", {
    description: "List todos on the current session branch",
    handler: async (_args, ctx) => {
      const message = todos.length
        ? todos.map((todo) => `[${todo.done ? "x" : " "}] #${todo.id}: ${todo.text}`).join("\n")
        : "No todos";
      ctx.ui.notify(message, "info");
    },
  });
}
