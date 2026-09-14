import { useEffect, useState, type ReactNode } from "react";
import { hydrateContent, packages } from "../content";
import { configureAnalytics } from "../lib/analytics";
import { allServices, api, type Settings } from "../lib/api";
export let siteSettings: Settings = {};
export default function PublicData({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      allServices(),
      api<Settings>("/settings/public"),
      api<string[]>("/packages"),
    ])
      .then(([rows, settings, names]) => {
        if (cancelled) return;
        hydrateContent(
          rows.map((row) => ({
            ...row,
            description: row.summary,
            items: row.deliverables,
          })),
          settings,
        );
        packages.splice(0, packages.length, ...names);
        siteSettings = settings;
        configureAnalytics(settings);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "We couldn’t load the website. Please check the connection and try again.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);
  if (error)
    return (
      <main className="wrap" role="alert">
        <h1>Unable to connect</h1>
        <p>{error}</p>
        <button
          className="button"
          onClick={() => {
            setError("");
            setAttempt((x) => x + 1);
          }}
        >
          Try again
        </button>
      </main>
    );
  return ready ? (
    children
  ) : (
    <main className="wrap" role="status">
      Loading Aster Digital…
    </main>
  );
}
