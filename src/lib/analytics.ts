import { api, type Settings } from "./api";
export type Preferences = { analytics: boolean; marketing: boolean };
const key = "aster-consent-v2";
const lifetime = 180 * 86400000;
let settings: Settings = {};
let initialized = false;
let memory: (Preferences & { at: number; configuration: string }) | undefined;
let lastPage = "";
let lastPageAt = 0;
const pendingKey = "aster-pending-events";
const activeRequests = new Set<Promise<unknown>>();
function pendingEvents(): string[] {
  try {
    const values = JSON.parse(sessionStorage.getItem(pendingKey) || "[]");
    return Array.isArray(values)
      ? values
          .filter(
            (v): v is string =>
              typeof v === "string" && /^[a-f0-9-]{36}$/.test(v),
          )
          .slice(-100)
      : [];
  } catch {
    return [];
  }
}
async function revokePending() {
  await Promise.allSettled([...activeRequests]);
  const eventIds = pendingEvents();
  if (!eventIds.length) return;
  await api("/track/revoke", { method: "POST", body: { eventIds } });
  try {
    sessionStorage.removeItem(pendingKey);
  } catch {
    /* Storage may be blocked. */
  }
}
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[];
      callMethod?: (...args: unknown[]) => void;
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
  }
}
export function providers() {
  return {
    ga: String(
      settings["pixels.ga4_measurement_id"] ||
        import.meta.env.VITE_GA4_MEASUREMENT_ID ||
        "",
    ),
    ads: String(settings["pixels.google_ads_conversion_id"] || ""),
    meta: String(
      settings["pixels.meta_pixel_id"] ||
        import.meta.env.VITE_META_PIXEL_ID ||
        "",
    ),
    diagnostics: Boolean(import.meta.env.VITE_SENTRY_DSN),
  };
}
export function optionalCategories() {
  const p = providers();
  return {
    analytics: Boolean(p.ga || p.diagnostics),
    marketing: Boolean(p.ads || p.meta),
  };
}
function configuration() {
  return JSON.stringify(providers());
}
export function preferences(): Preferences & { chosen: boolean } {
  try {
    const value = memory || JSON.parse(localStorage.getItem(key) || "null");
    if (
      value &&
      typeof value.analytics === "boolean" &&
      typeof value.marketing === "boolean" &&
      Number.isFinite(value.at) &&
      value.at <= Date.now() &&
      Date.now() - value.at < lifetime &&
      value.configuration === configuration()
    )
      return {
        analytics: value.analytics,
        marketing: value.marketing,
        chosen: true,
      };
  } catch {
    /* Storage unavailable: default to no optional processing. */
  }
  return { analytics: false, marketing: false, chosen: false };
}
export function consentGranted() {
  const p = preferences();
  return p.analytics || p.marketing;
}
export function consentChosen() {
  return preferences().chosen;
}
export function configureAnalytics(value: Settings) {
  settings = value;
}
function script(src: string) {
  const element = document.createElement("script");
  element.src = src;
  element.async = true;
  document.head.appendChild(element);
}
function initialize() {
  if (
    initialized ||
    !consentGranted() ||
    /^\/(admin|newsletter)(\/|$)/.test(location.pathname)
  )
    return;
  initialized = true;
  const consent = preferences();
  const p = providers();
  const ga = consent.analytics ? p.ga : "";
  const ads = consent.marketing ? p.ads : "";
  if (ga || ads) {
    window.dataLayer ||= [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
    window.gtag("js", new Date());
    const options = {
      send_page_view: false,
      page_location: location.origin + location.pathname,
      page_referrer: "",
      allow_google_signals: false,
      allow_ad_personalization_signals: consent.marketing,
    };
    if (ga) window.gtag("config", ga, options);
    if (ads) window.gtag("config", ads, options);
    script(
      "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(ga || ads),
    );
  }
  if (p.meta && consent.marketing) {
    const fbq: NonNullable<Window["fbq"]> = (...args) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    };
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    fbq("set", "autoConfig", false, p.meta);
    fbq("init", p.meta);
    script("https://connect.facebook.net/en_US/fbevents.js");
  }
  if (p.diagnostics && consent.analytics)
    void import("@sentry/react").then((Sentry) => {
      if (!preferences().analytics) return;
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        sendDefaultPii: false,
        beforeSend(event) {
          if (!preferences().analytics) return null;
          return {
            type: event.type,
            event_id: event.event_id,
            timestamp: event.timestamp,
            level: "error",
            message: "Website error",
            platform: "javascript",
          };
        },
      });
    });
}
function clearOptionalStorage() {
  try {
    localStorage.removeItem("aster-client-id");
    localStorage.removeItem("aster-consent-v1");
  } catch {
    /* blocked storage */
  }
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, i) => "." + parts.slice(i).join("."))];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (/^(_ga|_gid|_fbp|_fbc|_gcl)/.test(name))
      for (const domain of domains)
        document.cookie = `${name}=;Max-Age=0;path=/${domain ? ";domain=" + domain : ""}`;
  }
}
export function chooseConsent(value: Preferences | boolean) {
  const p =
    typeof value === "boolean" ? { analytics: value, marketing: value } : value;
  const available = optionalCategories();
  memory = {
    analytics: p.analytics && available.analytics,
    marketing: p.marketing && available.marketing,
    at: Date.now(),
    configuration: configuration(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(memory));
  } catch {
    // A full quota must not resurrect an older grant after withdrawal and reload.
    try {
      localStorage.removeItem(key);
    } catch {
      /* Storage unavailable. */
    }
  }
  clearOptionalStorage();
  if (initialized) {
    window.fbq?.("consent", "revoke");
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    // Cancel queued relays before unloading. An offline failure is retried on the next denied visit.
    if (pendingEvents().length) {
      void Promise.race([
        revokePending(),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ])
        .catch(() => {})
        .finally(() => location.reload());
    } else location.reload();
  } else {
    initialize();
    void track("PageView");
  }
}
export function synchronizeConsent() {
  if (!consentGranted() && pendingEvents().length)
    void revokePending().catch(() => {});
  if (!consentChosen()) {
    clearOptionalStorage();
    if (initialized) location.reload();
  }
}
export async function track(
  eventName: "PageView" | "Lead" | "Contact" | "Subscribe",
  eventId = crypto.randomUUID(),
) {
  if (/^\/(admin|newsletter)(\/|$)/.test(location.pathname)) return;
  synchronizeConsent();
  if (!consentGranted()) return;
  initialize();
  const consent = preferences();
  const p = providers();
  const path = location.pathname.replace(/[^a-zA-Z0-9/_-]/g, "");
  if (eventName === "PageView") {
    if (lastPage === path && Date.now() - lastPageAt < 1000) return;
    lastPage = path;
    lastPageAt = Date.now();
  }
  if (consent.marketing)
    window.fbq?.("track", eventName, {}, { eventID: eventId });
  const names = {
    PageView: "page_view",
    Lead: "generate_lead",
    Contact: "contact",
    Subscribe: "sign_up",
  };
  if (consent.analytics && p.ga && !settings.ga4ServerRelay)
    window.gtag?.("event", names[eventName], {
      send_to: p.ga,
      event_id: eventId,
      page_location: location.origin + path,
      page_referrer: "",
    });
  if (
    consent.marketing &&
    eventName === "Lead" &&
    p.ads &&
    settings["pixels.google_ads_conversion_label"]
  )
    window.gtag?.("event", "conversion", {
      send_to: `${p.ads}/${settings["pixels.google_ads_conversion_label"]}`,
      transaction_id: eventId,
    });
  if (
    !(consent.analytics && p.ga && settings.ga4ServerRelay) &&
    !(consent.marketing && p.meta && settings.metaServerRelay)
  )
    return;
  // Per-event identifier: no indefinitely retained browser identifier.
  const clientId = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;
  try {
    // If browser storage is unavailable, do not create a deferred server event that cannot be recalled.
    try {
      sessionStorage.setItem(
        pendingKey,
        JSON.stringify([...pendingEvents(), eventId].slice(-100)),
      );
    } catch {
      return;
    }
    const request = api("/track/event", {
      method: "POST",
      body: {
        eventId,
        eventName,
        consent: true,
        analytics: consent.analytics,
        marketing: consent.marketing,
        clientId,
        path,
      },
    });
    activeRequests.add(request);
    try {
      await request;
    } finally {
      activeRequests.delete(request);
    }
  } catch {
    /* Measurement must not interrupt an enquiry. */
  }
}
