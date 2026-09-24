import React from "react";
import { Link } from "react-router-dom";
import { faqs, processSteps, projects } from "../content";
export const Arrow = () => <span aria-hidden="true">↗</span>;
export function Button({
  to = "/contact",
  children,
  secondary = false,
}: {
  to?: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={secondary ? "text-link" : "button"} to={to}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Title({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="lede">{description}</p>}
    </header>
  );
}
export function ProjectGrid({ items = projects }: { items?: typeof projects }) {
  return (
    <div className="project-grid">
      {items.map((p) => (
        <Link className="project-card" to={"/work/" + p.slug} key={p.slug}>
          <div className="project-visual" style={{ background: p.color }}>
            <div className={"mini-site " + p.slug}>
              <div className="mini-nav">
                <b>{p.name}</b>
                <span>ABOUT &nbsp; COLLECTION</span>
              </div>
              <div className="mini-content">
                <small>{p.industry}</small>
                <p className="mini-title">{p.line}</p>
                <img
                  src={p.image}
                  alt={`${p.name} concept art direction`}
                  loading="lazy"
                />
              </div>
            </div>
            <span className="project-open">
              <Arrow />
            </span>
          </div>
          <div className="project-meta">
            <div>
              <h3>{p.name}</h3>
              <p>
                {p.category} · {p.industry}
              </p>
            </div>
            <div className="case-card-action">
              <small>CONCEPT PROJECT</small>
              <span>
                View case study <Arrow />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function Process() {
  return (
    <div className="process-grid">
      {processSteps.map(({ title: t, description: p }, i) => (
        <div key={t}>
          <span className="step">0{i + 1}</span>
          <h3>{t}</h3>
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
}
export function FAQ({
  limit = 6,
  items = faqs,
}: {
  limit?: number;
  items?: string[][];
}) {
  return (
    <div className="faq">
      {items.slice(0, limit).map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function CTA() {
  return (
    <section className="cta">
      <div className="wrap">
        <p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p>
        <h2>
          What’s your
          <br />
          <em>next chapter?</em>
        </h2>
        <p>
          A new idea. A fresh start. A better way forward.
          <br />
          We’d love to hear what you have in mind.
        </p>
        <Button to="/contact?intent=consultation">
          Get a Free Consultation
        </Button>
        <span className="cta-star" aria-hidden="true">
          ✳
        </span>
      </div>
    </section>
  );
}
export function Filters({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="filters" aria-label="Filter options">
      {items.map((x) => (
        <button key={x} aria-pressed={value === x} onClick={() => onChange(x)}>
          {x}
        </button>
      ))}
    </div>
  );
}
export function Crumb({
  parent,
  to,
  current,
}: {
  parent: string;
  to: string;
  current: string;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to={to}>{parent}</Link>
      <span>/</span>
      <span>{current}</span>
    </nav>
  );
}
