import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { serviceCategories } from "./content";
import "./project-showcase.css";
import ResponsiveVideo, { type VideoCaption } from "./responsive-video";

// Add each service's approved video URL here; its poster remains visible until hover.
export const showcaseMedia: {
  title: string;
  poster: string;
  alt: string;
  video?: string;
}[] = [
  {
    title: "Websites with a clear direction",
    poster: "/assets/interior.jpg",
    alt: "Architectural interior used for the Forma Studio website concept",
  },
  {
    title: "Stories through a different lens",
    poster: "/assets/studio.jpg",
    alt: "Sunlit creative space with artwork and natural details",
  },
  {
    title: "An identity with its own character",
    poster: "/assets/ceramics.jpg",
    alt: "Ceramic objects illustrating a considered brand direction",
  },
  {
    title: "Connected experiences, made simple",
    poster: "/assets/studio.jpg",
    alt: "Creative workspace illustrating the context for digital tools",
  },
];

export type ShowcaseItem = {
  title: string;
  poster: string;
  alt: string;
  video?: string;
  captions?: VideoCaption[];
  category: string;
  description: string;
  href: string;
  linkLabel: string;
};
const defaultItems: ShowcaseItem[] = showcaseMedia.map((media, index) => ({
  ...media,
  category: serviceCategories[index].title,
  description: serviceCategories[index].description,
  href: "/services?category=" + serviceCategories[index].slug,
  linkLabel:
    "Explore " +
    ["websites", "photo & video", "brand & content", "technology"][index],
}));

function ServiceCard({
  media,
  index,
  duplicate = false,
}: {
  media: ShowcaseItem;
  index: number;
  duplicate?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className="proud-card"
      aria-hidden={duplicate || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
    >
      <div className="browser-frame" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
      <div className={"proud-media proud-media-" + index}>
        <ResponsiveVideo
          src={media.video}
          poster={media.poster}
          title={media.title}
          alt={media.alt}
          mode="hover"
          active={hovered}
          aspectRatio={1.5}
          captions={media.captions}
        />
      </div>
      <div className="proud-card-copy">
        <p className="proud-category">{media.category}</p>
        <h3>{media.title}</h3>
        <p className="proud-description">{media.description}</p>
        <Link tabIndex={duplicate ? -1 : undefined} to={media.href}>
          {media.linkLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default function ProjectShowcase({
  items = defaultItems,
  title = "Projects we’re proud of",
  description = "Four connected disciplines. Explore our creative direction across websites, visual storytelling, branding, and technology.",
  note = "Illustrative concept previews across our four main services.",
}: {
  items?: ShowcaseItem[];
  title?: string;
  description?: string;
  note?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const stepSize = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + 24 : 0;
  };
  // The second copy follows the fourth card. Rebase only when both views are identical.
  const normalizeLoop = () => {
    const el = track.current;
    const cycle = stepSize() * items.length;
    if (el && cycle && el.scrollLeft >= cycle - 0.5)
      el.scrollTo({
        left: Math.max(0, el.scrollLeft - cycle),
        behavior: "instant",
      });
  };
  const move = (direction: number) => {
    const el = track.current;
    const distance = stepSize();
    if (!el || !distance) return;
    const cycle = distance * items.length;
    let position = el.scrollLeft;
    if (direction < 0 && position < 0.5) {
      position = cycle;
      el.scrollTo({ left: position, behavior: "instant" });
    }
    el.scrollTo({
      left: position + direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  useEffect(() => {
    if (paused || hovering || focused) return;
    const timer = window.setInterval(() => {
      const el = track.current;
      if (!el || document.hidden) return;
      const bounds = el.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      move(1);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [paused, hovering, focused, items.length]);
  return (
    <section className="proud-section section" aria-labelledby="proud-title">
      <div className="wrap">
        <header className="proud-heading">
          <h2 id="proud-title">{title}</h2>
          <p>{description}</p>
        </header>
        <div
          className="proud-carousel"
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onPointerCancel={() => setHovering(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocused(false);
          }}
        >
          <button
            className="proud-arrow proud-prev"
            type="button"
            aria-label="Previous service card"
            aria-controls="proud-track"
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <div
            ref={track}
            id="proud-track"
            className="proud-track"
            onScroll={normalizeLoop}
            tabIndex={0}
            role="region"
            aria-label="Service project previews"
          >
            {[0, 1].flatMap((copy) =>
              items.map((media, i) => (
                <ServiceCard
                  key={copy + "-" + i}
                  media={media}
                  index={i}
                  duplicate={copy === 1}
                />
              )),
            )}
          </div>
          <button
            className="proud-arrow proud-next"
            type="button"
            aria-label="Next service card"
            aria-controls="proud-track"
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
        <p className="proud-note">{note}</p>
        <div className="proud-playback">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-controls="proud-track"
          >
            {paused ? "Resume slideshow" : "Pause slideshow"}
          </button>
        </div>
      </div>
    </section>
  );
}
