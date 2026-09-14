import { Link } from "react-router-dom";
import { brand } from "./content";
import { detailFor, type Service } from "./service-detail-content";

export default function ServiceEnquiry({ service }: { service: Service }) {
  const detail = detailFor(service);
  const enquiry =
    "/contact?intent=consultation&service=" + encodeURIComponent(service.name);
  return (
    <section
      className="wrap detail-closing"
      aria-label="Start your project and ongoing support"
    >
      <div className="detail-enquiry-banner">
        <div>
          <h2>{detail.need}</h2>
          <p>
            Talk to Aster Digital about your goals. Start with a free
            consultation and a tailored quote in GBP.
          </p>
        </div>
        <div className="detail-enquiry-actions">
          <Link className="detail-button" to={enquiry}>
            Get a Free Consultation <span aria-hidden="true">↗</span>
          </Link>
          {brand.whatsapp ? (
            <a
              className="detail-button detail-whatsapp"
              href={"https://wa.me/" + brand.whatsapp.replace(/\D/g, "")}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <div className="detail-whatsapp-pending">
              <button type="button" disabled>
                WhatsApp coming soon
              </button>
              <small>Please use the enquiry form for now.</small>
            </div>
          )}
        </div>
      </div>
      <div className="detail-support-banner">
        <div className="detail-support-copy">
          <div className="detail-support-heading">
            <span className="detail-support-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </span>
            <h3>{detail.support.title}</h3>
          </div>
          <p>{detail.support.description}</p>
          <ul>
            {detail.support.items.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="detail-support-quote">
          <div>
            <span>ONGOING SUPPORT</span>
            <strong>A plan that fits</strong>
            <p>Quoted in GBP · Scope agreed with you</p>
          </div>
          <Link className="detail-button" to="/pricing">
            View packages <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
