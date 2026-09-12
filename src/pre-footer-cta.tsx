import { Link } from 'react-router-dom';
import './pre-footer-cta.css';

export default function PreFooterCTA() {
  return (
    <div className="pre-footer-cta-wrap">
      <section className="pre-footer-cta" aria-labelledby="pre-footer-cta-title">
        {/* Top Badge */}
        <div className="pre-footer-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
          </svg>
          <span>Free consultation · No commitment</span>
        </div>

        {/* Headline */}
        <h2 id="pre-footer-cta-title" className="pre-footer-title">
          Ready to grow<br />your business?
        </h2>

        {/* Subtitle */}
        <p className="pre-footer-subtitle">
          Let’s build something meaningful together. Tell us your goals and we’ll shape a clear plan and a tailored quote.
        </p>

        {/* Action Buttons */}
        <div className="pre-footer-actions">
          <Link className="cta-btn-primary" to="/contact">
            Start Your Project <span aria-hidden="true">→</span>
          </Link>
          <Link className="cta-btn-secondary" to="/work">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>View Our Work</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
