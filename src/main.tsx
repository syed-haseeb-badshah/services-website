import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import PublicData from "./components/PublicData";
import { brand } from "./content";
import "./style.css";
import "./theme.css";
import "./components/application.css";
if (import.meta.env.VITE_SENTRY_DSN) {
  void import("@sentry/react").then((Sentry) =>
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      sendDefaultPii: false,
      beforeSend(event) {
        delete event.request;
        delete event.user;
        delete event.breadcrumbs;
        return event;
      },
    }),
  );
}
const Admin = lazy(() => import("./admin/Admin"));
Object.entries({
  paper: brand.colors.ivory,
  ink: brand.colors.ink,
  green: brand.colors.green,
  accent: brand.colors.accent,
}).forEach(([key, value]) =>
  document.documentElement.style.setProperty("--" + key, value),
);
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route
            path="*"
            element={
              <PublicData>
                <Layout />
              </PublicData>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);
