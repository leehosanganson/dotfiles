import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("autopilot", {
    description: "Route and execute a task through the shared workflow (usage: /autopilot <task>)",
    handler: async (args, ctx) => {
      const task = args.trim();
      if (!task) {
        ctx.ui.notify("Usage: /autopilot <task>", "warning");
        return;
      }

      const prompt = `/skill:autopilot Task: ${task}`;
      pi.sendUserMessage(prompt, {
        expandPromptTemplates: true,
        ...(ctx.isIdle() ? {} : { deliverAs: "followUp" as const }),
      });
    },
  });
}
