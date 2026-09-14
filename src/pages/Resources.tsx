import { useState } from "react";
import { Link } from "react-router-dom";
import Newsletter from "../components/Newsletter";
import { Arrow, Button, Filters, Title } from "../components/shared";
import { articles } from "../content";
export default function Resources() {
  const [cat, setCat] = useState("All topics");
  const [q, setQ] = useState("");
  const filtered = articles.filter(
    (a) =>
      (cat === "All topics" || a.category === cat) &&
      (a.title + " " + a.intro).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="wrap">
      <Title
        eyebrow="The Aster journal"
        title="A little perspective for your next move."
        description="Practical notes on websites, brands, and doing digital with more intention. Original sample editorial content."
      />
      <div className="resource-controls">
        <Filters
          items={["All topics", "Web design", "Ecommerce", "Marketing"]}
          value={cat}
          onChange={setCat}
        />
        <label className="search">
          Search the journal
          <input
            type="search"
            placeholder="What’s on your mind?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <p className="result-note" role="status">
        {filtered.length} articles found
      </p>
      <div className="article-grid">
        {filtered.map((a) => (
          <Link to={"/resources/" + a.slug} key={a.slug}>
            <div className="article-art">
              <span>{a.category}</span>
              <h2>{a.title}</h2>
              <Arrow />
            </div>
            <small>{a.read} · Sample article</small>
            <p>{a.intro}</p>
            <span className="text-link">
              Read the story <Arrow />
            </span>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h2>No stories found.</h2>
          <p>Try a broader search or another topic.</p>
          <button
            className="button"
            onClick={() => {
              setQ("");
              setCat("All topics");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="proof">
        <p className="eyebrow">A FRESH PAIR OF EYES</p>
        <h2>Not sure where to begin?</h2>
        <p>
          Explore a sample website review to understand what an initial audit
          could cover.
        </p>
        <Button to="/audit" secondary>
          Explore the website review
        </Button>
      </div>
      <Newsletter />
    </div>
  );
}
