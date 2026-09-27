import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Text, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
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

  const updateStatus = (ctx: ExtensionContext) => {
    const theme = ctx.ui.theme;
    const rows = todos.map((todo) => {
      const check = todo.done ? theme.fg("success", "✓") : theme.fg("dim", "○");
      const id = theme.fg("accent", `#${todo.id}`);
      const text = todo.text.replace(/\s+/g, " ");
      return `${check} ${id} ${todo.done ? theme.fg("dim", text) : theme.fg("text", text)}`;
    });
    const status = todos.length ? `Todos ${rows.join(" · ")}` : theme.fg("dim", "Todos: none");
    ctx.ui.setStatus("todo", status);
  };

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

    updateStatus(ctx);
  };

  pi.on("session_start", async (_event, ctx) => reconstructState(ctx));
  pi.on("session_tree", async (_event, ctx) => reconstructState(ctx));

  pi.registerTool({
    name: "todo",
    label: "Todo",
    description: "Manage this session's todo list: list, add (text), toggle (id), or clear",
    parameters: TodoParams,
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      let message: string;
      let successful = true;

      switch (params.action) {
        case "list":
          message = todos.length
            ? todos.map((todo) => `[${todo.done ? "x" : " "}] #${todo.id}: ${todo.text}`).join("\n")
            : "No todos";
          break;
        case "add": {
          if (!params.text?.trim()) {
            message = "Error: text required for add";
            successful = false;
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
            successful = false;
            break;
          }
          const todo = todos.find((item) => item.id === params.id);
          if (!todo) {
            message = `Todo #${params.id} not found`;
            successful = false;
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

      if (successful) updateStatus(ctx);
      return {
        content: [{ type: "text", text: message }],
        details: { todos: todos.map((todo) => ({ ...todo })), nextId } satisfies TodoDetails,
        isError: !successful,
      };
    },
    renderResult(result, _options, theme) {
      if (result.isError) {
        const message = result.content
          .filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n");
        return new Text(message, 0, 0);
      }

      const details = result.details as TodoDetails | undefined;
      if (!details) {
        const message = result.content
          .filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n");
        return new Text(message, 0, 0);
      }
      if (details.todos.length === 0) return new Text(theme.fg("dim", "No todos"), 0, 0);

      const rows = details.todos.map((todo) => {
        const check = todo.done ? theme.fg("success", "✓") : theme.fg("dim", "○");
        const prefix = `${check} ${theme.fg("accent", `#${todo.id}`)} `;
        const description = todo.done ? theme.fg("dim", todo.text) : theme.fg("muted", todo.text);
        return { prefix, description };
      });
      return {
        render(width: number) {
          return rows.map(({ prefix, description }) => {
            const prefixWidth = visibleWidth(prefix);
            if (prefixWidth >= width) return truncateToWidth(prefix, width, "");
            const text = description.replace(/\s+/g, " ");
            return prefix + truncateToWidth(text, width - prefixWidth, "…");
          });
        },
        invalidate() {},
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
