import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";

const FOCUS_ENTRY = "goal-focus";
const LEGACY_ENTRY = "goal-state";

function readFocus(ctx: ExtensionContext): string | undefined {
  const { sessionManager } = ctx;
  const sessionId = sessionManager.getSessionId();
  const entries = sessionManager.getEntries();
  // /tree changes the active branch, not which goal was appended last.
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry.type !== "custom") continue;
    const { customType } = entry;
    if (customType !== FOCUS_ENTRY && customType !== LEGACY_ENTRY) continue;
    const data = entry.data as
      | { sessionId?: string; text?: string | null; status?: string }
      | undefined;
    if (data?.sessionId !== sessionId) continue;
    if (
      customType === LEGACY_ENTRY &&
      data.status !== "pending" &&
      data.status !== "active" &&
      data.status !== "blocked"
    )
      return;
    return typeof data.text === "string" ? data.text : undefined;
  }
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("goal", {
    description: "Set, show, or clear session focus (usage: /goal [text|clear])",
    handler: async (args, ctx) => {
      const input = args.trim();
      if (input) {
        pi.appendEntry(FOCUS_ENTRY, {
          sessionId: ctx.sessionManager.getSessionId(),
          text: input === "clear" ? null : input,
        });
      }
      const focus = readFocus(ctx);
      ctx.ui.notify(focus ? `Goal: ${focus}` : "No goal in this session", "info");
    },
  });

  pi.on("context", (event, ctx) => {
    const focus = readFocus(ctx);
    if (!focus) return;
    return {
      messages: [
        {
          role: "custom",
          customType: FOCUS_ENTRY,
          content: `Session goal (background only; the user's current request takes priority):\n${focus}`,
          display: false,
          timestamp: Date.now(),
        },
        ...event.messages,
      ],
    };
  });
}
