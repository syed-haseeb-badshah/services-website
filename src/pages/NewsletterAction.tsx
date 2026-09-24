import { useState } from "react";
import { useParams } from "react-router-dom";
import { track } from "../lib/analytics";
import { api } from "../lib/api";
export default function NewsletterAction() {
  const { action } = useParams();
  const [token] = useState(() => location.hash.slice(1));
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  if (!["confirm", "unsubscribe"].includes(action || ""))
    return <p>Invalid newsletter action.</p>;
  return (
    <section className="wrap">
      <h1>
        {action === "confirm" ? "Confirm your subscription" : "Unsubscribe"}
      </h1>
      <button
        disabled={busy}
        className="button"
        onClick={async () => {
          setBusy(true);
          try {
            const result = await api<{ message: string }>(
              `/newsletter/${action}`,
              { method: "POST", body: { token } },
            );
            setMessage(result.message);
            history.replaceState(null, "", location.pathname);
            if (action === "confirm") void track("Subscribe");
          } catch (error) {
            setMessage((error as Error).message);
            setBusy(false);
          }
        }}
      >
        {" "}
        {action === "confirm" ? "Confirm subscription" : "Unsubscribe"}
      </button>
      <p role="status">{message}</p>
    </section>
  );
}
