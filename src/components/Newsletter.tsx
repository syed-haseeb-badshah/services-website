import { useState } from "react";
import { api } from "../lib/api";
import SpamCheck from "./SpamCheck";
export default function Newsletter() {
  const [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [attempt, setAttempt] = useState(0);
  return (
    <section className="newsletter">
      <div>
        <p className="eyebrow">LET GOOD IDEAS FIND YOU</p>
        <h2>Notes from the studio.</h2>
        <p>
          Subscribe for notes from Aster Digital. Confirm by email, and
          unsubscribe at any time.
        </p>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const data = new FormData(event.currentTarget);
          setBusy(true);
          setMessage("");
          try {
            const result = await api<{ message: string }>("/newsletter", {
              method: "POST",
              body: {
                email: data.get("email"),
                website_url: data.get("website_url"),
                turnstileToken: token,
              },
            });
            setMessage(result.message);
          } catch (error) {
            setMessage((error as Error).message);
          } finally {
            setBusy(false);
            setToken("");
            setAttempt((x) => x + 1);
          }
        }}
      >
        <label htmlFor="newsletter-email">Your email</label>
        <div className="inline-form">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="you@yourbusiness.com"
          />
          <button className="button" disabled={busy}>
            {busy ? "Submitting…" : "Subscribe ↗"}
          </button>
        </div>
        <SpamCheck key={attempt} action="newsletter" onToken={setToken} />
        <p role="status">{message}</p>
      </form>
    </section>
  );
}
