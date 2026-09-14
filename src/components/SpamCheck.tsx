import { useEffect, useRef } from "react";
import { siteSettings } from "./PublicData";
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      remove: (id: string) => void;
    };
  }
}
let loading: Promise<void> | undefined;
function load() {
  return (loading ||= new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.onload = () => resolve();
    script.onerror = () => {
      loading = undefined;
      reject(new Error("Spam protection unavailable"));
    };
    document.head.appendChild(script);
  }));
}
export default function SpamCheck({
  action,
  onToken,
}: {
  action: string;
  onToken: (token: string) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (siteSettings.spamBypass) return;
    let cancelled = false,
      id: string | undefined;
    void load()
      .then(() => {
        if (!cancelled && element.current)
          id = window.turnstile?.render(element.current, {
            sitekey:
              siteSettings.turnstileSiteKey ||
              import.meta.env.VITE_TURNSTILE_SITE_KEY,
            action,
            callback: onToken,
            "expired-callback": () => onToken(""),
            "error-callback": () => onToken(""),
          });
      })
      .catch(() => onToken(""));
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, [action, onToken]);
  return (
    <>
      <label className="honeypot" aria-hidden="true">
        Leave empty
        <input name="website_url" tabIndex={-1} autoComplete="off" />
      </label>
      <div ref={element} />
      {siteSettings.spamBypass && (
        <small>Local development: spam verification bypassed.</small>
      )}
    </>
  );
}
