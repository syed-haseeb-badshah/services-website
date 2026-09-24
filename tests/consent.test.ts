import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function browser(
  settings: Record<string, string | boolean> = {},
  blocked = false,
) {
  const storage = new Map<string, string>();
  const session = new Map<string, string>();
  const scripts: string[] = [];
  const events: any[] = [];
  let reloads = 0;
  const location = {
    hostname: "example.co.uk",
    origin: "https://example.co.uk",
    pathname: "/contact",
    reload: () => reloads++,
  };
  const window: any = {};
  const sandbox: any = {
    exports: {},
    require: () => ({
      api: async (...args: any[]) => {
        events.push(args);
      },
    }),
    localStorage: {
      getItem: (key: string) => {
        if (blocked) throw Error();
        return storage.get(key) ?? null;
      },
      setItem: (key: string, value: string) => {
        if (blocked) throw Error();
        storage.set(key, value);
      },
      removeItem: (key: string) => storage.delete(key),
    },
    sessionStorage: {
      getItem: (key: string) => session.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (blocked) throw Error();
        session.set(key, value);
      },
      removeItem: (key: string) => session.delete(key),
    },
    setTimeout,
    document: {
      cookie: "",
      createElement: () => ({}),
      head: { appendChild: (script: any) => scripts.push(script.src) },
    },
    location,
    window,
    crypto,
    ENV: {},
    console,
  };
  const source = fs
    .readFileSync("src/lib/analytics.ts", "utf8")
    .replaceAll("import.meta.env", "ENV");
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    sandbox,
  );
  const api = sandbox.exports;
  api.configureAnalytics(settings);
  return {
    api,
    storage,
    scripts,
    events,
    location,
    window,
    reloads: () => reloads,
  };
}
const providers = {
  "pixels.ga4_measurement_id": "G-TEST",
  "pixels.meta_pixel_id": "12345",
  "pixels.google_ads_conversion_id": "AW-123",
};
test("no optional configuration creates no scripts, identifiers or event requests", async () => {
  const b = browser();
  b.api.chooseConsent(true);
  await b.api.track("Lead");
  assert.equal(b.scripts.length, 0);
  assert.equal(b.events.length, 0);
  assert.equal(b.api.consentGranted(), false);
});
test("unanswered and rejected consent prevents tracking", async () => {
  const b = browser(providers);
  await b.api.track("PageView");
  assert.equal(b.scripts.length, 0);
  assert.equal(b.storage.size, 0);
  b.api.chooseConsent(false);
  await b.api.track("Lead");
  assert.equal(b.scripts.length, 0);
  assert.equal(b.events.length, 0);
});
test("analytics-only consent never configures advertising providers", async () => {
  const b = browser(providers);
  b.api.chooseConsent({ analytics: true, marketing: false });
  assert.equal(b.scripts.length, 1);
  assert.match(b.scripts[0], /G-TEST/);
  assert.equal(b.window.fbq, undefined);
  const configs = b.window.dataLayer
    .map((x: any) => [...x])
    .filter((x: any[]) => x[0] === "config");
  assert.deepEqual(
    Array.from(configs, (x: any[]) => x[1]),
    ["G-TEST"],
  );
  assert.equal(b.storage.has("aster-client-id"), false);
});
test("marketing-only consent does not configure GA", () => {
  const b = browser(providers);
  b.api.chooseConsent({ analytics: false, marketing: true });
  assert.equal(b.scripts.length, 2);
  const configs = b.window.dataLayer
    .map((x: any) => [...x])
    .filter((x: any[]) => x[0] === "config");
  assert.deepEqual(
    Array.from(configs, (x: any[]) => x[1]),
    ["AW-123"],
  );
});
test("withdrawal removes old storage, revokes vendor consent and reloads", async () => {
  const b = browser(providers);
  b.api.chooseConsent(true);
  b.storage.set("aster-client-id", "old");
  b.api.chooseConsent(false);
  assert.equal(b.reloads(), 1);
  assert.equal(b.api.consentGranted(), false);
  assert.equal(b.storage.has("aster-client-id"), false);
  await b.api.track("Lead");
  assert.equal(b.events.length, 0);
});
test("old, malformed, future and expired choices are not valid consent", () => {
  const b = browser(providers);
  for (const at of [0, Date.now() + 100000, "invalid"]) {
    b.storage.set(
      "aster-consent-v2",
      JSON.stringify({
        analytics: true,
        marketing: true,
        at,
        configuration: JSON.stringify(b.api.providers()),
      }),
    );
    assert.equal(b.api.consentChosen(), false);
  }
  b.storage.set("aster-consent-v2", "broken");
  assert.equal(b.api.consentChosen(), false);
});
test("provider changes invalidate consent and private routes never load tags", async () => {
  const b = browser(providers);
  b.location.pathname = "/newsletter/confirm";
  b.api.chooseConsent(true);
  assert.equal(b.scripts.length, 0);
  b.api.configureAnalytics({ ...providers, "pixels.meta_pixel_id": "67890" });
  assert.equal(b.api.consentChosen(), false);
});
test("blocked storage still permits a deliberate current-visit choice", () => {
  const b = browser(providers, true);
  assert.equal(b.api.consentGranted(), false);
  b.api.chooseConsent({ analytics: true, marketing: false });
  assert.equal(b.scripts.length, 1);
  b.api.chooseConsent(false);
  assert.equal(b.api.consentGranted(), false);
});
test("server relay includes separate consent categories and no form data", async () => {
  const b = browser({ ...providers, ga4ServerRelay: true });
  b.api.chooseConsent({ analytics: true, marketing: false });
  await b.api.track("Lead");
  const data = b.events.at(-1)[1].body;
  assert.equal(data.analytics, true);
  assert.equal(data.marketing, false);
  assert.equal(data.path, "/contact");
  assert.equal(data.email, undefined);
  assert.equal(data.phone, undefined);
});

test("withdrawal requests cancellation of queued server events", async () => {
  const b = browser({ ...providers, ga4ServerRelay: true });
  b.api.chooseConsent({ analytics: true, marketing: false });
  await b.api.track("Lead");
  const sent = b.events
    .filter((e: any[]) => e[0] === "/track/event")
    .map((e: any[]) => e[1].body.eventId);
  b.api.chooseConsent(false);
  await new Promise((resolve) => setTimeout(resolve, 10));
  const revoke = b.events.find((e: any[]) => e[0] === "/track/revoke");
  assert.ok(revoke);
  assert.deepEqual(Array.from(revoke[1].body.eventIds), sent);
  assert.equal(b.reloads(), 1);
});
