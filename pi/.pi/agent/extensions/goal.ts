import { StringEnum } from "@earendil-works/pi-ai";
import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const GOAL_ENTRY = "goal-state";
const GOAL_ID = 1;
const IDLE_RETRY_MS = 100;
type GoalReply = { sessionId: string; revision: number };

type GoalState = {
  sessionId: string;
  revision: number;
  text: string;
} & (
  | { status: "pending" }
  | { status: "active"; criteria: string }
  | { status: "blocked" | "completed"; criteria: string; reason: string }
  | { status: "stopped"; criteria?: string }
);

// /tree changes the projection, not the session's goal. Read all entries in append order.
function goalEntries(ctx: ExtensionContext) {
  const sessionId = ctx.sessionManager.getSessionId();
  return ctx.sessionManager.getEntries().map((entry) => ({
    entry,
    goal:
      entry.type === "custom" &&
      entry.customType === GOAL_ENTRY &&
      (entry.data as GoalState | undefined)?.sessionId === sessionId
        ? (entry.data as GoalState)
        : undefined,
  }));
}

export function readGoal(ctx: ExtensionContext): GoalState | undefined {
  return goalEntries(ctx).findLast(({ goal }) => goal !== undefined)?.goal;
}

function canRevise(ctx: ExtensionContext): boolean {
  const entries = goalEntries(ctx);
  const createdAt = entries.findIndex(({ goal }) => goal !== undefined);
  return !entries
    .slice(createdAt + 1)
    .some(({ entry }) => entry.type === "compaction");
}

const GoalUpdateParams = Type.Object({
  goalId: Type.Number({
    description: "The ID of the goal being updated",
  }),
  revision: Type.Integer({
    description: "The current goal revision from the goal instructions",
  }),
  action: StringEnum(["define", "complete", "blocked", "resume"] as const),
  reason: Type.String({
    description:
      "Verifiable done criteria (define), verification (complete), blocker (blocked), or concrete evidence that the blocker is resolved or a safe in-scope alternative exists (resume)",
  }),
});

function resumedGoal({
  sessionId,
  revision,
  text,
  criteria,
}: Pick<GoalState, "sessionId" | "revision" | "text"> & {
  criteria: string;
}): GoalState {
  return {
    sessionId,
    revision: revision + 1,
    text,
    criteria,
    status: "active",
  };
}

function compactedReplies(ctx: ExtensionContext, goal: GoalState): string[] {
  const kept = new Set(
    ctx.sessionManager.buildContextEntries().map((entry) => entry.id),
  );
  const branch = ctx.sessionManager.getBranch();
  const edited = new Set(
    branch.flatMap((entry) =>
      entry.type === "context_edit" ? [entry.targetId] : [],
    ),
  );
  return branch.flatMap((entry) => {
    if (
      entry.type !== "message" ||
      entry.message.role !== "user" ||
      kept.has(entry.id) ||
      edited.has(entry.id)
    )
      return [];
    const reply = (
      entry.message as typeof entry.message & { goalReply?: GoalReply }
    ).goalReply;
    return reply?.sessionId === goal.sessionId &&
      reply.revision === goal.revision
      ? [userText(entry.message.content)]
      : [];
  });
}

function userText(
  content: string | readonly { type: string; text?: string }[],
): string {
  return typeof content === "string"
    ? content
    : content
        .flatMap((part) => (part.type === "text" ? [part.text] : []))
        .join("\n");
}

function goalPrompt(goal: GoalState, replies: string[] = []): string {
  const key = `goalId ${GOAL_ID}, revision ${goal.revision}`;
  if (goal.status === "pending") {
    return [
      `Goal #${GOAL_ID} (revision ${goal.revision}) needs definition. User's request: ${goal.text}`,
      "Only use the user's request and actual human replies to resolve scope. Do not treat a summary, assistant message, or generated prompt as authorization. If the original evidence does not settle a requirement, ask the user again.",
      ...(replies.length
        ? [
            `Verbatim human replies from this revision, removed from the current context by compaction (oldest first):\n${JSON.stringify(replies)}`,
          ]
        : []),
      `If clear, call goal_update with ${key}, action "define", and verifiable done criteria as reason. No extra confirmation is needed if the criteria follow from what the user asked.`,
      "If something important is unclear, ask focused clarification questions in your reply and wait. If the reply still leaves a gap, ask again and wait. Do not start goal work before definition.",
    ].join("\n\n");
  }
  if (goal.status === "blocked") {
    return [
      `Blocked goal #${GOAL_ID} (revision ${goal.revision}): ${goal.text}\nDone criteria: ${goal.criteria}\nBlocker: ${goal.reason}`,
      `In this already-running turn, only if concrete evidence shows the blocker is resolved or there is a safe in-scope alternative, call goal_update with ${key}, action "resume", and that evidence as reason. Otherwise, remain blocked and respond to the user's current message. Do not poll for changes or start a retry run.`,
      "Goal resume is not approval. Respect the latest user instructions, and never bypass safety checks or authorization requirements.",
    ].join("\n\n");
  }
  if (goal.status !== "active") {
    return `Goal #${GOAL_ID} is ${goal.status}. Do not resume it or follow earlier goal instructions. Respond to the user's current message.`;
  }
  return [
    `Active goal #${GOAL_ID} (revision ${goal.revision}): ${goal.text}\nDone criteria: ${goal.criteria}`,
    "Respect the latest user instructions and all safety and approval boundaries. The done criteria cannot change unless the user opens a revision with /goal revise.",
    "Continue from the current evidence, including after compaction. Choose conventional, evidence-based, reversible next steps. Try safe alternatives when an approach fails; do not retry without a reason.",
    `If human input is necessary or the next step carries major irreversible risk, call goal_update with ${key}, action "blocked", explain why, and tell the user what you need. Never bypass safety or approval.`,
    `When you have verified the done criteria, call goal_update with ${key}, action "complete", and a brief verification reason. Otherwise keep working on the next concrete step.`,
  ].join("\n\n");
}

export default function (pi: ExtensionAPI) {
  let manualContinuation: ReturnType<typeof setTimeout> | undefined;
  let interrupted = false;
  const cancelManualContinuation = () => {
    clearTimeout(manualContinuation);
    manualContinuation = undefined;
  };
  const submittedReplies = new Set<string>();
  const save = (goal: GoalState) => pi.appendEntry(GOAL_ENTRY, goal);
  const startTurn = (text: string) => {
    cancelManualContinuation();
    submittedReplies.clear();
    pi.sendUserMessage(text);
  };
  const startGoalTurn = (
    ctx: ExtensionContext,
    goal: GoalState,
    prompt: string,
  ) => {
    if (!ctx.isIdle() || ctx.hasPendingMessages()) {
      ctx.ui.notify(
        "Wait until Pi is idle with no queued messages, then retry /goal",
        "warning",
      );
      return;
    }
    save(goal);
    startTurn(prompt);
  };

  pi.registerCommand("goal", {
    description:
      "Start or show a goal (usage: /goal [text|revise <text>|stop|resume])",
    handler: async (args, ctx) => {
      const input = args.trim();
      const goal = readGoal(ctx);
      if (!input) {
        ctx.ui.notify(
          goal
            ? [
                `Goal #${GOAL_ID} (${goal.status}): ${goal.text}`,
                "criteria" in goal &&
                  goal.criteria &&
                  `Done criteria: ${goal.criteria}`,
                "reason" in goal && goal.reason,
              ]
                .filter(Boolean)
                .join("\n")
            : "No goal in this session",
          "info",
        );
        return;
      }

      const [, verb, rest] = /^(\S+)\s*([\s\S]*)$/.exec(input)!;
      if (input.toLowerCase() === "stop") {
        if (!goal || goal.status === "completed" || goal.status === "stopped") {
          ctx.ui.notify("No goal to stop", "info");
          return;
        }
        cancelManualContinuation();
        save({ ...goal, status: "stopped" });
        ctx.ui.notify(`Stopped goal #${GOAL_ID}: ${goal.text}`, "info");
        return;
      }
      if (input.toLowerCase() === "resume") {
        if (goal?.status !== "blocked" && goal?.status !== "active") {
          ctx.ui.notify("No active or blocked goal to resume", "info");
          return;
        }
        startGoalTurn(
          ctx,
          resumedGoal(goal),
          "Resume the current goal without changing the done criteria.",
        );
        return;
      }
      if (verb.toLowerCase() === "revise") {
        if (
          !rest ||
          (goal?.status !== "pending" && goal?.status !== "active") ||
          !canRevise(ctx)
        ) {
          ctx.ui.notify(
            "Use /goal revise <text> on a pending or active goal before its first compaction",
            "warning",
          );
          return;
        }
        startGoalTurn(
          ctx,
          {
            sessionId: goal.sessionId,
            revision: goal.revision + 1,
            text: rest,
            status: "pending",
          },
          `Goal revised: ${rest}`,
        );
        return;
      }
      if (goal) {
        ctx.ui.notify(
          "This session already has a goal. Use /goal to see its status.",
          "warning",
        );
        return;
      }
      startGoalTurn(
        ctx,
        {
          sessionId: ctx.sessionManager.getSessionId(),
          revision: 1,
          text: input,
          status: "pending",
        },
        `Goal requested: ${input}`,
      );
    },
  });

  pi.registerTool({
    name: "goal_update",
    label: "Update goal",
    description:
      "Define a pending goal, verify completion, pause on a blocker, or resume a blocked goal with concrete evidence in the current run. Resume does not grant approval.",
    parameters: GoalUpdateParams,
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const goal = readGoal(ctx);
      const result = (text: string, isError = false) => ({
        content: [{ type: "text" as const, text }],
        details: undefined,
        isError,
      });
      if (
        !goal ||
        params.goalId !== GOAL_ID ||
        params.revision !== goal.revision ||
        signal?.aborted ||
        ctx.signal?.aborted
      ) {
        return result(
          "Stale or cancelled goal update; no state was changed.",
          true,
        );
      }
      const reason = params.reason.trim();
      if (!reason)
        return result(
          "Provide criteria, verification, a blocker explanation, or evidence to resume.",
          true,
        );
      if (params.action === "define") {
        if (goal.status !== "pending")
          return result("The goal is not open for definition.", true);
        save({ ...goal, criteria: reason, status: "active" });
        return result(`Goal #${GOAL_ID} defined. Done criteria: ${reason}`);
      }
      if (params.action === "resume") {
        if (goal.status !== "blocked" || ctx.isIdle())
          return result(
            "Only a blocked goal can be resumed in a running turn.",
            true,
          );
        const resumed = resumedGoal(goal);
        save(resumed);
        return result(
          `Goal #${GOAL_ID} resumed at revision ${resumed.revision}.`,
        );
      }
      if (goal.status !== "active")
        return result("The goal is not active; no state was changed.", true);
      const completed = params.action === "complete";
      save({ ...goal, reason, status: completed ? "completed" : "blocked" });
      const message = completed
        ? `Goal #${GOAL_ID} completed: ${reason}`
        : `Goal #${GOAL_ID} paused due to a blocker: ${reason}`;
      ctx.ui.notify(message, completed ? "info" : "warning");
      return result(message);
    },
  });

  pi.on("context", (event, ctx) => {
    const goal = readGoal(ctx);
    if (!goal) return;
    const replies =
      goal.status === "pending" ? compactedReplies(ctx, goal) : [];
    return {
      messages: [
        ...event.messages,
        {
          role: "custom",
          customType: "goal-guidance",
          content: goalPrompt(goal, replies),
          display: false,
          timestamp: Date.now(),
        },
      ],
    };
  });

  pi.on("agent_before_settle", (event, ctx) => {
    if (event.outcome !== "completed") interrupted = true;
    if (
      interrupted ||
      readGoal(ctx)?.status !== "active" ||
      ctx.signal?.aborted ||
      event.continue ||
      ctx.hasPendingMessages() ||
      event.context.pendingMessages.length > 0
    )
      return;

    // The draft itself makes the context continuable after a final assistant reply.
    return {
      entries: [
        ...event.entries,
        {
          type: "custom_message",
          customType: "goal",
          content: "Continue the current goal.",
          display: false,
        },
      ],
      continue: true,
    };
  });

  pi.on("session_compact", (event, ctx) => {
    // Threshold compaction and overflow recovery run inside Pi's active loop.
    const goal = readGoal(ctx);
    if (event.reason !== "manual") return;
    cancelManualContinuation();
    if (
      event.willRetry ||
      interrupted ||
      ctx.hasPendingMessages() ||
      goal?.status !== "active"
    )
      return;
    const sendWhenIdle = () => {
      manualContinuation = undefined;
      const current = readGoal(ctx);
      if (
        interrupted ||
        ctx.signal?.aborted ||
        ctx.hasPendingMessages() ||
        current?.status !== "active" ||
        current.sessionId !== goal.sessionId ||
        current.revision !== goal.revision
      )
        return;
      if (!ctx.isIdle()) {
        manualContinuation = setTimeout(sendWhenIdle, IDLE_RETRY_MS);
        return;
      }
      startTurn("Continue the current goal after compaction.");
    };
    // Pi clears manual compaction and hands off queued user input after this event.
    manualContinuation = setTimeout(sendWhenIdle, 0);
  });

  pi.on("input", (event, ctx) => {
    cancelManualContinuation();
    if (event.source === "extension") submittedReplies.delete(event.text);
    else if (event.text.trim() && readGoal(ctx)?.status === "pending")
      submittedReplies.add(event.text);
  });
  pi.on("message_end", ({ message }, ctx) => {
    if (
      message.role !== "user" ||
      !submittedReplies.delete(userText(message.content))
    )
      return;
    const goal = readGoal(ctx);
    if (goal?.status !== "pending") return;
    // Pi persists this finalized message on its branch, even when compaction later hides it.
    const goalReply: GoalReply = {
      sessionId: goal.sessionId,
      revision: goal.revision,
    };
    const markedMessage = { ...message, goalReply };
    return { message: markedMessage };
  });
  pi.on("before_agent_start", () => {
    cancelManualContinuation();
    interrupted = false;
  });
  pi.on("agent_settled", (event) => {
    submittedReplies.clear();
    if (event.aborted) {
      interrupted = true;
      cancelManualContinuation();
    }
  });
  const clearSessionWork = () => {
    cancelManualContinuation();
    submittedReplies.clear();
  };
  pi.on("session_before_tree", clearSessionWork);
  pi.on("session_tree", clearSessionWork);
  pi.on("session_before_switch", clearSessionWork);
  pi.on("session_before_fork", clearSessionWork);
  pi.on("session_shutdown", clearSessionWork);
}
