import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONFIDENCE_THRESHOLD,
  PLANNER_MODEL,
  PLANNER_MODEL_PRIORITY,
  RISK_THRESHOLD,
  WORKER_MODEL_PRIORITY,
  decideSubagentPolicy,
  routeSubagentCall,
} from "../src/subagent-policy.ts";

const lowRiskAnswers = {
  risk: { type: "score", score: 0.2, confidence: 0.9 },
  worker_model: {
    type: "choice",
    choice: WORKER_MODEL_PRIORITY[0],
    confidence: 0.9,
  },
};

const launch = () => ({
  agent: "worker",
  task: "Read and summarize a small file.",
});

describe("Jev subagent routing policy", () => {
  it("routes a low-risk child to Jev's allowlisted worker model in the background", async () => {
    const input = launch();
    let calls = 0;
    const block = await routeSubagentCall(input, async (received) => {
      calls++;
      assert.equal(received.task, input.task);
      return lowRiskAnswers;
    });

    assert.equal(block, undefined);
    assert.equal(calls, 1);
    assert.equal(input.model, WORKER_MODEL_PRIORITY[0]);
    assert.equal(input.async, true);
    assert.equal((input.options as Record<string, unknown>).agentScope, "user");
    assert.equal((input.options as Record<string, unknown>).context, "fresh");
  });

  it("reroutes high-risk work to a planning-only child and strong model", async () => {
    const input = launch();
    const result = decideSubagentPolicy(input, {
      ...lowRiskAnswers,
      risk: { type: "score", score: RISK_THRESHOLD, confidence: 0.9 },
    });
    assert.equal(result.kind, "planner");
    if (result.kind !== "planner") return;

    assert.equal(result.model, PLANNER_MODEL);
    assert.equal(PLANNER_MODEL_PRIORITY[0], "litellm/chatgpt/gpt-6.2-astra");
    assert.match(result.task, /Planning-only handoff/);
    assert.match(result.task, /Do not edit files/);
    assert.match(result.task, /Read and summarize a small file/);
  });

  it("uses an approved model override when the parent retries the planner", async () => {
    const fallbackModel = PLANNER_MODEL_PRIORITY[1];
    const input = { ...launch(), model: fallbackModel };
    const block = await routeSubagentCall(input, async () => ({
      ...lowRiskAnswers,
      risk: { type: "score", score: 0.9, confidence: 0.9 },
    }));

    assert.equal(block, undefined);
    assert.equal(input.agent, "planner");
    assert.equal(input.model, fallbackModel);
  });

  it("ignores a planner model override outside the approved list", () => {
    const result = decideSubagentPolicy(
      { ...launch(), model: "provider/unapproved-model" },
      {
        ...lowRiskAnswers,
        risk: { type: "score", score: 0.9, confidence: 0.9 },
      },
    );

    assert.equal(result.kind, "planner");
    if (result.kind !== "planner") return;
    assert.equal(result.model, PLANNER_MODEL);
  });

  it("rewrites a high-risk launch to the read-only planner before execution", async () => {
    const input = launch();
    const block = await routeSubagentCall(input, async () => ({
      ...lowRiskAnswers,
      risk: { type: "score", score: 0.9, confidence: 0.9 },
    }));

    assert.equal(block, undefined);
    assert.equal(input.agent, "planner");
    assert.equal(input.model, PLANNER_MODEL);
    assert.equal(input.async, true);
    assert.match(input.task, /Planning-only handoff/);
  });

  it("lets the parent continue after explicitly reviewing the planner output", async () => {
    const input = { ...launch(), label: "plan reviewed" };
    const block = await routeSubagentCall(input, async () => ({
      ...lowRiskAnswers,
      risk: { type: "score", score: 0.9, confidence: 0.9 },
    }));
    assert.equal(block, undefined);
    assert.equal(input.model, WORKER_MODEL_PRIORITY[0]);
  });

  it("fails closed when Jev confidence is below the configured threshold", () => {
    const result = decideSubagentPolicy(launch(), {
      ...lowRiskAnswers,
      risk: {
        type: "score",
        score: 0.1,
        confidence: CONFIDENCE_THRESHOLD - 0.01,
      },
    });
    assert.equal(result.kind, "block");
  });

  it("fails closed when Jev returns a model outside the approved pool", () => {
    const result = decideSubagentPolicy(launch(), {
      ...lowRiskAnswers,
      worker_model: {
        type: "choice",
        choice: "provider/unapproved-model",
        confidence: 0.99,
      },
    });
    assert.equal(result.kind, "block");
  });

  it("blocks package actions that could launch or modify worker execution", () => {
    const result = decideSubagentPolicy({ action: "resume", id: "run-1" });
    assert.equal(result.kind, "block");
  });

  it("blocks composite launches so each child passes through its own risk check", async () => {
    const input = { tasks: [{ agent: "worker", task: "Do work" }] };
    let judged = false;
    const block = await routeSubagentCall(input, async () => {
      judged = true;
      return lowRiskAnswers;
    });
    assert.equal(judged, false);
    assert.equal(block?.block, true);
    assert.match(block?.reason ?? "", /one child at a time/);
  });

  it("passes read-only package management actions without routing them as workers", async () => {
    const input = { action: "status" };
    let judged = false;
    const block = await routeSubagentCall(input, async () => {
      judged = true;
      return lowRiskAnswers;
    });
    assert.equal(judged, false);
    assert.equal(block, undefined);
  });
});
