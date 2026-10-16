import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

interface ActiveGoal {
  id: number;
  text: string;
}

const GoalUpdateParams = Type.Object({
  goalId: Type.Number({ description: "The ID of the active goal being updated" }),
  action: StringEnum(["complete", "blocked"] as const),
  reason: Type.String({ description: "Brief verification or blocker explanation" }),
});

function goalPrompt(goal: ActiveGoal): string {
  return [
    `Active goal #${goal.id}: ${goal.text}`,
    "Work toward this goal, continuing from the current session state. Verify the goal's success criteria before declaring it complete.",
    `When you have verified that the goal is complete, call goal_update with goalId ${goal.id}, action \"complete\", and a brief verification reason.`,
    `If a material blocker means you cannot proceed, stop rather than guessing, call goal_update with goalId ${goal.id}, action \"blocked\", and explain the blocker. Then report the blocker to the user.`,
    "Otherwise, continue with the next concrete step. Do not claim completion without verification.",
  ].join("\n\n");
}

export default function (pi: ExtensionAPI) {
  let activeGoal: ActiveGoal | undefined;
  let nextGoalId = 1;

  pi.registerCommand("goal", {
    description: "Start or replace a goal, show its status, or stop it (usage: /goal [text|stop])",
    handler: async (args, ctx) => {
      const input = args.trim();
      if (!input) {
        ctx.ui.notify(
          activeGoal ? `Active goal #${activeGoal.id}: ${activeGoal.text}` : "No active goal",
          "info",
        );
        return;
      }

      if (input.toLowerCase() === "stop") {
        if (!activeGoal) {
          ctx.ui.notify("No active goal to stop", "info");
          return;
        }
        const stoppedGoal = activeGoal;
        activeGoal = undefined;
        ctx.ui.notify(`Stopped goal #${stoppedGoal.id}: ${stoppedGoal.text}`, "info");
        return;
      }

      activeGoal = { id: nextGoalId++, text: input };
      ctx.ui.notify(`Started goal #${activeGoal.id}: ${activeGoal.text}`, "info");
      pi.sendUserMessage(goalPrompt(activeGoal), ctx.isIdle() ? undefined : { deliverAs: "steer" });
    },
  });

  pi.registerTool({
    name: "goal_update",
    label: "Update goal",
    description:
      "Mark the active /goal complete only after verifying success, or stop automatic continuation when a material blocker prevents progress.",
    parameters: GoalUpdateParams,
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      if (!activeGoal || params.goalId !== activeGoal.id) {
        return {
          content: [{ type: "text", text: "This goal is no longer active; no state was changed." }],
          details: undefined,
          isError: true,
        };
      }

      const resolvedGoal = activeGoal;
      activeGoal = undefined;
      const message = params.action === "complete"
        ? `Goal #${resolvedGoal.id} completed: ${params.reason}`
        : `Goal #${resolvedGoal.id} paused due to a blocker: ${params.reason}`;
      ctx.ui.notify(message, params.action === "complete" ? "info" : "warning");
      return {
        content: [{ type: "text", text: message }],
        details: undefined,
      };
    },
  });

  pi.on("agent_before_settle", (event, ctx) => {
    if (
      !activeGoal ||
      event.outcome !== "completed" ||
      ctx.hasPendingMessages() ||
      event.context.pendingMessages.length > 0 ||
      !event.context.canContinue
    ) {
      return;
    }

    return {
      entries: [
        {
          type: "custom_message",
          customType: "goal",
          content: goalPrompt(activeGoal),
          display: false,
        },
      ],
      continue: true,
    };
  });
}
