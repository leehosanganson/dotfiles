import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { realpath, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const OUTPUT_STYLES_DIR = "output-styles";
const OUTPUT_STYLE_SECTION = "output-style";
const DIAGNOSTIC_INTERVAL_MS = 60_000;

function getAgentDir(): string {
  return resolve(process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent"));
}

function isWithinDirectory(directory: string, target: string): boolean {
  const pathFromDirectory = relative(directory, target);
  return pathFromDirectory === "" ||
    (!pathFromDirectory.startsWith(`..${sep}`) &&
      pathFromDirectory !== ".." &&
      !isAbsolute(pathFromDirectory));
}

async function readOutputStyle(filename: unknown): Promise<string> {
  if (typeof filename !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.md$/.test(filename)) {
    throw new Error("invalid filename");
  }

  const agentDir = await realpath(getAgentDir());
  const stylesDir = await realpath(join(agentDir, OUTPUT_STYLES_DIR));

  const stylePath = await realpath(join(stylesDir, filename));
  if (!isWithinDirectory(stylesDir, stylePath)) throw new Error("style outside styles directory");
  return readFile(stylePath, "utf8");
}

function reportFailure(ctx: ExtensionContext, lastDiagnostic: { at: number }): void {
  const now = Date.now();
  if (now - lastDiagnostic.at < DIAGNOSTIC_INTERVAL_MS) return;
  lastDiagnostic.at = now;
  try {
    ctx.ui.notify("Could not load configured output style; continuing with the existing prompt.", "warning");
  } catch {
    // A diagnostic must never interfere with the agent prompt.
  }
}

export default function (pi: ExtensionAPI) {
  const lastDiagnostic = { at: 0 };

  pi.on("before_agent_start", async (event, ctx) => {
    const settings: unknown = pi.getSettings();
    const filename = typeof settings === "object" && settings !== null && "outputStyle" in settings
      ? settings.outputStyle
      : undefined;
    if (filename === undefined || filename === "") return;

    try {
      const content = await readOutputStyle(filename);
      event.systemPromptOptions.sections[OUTPUT_STYLE_SECTION] = content;
    } catch {
      reportFailure(ctx, lastDiagnostic);
    }
  });
}
