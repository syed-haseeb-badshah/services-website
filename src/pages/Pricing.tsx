import { useState } from "react";
import { Button, FAQ, Filters, Title } from "../components/shared";
import { groups, packages, services } from "../content";
export default function Pricing() {
  const [category, setCategory] = useState(groups[1]);
  return (
    <div className="wrap">
      <Title
        eyebrow="Ways to work together"
        title="The right scope. A clear starting point."
        description="Flexible package outlines to start the conversation. Final deliverables, timelines, and pricing are agreed around your business."
      />
      <Filters
        items={groups.slice(1)}
        value={category}
        onChange={setCategory}
      />
      <div className="pricing-grid">
        {packages.map((p, i) => (
          <article
            className={i === 1 ? "price-card featured" : "price-card"}
            key={p}
          >
            <p className="eyebrow">
              0{i + 1} / {category}
            </p>
            <h2>{p}</h2>
            <p>
              {
                [
                  "A focused first step with a well-defined outcome.",
                  "A connected set of deliverables for your next chapter.",
                  "Ongoing attention as your priorities evolve.",
                ][i]
              }
            </p>
            <h3>Request pricing</h3>
            <ul>
              {[
                category + " discovery",
                ...(
                  services.find((s) => s.group === category)?.items || []
                ).slice(0, i + 2),
                [
                  "Handover notes",
                  "Connected launch plan",
                  "Ongoing review schedule",
                ][i],
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Button
              to={
                "/contact?service=" +
                encodeURIComponent(category) +
                "&package=" +
                p
              }
            >
              Explore {p}
            </Button>
          </article>
        ))}
      </div>
      <section className="section">
        <h2>Compare the approach.</h2>
        <div className="table-scroll">
          <table>
            <caption>
              Proposed package structure — all details subject to agreement
            </caption>
            <thead>
              <tr>
                <th>Included approach</th>
                {packages.map((p) => (
                  <th key={p}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Discovery", "Focused", "Expanded", "Ongoing"],
                [
                  "Scope",
                  "Single priority",
                  "Connected priorities",
                  "Evolving roadmap",
                ],
                [
                  "Review",
                  "Milestone review",
                  "Milestone reviews",
                  "Regular reviews",
                ],
                [
                  "Handover",
                  "Documentation",
                  "Documentation & training",
                  "Continuous support planning",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) =>
                    i === 0 ? (
                      <th key={c} scope="row">
                        {c}
                      </th>
                    ) : (
                      <td key={i}>{c}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="proof">
        <h2>Something a little different?</h2>
        <p>
          Tell us what you’re imagining. We can shape a custom scope around it.
        </p>
        <Button to="/contact?package=Custom">Build a custom brief</Button>
      </div>
      <FAQ />
    </div>
  );
}
