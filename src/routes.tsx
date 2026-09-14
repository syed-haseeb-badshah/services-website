import { Route, Routes } from "react-router-dom";
import About from "./about-page";
import { FAQ, Process, Title } from "./components/shared";
import Contact from "./contact-page";
import { faqs } from "./content";
import Home from "./home";
import Article from "./pages/Article";
import Audit from "./pages/Audit";
import Industries from "./pages/Industries";
import Industry from "./pages/Industry";
import Legal from "./pages/Legal";
import NewsletterAction from "./pages/NewsletterAction";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Project from "./pages/Project";
import Resources from "./pages/Resources";
import Simple from "./pages/Simple";
import Sitemap from "./pages/Sitemap";
import Work from "./pages/Work";
import Service from "./service-detail-page";
import Services from "./services-page";
export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/newsletter/:action" element={<NewsletterAction />} />
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<Service />} />
      <Route path="/about" element={<About />} />
      <Route path="/work" element={<Work />} />
      <Route path="/work/:slug" element={<Project />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/industries/:slug" element={<Industry />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:slug" element={<Article />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/audit" element={<Audit />} />
      <Route
        path="/faq"
        element={
          <div className="wrap">
            <Title
              eyebrow="A little clarity"
              title="Good questions. Honest answers."
            />
            <FAQ limit={faqs.length} />
          </div>
        }
      />
      <Route
        path="/process"
        element={
          <div className="wrap">
            <Title
              eyebrow="How we work"
              title="Clear steps. Shared direction."
            />
            <Process />
          </div>
        }
      />
      <Route path="/privacy" element={<Legal type="Privacy" />} />
      <Route path="/terms" element={<Legal type="Terms" />} />
      <Route path="/careers" element={<Simple type="careers" />} />
      <Route path="/client-preview" element={<Simple type="portal" />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
