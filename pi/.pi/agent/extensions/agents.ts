// Registers the primary agents (coder, content, homelab) defined as markdown
// files in ~/.pi/agent/agents/ and keeps the active one persistent for the
// session via system-prompt injection (survives compaction) and across sessions
// via a state file. Subagent definitions (mode !== "primary") are ignored, and
// opencode's nested `permission` frontmatter block is intentionally dropped.
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const expandHome = (p: string) => (p.startsWith("~/") ? join(homedir(), p.slice(2)) : p);
const AGENTS_DIR = process.env.PI_AGENTS_DIR
  ? resolve(expandHome(process.env.PI_AGENTS_DIR))
  : resolve(homedir(), ".pi/agent/agents");
const STATE_FILE = join(homedir(), ".pi/agent/agents-active.json");
const STATUS_KEY = "agent-selector";

interface Agent {
  id: string;
  description: string;
  instruction: string;
}

interface ParsedMarkdown {
  description: string;
  isPrimary: boolean;
  body: string;
}

// Read only flat frontmatter keys needed by pi; the `permission` block is ignored.
function parseMarkdown(raw: string): ParsedMarkdown {
  const fence = /^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(raw);
  const frontmatter = fence ? fence[1] : "";
  const body = fence ? raw.slice(fence[0].length).trim() : raw.trim();

  const line = (key: string) => {
    const rule = new RegExp(`^\\s*${key}\\s*:\\s*["']?([^"'\\n\\r]+)["']?\\s*$`, "m");
    const hit = rule.exec(frontmatter);
    return hit ? hit[1].trim() : "";
  };

  return { description: line("description"), isPrimary: line("mode") === "primary", body };
}

async function loadAgents(): Promise<Agent[]> {
  try {
    const files = (await readdir(AGENTS_DIR)).filter((f) => f.endsWith(".md"));
    const agents: Agent[] = [];
    for (const file of files) {
      const { description, isPrimary, body } = parseMarkdown(await readFile(join(AGENTS_DIR, file), "utf8"));
      if (isPrimary) agents.push({ id: file.replace(/\.md$/, ""), description, instruction: body });
    }
    return agents.sort((a, b) => a.id.localeCompare(b.id));
  } catch {
    return [];
  }
}

async function readActiveId(): Promise<string | null> {
  try {
    const state = JSON.parse(await readFile(STATE_FILE, "utf8")) as { id?: string };
    return state.id ?? null;
  } catch {
    return null;
  }
}

function writeActiveId(id: string | null): Promise<void> {
  return writeFile(STATE_FILE, JSON.stringify({ id }, null, 2), "utf8");
}

export default async function (pi: ExtensionAPI) {
  const agents = await loadAgents();
  const findAgent = (id?: string | null) => agents.find((a) => a.id === id);
  const completionChoices = [...agents.map((a) => a.id), "clear"];
  const choiceItems = completionChoices.map((value) => ({ value, label: value }));

  let activeId: string | null = null;

  // Render the current agent as a themed status-line ("powerline") segment that
  // persists in the footer until the agent changes or is cleared.
  const updateStatus = (ctx: ExtensionContext) => {
    if (!ctx.hasUI) return;
    const agent = findAgent(activeId);
    ctx.ui.setStatus(
      STATUS_KEY,
      ctx.ui.theme.fg("accent", `agent: ${agent ? agent.id : "none"}`),
    );
  };

  pi.on("session_start", async (_event, ctx) => {
    activeId = await readActiveId();
    updateStatus(ctx);
  });

  pi.on("before_agent_start", async (event, ctx) => {
    updateStatus(ctx);
    const agent = findAgent(activeId);
    if (!agent) return;
    return {
      systemPrompt: `${event.systemPrompt}\n\n# Running as agent: ${agent.id}\n\n${agent.instruction}`,
    };
  });

  pi.registerCommand("agent", {
    description:
      "Set the active agent for the session: /agent <coder|content|homelab>, /agent clear to unset, or /agent to pick",
    getArgumentCompletions: (prefix) => {
      const matches = choiceItems.filter((i) => i.value.startsWith(prefix));
      return matches.length ? matches : null;
    },
    handler: async (args, ctx) => {
      const setActive = (id: string | null) => {
        activeId = id;
        updateStatus(ctx);
      };
      const activate = async (id: string) => {
        setActive(id);
        await writeActiveId(id);
        ctx.ui.notify(`Active agent: ${id}`, "info");
      };
      const clear = async () => {
        setActive(null);
        await writeActiveId(null);
        ctx.ui.notify("Agent cleared — default behavior restored", "info");
      };

      const arg = (args ?? "").trim();

      if (arg === "clear") {
        await clear();
        return;
      }

      if (arg) {
        const agent = findAgent(arg);
        if (!agent) {
          ctx.ui.notify(`Unknown agent: ${arg}`, "error");
          return;
        }
        await activate(agent.id);
        return;
      }

      if (!ctx.hasUI) {
        ctx.ui.notify(activeId ? `Active agent: ${activeId}` : "No active agent (default)", "info");
        return;
      }

      const current = findAgent(activeId);
      const choice = await ctx.ui.select(
        current ? `Pick agent (current: ${current.id})` : "Pick agent",
        ["(none)", ...agents.map((a) => a.id)],
      );
      if (!choice || choice === current?.id) return;
      if (choice === "(none)") {
        await clear();
        return;
      }
      await activate(choice);
    },
  });
}
