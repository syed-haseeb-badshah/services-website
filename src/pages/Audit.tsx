import { useState } from "react";
import { Arrow, Button, Title } from "../components/shared";
export default function Audit() {
  const [shown, setShown] = useState(false);
  return (
    <div className="wrap">
      <Title
        eyebrow="A fresh perspective"
        title="See your website with fresh eyes."
        description="Explore the questions behind a useful website review. This sample does not scan or score a live website."
      />
      <div className="split section">
        <div>
          <h2>Clarity before a redesign.</h2>
          <p>
            A first review can look at your message, navigation, mobile
            experience, and enquiry path. It is a starting point for a
            conversation, not an automated verdict.
          </p>
          <button
            className="button"
            aria-expanded={shown}
            onClick={() => setShown(!shown)}
          >
            {shown ? "Hide sample review" : "Open sample review"} <Arrow />
          </button>
          <p>
            <Button to="/contact?service=Website%20review" secondary>
              Request a website review
            </Button>
          </p>
        </div>
        <div>
          {shown ? (
            <div
              className="proof"
              role="region"
              aria-label="Sample website review"
            >
              <p className="eyebrow">ILLUSTRATIVE REVIEW — NO LIVE SCAN</p>
              <h3>Fictional small-business website</h3>
              {[
                [
                  "Message",
                  "Make the main service and audience clear in the first screen.",
                ],
                [
                  "Navigation",
                  "Group related services and use familiar labels.",
                ],
                [
                  "Mobile",
                  "Check button spacing and form labels on a small screen.",
                ],
                [
                  "Enquiry",
                  "Explain what happens after someone gets in touch.",
                ],
              ].map(([h, p]) => (
                <div key={h}>
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="audit-placeholder">
              <span>01 — 04</span>
              <h2>
                Message.
                <br />
                Journey.
                <br />
                Experience.
                <br />
                <em>Next step.</em>
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
