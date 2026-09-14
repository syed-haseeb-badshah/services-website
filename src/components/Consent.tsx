import { useEffect, useState } from "react";
import { chooseConsent, consentChosen, track } from "../lib/analytics";
import { siteSettings } from "./PublicData";
export default function Consent() {
  const [open, setOpen] = useState(!consentChosen());
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (anchor && /^(tel:|https:\/\/wa.me\/)/.test(anchor.href))
        void track("Contact");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  const choose = (accepted: boolean) => {
    chooseConsent(accepted);
    setOpen(false);
  };
  return (
    <>
      <button className="cookie-preferences" onClick={() => setOpen(true)}>
        Cookie preferences
      </button>
      {open && (
        <section className="consent-panel" aria-label="Cookie preferences">
          <h2>Your privacy choices</h2>
          <p>
            {String(
              siteSettings["consent.copy"] ||
                "Allow optional analytics and advertising cookies?",
            )}
          </p>
          <div>
            <button onClick={() => choose(true)}>
              Accept optional cookies
            </button>
            <button onClick={() => choose(false)}>
              Reject optional cookies
            </button>
          </div>
          <a href="/privacy">Privacy information</a>
        </section>
      )}
    </>
  );
}
