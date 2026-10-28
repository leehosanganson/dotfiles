import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export type AgentMetadata = Record<string, unknown>;

export function resolveAgentConfigDir(extensionPath: string, override?: string): string {
  return override ? resolve(override) : resolve(dirname(extensionPath), "../agent-config");
}

export function mergeAgentMetadata(frontmatter: AgentMetadata, config: AgentMetadata): AgentMetadata {
  return { ...frontmatter, ...config };
}

export async function readAgentConfig(configDir: string, promptFile: string): Promise<AgentMetadata> {
  try {
    return JSON.parse(await readFile(join(configDir, promptFile.replace(/\.md$/, ".json")), "utf8"));
  } catch {
    return {};
  }
}

export function readAgentConfigSync(configDir: string, promptFile: string): AgentMetadata {
  try {
    return JSON.parse(readFileSync(join(configDir, promptFile.replace(/\.md$/, ".json")), "utf8"));
  } catch {
    return {};
  }
}
