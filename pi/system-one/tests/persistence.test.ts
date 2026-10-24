import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it } from "node:test";
import { loadStoredConfig, saveStoredConfig } from "../src/persistence.ts";

it("round-trips persistent settings without writing a key", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-config-"));
  try {
    const path = join(dir, "pi-system-one.json");
    saveStoredConfig(path, {
      mode: "custom",
      baseUrl: "http://localhost:8008",
      model: "reflex",
      timeoutMs: 9000,
    });
    assert.deepEqual(loadStoredConfig(path), {
      mode: "custom",
      baseUrl: "http://localhost:8008",
      model: "reflex",
      timeoutMs: 9000,
    });
    assert.doesNotMatch(readFileSync(path, "utf8"), /apiKey/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("persists model routing without storing endpoint or credentials", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-model-"));
  try {
    const path = join(dir, "pi-system-one.json");
    saveStoredConfig(path, { mode: "model", timeoutMs: 5000 });
    assert.deepEqual(loadStoredConfig(path), { mode: "model", timeoutMs: 5000 });
    assert.doesNotMatch(readFileSync(path, "utf8"), /baseUrl|apiKey|secret/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("persists auto routing policy without a detected provider or credentials", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-auto-"));
  try {
    const path = join(dir, "pi-system-one.json");
    saveStoredConfig(path, { mode: "auto", timeoutMs: 5000 });
    assert.deepEqual(loadStoredConfig(path), { mode: "auto", timeoutMs: 5000 });
    assert.doesNotMatch(
      readFileSync(path, "utf8"),
      /baseUrl|apiKey|jev-latest/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("validates declared default references and safe HTTP provider config", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-decision-model-"));
  try {
    const path = join(dir, "pi-system-one.json");
    const declaration = {
      provider: "litellm",
      model: "openrouter/jev-1.14",
    };
    const providers = {
      litellm: {
        baseUrl: "https://litellm.example/v1",
        apiKeyFile: "~/.config/secrets/provider-key",
        models: [{ id: "openrouter/jev-1.14" }],
      },
    };
    saveStoredConfig(path, { mode: "model", default: declaration, providers });
    assert.deepEqual(loadStoredConfig(path), {
      mode: "model",
      default: declaration,
      providers,
    });

    writeFileSync(path, JSON.stringify({
      default: declaration,
      providers: { ...providers, litellm: { ...providers.litellm, models: [{ id: "different" }] } },
    }));
    assert.throws(() => loadStoredConfig(path), /declared provider model/);

    for (const invalid of [
      { default: { provider: "__proto__", model: "openrouter/jev-1.14" }, providers },
      { default: declaration, providers: { ...providers, litellm: { ...providers.litellm, models: [{ id: "different" }] } } },
      { default: declaration, providers: { litellm: { ...providers.litellm, baseUrl: "file:///tmp/api-key" } } },
      { default: declaration, providers: { litellm: { ...providers.litellm, baseUrl: "https://user:secret@example.com" } } },
    ]) {
      assert.throws(
        () => saveStoredConfig(path, invalid),
        (error: Error) => {
          assert.match(error.message, /Invalid System One settings/);
          assert.doesNotMatch(error.message, /secret|api-key|provider-key/);
          return true;
        },
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("rejects credential-bearing endpoint URLs without persisting them", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-config-"));
  try {
    const path = join(dir, "pi-system-one.json");
    for (const baseUrl of [
      "https://user:secret@example.com",
      "https://example.com/?token=secret",
      "https://example.com/#secret",
    ]) {
      assert.throws(
        () => saveStoredConfig(path, { mode: "custom", baseUrl }),
        (error: Error) =>
          !error.message.includes("secret") && /baseUrl/.test(error.message),
      );
      assert.throws(() => readFileSync(path, "utf8"), /ENOENT/);
    }
    writeFileSync(
      path,
      JSON.stringify({
        mode: "custom",
        baseUrl: "https://example.com/?token=secret",
      }),
    );
    assert.throws(() => loadStoredConfig(path), /baseUrl/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("does not echo unknown JSON field names in diagnostics", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-config-"));
  try {
    const path = join(dir, "pi-system-one.json");
    writeFileSync(path, JSON.stringify({ "Bearer secret-token": "ignored" }));
    assert.throws(
      () => loadStoredConfig(path),
      (error: Error) => {
        assert.match(error.message, /unknown field/);
        assert.doesNotMatch(error.message, /Bearer|secret-token/);
        return true;
      },
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it("rejects malformed settings and refuses stored secrets", () => {
  const dir = mkdtempSync(join(tmpdir(), "so-config-"));
  try {
    const path = join(dir, "pi-system-one.json");
    writeFileSync(path, JSON.stringify({ mode: "typesafe", apiKey: "secret" }));
    assert.throws(() => loadStoredConfig(path), /apiKey/);
    writeFileSync(path, "{");
    assert.throws(() => loadStoredConfig(path), /Invalid System One settings JSON/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
