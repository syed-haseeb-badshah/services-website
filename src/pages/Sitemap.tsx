import { Link } from "react-router-dom";
import { Title } from "../components/shared";
import { articles, industries, projects, services, slugify } from "../content";
export default function Sitemap() {
  return (
    <div className="wrap">
      <Title eyebrow="Find your way" title="A place for everything." />
      <div className="sitemap">
        {[
          ["/", "Home"],
          ["/about", "About"],
          ["/services", "Services"],
          ["/work", "Work"],
          ["/pricing", "Packages"],
          ["/industries", "Industries"],
          ["/resources", "Journal"],
          ["/audit", "Website review"],
          ["/process", "Process"],
          ["/faq", "FAQs"],
          ["/careers", "Careers"],
          ["/client-preview", "Client preview"],
          ["/privacy", "Privacy"],
          ["/terms", "Terms"],
          ["/contact", "Contact"],
          ...services.map((s) => ["/services/" + s.slug, s.name]),
          ...projects.map((p) => ["/work/" + p.slug, p.name]),
          ...industries.map((i) => ["/industries/" + slugify(i), i]),
          ...articles.map((a) => ["/resources/" + a.slug, a.title]),
        ].map(([url, n]) => (
          <Link key={url} to={url}>
            {n} ↗
          </Link>
        ))}
      </div>
    </div>
  );
}
