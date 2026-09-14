import { Link } from "react-router-dom";
import { Arrow, CTA, Title } from "../components/shared";
import { industries, slugify } from "../content";
export default function Industries() {
  return (
    <div className="wrap">
      <Title
        eyebrow="Your world, understood"
        title="Different businesses. Different possibilities."
        description="Explore starting points for your industry. These are proposed solutions, not claims of past sector experience."
      />
      <div className="industry-grid">
        {industries.map((x, i) => (
          <Link key={x} to={"/industries/" + slugify(x)}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h2>{x}</h2>
            <Arrow />
          </Link>
        ))}
      </div>
      <CTA />
    </div>
  );
}
