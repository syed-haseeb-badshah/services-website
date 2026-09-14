import { api, type Settings } from "./api";
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
let lastPage = "";
let lastPageAt = 0;
let settings: Settings = {},
  initialized = false;
export function consentGranted() {
  try {
    const value = JSON.parse(
      localStorage.getItem("aster-consent-v1") || "null",
    );
    return value?.accepted === true && Date.now() - value.at < 180 * 86400000;
  } catch {
    return false;
  }
}
export function consentChosen() {
  try {
    const value = JSON.parse(
      localStorage.getItem("aster-consent-v1") || "null",
    );
    return (
      typeof value?.accepted === "boolean" &&
      Date.now() - value.at < 180 * 86400000
    );
  } catch {
    return false;
  }
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
  if (initialized || !consentGranted()) return;
  initialized = true;
  const ga = String(
    settings["pixels.ga4_measurement_id"] ||
      import.meta.env.VITE_GA4_MEASUREMENT_ID ||
      "",
  );
  const ads = String(settings["pixels.google_ads_conversion_id"] || "");
  if (ga || ads) {
    window.dataLayer ||= [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    window.gtag("js", new Date());
    if (ga) window.gtag("config", ga, { send_page_view: false });
    if (ads) window.gtag("config", ads, { send_page_view: false });
    script(
      "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(ga || ads),
    );
  }
  const meta = String(
    settings["pixels.meta_pixel_id"] ||
      import.meta.env.VITE_META_PIXEL_ID ||
      "",
  );
  if (meta) {
    const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    };
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    fbq("init", meta);
    script("https://connect.facebook.net/en_US/fbevents.js");
  }
}
export function chooseConsent(accepted: boolean) {
  try {
    localStorage.setItem(
      "aster-consent-v1",
      JSON.stringify({ accepted, at: Date.now() }),
    );
  } catch {
    return;
  }
  if (!accepted) {
    localStorage.removeItem("aster-client-id");
    window.fbq?.("consent", "revoke");
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    const domains = [
      "",
      location.hostname,
      "." + location.hostname,
      "." + location.hostname.split(".").slice(-2).join("."),
    ];
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (/^(_ga|_gid|_fbp|_fbc|_gcl)/.test(name))
        for (const domain of domains)
          document.cookie = `${name}=;Max-Age=0;path=/${domain ? ";domain=" + domain : ""}`;
    }
    if (initialized) location.reload();
  } else {
    initialize();
    void track("PageView");
  }
}
export async function track(
  eventName: "PageView" | "Lead" | "Contact" | "Subscribe",
  eventId = crypto.randomUUID(),
) {
  if (!consentGranted() || location.pathname.startsWith("/admin")) return;
  initialize();
  const path = location.pathname.replace(/[^a-zA-Z0-9/_-]/g, "");
  if (eventName === "PageView") {
    if (lastPage === path && Date.now() - lastPageAt < 1000) return;
    lastPage = path;
    lastPageAt = Date.now();
  }
  window.fbq?.("track", eventName, {}, { eventID: eventId });
  const names = {
    PageView: "page_view",
    Lead: "generate_lead",
    Contact: "contact",
    Subscribe: "sign_up",
  };
  // GA4 does not guarantee deduplication by event_id. Send through exactly one transport.
  if (!settings.ga4ServerRelay)
    window.gtag?.("event", names[eventName], {
      event_id: eventId,
      page_location: location.origin + path,
    });
  if (
    eventName === "Lead" &&
    settings["pixels.google_ads_conversion_id"] &&
    settings["pixels.google_ads_conversion_label"]
  )
    window.gtag?.("event", "conversion", {
      send_to: `${settings["pixels.google_ads_conversion_id"]}/${settings["pixels.google_ads_conversion_label"]}`,
      transaction_id: eventId,
    });
  const gaCookie = document.cookie.match(
    /(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/,
  )?.[1];
  let clientId = gaCookie;
  if (!clientId) {
    try {
      clientId =
        localStorage.getItem("aster-client-id") ||
        `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;
      localStorage.setItem("aster-client-id", clientId);
    } catch {
      clientId = `1.${Math.floor(Date.now() / 1000)}`;
    }
  }
  try {
    await api("/track/event", {
      method: "POST",
      body: { eventId, eventName, consent: true, clientId, path },
    });
  } catch {
    /* Analytics failure must not interrupt the enquiry journey. */
  }
}
