import {
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import type { ConfigMode, StoredConfig } from "./config.ts";

const MODES: ConfigMode[] = ["model", "typesafe", "custom", "native", "auto"];

function invalid(message: string): never {
  throw new Error(`Invalid System One settings: ${message}`);
}

function validHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

function validate(value: unknown): StoredConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    invalid("expected object");
  const v = value as Record<string, unknown>;
  if (Object.hasOwn(v, "apiKey") || Object.hasOwn(v, "key"))
    invalid("apiKey must stay in Pi credentials or environment");
  for (const key of Object.keys(v)) {
    if (
      !["mode", "baseUrl", "model", "timeoutMs", "default", "providers"].includes(key)
    )
      invalid("unknown field");
  }
  if (v.mode !== undefined && !MODES.includes(v.mode as ConfigMode))
    invalid("mode must be model, typesafe, custom, native, or auto");
  if (
    v.baseUrl !== undefined &&
    (typeof v.baseUrl !== "string" || !v.baseUrl.trim())
  )
    invalid("baseUrl must be a nonempty string");
  if (typeof v.baseUrl === "string" && !validHttpUrl(v.baseUrl))
    invalid(
      "baseUrl must be an HTTP(S) URL without credentials, query, or fragment",
    );
  if (v.model !== undefined && (typeof v.model !== "string" || !v.model.trim()))
    invalid("model must be a nonempty string");
  if (
    v.timeoutMs !== undefined &&
    (typeof v.timeoutMs !== "number" ||
      !Number.isFinite(v.timeoutMs) ||
      v.timeoutMs <= 0)
  )
    invalid("timeoutMs must be positive");
  if (v.mode === "custom" && !v.baseUrl)
    invalid("custom mode needs baseUrl");

  let defaultModel: { provider: string; model: string } | undefined;
  let providers:
    | Record<
        string,
        { baseUrl: string; apiKeyFile: string; models: { id: string }[] }
      >
    | undefined;
  if (v.default !== undefined || v.providers !== undefined) {
    if (
      typeof v.default !== "object" ||
      v.default === null ||
      Array.isArray(v.default)
    )
      invalid("default must select a declared provider and model");
    const selection = v.default as Record<string, unknown>;
    if (
      typeof selection.provider !== "string" ||
      !selection.provider.trim() ||
      typeof selection.model !== "string" ||
      !selection.model.trim() ||
      Object.keys(selection).some((key) => key !== "provider" && key !== "model")
    )
      invalid("default must select a declared provider and model");
    if (
      typeof v.providers !== "object" ||
      v.providers === null ||
      Array.isArray(v.providers)
    )
      invalid("providers must be an object");
    providers = {};
    for (const [name, rawProvider] of Object.entries(v.providers as Record<string, unknown>)) {
      if (
        !name.trim() ||
        name === "__proto__" ||
        name === "constructor" ||
        name === "prototype"
      )
        invalid("provider name must be a safe nonempty identifier");
      if (
        typeof rawProvider !== "object" ||
        rawProvider === null ||
        Array.isArray(rawProvider)
      )
        invalid("provider entries must declare baseUrl, apiKeyFile, and models");
      const provider = rawProvider as Record<string, unknown>;
      if (
        Object.keys(provider).some(
          (key) => !["baseUrl", "apiKeyFile", "models"].includes(key),
        ) ||
        !validHttpUrl(provider.baseUrl) ||
        typeof provider.apiKeyFile !== "string" ||
        !provider.apiKeyFile.trim() ||
        !Array.isArray(provider.models) ||
        provider.models.length === 0
      )
        invalid("provider entries must declare a valid HTTP(S) baseUrl, apiKeyFile, and models");
      const models: { id: string }[] = [];
      for (const rawModel of provider.models) {
        if (
          typeof rawModel !== "object" ||
          rawModel === null ||
          Array.isArray(rawModel)
        )
          invalid("provider models must declare an id");
        const model = rawModel as Record<string, unknown>;
        if (
          typeof model.id !== "string" ||
          !model.id.trim() ||
          Object.keys(model).some((key) => key !== "id")
        )
          invalid("provider models must declare an id");
        models.push({ id: model.id });
      }
      providers[name] = { baseUrl: provider.baseUrl, apiKeyFile: provider.apiKeyFile, models };
    }
    defaultModel = { provider: selection.provider, model: selection.model };
    if (
      !Object.hasOwn(providers, defaultModel.provider) ||
      !providers[defaultModel.provider].models.some(
        ({ id }) => id === defaultModel?.model,
      )
    )
      invalid("default must reference a declared provider model");
  }
  return {
    ...v,
    ...(defaultModel && providers ? { default: defaultModel, providers } : {}),
  } as StoredConfig;
}

export function loadStoredConfig(path: string): StoredConfig {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw new Error("Could not read System One settings");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid System One settings JSON");
  }
  return validate(parsed);
}

export function saveStoredConfig(path: string, config: StoredConfig): void {
  const safe = validate(config);
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.${process.pid}.${Math.random().toString(16).slice(2)}.tmp`;
  try {
    writeFileSync(temp, `${JSON.stringify(safe, null, 2)}\n`, {
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temp, path);
  } catch {
    try {
      unlinkSync(temp);
    } catch {
      /* no temporary file */
    }
    throw new Error("Could not save System One settings");
  }
}
