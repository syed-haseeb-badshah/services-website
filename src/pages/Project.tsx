import { useParams } from "react-router-dom";
import { Button, Crumb, CTA, ProjectGrid, Title } from "../components/shared";
import { projectContext, projects } from "../content";
import { projectVideos } from "../media-catalogue";
import ResponsiveVideo from "../responsive-video";
import NotFound from "./NotFound";
export default function Project() {
  const { slug } = useParams();
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <div className="wrap">
        <Crumb to="/work" parent="Our work" current={p.name} />
        <Title
          eyebrow={"Concept project / " + p.industry}
          title={p.name}
          description={p.line}
        />
        <img
          className="case-image"
          src={p.image}
          alt={`${p.name} photographic art direction`}
        />
        <dl className="case-context">
          <div>
            <dt>Project type</dt>
            <dd>Illustrative concept</dd>
          </div>
          <div>
            <dt>Industry</dt>
            <dd>{p.industry}</dd>
          </div>
          <div>
            <dt>Proposed services</dt>
            <dd>{p.deliverables.join(" · ")}</dd>
          </div>
          <div>
            <dt>Implementation</dt>
            <dd>{projectContext[p.slug].technology}</dd>
          </div>
        </dl>
        {projectVideos[p.slug] && (
          <section
            className="case-walkthrough"
            aria-label="Project walkthrough"
          >
            <h2>Project walkthrough</h2>
            <ResponsiveVideo
              {...projectVideos[p.slug]}
              title={p.name + " project walkthrough"}
            />
          </section>
        )}
        <section className="section split">
          <div>
            <p className="eyebrow">THE BRIEF</p>
            <h2>{p.line}</h2>
            <p>{p.brief}</p>
          </div>
          <div>
            <h3>The approach</h3>
            <p>{p.approach}</p>
            <h3>Proposed deliverables</h3>
            <ul>
              {p.deliverables.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="note">
              Original fictional project. Photography is licensed stock. No
              client relationship or performance result is implied.
            </p>
          </div>
        </section>
        <section className="case-outcome" aria-labelledby="case-outcome-title">
          <div>
            <p className="eyebrow">THE INTENDED OUTCOME</p>
            <h2 id="case-outcome-title">A direction with a purpose.</h2>
            <p>{projectContext[p.slug].outcome}</p>
            <p className="note">
              This is a design concept, not a launched client project. No
              measured performance results are available.
            </p>
          </div>
          <Button
            to={
              "/contact?service=" +
              encodeURIComponent(projectContext[p.slug].service)
            }
          >
            Discuss a similar project
          </Button>
        </section>
        <h2 className="case-more-title">Explore more concepts.</h2>
        <ProjectGrid items={projects.filter((x) => x.slug !== slug)} />
      </div>
      <CTA />
    </>
  );
}
