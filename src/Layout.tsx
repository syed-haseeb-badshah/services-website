import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Consent from "./components/Consent";
import Footer from "./components/Footer";
import { brand } from "./content";
import { track } from "./lib/analytics";
import PreFooterCTA from "./pre-footer-cta";
import PublicRoutes from "./routes";
import { SiteNavigation } from "./service-components";
export default function Layout() {
  const loc = useLocation();
  useEffect(() => {
    let structured = document.getElementById(
      "organization-jsonld",
    ) as HTMLScriptElement | null;
    if (!structured) {
      structured = document.createElement("script");
      structured.id = "organization-jsonld";
      structured.type = "application/ld+json";
      document.head.appendChild(structured);
    }
    structured.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brand.name,
      url: location.origin,
      logo: location.origin + brand.logo,
      ...(brand.email ? { email: brand.email } : {}),
      ...(brand.phone ? { telephone: brand.phone } : {}),
    });
    window.scrollTo(0, 0);
    void track("PageView");
    const key = loc.pathname.split("/").filter(Boolean).at(-1);
    document.title = key
      ? `${key
          .split("-")
          .map((x) => x[0]?.toUpperCase() + x.slice(1))
          .join(" ")} | ${brand.name}`
      : `${brand.name} — Make room for growth`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        key
          ? `Explore ${key.replace(/-/g, " ")} with ${brand.name}. ${brand.description}`
          : brand.description,
      );
  }, [loc.pathname]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNavigation />
      <main
        id="main"
        tabIndex={-1}
        className={
          loc.pathname === "/about" ||
          loc.pathname === "/work" ||
          loc.pathname.startsWith("/work/")
            ? "light-editorial"
            : undefined
        }
      >
        <PublicRoutes />
      </main>
      {(loc.pathname === "/" || loc.pathname === "/services") && (
        <PreFooterCTA />
      )}
      <Footer />
      <Consent />
    </>
  );
}
