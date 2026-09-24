import { useState } from "react";
import { CTA, Filters, ProjectGrid, Title } from "../components/shared";
import { projects } from "../content";
export default function Work() {
  const [cat, setCat] = useState("All work");
  return (
    <div className="wrap">
      <Title
        eyebrow="Selected possibilities"
        title="Good ideas, thoughtfully brought to life."
        description="Original concept projects that show a direction, a way of thinking, and the details that bring it together. These are not client commissions."
      />
      <Filters
        items={["All work", ...projects.map((p) => p.category)]}
        value={cat}
        onChange={setCat}
      />
      <p role="status" className="result-note">
        {
          projects.filter((p) => cat === "All work" || p.category === cat)
            .length
        }{" "}
        concept projects
      </p>
      <h2 className="visually-hidden">Concept projects</h2>
      <ProjectGrid
        items={projects.filter((p) => cat === "All work" || p.category === cat)}
      />
      <CTA />
    </div>
  );
}
