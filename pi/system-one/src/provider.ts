import type { ExtensionToolContext } from "@earendil-works/pi-coding-agent";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import {
  HttpSystemOneProvider,
  type QuestionMap,
  type SystemOneCallOptions,
  type SystemOneProvider,
  type SystemOneRequest,
  type SystemOneResponse,
  validateResponse,
} from "../system-one-core/src/index.ts";
import {
  isTypeSafeEndpoint,
  type ConfiguredModelProvider,
  type SessionConfig,
} from "./config.ts";

export type NativeFailureCategory =
  | "native model unavailable"
  | "native Score unsupported"
  | "native input incompatible"
  | "native classify threw"
  | "native classifier returned error"
  | "invalid native response"
  | "native request aborted";

/** Fixed diagnostic category only; never include Pi/provider error text. */
export class PiNativeDiagnosticError extends Error {
  readonly category: NativeFailureCategory;
  constructor(category: NativeFailureCategory, message: string) {
    super(message);
    this.category = category;
  }
}

function nativeFailure(
  category: NativeFailureCategory,
  aborted: boolean,
): PiNativeDiagnosticError {
  return new PiNativeDiagnosticError(
    aborted ? "native request aborted" : category,
    aborted
      ? "Pi native classifier request aborted."
      : "Pi native classifier failed. Check Pi classifier credentials and logs.",
  );
}

class PiNativeProvider implements SystemOneProvider {
  readonly id = "pi-native";
  private readonly ctx: ExtensionToolContext;
  private readonly timeoutMs: number;
  private readonly onDispatch?: () => void;
  constructor(
    ctx: ExtensionToolContext,
    timeoutMs: number,
    onDispatch?: () => void,
  ) {
    this.ctx = ctx;
    this.timeoutMs = timeoutMs;
    this.onDispatch = onDispatch;
  }

  async evaluate<Q extends QuestionMap>(
    request: SystemOneRequest<Q>,
    options?: SystemOneCallOptions,
  ): Promise<SystemOneResponse<Q>> {
    const classifiers =
      this.ctx.modelRegistry?.getModelsOfType?.("classifier") ?? [];
    const model =
      classifiers.find(
        (candidate) => candidate.provider === this.ctx.model?.provider,
      ) ?? classifiers[0];
    if (!model)
      throw new PiNativeDiagnosticError(
        "native model unavailable",
        "No Pi classifier model is available. Use /so config to select an HTTP provider instead.",
      );
    const questions: Record<string, unknown> = Object.create(null);
    for (const [id, question] of Object.entries(request.questions)) {
      if (question.type === "score")
        throw new PiNativeDiagnosticError(
          "native Score unsupported",
          "Pi native classifier omits Score probabilities. Use /so config to select an HTTP provider for Score questions.",
        );
      if (typeof question.instructions !== "string")
        throw new PiNativeDiagnosticError(
          "native input incompatible",
          "Pi native classifier requires string instructions. Use HTTP mode for structured instructions.",
        );
      if (question.type === "choice") {
        const criteria: Record<string, string> = Object.create(null);
        for (const [key, meaning] of Object.entries(question.criteria)) {
          if (meaning !== null && typeof meaning !== "string")
            throw new PiNativeDiagnosticError(
              "native input incompatible",
              "Pi native classifier requires string Choice criteria. Use HTTP mode for structured criteria.",
            );
          criteria[key] = meaning ?? key;
        }
        questions[id] = {
          type: "choice",
          instructions: question.instructions,
          criteria,
        };
      } else {
        const values = question.criteria;
        if (
          values &&
          (typeof values.true !== "string" || typeof values.false !== "string")
        )
          throw new PiNativeDiagnosticError(
            "native input incompatible",
            "Pi native classifier requires string yes/no criteria. Use HTTP mode for structured criteria.",
          );
        questions[id] = {
          type: "bool",
          instructions: question.instructions,
          criteria: {
            true: values?.true ?? "Yes",
            false: values?.false ?? "No",
          },
        };
      }
    }
    const state =
      typeof request.state === "object" &&
      request.state !== null &&
      !Array.isArray(request.state)
        ? request.state
        : { state: request.state };
    let result: Awaited<
      ReturnType<ExtensionToolContext["modelRegistry"]["classify"]>
    >;
    try {
      this.onDispatch?.();
      result = await this.ctx.modelRegistry.classify(
        model,
        { state, questions } as never,
        { signal: options?.signal, timeoutMs: this.timeoutMs },
      );
    } catch {
      // Pi and its provider may include untrusted response bodies in errors.
      throw nativeFailure(
        "native classify threw",
        options?.signal?.aborted === true,
      );
    }
    if (result.stopReason !== "stop")
      throw nativeFailure(
        "native classifier returned error",
        result.stopReason === "aborted" || options?.signal?.aborted === true,
      );
    try {
      const answers: Record<string, unknown> = Object.create(null);
      for (const [id, answer] of Object.entries(result.answers))
        answers[id] =
          answer.type === "bool"
            ? { type: "noul", noul: answer.probability }
            : answer;
      return validateResponse(
        request.questions,
        {
          model: result.model,
          answers,
          usage: result.usage
            ? {
                inputTokens: result.usage.input,
                outputTokens: result.usage.output,
              }
            : undefined,
        },
        this.id,
      );
    } catch {
      // Core validation can quote provider-controlled values; hide its detail.
      throw nativeFailure("invalid native response", false);
    }
  }
}

export function piModelBaseUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  const path = url.pathname.replace(/\/v1\/?$/, "").replace(/\/$/, "");
  return `${url.origin}${path}`;
}

function supportsNative(request: SystemOneRequest<QuestionMap>): boolean {
  return Object.values(request.questions).every((question) => {
    if (question.type === "score" || typeof question.instructions !== "string")
      return false;
    if (question.type === "choice")
      return Object.values(question.criteria).every(
        (value) => value === null || typeof value === "string",
      );
    return (
      !question.criteria ||
      (Object.keys(question.criteria).every(
        (key) => key === "true" || key === "false",
      ) &&
        typeof question.criteria.true === "string" &&
        typeof question.criteria.false === "string")
    );
  });
}

export type RouteObserver = (
  provider: "pi-native" | "typesafe" | "configured",
  reason:
    | "compatible request"
    | "contains Score"
    | "native-incompatible input"
    | "classifier unavailable"
    | "selected mode",
) => void;

function resolveDeclaredModelProvider(session: SessionConfig): SystemOneProvider | undefined {
  const declaration = session.decisionModel;
  if (!declaration) return undefined;
  const selection = declaration.default;
  const provider = declaration.providers[selection.provider];
  if (!provider?.models.some((model) => model.id === selection.model))
    throw new Error("Configured System One default model is unavailable.");
  return new DeclaredModelProvider(
    selection.model,
    provider,
    session.current.timeoutMs,
  );
}

export function expandApiKeyFile(path: string): string {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return isAbsolute(path) ? path : join(homedir(), path);
}

class DeclaredModelProvider implements SystemOneProvider {
  readonly id = "configured";
  private readonly model: string;
  private readonly provider: ConfiguredModelProvider;
  private readonly timeoutMs: number;
  constructor(
    model: string,
    provider: ConfiguredModelProvider,
    timeoutMs: number,
  ) {
    this.model = model;
    this.provider = provider;
    this.timeoutMs = timeoutMs;
  }

  async evaluate<Q extends QuestionMap>(
    request: SystemOneRequest<Q>,
    options?: SystemOneCallOptions,
  ): Promise<SystemOneResponse<Q>> {
    try {
      const endpoint = new URL(this.provider.baseUrl);
      if (
        (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") ||
        endpoint.username ||
        endpoint.password ||
        endpoint.search ||
        endpoint.hash
      )
        throw new Error();
      const key = (
        await readFile(expandApiKeyFile(this.provider.apiKeyFile), "utf8")
      ).trim();
      if (!key) throw new Error();
      const http = new HttpSystemOneProvider({
        id: this.id,
        baseUrl: piModelBaseUrl(endpoint.toString()),
        apiKey: key,
        defaultModel: this.model,
        timeoutMs: this.timeoutMs,
        fetch: (input, init) => fetch(input, { ...init, redirect: "error" }),
      });
      return await http.evaluate(request, { ...options, model: this.model });
    } catch {
      throw new Error(
        "Configured System One model request failed; check provider configuration and availability.",
      );
    }
  }
}

class AutoSystemOneProvider implements SystemOneProvider {
  readonly id = "auto";
  private readonly session: SessionConfig;
  private readonly ctx: ExtensionToolContext;
  private readonly onRoute?: RouteObserver;
  private readonly onDispatch?: () => void;
  constructor(
    session: SessionConfig,
    ctx: ExtensionToolContext,
    onRoute?: RouteObserver,
    onDispatch?: () => void,
  ) {
    this.session = session;
    this.ctx = ctx;
    this.onRoute = onRoute;
    this.onDispatch = onDispatch;
  }

  async evaluate<Q extends QuestionMap>(
    request: SystemOneRequest<Q>,
    options?: SystemOneCallOptions,
  ): Promise<SystemOneResponse<Q>> {
    const compatible = supportsNative(request);
    if (
      compatible &&
      (this.ctx.modelRegistry?.getModelsOfType?.("classifier").length ?? 0) > 0
    ) {
      this.onRoute?.("pi-native", "compatible request");
      return new PiNativeProvider(
        this.ctx,
        this.session.current.timeoutMs,
        this.onDispatch,
      ).evaluate(request, options);
    }
    this.onRoute?.(
      "configured",
      compatible
        ? "classifier unavailable"
        : Object.values(request.questions).some(
              (question) => question.type === "score",
            )
          ? "contains Score"
          : "native-incompatible input",
    );
    const http =
      resolveDeclaredModelProvider(this.session) ??
      (await resolvePiModelProvider(this.session, this.ctx));
    this.onDispatch?.();
    return http.evaluate(request, options);
  }
}

/** Resolve active-model credentials and endpoint together at call time. */
async function resolvePiModelProvider(
  session: SessionConfig,
  ctx: ExtensionToolContext,
): Promise<SystemOneProvider> {
  const model = ctx.model;
  if (!model?.baseUrl || !model.id)
    throw new Error("No active Pi chat model is available for System One.");
  const auth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
  if (!auth.ok)
    throw new Error("Could not resolve credentials for the active Pi model.");
  const baseUrl = auth.baseUrl ?? model.baseUrl;
  let endpoint: URL;
  try {
    endpoint = new URL(baseUrl);
  } catch {
    throw new Error("The active Pi model has an invalid endpoint.");
  }
  let modelEndpoint: URL;
  try {
    modelEndpoint = new URL(model.baseUrl);
  } catch {
    throw new Error("The active Pi model has an invalid endpoint.");
  }
  if (
    endpoint.origin !== modelEndpoint.origin ||
    (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash
  )
    throw new Error("The active Pi model has an unsupported endpoint.");
  const headers = Object.fromEntries(
    Object.entries(auth.headers ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  return new HttpSystemOneProvider({
    id: "configured",
    baseUrl: piModelBaseUrl(baseUrl),
    apiKey: auth.apiKey,
    headers,
    defaultModel: session.current.model ?? model.id,
    timeoutMs: session.current.timeoutMs,
  });
}

/** Resolve credentials at call time. Custom endpoints never inherit Pi credentials. */
export async function resolveSessionProvider(
  session: SessionConfig,
  ctx: ExtensionToolContext,
  onRoute?: RouteObserver,
  onDispatch?: () => void,
): Promise<SystemOneProvider> {
  if (session.mode === "native") {
    onRoute?.("pi-native", "selected mode");
    return new PiNativeProvider(ctx, session.current.timeoutMs, onDispatch);
  }
  if (session.mode === "auto")
    return new AutoSystemOneProvider(session, ctx, onRoute, onDispatch);
  if (session.mode === "model") {
    onRoute?.("configured", "selected mode");
    return resolveDeclaredModelProvider(session) ?? resolvePiModelProvider(session, ctx);
  }
  const config = session.current;
  if (!config.baseUrl)
    throw new Error("Custom endpoint missing. Run /so config.");
  const typeSafe = isTypeSafeEndpoint(config.baseUrl);
  const key =
    config.apiKey ??
    (typeSafe
      ? await ctx.modelRegistry?.getApiKeyForProvider?.("typesafe")
      : undefined);
  onRoute?.(typeSafe ? "typesafe" : "configured", "selected mode");
  if (typeSafe && !key)
    throw new Error(
      "TypeSafe key missing. Run /login typesafe or set SYSTEM_ONE_API_KEY.",
    );
  return new HttpSystemOneProvider({
    id: typeSafe ? "typesafe" : "configured",
    baseUrl: config.baseUrl,
    apiKey: key,
    defaultModel: config.model,
    timeoutMs: config.timeoutMs,
  });
}
