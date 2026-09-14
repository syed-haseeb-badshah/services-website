import { useParams } from "react-router-dom";
import { Button, Crumb, Title } from "../components/shared";
import { articles } from "../content";
import NotFound from "./NotFound";
export default function Article() {
  const { slug } = useParams();
  const a = articles.find((a) => a.slug === slug);
  if (!a) return <NotFound />;
  return (
    <article className="wrap reading">
      <Crumb parent="Journal" to="/resources" current={a.category} />
      <Title
        eyebrow={`${a.category} / ${a.read} / Sample article`}
        title={a.title}
        description={a.intro}
      />
      {a.sections.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
      <div className="proof">
        <h3>Turn a useful idea into a next step.</h3>
        <Button>Tell us what you’re planning</Button>
      </div>
      <Button to="/resources" secondary>
        Back to the journal
      </Button>
    </article>
  );
}
