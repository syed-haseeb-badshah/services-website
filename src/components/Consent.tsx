import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  chooseConsent,
  consentChosen,
  optionalCategories,
  preferences,
  synchronizeConsent,
  track,
  type Preferences,
} from "../lib/analytics";
export default function Consent() {
  const available = optionalCategories();
  const needed = available.analytics || available.marketing;
  const [open, setOpen] = useState(needed && !consentChosen());
  const [manage, setManage] = useState(false);
  const [choice, setChoice] = useState<Preferences>(preferences);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = () => {
      previous.current = document.activeElement as HTMLElement;
      setChoice(preferences());
      setManage(true);
      setOpen(true);
    };
    const check = () => {
      synchronizeConsent();
      if (needed && !consentChosen()) setOpen(true);
    };
    const storage = (e: StorageEvent) => {
      if (e.key === "aster-consent-v2" || e.key === null) location.reload();
    };
    const click = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (anchor && /^(tel:|https:\/\/wa.me\/)/.test(anchor.href))
        void track("Contact");
    };
    window.addEventListener("cookie-settings", show);
    window.addEventListener("storage", storage);
    document.addEventListener("click", click);
    const timer = setInterval(check, 60000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("cookie-settings", show);
      window.removeEventListener("storage", storage);
      document.removeEventListener("click", click);
    };
  }, [needed]);
  useEffect(() => {
    if (open && manage) heading.current?.focus();
  }, [open, manage]);
  const close = () => {
    setOpen(false);
    previous.current?.focus();
  };
  const choose = (value: Preferences | boolean) => {
    chooseConsent(value);
    close();
  };
  if (!open) return null;
  return (
    <section
      className="consent-panel"
      aria-labelledby="consent-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <h2 ref={heading} tabIndex={-1} id="consent-title">
        Your privacy choices
      </h2>
      <p>
        {needed
          ? "Optional analytics helps measure visits and diagnose errors. Optional marketing measures advertising. Both are off until you choose. Your enquiry works without them."
          : "No optional tracking is configured. Essential security and your saved privacy choice do not require optional consent."}
      </p>
      {manage && (
        <fieldset>
          <legend>Choose optional purposes</legend>
          <p>Necessary — always active</p>
          {available.analytics && (
            <label>
              <input
                type="checkbox"
                checked={choice.analytics}
                onChange={(e) =>
                  setChoice({ ...choice, analytics: e.target.checked })
                }
              />{" "}
              Analytics and diagnostics
            </label>
          )}
          {available.marketing && (
            <label>
              <input
                type="checkbox"
                checked={choice.marketing}
                onChange={(e) =>
                  setChoice({ ...choice, marketing: e.target.checked })
                }
              />{" "}
              Marketing (Google Ads / Meta, when configured)
            </label>
          )}
        </fieldset>
      )}
      <div>
        {needed && (
          <>
            <button onClick={() => choose(true)}>Accept All</button>
            <button onClick={() => choose(false)}>Reject Non-Essential</button>
            {manage ? (
              <button onClick={() => choose(choice)}>Save preferences</button>
            ) : (
              <button onClick={() => setManage(true)}>
                Manage Preferences
              </button>
            )}
          </>
        )}
        <button onClick={close}>Close</button>
      </div>
      <Link to="/cookie-policy" onClick={close}>
        Cookie Policy
      </Link>
      {" · "}
      <Link to="/privacy-policy" onClick={close}>
        Privacy Policy
      </Link>
    </section>
  );
}
