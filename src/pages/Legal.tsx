import { Link } from "react-router-dom";
import { Title } from "../components/shared";
import { brand } from "../content";
import { siteSettings } from "../components/PublicData";
import { optionalCategories, providers } from "../lib/analytics";
const titles: Record<string, string> = {
  Privacy: "Privacy Policy",
  Terms: "Terms & Conditions",
  Cookies: "Cookie Policy",
  Refunds: "Refund / Cancellation Policy",
  Accessibility: "Accessibility Statement",
};
function Contact() {
  return (
    <p>
      For enquiries, privacy requests, complaints or accessibility help, use our{" "}
      <Link to="/contact">contact form</Link>
      {brand.email && (
        <>
          {" "}
          or email <a href={"mailto:" + brand.email}>{brand.email}</a>
        </>
      )}
      . Please explain your request and provide only the information needed to
      respond.
    </p>
  );
}
function Review({ children }: { children: React.ReactNode }) {
  return (
    <p className="owner-review">
      <strong>OWNER REVIEW — </strong>
      {children}
    </p>
  );
}
export default function Legal({ type }: { type: string }) {
  const p = providers();
  const optional = optionalCategories();
  return (
    <article className="wrap reading legal-page">
      <Title
        eyebrow="Website information"
        title={titles[type] || type}
        description="Last updated: 24 September 2026"
      />
      {type !== "Accessibility" && (
        <p className="legal-status">
          This notice reflects the website implementation. Items marked OWNER
          REVIEW remain unresolved and must be completed before this notice is
          relied upon for a live business.
        </p>
      )}
      {type === "Privacy" && (
        <>
          <h2>Who operates this website</h2>
          <p>
            This website uses the name {brand.name} and presents agency services
            to UK businesses. The supplied project describes this as a working
            agency identity; a legal entity and registered establishment have
            not been verified.
          </p>
          <Review>
            Provide the controller’s legal name, trading status, postal address,
            privacy email, establishment country and any required registration
            details. Confirm the countries actively served.
          </Review>
          <Contact />
          <h2>Information you provide</h2>
          <p>
            The enquiry form requires a name, email address and message. Phone,
            company, service, budget, timeline, package and industry details are
            optional and help us understand the request. Do not include
            passwords, payment-card details or sensitive personal information.
            Enquiries do not subscribe you to marketing.
          </p>
          <p>
            Newsletter signup collects an email address separately. A
            confirmation email is required before subscription is active. The
            database records confirmation and unsubscribe status and dates.
            Confirmation links expire after 24 hours. Unsubscribe using the link
            in an email or contact us.
          </p>
          <h2>Automatic information and security</h2>
          <p>
            The server processes network information to deliver the site and
            limit abuse. Application logs record request method, path, status,
            timing and a random request identifier; they do not intentionally
            log enquiry bodies. Hosting infrastructure may keep separate access
            logs.
          </p>
          {!siteSettings.spamBypass && (
            <p>
              Cloudflare Turnstile checks forms for automated abuse. Loading its
              challenge sends network and browser information to Cloudflare;
              verification sends the challenge token and IP address to
              Cloudflare. This security check is separate from optional
              marketing consent.
            </p>
          )}
          <p>
            Staff-only administration uses authentication and anti-forgery
            cookies, session records, login protections and an audit log. There
            are no public customer accounts or online payment-card forms. Staff
            may record client names, invoices, payment status and notes in the
            administration system.
          </p>
          <h2>Optional analytics and marketing</h2>
          {!optional.analytics && !optional.marketing ? (
            <p>
              No optional visitor tracking is configured in this website
              instance.
            </p>
          ) : (
            <>
              {p.ga && (
                <p>
                  With Analytics consent, Google Analytics receives visit and
                  enquiry-event information, a browser or event identifier and
                  page paths. Query strings and form values are excluded from
                  our explicit event payloads. Google also receives connection
                  information when its code loads.
                </p>
              )}
              {p.diagnostics && (
                <p>
                  With Analytics consent, browser diagnostics may send a generic
                  error event to Sentry. The application removes exception
                  content, request details, user details and breadcrumbs from
                  those reports.
                </p>
              )}
              {(p.meta || p.ads) && (
                <p>
                  With Marketing consent, {p.meta && "Meta"}
                  {p.meta && p.ads && " and "}
                  {p.ads && "Google Ads"} may receive page and
                  enquiry-conversion events and connection/device information to
                  measure advertising. Our server does not attach enquiry email
                  addresses or phone numbers to advertising events. Vendor
                  scripts can access browser information; do not put personal
                  information into page URLs.
                </p>
              )}
            </>
          )}
          <p>
            Use Cookie Settings in the footer to accept, reject or change
            optional purposes. Withdrawal stops future optional browser
            processing; it cannot undo information already transmitted or in
            flight. Offline cancellation is retried when you return with
            tracking denied. See the{" "}
            <Link to="/cookie-policy">Cookie Policy</Link>.
          </p>
          <h2>Purposes and legal bases</h2>
          <p>
            Where UK GDPR applies, responding to requests about a potential
            contract may rely on steps requested before a contract;
            business-contact correspondence and site security may rely on
            legitimate interests, subject to an assessment. Optional tracking
            and newsletter marketing rely on your choice or subscription
            consent. Accounting obligations may require certain records to be
            retained.
          </p>
          <Review>
            Confirm and document the lawful basis for each actual business
            process, legitimate-interest assessments, applicable accounting
            obligations and how privacy complaints are handled.
          </Review>
          <h2>Storage, recipients and international transfers</h2>
          <p>
            Enquiries, newsletter records and administration records are stored
            in PostgreSQL. Outgoing emails and enabled measurement events pass
            through a database delivery queue; successfully delivered payloads
            are cleared. Enquiry notifications and newsletter confirmation
            emails use Resend when configured. Hosting, database, email, backups
            and any enabled security or measurement providers process data for
            these functions. Server-side Sentry error reporting is optional
            configuration and sends a generic error report.
          </p>
          <Review>
            Identify the actual hosting/database/backup providers, Resend and
            Sentry activation, processing locations, contracts and
            subprocessors. Where information leaves the UK, assess adequacy or
            appropriate safeguards and provide details of how to obtain a copy.
            No transfer safeguard is asserted without this review.
          </Review>
          <h2>Retention and minimisation</h2>
          <p>
            There is no verified automatic deletion schedule for enquiries,
            active subscribers, invoices, audit logs, backups or failed email
            deliveries. Removing an enquiry in the administration interface
            currently hides it rather than permanently erasing it. The project
            includes a maintenance command for old technical records, but its
            production scheduling is not verified.
          </p>
          <Review>
            OWNER DECISION REQUIRED — DATA RETENTION PERIOD. Set justified
            periods for each record type, include email copies and backups,
            implement permanent deletion and schedule maintenance. Do not rely
            on soft deletion to fulfil an erasure request.
          </Review>
          <h2>Security</h2>
          <p>
            The implementation uses server-side validation, request limits,
            restricted administration access and anti-forgery protections.
            Production configuration requires HTTPS. These measures do not
            guarantee that information is completely secure; the operator must
            also maintain hosting, staff access and backups.
          </p>
          <h2>Your privacy rights</h2>
          <p>
            Where UK GDPR applies, you may request access, correction, erasure,
            restriction or portability of your information, or object to
            processing, subject to the applicable conditions and exemptions. You
            may withdraw consent without affecting the lawfulness of earlier
            processing. Contact us using the route above; identity checks should
            be proportionate. You may also{" "}
            <a href="https://ico.org.uk/make-a-complaint/">
              complain to the Information Commissioner’s Office
            </a>
            . Other jurisdictions may provide additional rights.
          </p>
          <h2>Children and changes</h2>
          <p>
            The services are presented to businesses and are not designed for
            children. If a child has supplied personal information, contact us
            so it can be reviewed. This notice will be updated when website
            practices change; the date above identifies the current version.
          </p>
        </>
      )}
      {type === "Terms" && (
        <>
          <h2>Operator and website use</h2>
          <p>
            {brand.name} presents design, development, branding, visual media
            and technology services. Use the site lawfully. Do not attempt
            unauthorised access, disrupt its operation, submit malicious content
            or misuse another person’s information.
          </p>
          <Review>
            Confirm the legal operator, trading address, company registration
            and VAT details where applicable. The project’s working identity
            does not establish a registered business.
          </Review>
          <h2>Enquiries, proposals and project agreements</h2>
          <p>
            Sending an enquiry does not purchase a service, reserve a
            consultation time or create a project agreement. Scope,
            deliverables, schedule, fees, tax treatment, revision rounds and
            support should be set out in an agreed proposal or project contract
            before work begins. Package descriptions introduce possible
            services; exact terms require agreement.
          </p>
          <h2>Client responsibilities and intellectual property</h2>
          <p>
            A project agreement should identify required client materials,
            permissions, approvals and deadlines. Clients should have permission
            to supply materials for use. Ownership or licensing of final work,
            source files, pre-existing tools and third-party assets must be
            expressly agreed; using this website does not transfer those rights.
          </p>
          <h2>Website content and third-party links</h2>
          <p>
            Portfolio concepts are illustrative and are not evidence of
            commissioned client work or measured results. Website information
            may change. Third-party websites have their own terms and privacy
            practices; a link does not imply endorsement or partnership.
          </p>
          <h2>Payments, cancellation and refunds</h2>
          <p>
            This site has no online checkout. Any payment schedule, deposits,
            milestones or recurring services must be documented in your project
            agreement. See the{" "}
            <Link to="/refund-policy">Refund / Cancellation Policy</Link>.
            Nothing in these notices removes mandatory statutory consumer
            rights.
          </p>
          <h2>Responsibility, ending a project and disputes</h2>
          <p>
            No particular commercial outcome is guaranteed. Any project-specific
            limits on liability, termination process, payment consequences and
            dispute procedure need a fair written agreement. These website terms
            do not exclude liability that cannot lawfully be excluded, including
            for fraud or death or personal injury caused by negligence where
            applicable.
          </p>
          <Review>
            Have the project contract reviewed for the actual business and
            customer jurisdictions, including governing law, courts, consumer
            rights and fair liability terms. No governing jurisdiction is
            invented here.
          </Review>
          <h2>Changes and contact</h2>
          <p>
            Updated website terms apply to future website use. Changes to a
            signed project agreement need to follow that agreement and
            applicable law.
          </p>
          <Contact />
        </>
      )}
      {type === "Refunds" && (
        <>
          <h2>Agency services and project agreements</h2>
          <p>
            This website accepts enquiries and does not take online payments.
            The supplied project does not establish a deposit percentage, refund
            deadline or standard cancellation charge. Before committing to paid
            work, request written terms covering scope, prices, milestones and
            cancellation.
          </p>
          <h2>Before work starts</h2>
          <p>
            Contact us promptly if you wish to cancel. Any refund of a deposit
            or advance payment must be assessed against the agreed terms, work
            actually authorised and applicable law. A payment is not
            automatically non-refundable because it is called a deposit.
          </p>
          <h2>Work in progress and custom work</h2>
          <p>
            A cancellation review should identify work completed, unpaid
            milestones and any services still to be supplied. Custom design or
            development does not by itself remove statutory rights. Do not
            assume all future fees become payable on cancellation.
          </p>
          <h2>Third-party expenses and recurring services</h2>
          <p>
            Domains, hosting, licences, software subscriptions and advertising
            spend may have separate supplier conditions if included in your
            project. Any purchase authorisation, renewal, transfer or
            cancellation responsibilities and recoverable costs must be
            explained in advance. Third-party conditions cannot override rights
            you have against the agency under applicable law.
          </p>
          <h2>Consumer rights</h2>
          <p>
            If you contract as a consumer and applicable distance-contract rules
            provide cancellation rights, the project agreement must explain
            those rights before purchase. Starting a service during a
            cancellation period may require an express request and specific
            information. Statutory remedies for services not supplied with
            reasonable care and skill remain available where applicable.
          </p>
          <Review>
            Confirm whether consumers are accepted, deposit and milestone rules,
            cancellation before and after commencement, treatment of authorised
            expenses, refund process and timing, recurring-service terms and any
            required cancellation form. Obtain legal review before taking
            payment.
          </Review>
          <h2>Request a cancellation or refund</h2>
          <p>
            Include the project reference, your contact details and what you
            would like cancelled or reviewed. Please do not send bank or card
            details in the enquiry form. No fixed refund response period has
            been verified.
          </p>
          <Contact />
        </>
      )}
      {type === "Cookies" && (
        <>
          <h2>Storage used by this website</h2>
          <p>
            Cookies and browser storage can remember information on your device.
            This instance{" "}
            {optional.analytics || optional.marketing
              ? "has optional integrations, which are blocked until you choose the relevant purpose"
              : "has no configured optional visitor tracking"}
            . We do not add a consent banner when only necessary functionality
            is available.
          </p>
          <div
            className="legal-table-scroll"
            role="region"
            aria-label="Browser storage inventory"
            tabIndex={0}
          >
            <table>
              <caption>Storage implemented in this website</caption>
              <thead>
                <tr>
                  <th>Name / provider</th>
                  <th>Purpose and category</th>
                  <th>Duration / party</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>aster-consent-v2 / this website</td>
                  <td>
                    Remember your privacy choice; necessary localStorage,
                    created when you save a choice
                  </td>
                  <td>
                    Honoured for 180 days, then renewed; first-party. Browser
                    storage may remain until overwritten or cleared.
                  </td>
                </tr>
                <tr>
                  <td>access / this website</td>
                  <td>Staff login; necessary cookie, administration only</td>
                  <td>15 minutes; first-party</td>
                </tr>
                <tr>
                  <td>refresh and csrf / this website</td>
                  <td>
                    Staff session renewal and request protection; necessary
                    cookies, administration only
                  </td>
                  <td>30 days; first-party</td>
                </tr>
                {p.ga && (
                  <tr>
                    <td>_ga and _ga_… / Google Analytics</td>
                    <td>Analytics identifiers; Analytics choice required</td>
                    <td>
                      Vendor defaults can be up to 2 years; first-party. Confirm
                      actual configured duration before release.
                    </td>
                  </tr>
                )}
                {p.meta && (
                  <tr>
                    <td>
                      _fbp; _fbc when a relevant ad click is present / Meta
                    </td>
                    <td>Advertising measurement; Marketing choice required</td>
                    <td>
                      Typically up to 90 days; first-party. Actual creation
                      depends on vendor behaviour and visit.
                    </td>
                  </tr>
                )}
                {p.ads && (
                  <tr>
                    <td>
                      Google Ads storage (names depend on tag and ad
                      interaction)
                    </td>
                    <td>
                      Advertising conversion measurement; Marketing choice
                      required
                    </td>
                    <td>
                      OWNER REVIEW: record actual cookie names, domain and
                      duration in a configured browser session.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p>
            The obsolete aster-consent-v1 preference and aster-client-id
            identifier are removed by the current consent code. No new
            persistent analytics identifier is created by our application.
            Vendor cookies may still be used if you consent.
          </p>
          {!siteSettings.spamBypass && (
            <p>
              Cloudflare Turnstile loads on forms for abuse protection. Its
              current deployment, any challenge storage and whether
              pre-clearance is enabled must be verified by the operator. No
              Cloudflare cookie name is assumed from the source alone.
            </p>
          )}
          {p.diagnostics && (
            <p>
              Sentry browser diagnostics is gated by Analytics consent. This
              implementation does not enable session replay or add a diagnostic
              cookie.
            </p>
          )}
          <p>
            When a server measurement relay is enabled and consented,
            aster-pending-events stores up to 100 random event references in
            first-party sessionStorage so this tab can request cancellation of
            queued events when you change your choice. It contains no form
            values, is cleared after successful cancellation, and otherwise
            lasts until the tab session ends.
          </p>
          <h2>Your choice</h2>
          <p>
            Use Accept All, Reject Non-Essential or Manage Preferences when
            optional services are configured. Optional boxes start unchecked.
            You can change choices using{" "}
            <button
              className="inline-link"
              onClick={() => window.dispatchEvent(new Event("cookie-settings"))}
            >
              Cookie Settings
            </button>
            . Closing the panel without choosing does not consent. A new
            provider configuration or expired choice requires a new choice.
            Necessary staff authentication is unaffected by rejection.
          </p>
          <p>
            Changing a saved choice reloads the page to unload optional scripts
            and removes recognised first-party measurement cookies accessible to
            this website. Your browser controls other cookies, including
            third-party cookies. If storage is blocked, your choice may not
            persist after refresh. See the{" "}
            <Link to="/privacy-policy">Privacy Policy</Link> for recipients,
            rights and retention review.
          </p>
        </>
      )}
      {type === "Accessibility" && (
        <>
          <h2>Our accessibility objective</h2>
          <p>
            We aim to make this website accessible and continually improve its
            usability, using WCAG 2.2 AA as a technical reference. This is not a
            claim of formal conformance.
          </p>
          <h2>Using the site</h2>
          <p>
            The site provides a skip link, keyboard-operated navigation,
            labelled forms, visible focus styles and support for reduced-motion
            preferences. Optional cookies are not required to send an enquiry.
            You can enlarge text using your browser and use the mobile
            navigation on smaller screens.
          </p>
          <h2>Known limitations</h2>
          <p>
            Assistive-technology testing with disabled users and a formal
            conformance assessment have not been completed. Third-party spam
            challenges may require additional accessibility testing. Any future
            video content must be reviewed for captions, transcripts and other
            alternatives before publication.
          </p>
          <h2>Report a problem or request another format</h2>
          <p>
            Tell us the page, what you were trying to do, the difficulty
            encountered and your preferred way to receive the information.
            Device or assistive-technology details are optional. We will review
            the issue; no fixed response time is currently promised.
          </p>
          <Contact />
        </>
      )}
    </article>
  );
}
