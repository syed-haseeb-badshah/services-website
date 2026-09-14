import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SpamCheck from "./components/SpamCheck";
import "./contact-page.css";
import { brand, packages, services } from "./content";
import { track } from "./lib/analytics";
import { api } from "./lib/api";

const contactDetails = {
  get email() {
    return brand.email || "Use the enquiry form";
  },
  get phone() {
    return brand.phone || "Ask us to arrange a call";
  },
  get whatsapp() {
    return brand.whatsapp || "Not configured";
  },
  location: "United Kingdom",
  hours: "Mon–Fri, 09:00–18:00",
  timezone: "UK time · GMT / BST",
};
function ContactIcon({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "email" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      ) : kind === "phone" ? (
        <path d="m5 3 4 1 1 5-3 2c2 3 3 4 6 6l2-3 5 1 1 4c-1 5-9 1-13-3S0 4 5 3Z" />
      ) : kind === "location" ? (
        <>
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2" />
        </>
      ) : kind === "hours" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </>
      ) : (
        <path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 1 1 19 0Z" />
      )}
    </svg>
  );
}
export default function ContactPage() {
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const eventId = useRef(crypto.randomUUID());
  const [params] = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<Record<string, string> | null>(null);
  const pre = params.get("service") || "";
  const intent = params.get("intent");
  const review = useRef<HTMLElement>(null);
  useEffect(() => {
    if (summary) {
      review.current?.focus({ preventScroll: true });
      review.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [summary]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || summary) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const next: Record<string, string> = {};
    if (!data.name.trim()) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!data.description.trim())
      next.description = "Please tell us about your project.";
    setErrors(next);
    if (Object.keys(next).length) {
      setSummary(null);
      (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus();
      return;
    }
    setBusy(true);
    setServerError("");
    try {
      await api("/contact", {
        method: "POST",
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          description:
            data.description +
            "\n\nBudget: " +
            data.budget +
            "\nTimeline: " +
            data.timeline +
            (data.industry ? "\nIndustry: " + data.industry : ""),
          intent: data.intent,
          serviceName: data.service,
          packageName: data.package,
          eventId: eventId.current,
          website_url: data.website_url || "",
          turnstileToken: token,
        },
      });
      setSummary(data);
      void track("Lead", eventId.current);
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setBusy(false);
      setToken("");
      setAttempt((x) => x + 1);
    }
  };
  return (
    <div className="uk-contact-page">
      <header className="wrap uk-contact-heading">
        <p className="eyebrow">START A CONVERSATION</p>
        <h1>
          Tell us about
          <br />
          your next chapter.
        </h1>
        <p>
          A new website, a stronger brand, or a clearer direction. Let’s talk
          about what your business needs.
        </p>
      </header>
      <div className="wrap uk-contact-grid">
        <section className="uk-form-panel" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">Send us a message</h2>
          <p className="uk-form-intro">
            Share your plans and we’ll help define the next step.
          </p>
          {(intent === "call" || intent === "consultation") && (
            <div className="uk-consultation-context">
              <strong>
                {intent === "call"
                  ? "Plan a consultation call"
                  : "Your free consultation starts with a clear brief"}
              </strong>
              <p>
                Tell us what you would like to discuss and, for a call, your
                availability in UK time. We will respond to your enquiry to
                agree the next step. Submitting this form does not reserve a
                time.
              </p>
            </div>
          )}
          <form noValidate onSubmit={submit}>
            <input
              type="hidden"
              name="intent"
              value={
                intent === "call"
                  ? "Consultation call"
                  : intent === "consultation"
                    ? "Free consultation"
                    : "Project enquiry"
              }
            />
            <div className="uk-field-grid">
              {[
                ["name", "Full name", "text", "Alex Taylor", "name"],
                ["email", "Email", "email", "alex@example.com", "email"],
                ["phone", "Phone", "tel", "+44 7700 900123", "tel"],
                ["company", "Company", "text", "Your company", "organization"],
              ].map(([id, label, type, placeholder, auto]) => (
                <label key={id} htmlFor={"uk-" + id}>
                  {label}
                  {["name", "email"].includes(id) && (
                    <span className="uk-required"> *</span>
                  )}
                  <input
                    id={"uk-" + id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={auto}
                    required={["name", "email"].includes(id)}
                    aria-invalid={!!errors[id]}
                    aria-describedby={errors[id] ? "uk-error-" + id : undefined}
                  />
                  {errors[id] && (
                    <span className="uk-error" id={"uk-error-" + id}>
                      {errors[id]}
                    </span>
                  )}
                </label>
              ))}
              <label>
                Service
                <select name="service" defaultValue={pre}>
                  <option value="">Select a service</option>
                  {pre && !services.some((s) => s.name === pre) && (
                    <option>{pre}</option>
                  )}
                  {services.map((s) => (
                    <option key={s.slug}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Budget (GBP)
                <select name="budget">
                  <option>Let’s discuss</option>
                  <option>Under £1,000</option>
                  <option>£1,000–£3,000</option>
                  <option>£3,000–£5,000</option>
                  <option>£5,000–£10,000</option>
                  <option>£10,000+</option>
                </select>
              </label>
              <label>
                Ideal timeline
                <select name="timeline">
                  <option>Flexible / exploring</option>
                  <option>Within 1 month</option>
                  <option>1–3 months</option>
                  <option>3+ months</option>
                </select>
              </label>
              <label>
                Package interest
                <select
                  name="package"
                  defaultValue={params.get("package") || ""}
                >
                  <option value="">Not sure yet</option>
                  {[...packages, "Custom"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
            {params.get("industry") && (
              <label>
                Industry
                <input
                  name="industry"
                  defaultValue={params.get("industry") || ""}
                />
              </label>
            )}
            <label htmlFor="uk-description">
              Message<span className="uk-required"> *</span>
              <textarea
                id="uk-description"
                name="description"
                rows={5}
                placeholder="Tell us about your project…"
                required
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "uk-error-description" : undefined
                }
              />
              {errors.description && (
                <span className="uk-error" id="uk-error-description">
                  {errors.description}
                </span>
              )}
            </label>
            <p className="uk-form-note">
              Your enquiry will be saved securely so we can respond. Budgets are
              in pounds sterling (GBP).{" "}
              <Link to="/privacy">Privacy information</Link>.
            </p>
            <SpamCheck key={attempt} action="contact" onToken={setToken} />
            {serverError && <p role="alert">{serverError}</p>}
            <button
              type="submit"
              className="uk-submit"
              disabled={busy || !!summary}
            >
              {busy
                ? "Sending…"
                : summary
                  ? "Enquiry sent"
                  : "Send your enquiry"}{" "}
              <span aria-hidden="true">→</span>
            </button>
            {summary && (
              <section
                ref={review}
                className="uk-enquiry-summary"
                role="region"
                tabIndex={-1}
                aria-labelledby="enquiry-review-title"
              >
                <h3 id="enquiry-review-title">
                  Your enquiry has been received
                </h3>
                <p>
                  Thank you. We will be in touch to discuss your project. A call
                  is not booked until confirmed.
                </p>
                <dl>
                  {[
                    ["intent", "Request"],
                    ["name", "Name"],
                    ["email", "Email"],
                    ["company", "Company"],
                    ["service", "Service"],
                    ["budget", "Budget (GBP)"],
                    ["timeline", "Timeline"],
                    ["description", "Message"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>{summary[key] || "Not specified"}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setSummary(null);
                    eventId.current = crypto.randomUUID();
                    document.getElementById("uk-name")?.focus();
                  }}
                >
                  Send another enquiry
                </button>
              </section>
            )}
          </form>
        </section>
        <aside className="uk-contact-cards" aria-label="Contact information">
          {[
            ["email", "Email us", contactDetails.email, "Business enquiries"],
            ["phone", "Call us", contactDetails.phone, "UK business hours"],
            [
              "location",
              "Location",
              contactDetails.location,
              "Serving businesses across the UK",
            ],
            [
              "hours",
              "Working hours",
              contactDetails.hours,
              contactDetails.timezone,
            ],
          ].map(([kind, label, value, note]) => (
            <div className="uk-info-card" key={kind}>
              <span className={"uk-contact-icon " + kind}>
                <ContactIcon kind={kind} />
              </span>
              <div>
                <p>{label}</p>
                <strong>
                  {kind === "email" && brand.email ? (
                    <a href={"mailto:" + brand.email}>{value}</a>
                  ) : kind === "phone" && brand.phone ? (
                    <a href={"tel:" + brand.phone}>{value}</a>
                  ) : (
                    value
                  )}
                </strong>
                <small>{note}</small>
              </div>
            </div>
          ))}
          <div className="uk-whatsapp-card">
            <span className="uk-contact-icon whatsapp">
              <ContactIcon kind="chat" />
            </span>
            <div>
              <p>Chat on WhatsApp</p>
              <strong>
                {brand.whatsapp ? (
                  <a
                    href={"https://wa.me/" + brand.whatsapp.replace(/\D/g, "")}
                  >
                    {contactDetails.whatsapp}
                  </a>
                ) : (
                  contactDetails.whatsapp
                )}
              </strong>
              <small>Enquire during UK business hours</small>
            </div>
          </div>
          <p className="uk-contact-note">
            Contact details are maintained by the studio. You can always use the
            enquiry form.
          </p>
        </aside>
      </div>
    </div>
  );
}
