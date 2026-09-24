import { Link, useParams } from "react-router-dom";
import AnimatedStats from "./animated-stats";
import { packages, processSteps, serviceCategories, services } from "./content";
import ServiceComparison from "./service-comparison";
import { detailFor } from "./service-detail-content";
import "./service-detail-page.css";
import ServiceEnquiry from "./service-enquiry";
import ServiceWork from "./service-work";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  if (!service)
    return (
      <div className="wrap not-found">
        <h1>Service not found</h1>
        <Link className="button" to="/services">
          Explore all services
        </Link>
      </div>
    );
  const detail = detailFor(service);
  const enquiry = "/contact?service=" + encodeURIComponent(service.name);
  return (
    <div className="service-detail">
      <header className="wrap detail-banner">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/services">Services</Link>
          <span aria-hidden="true">/</span>
          <span>{service.name}</span>
        </nav>
        <p className="eyebrow">{service.group}</p>
        <h1>{service.name}</h1>
        <p className="detail-lede">{service.description}</p>
        <div className="actions">
          <Link className="button" to={enquiry}>
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" to="/pricing">
            Explore packages <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      <div className="detail-white">
        <section
          className="detail-stats"
          aria-label="Aster Digital at a glance"
        >
          <div className="wrap">
            <AnimatedStats
              key={service.slug}
              items={[
                [detail.category.services.length, "Related services"],
                [serviceCategories.length, "Core disciplines"],
                [service.items.length, "Key deliverables"],
                [packages.length, "Package options"],
                [4, "Process stages"],
              ]}
            />
            <p className="detail-stat-note">
              Explore the services, deliverables and process for your project.
            </p>
          </div>
        </section>
        <section
          className="wrap section detail-overview"
          aria-labelledby="detail-overview-title"
        >
          <div className="detail-overview-copy">
            <h2 id="detail-overview-title">{detail.headline}</h2>
            <div className="detail-heading-line" />
            <p>{detail.intro}</p>
            <p>
              At Aster Digital, {service.name.toLowerCase()} starts with your
              priorities. We agree the audience, deliverables, and review points
              before production, so the work has a clear purpose from the
              beginning.
            </p>
            <p>
              For UK businesses, we keep the practical details clear: proposals
              in GBP, collaboration planned around UK working hours, and a
              written scope covering the work and handover.
            </p>
            <Link className="detail-button" to={enquiry}>
              Start your project <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="detail-benefits">
            {detail.features.map((feature) => (
              <article key={feature.title}>
                <span className="detail-check" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <ServiceComparison service={service} />
        <ServiceWork service={service} />
        <section className="wrap section detail-next">
          <div>
            <p className="eyebrow">FROM BRIEF TO HANDOVER</p>
            <h2>
              A clear process.
              <br />A shared direction.
            </h2>
          </div>
          <div className="detail-process">
            {processSteps.map(({ title, description }, i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <nav className="wrap detail-related" aria-label="Related services">
          <p className="eyebrow">CONNECTED SERVICES</p>
          <div>
            {services
              .filter((s) => s.group === service.group && s.slug !== slug)
              .slice(0, 3)
              .map((s) => (
                <Link key={s.slug} to={"/services/" + s.slug}>
                  {s.name} <span aria-hidden="true">↗</span>
                </Link>
              ))}
          </div>
        </nav>
        <ServiceEnquiry service={service} />
      </div>
    </div>
  );
}
