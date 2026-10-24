// pi-system-one/src/config.ts
//
// Non-secret settings persist in the user agent directory. A saved mode and
// endpoint override an inherited environment URL; environment-only setups
// still select their URL. API keys are never written by this extension:
// /so config keys live only in memory; Pi login or endpoint-bound environment
// credentials provide persistent authentication.

export interface SystemOneEnv {
  SYSTEM_ONE_BASE_URL?: string;
  SYSTEM_ONE_API_KEY?: string;
  SYSTEM_ONE_MODEL?: string;
  SYSTEM_ONE_TIMEOUT_MS?: string;
}

export interface SystemOneExtConfig {
  baseUrl: string;
  apiKey?: string;
  model?: string;
  timeoutMs: number;
}

export const DEFAULT_TIMEOUT_MS = 10_000;
export const TYPESAFE_BASE_URL = "https://api.typesafe.ai";

export function isTypeSafeEndpoint(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    return (
      url.origin === TYPESAFE_BASE_URL &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export type ConfigMode = "model" | "typesafe" | "custom" | "native" | "auto";

/** Public settings only. Credentials never belong in this file. */
export interface ConfiguredModelReference {
  provider: string;
  model: string;
}

export interface ConfiguredModelProvider {
  baseUrl: string;
  apiKeyFile: string;
  models: { id: string }[];
}

export interface ConfiguredModelConfig {
  default: ConfiguredModelReference;
  providers: Record<string, ConfiguredModelProvider>;
}

export interface StoredConfig {
  mode?: ConfigMode;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
  default?: ConfiguredModelReference;
  providers?: Record<string, ConfiguredModelProvider>;
}

export function loadSystemOneConfig(
  env: SystemOneEnv = process.env,
): SystemOneExtConfig {
  const baseUrl = env.SYSTEM_ONE_BASE_URL;
  if (!baseUrl)
    throw new Error(
      "SYSTEM_ONE_BASE_URL is required when using a custom System One endpoint.",
    );
  const timeoutMs = env.SYSTEM_ONE_TIMEOUT_MS
    ? Number(env.SYSTEM_ONE_TIMEOUT_MS)
    : DEFAULT_TIMEOUT_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new Error("SYSTEM_ONE_TIMEOUT_MS must be a positive number");
  return {
    baseUrl,
    apiKey: env.SYSTEM_ONE_API_KEY || undefined,
    model: env.SYSTEM_ONE_MODEL || undefined,
    timeoutMs,
  };
}

export interface SessionConfig {
  /** Current effective config (env + in-memory overrides). */
  current: SystemOneExtConfig;
  /** True when the key came from `/so config` (memory-only). */
  keyInMemory: boolean;
  mode: ConfigMode;
  modeSource: "session" | "saved" | "environment" | "default";
  ignoredEnvironmentEndpoint: boolean;
  /** Explicit System One model declaration, independent of Pi's model registry. */
  decisionModel?: ConfiguredModelConfig;
}

export function createSessionConfig(
  env: SystemOneEnv = process.env,
  stored: StoredConfig = {},
): SessionConfig {
  const mode: ConfigMode =
    stored.mode ?? (env.SYSTEM_ONE_BASE_URL ? "custom" : "model");
  const baseUrl =
    mode === "native" || mode === "model" || mode === "auto"
      ? ""
      : mode === "typesafe"
        ? TYPESAFE_BASE_URL
        : stored.mode === "custom"
          ? (stored.baseUrl ?? "")
          : (env.SYSTEM_ONE_BASE_URL ?? "");
  const rawTimeout = env.SYSTEM_ONE_TIMEOUT_MS
    ? Number(env.SYSTEM_ONE_TIMEOUT_MS)
    : (stored.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(rawTimeout) || rawTimeout <= 0)
    throw new Error("SYSTEM_ONE_TIMEOUT_MS must be a positive number");
  return {
    mode,
    modeSource: stored.mode
      ? "saved"
      : env.SYSTEM_ONE_BASE_URL
        ? "environment"
        : "default",
    ignoredEnvironmentEndpoint: Boolean(
      stored.mode &&
        env.SYSTEM_ONE_BASE_URL &&
        env.SYSTEM_ONE_BASE_URL !== baseUrl,
    ),
    current: {
      baseUrl,
      // Bind environment credentials and model to their configured endpoint.
      apiKey:
        mode === "native" ||
        mode === "model" ||
        (mode === "custom" &&
          stored.mode === "custom" &&
          env.SYSTEM_ONE_BASE_URL !== baseUrl) ||
        ((mode === "typesafe" || mode === "auto") &&
          env.SYSTEM_ONE_BASE_URL &&
          !isTypeSafeEndpoint(env.SYSTEM_ONE_BASE_URL))
          ? undefined
          : env.SYSTEM_ONE_API_KEY || undefined,
      model:
        mode === "native"
          ? undefined
          : mode === "model" || mode === "auto"
            ? stored.model ??
              (env.SYSTEM_ONE_BASE_URL ? undefined : env.SYSTEM_ONE_MODEL)
            : mode === "typesafe"
              ? ((!env.SYSTEM_ONE_BASE_URL ||
                  isTypeSafeEndpoint(env.SYSTEM_ONE_BASE_URL)) &&
                  env.SYSTEM_ONE_MODEL) ||
                (stored.mode === "typesafe" ? "jev-latest" : stored.model)
              : (env.SYSTEM_ONE_BASE_URL === baseUrl
                  ? env.SYSTEM_ONE_MODEL
                  : undefined) || stored.model,
      timeoutMs: rawTimeout,
    },
    keyInMemory: false,
    decisionModel:
      stored.default && stored.providers
        ? { default: stored.default, providers: stored.providers }
        : undefined,
  };
}

/** Empty session for `/so config` when no env is present. */
export function blankSession(): SessionConfig {
  return {
    current: {
      baseUrl: "",
      apiKey: undefined,
      model: undefined,
      timeoutMs: DEFAULT_TIMEOUT_MS,
    },
    keyInMemory: false,
    mode: "custom",
    modeSource: "default",
    ignoredEnvironmentEndpoint: false,
    decisionModel: undefined,
  };
}

export interface ConfigAnswers {
  /** Empty string keeps the existing value. */
  baseUrl: string;
  model: string;
  /** Empty string keeps the existing key. Provided keys are memory-only. */
  apiKey: string;
  timeoutMs: string;
}

/** Apply `/so config` answers. Returns true when a memory-only key was set. */
export function applyConfigAnswers(
  session: SessionConfig,
  answers: ConfigAnswers,
  env: SystemOneEnv = process.env,
): boolean {
  if (answers.baseUrl) session.current.baseUrl = answers.baseUrl;
  if (answers.model) session.current.model = answers.model;
  const timeoutMs = Number(answers.timeoutMs);
  if (answers.timeoutMs && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    session.current.timeoutMs = timeoutMs;
  }
  if (answers.apiKey === "-") {
    session.current.apiKey = env.SYSTEM_ONE_API_KEY || undefined;
    session.keyInMemory = false;
    return false;
  }
  if (answers.apiKey) {
    session.current.apiKey = answers.apiKey;
    session.keyInMemory = true;
    return true;
  }
  return false;
}

/** Human-readable summary. Shows whether a key exists, never the key. */
export function describeConfig(session: SessionConfig): string {
  const c = session.current;
  const keyLine =
    session.mode === "native"
      ? "  api key: managed by Pi (native classifier)"
      : session.mode === "model" && session.decisionModel
        ? "  api key: read from configured provider file per request"
        : session.mode === "model" || session.mode === "auto"
          ? "  api key: managed by active Pi model"
          : !c.apiKey
            ? "  api key: absent"
            : session.keyInMemory
              ? "  api key: in memory only (gone when the session closes; export SYSTEM_ONE_API_KEY to persist)"
              : "  api key: from environment";
  return [
    "System One:",
    `  mode: ${session.mode} (${session.modeSource})`,
    ...(session.mode === "auto"
      ? [
          "  routing: per request (native when compatible; active Pi model HTTP otherwise)",
        ]
      : []),
    ...(session.ignoredEnvironmentEndpoint
      ? ["  environment endpoint ignored by selected mode"]
      : []),
    `  ${session.mode === "auto" ? "HTTP fallback endpoint" : "endpoint"}: ${c.baseUrl || (session.mode === "model" && session.decisionModel ? "configured decision provider" : session.mode === "auto" || session.mode === "model" ? "active Pi model" : "none")}`,
    keyLine,
    `  model: ${session.decisionModel && session.mode === "model" ? `${session.decisionModel.default.provider}/${session.decisionModel.default.model}` : c.model ?? ((session.mode === "model" || session.mode === "auto") ? "active Pi model" : "server default")}`,
    `  timeout: ${c.timeoutMs}ms`,
  ].join("\n");
}
