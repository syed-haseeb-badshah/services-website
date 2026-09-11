import {Link} from 'react-router-dom';
import {serviceCategories,services} from './content';
import {ServiceLogo,categoryThemeMap} from './service-logos';
import './home-services.css';

export default function HomeServices(){
  return (
    <section className="all-services section" aria-labelledby="all-services-title">
      <div className="wrap">
        <header className="all-services-heading">
          <p className="eyebrow">WHAT WE DO</p>
          <h2 id="all-services-title">Everything your business needs<br/>to grow online.</h2>
          <p>{services.length} services across four connected disciplines. Find the right support for your next step.</p>
        </header>

        {serviceCategories.map((category) => {
          const theme = categoryThemeMap[category.title] || { color: '#3B82F6' };
          return (
            <section
              className="all-services-group"
              key={category.slug}
              aria-labelledby={'group-' + category.slug}
              style={{ '--cat-color': theme.color } as React.CSSProperties}
            >
              <div className="service-group-heading">
                <h3 id={'group-' + category.slug}>{category.title}</h3>
                <span className="service-group-badge">{category.services.length} services</span>
              </div>
              <div className="all-services-grid">
                {category.services.map((service) => (
                  <Link
                    className="all-service-card"
                    key={service.slug}
                    to={'/services/' + service.slug}
                  >
                    <span className="all-service-icon">
                      <ServiceLogo slug={service.slug} />
                    </span>
                    <h4>{service.name}</h4>
                    <p>{service.description}</p>
                    <span className="all-service-explore">
                      Explore service <span className="explore-arrow" aria-hidden="true">↗</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

