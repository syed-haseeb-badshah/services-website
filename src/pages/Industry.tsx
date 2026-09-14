import { useParams } from "react-router-dom";
import { Button, Crumb, Title } from "../components/shared";
import { industries, slugify } from "../content";
import NotFound from "./NotFound";
export default function Industry() {
  const { slug } = useParams();
  const name = industries.find((x) => slugify(x) === slug);
  if (!name) return <NotFound />;
  return (
    <div className="wrap">
      <Crumb parent="Industries" to="/industries" current={name} />
      <Title
        eyebrow="Industry possibilities"
        title={name}
        description={`A clear digital presence starts with understanding how people choose a ${name.toLowerCase()} business.`}
      />
      <div className="split section">
        <div>
          <h2>Make the next step feel natural.</h2>
          <p>
            Help visitors understand your offering, find relevant information,
            and decide whether to get in touch. The first conversation will
            identify your customers’ questions and the information they need.
          </p>
          <Button to={"/contact?industry=" + encodeURIComponent(name)}>
            Discuss your business
          </Button>
        </div>
        <div>
          <h3>A practical starting point</h3>
          <ul>
            <li>Clear service or product information</li>
            <li>Mobile-friendly discovery and enquiry</li>
            <li>Relevant stories and useful resources</li>
            <li>A content plan your team can maintain</li>
          </ul>
          <Button to="/services" secondary>
            Find your services
          </Button>
        </div>
      </div>
    </div>
  );
}
