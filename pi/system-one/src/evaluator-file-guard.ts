import { realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

type FileToolInput = {
  path?: unknown;
};

const blockedDirectoryNames = new Set([
  ".aws",
  ".docker",
  ".git",
  ".gnupg",
  ".kube",
  ".pi",
  ".ssh",
  ".terraform",
  "secret",
  "secrets",
  "sessions",
]);
const blockedFileNames = new Set([
  ".netrc",
  ".npmrc",
  ".pypirc",
  "auth.json",
  "credentials.json",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "id_rsa",
  "pi-system-one.json",
  "terraform.tfstate",
  "terraform.tfstate.backup",
]);
const blockedFileSuffixes = new Set([
  ".age",
  ".jks",
  ".key",
  ".kdbx",
  ".pem",
  ".p12",
  ".pfx",
]);
const credentialWord =
  /(?:^|[._-])(?:auth|credential|password|secret|token)(?:[._-]|$)/i;

function isWithinRoot(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return (
    pathFromRoot === "" ||
    (!isAbsolute(pathFromRoot) &&
      pathFromRoot !== ".." &&
      !pathFromRoot.startsWith(`..${sep}`))
  );
}

function hasSensitiveComponent(pathFromRoot: string): boolean {
  const parts = pathFromRoot.split(sep).filter(Boolean);
  return parts.some((part) => {
    const name = part.toLowerCase();
    if (blockedDirectoryNames.has(name) || blockedFileNames.has(name))
      return true;
    if (name.startsWith(".env")) return true;
    if (blockedFileSuffixes.has(name.slice(name.lastIndexOf(".")))) return true;
    return credentialWord.test(name);
  });
}

function block(reason: string): string {
  return `Evaluator file access blocked: ${reason}`;
}

/** Returns a blocking reason for a tool call that exceeds the evaluator's read boundary. */
export function guardEvaluatorFileToolCall(
  toolName: string,
  input: unknown,
  workingDirectory: string,
): string | undefined {
  if (toolName !== "read" && toolName !== "ls") {
    return block("recursive search and non-file tools are disabled");
  }
  if (input === null || typeof input !== "object") {
    return block("tool input is invalid");
  }

  const toolInput = input as FileToolInput;
  const requestedPath =
    toolInput.path === undefined && toolName === "ls" ? "." : toolInput.path;
  if (typeof requestedPath !== "string" || requestedPath.trim() === "") {
    return block("a valid path is required");
  }

  let projectRoot: string;
  let targetPath: string;
  try {
    projectRoot = realpathSync(workingDirectory);
    targetPath = resolve(projectRoot, requestedPath);
  } catch {
    return block("the project path cannot be resolved");
  }

  if (!isWithinRoot(projectRoot, targetPath)) {
    return block("paths outside the current project are not allowed");
  }
  if (hasSensitiveComponent(relative(projectRoot, targetPath))) {
    return block("credential and private-data paths are not allowed");
  }

  let realTargetPath: string;
  try {
    realTargetPath = realpathSync(targetPath);
  } catch {
    return block("the requested path does not exist or cannot be resolved");
  }
  if (!isWithinRoot(projectRoot, realTargetPath)) {
    return block("symbolic links outside the current project are not allowed");
  }
  if (hasSensitiveComponent(relative(projectRoot, realTargetPath))) {
    return block("credential and private-data paths are not allowed");
  }

  if (toolName === "read") {
    try {
      const targetStats = statSync(realTargetPath);
      if (targetStats.isDirectory()) {
        return block("read can only access files");
      }
      if (targetStats.nlink > 1) {
        return block("files with multiple hard links are not allowed");
      }
    } catch {
      return block("the requested file cannot be inspected");
    }
  }

  return undefined;
}

export function installEvaluatorFileGuard(pi: {
  on: (
    event: "tool_call",
    handler: (
      event: { toolName: string; input: unknown },
      context: { cwd: string },
    ) => unknown,
  ) => unknown;
}): void {
  pi.on("tool_call", (event, context) => {
    const reason = guardEvaluatorFileToolCall(
      event.toolName,
      event.input,
      context.cwd,
    );
    return reason ? { block: true, reason } : undefined;
  });
}

export default function evaluatorFileGuardExtension(
  pi: Parameters<typeof installEvaluatorFileGuard>[0],
): void {
  installEvaluatorFileGuard(pi);
}
