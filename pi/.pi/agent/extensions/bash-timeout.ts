import { isToolCallEventType } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const MIN_TIMEOUT_SECONDS = 900;

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", (event) => {
    if (!isToolCallEventType("bash", event)) return;

    if (event.input.timeout === undefined || event.input.timeout <= MIN_TIMEOUT_SECONDS) {
      event.input.timeout = MIN_TIMEOUT_SECONDS;
    }
  });
}
