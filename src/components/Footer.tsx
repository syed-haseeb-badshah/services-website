import { Link } from "react-router-dom";
import { brand } from "../content";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="logo" to="/">
            <img className="wordmark" src={brand.wordmark} alt={brand.name} />
          </Link>
          <p>
            {brand.tagline}
            <br />
            {brand.region}
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          {[
            ["/services", "Services"],
            ["/work", "Our work"],
            ["/pricing", "Packages"],
            ["/industries", "Industries"],
          ].map(([u, t]) => (
            <Link key={u} to={u}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h2>The studio</h2>
          {[
            ["/about", "About us"],
            ["/process", "Our process"],
            ["/resources", "Journal"],
            ["/careers", "Careers"],
          ].map(([u, t]) => (
            <Link key={u} to={u}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h2>A little help</h2>
          {[
            ["/contact", "Start a project"],
            ["/audit", "Website review"],
            ["/faq", "FAQs"],
            ["/client-preview", "Client preview"],
          ].map(([u, t]) => (
            <Link key={u} to={u}>
              {t}
            </Link>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {brand.name} · An agency concept
        </span>
        <div>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/refund-policy">Refund / Cancellation Policy</Link>
          <Link to="/accessibility">Accessibility</Link>
          <button
            className="cookie-settings-link"
            onClick={() => window.dispatchEvent(new Event("cookie-settings"))}
          >
            Cookie Settings
          </button>
          <Link to="/sitemap">Sitemap</Link>
          <a href="#main">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
