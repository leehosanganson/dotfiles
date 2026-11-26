export const WORKER_MODEL_PRIORITY = [
  "litellm/openrouter/gpt-6-luna",
  "litellm/openrouter/deepseek-v4-flash",
  "litellm/chatgpt/gpt-6-luna",
  "litellm/chatgpt/gpt-6.2-sol",
  "litellm/chatgpt/gpt-6.2-astra",
  "litellm/unsloth/qwen-3.8",
] as const;

export const PLANNER_MODEL_PRIORITY = [
  "litellm/chatgpt/gpt-6.2-astra",
  "litellm/openrouter/gpt-6-luna",
  "litellm/openrouter/deepseek-v4-flash",
  "litellm/chatgpt/gpt-6.2-sol",
  "litellm/chatgpt/gpt-6-luna",
  "litellm/unsloth/qwen-3.8",
] as const;

export const PLANNER_MODEL = PLANNER_MODEL_PRIORITY[0];
export const RISK_THRESHOLD = 0.7;
export const CONFIDENCE_THRESHOLD = 0.7;

export type SubagentPolicyAnswers = {
  risk?: { type?: unknown; score?: unknown; confidence?: unknown };
  worker_model?: { type?: unknown; choice?: unknown; confidence?: unknown };
};

export type SubagentPolicyResult =
  | { kind: "pass" }
  | { kind: "pending" }
  | { kind: "block"; reason: string }
  | { kind: "worker"; model: (typeof WORKER_MODEL_PRIORITY)[number] }
  | {
      kind: "planner";
      model: (typeof PLANNER_MODEL_PRIORITY)[number];
      task: string;
    };

export function decideSubagentPolicy(
  input: Record<string, unknown>,
  answers?: SubagentPolicyAnswers,
  approvedPlan = false,
): SubagentPolicyResult {
  const safeControlActions = new Set([
    "list",
    "status",
    "doctor",
    "models",
    "guide",
    "children.list",
    "stop",
  ]);
  if (typeof input.action === "string") {
    return safeControlActions.has(input.action)
      ? { kind: "pass" }
      : {
          kind: "block",
          reason:
            "Jev routing blocks subagent actions that can start or change work. Use one scored single-agent call instead.",
        };
  }

  const hasComposite =
    input.workflow !== undefined ||
    input.args !== undefined ||
    (Array.isArray(input.tasks) && input.tasks.length > 0) ||
    (Array.isArray(input.chain) && input.chain.length > 0);
  if (hasComposite) {
    return {
      kind: "block",
      reason:
        "Jev routing currently approves one child at a time. Use separate single-agent background calls; each will be scored and routed independently.",
    };
  }

  if (typeof input.agent !== "string") return { kind: "pass" };
  if (typeof input.task !== "string" || input.task.trim() === "") {
    return {
      kind: "block",
      reason:
        "Jev routing requires an explicit non-empty task before a child can start.",
    };
  }

  if (!answers) return { kind: "pending" };

  const risk = answers.risk;
  if (
    risk?.type !== "score" ||
    typeof risk.score !== "number" ||
    !Number.isFinite(risk.score) ||
    risk.score < 0 ||
    risk.score > 1 ||
    typeof risk.confidence !== "number" ||
    !Number.isFinite(risk.confidence) ||
    risk.confidence < CONFIDENCE_THRESHOLD
  ) {
    return {
      kind: "block",
      reason:
        "Jev could not score this task with enough confidence. No child was started. Please clarify the task or choose the route yourself.",
    };
  }

  if (risk.score >= RISK_THRESHOLD && !approvedPlan) {
    const requestedPlannerModel = input.model;
    const model =
      typeof requestedPlannerModel === "string" &&
      PLANNER_MODEL_PRIORITY.includes(
        requestedPlannerModel as (typeof PLANNER_MODEL_PRIORITY)[number],
      )
        ? (requestedPlannerModel as (typeof PLANNER_MODEL_PRIORITY)[number])
        : PLANNER_MODEL;
    return {
      kind: "planner",
      model,
      task: [
        "Planning-only handoff. Do not edit files, run commands, or start other agents.",
        "Analyze the task and return a concrete plan, key risks, assumptions, and verification steps for the parent to review.",
        "Task:",
        input.task,
      ].join("\n\n"),
    };
  }

  const worker = answers?.worker_model;
  if (
    worker?.type !== "choice" ||
    typeof worker.choice !== "string" ||
    !WORKER_MODEL_PRIORITY.includes(
      worker.choice as (typeof WORKER_MODEL_PRIORITY)[number],
    ) ||
    typeof worker.confidence !== "number" ||
    !Number.isFinite(worker.confidence) ||
    worker.confidence < CONFIDENCE_THRESHOLD
  ) {
    return {
      kind: "block",
      reason:
        "Jev did not select an approved worker model with enough confidence. No child was started.",
    };
  }

  return {
    kind: "worker",
    model: worker.choice as (typeof WORKER_MODEL_PRIORITY)[number],
  };
}

export async function routeSubagentCall(
  input: Record<string, unknown>,
  judge: (input: Record<string, unknown>) => Promise<SubagentPolicyAnswers>,
): Promise<{ block: true; reason: string } | undefined> {
  const initial = decideSubagentPolicy(input);
  if (initial.kind !== "pending") return applySubagentPolicy(input, initial);

  const answers = await judge(input);
  const approvedPlan = input.label === "plan reviewed";
  return applySubagentPolicy(
    input,
    decideSubagentPolicy(input, answers, approvedPlan),
  );
}

export function applySubagentPolicy(
  input: Record<string, unknown>,
  result: SubagentPolicyResult,
): { block: true; reason: string } | undefined {
  if (result.kind === "pass" || result.kind === "pending") return undefined;
  if (result.kind === "block") return { block: true, reason: result.reason };

  input.model = result.model;
  input.async = true;
  const options =
    input.options &&
    typeof input.options === "object" &&
    !Array.isArray(input.options)
      ? (input.options as Record<string, unknown>)
      : {};
  input.options = { ...options, agentScope: "user", context: "fresh" };
  if (result.kind === "planner") {
    input.agent = "planner";
    input.task = result.task;
  }
  return undefined;
}
