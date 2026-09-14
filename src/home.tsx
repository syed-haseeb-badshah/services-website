import AnimatedStats from "./animated-stats";
import HomeServices from "./home-services";
import ProjectShowcase from "./project-showcase";

import { Link } from "react-router-dom";
import {
  audiences,
  faqs,
  packages,
  processSteps,
  projects,
  serviceCategories,
  services,
} from "./content";

export default function Home() {
  return (
    <div className="studio-home">
      <section className="new-hero wrap">
        <div className="new-hero-copy">
          <p className="eyebrow">INDEPENDENT DIGITAL & CREATIVE STUDIO</p>
          <h1>
            A better presence.
            <br />
            <em>A bigger possibility.</em>
          </h1>
          <p className="hero-description">
            Websites, branding, photography, video, and digital tools for UK
            startups and growing businesses. Help customers understand your
            offer, trust your business, and take the next step.
          </p>
          <div className="actions">
            <Link className="button" to="/contact?intent=consultation">
              Get a Free Consultation <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" to="/work">
              View Our Work <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="hero-assurance">
            <span>Clear scope</span>
            <span>Collaborative process</span>
            <span>Thoughtful handover</span>
          </div>
        </div>
      </section>
      <div className="home-light">
        <section className="studio-stats" aria-label="Our offering at a glance">
          <div className="wrap">
            <AnimatedStats
              items={[
                [400, "Total clients"],
                [services.length, "Services offered"],
                [serviceCategories.length, "Core disciplines"],
                [projects.length, "Concept projects"],
                [packages.length, "Package options"],
                [4, "Process stages"],
              ]}
            />
            <p className="studio-evidence-note">
              <strong>50+ websites created</strong> across our studio’s website
              work. The previews below are clearly labelled concepts.
            </p>
          </div>
        </section>
        <ProjectShowcase />
        <HomeServices />
        <section className="section wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">02 / HOW WE WORK</p>
              <h2>
                Good work starts
                <br />
                with a clear plan.
              </h2>
            </div>
            <Link className="text-link" to="/process">
              Meet the process <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="new-process">
            {processSteps.map(({ title: t, description: d }, i) => (
              <article key={t}>
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="partner-section wrap">
          <div>
            <p className="eyebrow">SMALL STUDIO. SHARED AMBITION.</p>
            <h2>
              Your business deserves
              <br />
              <em>to be understood.</em>
            </h2>
          </div>
          <div>
            <p>
              We bring strategy, design, and development into the same
              conversation. That means a shared direction, practical decisions,
              and a digital presence that feels like you.
            </p>
            <ul className="trust-practices">
              <li>A written scope before work begins</li>
              <li>Agreed milestones and review points</li>
              <li>Clear handover and support responsibilities</li>
            </ul>
            <Link className="text-link" to="/about">
              Get to know Aster <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
        <section
          className="section wrap journey-audiences"
          aria-labelledby="audiences-title"
        >
          <div className="section-head">
            <div>
              <p className="eyebrow">WHO WE HELP</p>
              <h2 id="audiences-title">
                Built around your
                <br />
                next stage.
              </h2>
            </div>
            <Link className="text-link" to="/industries">
              Explore industry possibilities <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="journey-audience-grid">
            {audiences.map((a) => (
              <article key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section wrap faq-layout">
          <div>
            <p className="eyebrow">BEFORE WE BEGIN</p>
            <h2>
              Good questions.
              <br />
              Clear answers.
            </h2>
            <Link className="text-link" to="/faq">
              More questions answered ↗
            </Link>
          </div>
          <div className="faq">
            {faqs
              .filter((_, index) => [1, 2, 4, 6, 7, 8].includes(index))
              .map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
