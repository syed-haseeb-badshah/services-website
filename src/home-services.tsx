import { Link } from "react-router-dom";
import { serviceCategories, services } from "./content";
import "./home-services.css";
import { ServiceLogo, categoryThemeMap } from "./service-logos";

function ServiceCard({
  service,
  heading = "h4",
}: {
  service: (typeof services)[number];
  heading?: "h2" | "h3" | "h4";
}) {
  const Heading = heading;
  return (
    <Link
      className="all-service-card"
      to={"/services/" + service.slug}
      aria-label={"Explore " + service.name}
      style={
        {
          "--cat-color": categoryThemeMap[service.group]?.color || "#3B82F6",
        } as React.CSSProperties
      }
    >
      <span className="all-service-icon">
        <ServiceLogo slug={service.slug} />
      </span>
      <Heading className="all-service-name">{service.name}</Heading>
      <p>{service.description}</p>
      <ul className="service-capabilities" aria-label="Selected capabilities">
        {service.items.slice(0, 2).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span className="all-service-explore">
        Explore service{" "}
        <span className="explore-arrow" aria-hidden="true">
          ↗
        </span>
      </span>
    </Link>
  );
}

export default function HomeServices({
  categorySlug,
  directory = false,
}: { categorySlug?: string; directory?: boolean } = {}) {
  if (directory && !categorySlug) {
    return (
      <section
        className="all-services section services-catalogue"
        aria-label="Service catalogue"
      >
        <div className="wrap">
          <div className="all-services-grid">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} heading="h2" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      className={
        "all-services section" + (directory ? " services-catalogue" : "")
      }
      aria-label={directory ? "Service catalogue" : undefined}
      aria-labelledby={directory ? undefined : "all-services-title"}
    >
      <div className="wrap">
        {!directory && (
          <header className="all-services-heading">
            <p className="eyebrow">WHAT WE DO</p>
            <h2 id="all-services-title">
              Everything your business needs
              <br />
              to grow online.
            </h2>
            <p>
              {services.length} services across four connected disciplines. Find
              the right support for your next step.
            </p>
          </header>
        )}

        {serviceCategories
          .filter((category) => !categorySlug || category.slug === categorySlug)
          .map((category) => {
            const theme = categoryThemeMap[category.title] || {
              color: "#3B82F6",
            };
            const GroupHeading = directory ? "h2" : "h3";
            return (
              <section
                className="all-services-group"
                key={category.slug}
                aria-labelledby={"group-" + category.slug}
                style={{ "--cat-color": theme.color } as React.CSSProperties}
              >
                <div className="service-group-heading">
                  <GroupHeading id={"group-" + category.slug}>
                    {category.title}
                  </GroupHeading>
                  <span className="service-group-badge">
                    {category.services.length} services
                  </span>
                </div>
                <div className="all-services-grid">
                  {category.services.map((service) => (
                    <ServiceCard
                      key={service.slug}
                      service={service}
                      heading={directory ? "h3" : "h4"}
                    />
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </section>
  );
}
