/**
 * Auto-Continue After Compaction
 *
 * pi collapses long contexts by summarizing older turns (auto-compaction at the
 * token threshold, `/compact`, or overflow recovery). For every non-overflow
 * compaction this extension automatically injects a "continue" directive so the
 * agent resumes its in-progress work instead of stopping until the user types
 * again.
 *
 * Behavior:
 *   - Listens to `session_compact`.
 *   - Skips `overflow` recoveries (pi already retries the aborted turn itself).
 *   - Skips when messages are already queued (would stack duplicative prompts).
 *   - Cooldown between auto-continues to avoid racing a rapid second compaction.
 *   - Default ON; toggle per session with:
 *       /auto-continue         -> show its status
 *       /auto-continue on      -> enable  (default)
 *       /auto-continue off     -> disable
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const CONTINUATION_PROMPT =
  "The conversation context was compacted to reclaim space. Before continuing, re-read any " +
  "skills the user explicitly invoked or asked you to use that remain relevant to the current task. " +
  "Then continue the in-progress work seamlessly: resume the next uncompleted step of the current " +
  "task. Do not apologize, do not restate the whole plan, and do not summarize what already " +
  "happened — just proceed with the next action as if nothing interrupted you.";

// Cooldown so a compaction followed almost immediately by another compaction
// (e.g. the just-produced continuation itself pushes over the threshold) does
// not fire two overlapping continues back-to-back.
const COOLDOWN_MS = 15_000;

export default function (pi: ExtensionAPI) {
	let enabled = true;
	let lastContinueAt = 0;
	let pendingContinuation: { reason: string; ctx: ExtensionContext } | undefined;
	let continuationTimer: ReturnType<typeof setTimeout> | undefined;

	const sendWhenIdle = () => {
		continuationTimer = undefined;
		const pending = pendingContinuation;
		if (!pending) return;
		if (!enabled) {
			pendingContinuation = undefined;
			return;
		}

		if (pending.ctx.hasPendingMessages()) {
			pendingContinuation = undefined;
			return;
		}
		if (!pending.ctx.isIdle()) {
			continuationTimer = setTimeout(sendWhenIdle, 100);
			return;
		}

		pendingContinuation = undefined;
		if (pending.ctx.hasUI) {
			pending.ctx.ui.notify(`Compaction finished (${pending.reason}) — auto-continuing`, "info");
		}
		pi.sendUserMessage(CONTINUATION_PROMPT);
	};

	const maybeContinueAfterCompact = (reason: string, willRetry: boolean, ctx: ExtensionContext) => {
		if (!enabled) return;

		// Overflow recovery already retries the aborted turn automatically.
		if (willRetry) return;

		// Avoid stacking a continuation on top of already-queued messages.
		if (ctx.hasPendingMessages() || pendingContinuation) return;

		const now = Date.now();
		if (now - lastContinueAt < COOLDOWN_MS) return;
		lastContinueAt = now;

		pendingContinuation = { reason, ctx };
		continuationTimer = setTimeout(sendWhenIdle, 0);
	};

	pi.on("session_compact", (event, ctx) => {
		maybeContinueAfterCompact(event.reason, event.willRetry, ctx);
	});

	pi.on("session_shutdown", () => {
		if (continuationTimer) clearTimeout(continuationTimer);
		continuationTimer = undefined;
		pendingContinuation = undefined;
	});

	pi.registerCommand("auto-continue", {
		description: "Show or set the auto-continue-after-compaction toggle (usage: /auto-continue [on|off])",
		handler: async (args, ctx) => {
			const arg = args.trim().toLowerCase();
			if (arg === "on" || arg === "off") {
				enabled = arg === "on";
				ctx.ui.notify(`Auto-continue after compaction: ${enabled ? "enabled" : "disabled"}`);
				return;
			}
			ctx.ui.notify(`Auto-continue after compaction is currently ${enabled ? "enabled" : "disabled"}`);
		},
	});
}
