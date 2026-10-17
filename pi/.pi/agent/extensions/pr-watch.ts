import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const INTERVAL_MS = 5 * 60 * 1000;
const STATUS_KEY = "pr-watch";

const REVIEW_PROMPT = `Scheduled PR review. Work only in the GitHub repository for the current working directory.

1. Identify the repository with gh repo view, then list all open pull requests. If there are none, report that and stop.
2. For every open, non-draft PR, inspect its title/body, full diff, relevant surrounding code, existing review threads, and current CI/check status. Do a substantive correctness, security, regression, and test-coverage review; do not treat passing CI as proof of correctness.
3. Do not modify files, push branches, close PRs, or change PR contents. You may post a concise review/comment, and you may squash-merge a PR only under the gates below. Never submit an approval review; the authorized success action is squash-merge, not approval.
4. If you find an actionable issue, do not merge. Post a concise comment/review only if the finding is new or materially different from the latest existing review/comment on that PR; do not repeat unchanged findings every poll. Explain impact and evidence, with relevant file/line where possible.
5. Squash-merge an open PR with the gh pr merge <number> --squash command only when all are true: it is not a draft; you have inspected the full diff and relevant code and found no actionable correctness, security, regression, or test-coverage issue; GitHub currently reports it mergeable with a clean merge state; the PR has at least one reported check and every reported required check has completed successfully (pending, failing, skipped, cancelled, unknown, or missing checks block merging); and the PR head has not changed since the review and check-state snapshot you examined. Re-fetch PR metadata and checks immediately before merging, then confirm the resulting PR state. Do not use auto-merge or bypass protections. If repository rules prevent the merge, report the blocker; do not try another merge method.
6. If any check, mergeability, diff, review history, head snapshot, or GitHub query is unavailable or ambiguous, do not merge. Never infer success from missing data. A failed or unresolved finding blocks merge until a later iteration confirms it is resolved and re-reviews the updated diff.
7. Keep the result concise and report each PR's URL, review conclusion, check/merge status, and any comment or squash-merge action taken.`;

export default function (pi: ExtensionAPI) {
  let timer: ReturnType<typeof setInterval> | undefined;
  let context: ExtensionContext | undefined;
  let enabled = false;
  let inFlight = false;

  function updateStatus(ctx = context) {
    ctx?.ui.setStatus(STATUS_KEY, enabled ? "PR watch: on (5m)" : undefined);
  }

  function stop(ctx = context) {
    enabled = false;
    if (timer) clearInterval(timer);
    timer = undefined;
    updateStatus(ctx);
  }

  function checkNow() {
    const ctx = context;
    if (!enabled || !ctx || !ctx.isIdle() || inFlight) return;
    inFlight = true;
    try {
      pi.sendUserMessage(REVIEW_PROMPT);
    } catch (error) {
      inFlight = false;
      ctx.ui.notify(`PR watch could not start a review: ${String(error)}`, "error");
    }
  }

  pi.on("session_start", (_event, ctx) => {
    context = ctx;
  });

  pi.on("agent_settled", () => {
    inFlight = false;
  });

  pi.on("session_shutdown", () => {
    stop();
    context = undefined;
  });

  pi.registerCommand("pr-watch", {
    description: "Start, stop, or check the five-minute PR review watcher",
    handler: async (args, ctx) => {
      context = ctx;
      const action = args.trim().toLowerCase() || "status";

      if (action === "start") {
        if (enabled) {
          ctx.ui.notify("PR watch is already running.", "info");
          return;
        }
        const repo = await pi.exec("gh", ["repo", "view", "--json", "nameWithOwner"], {
          cwd: ctx.cwd,
          timeout: 10_000,
        });
        if (repo.code !== 0) {
          ctx.ui.notify(`PR watch needs a GitHub repository and authenticated gh CLI: ${repo.stderr.trim() || "gh repo view failed"}`, "error");
          return;
        }
        enabled = true;
        updateStatus(ctx);
        timer = setInterval(checkNow, INTERVAL_MS);
        ctx.ui.notify(`PR watch started for ${repo.stdout.trim()}. Reviewing now and every five minutes while this Pi session remains open.`, "info");
        checkNow();
        return;
      }

      if (action === "stop") {
        stop(ctx);
        ctx.ui.notify("PR watch stopped. Any review already in progress will finish, but no further reviews will be scheduled.", "info");
        return;
      }

      if (action === "status") {
        ctx.ui.notify(enabled ? "PR watch is running (five-minute interval)." : "PR watch is stopped.", "info");
        return;
      }

      ctx.ui.notify("Usage: /pr-watch start|stop|status", "warning");
    },
  });
}
