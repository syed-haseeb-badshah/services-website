import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./responsive-video.css";

export type VideoCaption = {
  src: string;
  language: string;
  label: string;
  default?: boolean;
};
export type VideoAsset = {
  src: string;
  poster: string;
  captions?: VideoCaption[];
  transcript?: string;
};
type Props = {
  src?: string;
  poster: string;
  title: string;
  alt?: string;
  mode?: "controls" | "hover" | "muted-autoplay";
  active?: boolean;
  aspectRatio?: number;
  eager?: boolean;
  captions?: VideoCaption[];
  transcript?: string;
};

// A source change starts a fresh player rather than retaining the previous video's state.
export default function ResponsiveVideo(props: Props) {
  return <VideoPlayback key={props.src || props.poster} {...props} />;
}

function VideoPlayback({
  src,
  poster,
  title,
  alt = title,
  mode = "controls",
  active = false,
  aspectRatio = 16 / 9,
  eager = false,
  captions = [],
  transcript,
}: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const attempt = useRef(0);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pageActive, setPageActive] = useState(!document.hidden);
  const [motionAllowed, setMotionAllowed] = useState(
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const automatic = mode !== "controls";
  const wantsAutomatic =
    automatic &&
    motionAllowed &&
    visible &&
    pageActive &&
    (mode === "muted-autoplay" || active);
  useEffect(() => {
    if (!src) return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.15 },
    );
    if (stage.current) observer.observe(stage.current);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => setMotionAllowed(!preference.matches);
    const onVisibility = () => setPageActive(!document.hidden);
    const onBlur = () => setPageActive(false);
    const onFocus = () => setPageActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    preference.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      preference.removeEventListener("change", onPreference);
      attempt.current++;
      video.current?.pause();
    };
  }, [src]);
  useEffect(() => {
    if (src && !failed && (requested || wantsAutomatic)) setLoaded(true);
  }, [src, failed, requested, wantsAutomatic]);
  useEffect(() => {
    const element = video.current;
    if (!element || failed) return;
    const token = ++attempt.current;
    if (!visible || !pageActive || (automatic && !wantsAutomatic)) {
      element.pause();
      setPlaying(false);
      if (mode === "hover" && element.readyState > 0) element.currentTime = 0;
    } else if (loaded && (automatic ? wantsAutomatic : requested)) {
      if (automatic) element.muted = true;
      void element
        .play()
        .then(() => {
          if (token !== attempt.current) return;
          setPlaying(true);
        })
        .catch(() => {
          if (token === attempt.current) {
            setPlaying(false);
            setRequested(false);
          }
        });
    }
    return () => {
      attempt.current++;
    };
  }, [
    loaded,
    requested,
    visible,
    pageActive,
    automatic,
    wantsAutomatic,
    mode,
    failed,
  ]);
  return (
    <div className={"responsive-video mode-" + mode}>
      <div
        className="video-stage"
        ref={stage}
        style={{ aspectRatio } as CSSProperties}
      >
        <img
          src={poster}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          width="1600"
          height={Math.round(1600 / aspectRatio)}
        />
        {src && !failed && (
          <video
            ref={video}
            src={loaded ? src : undefined}
            poster={poster}
            controls={!automatic}
            muted={automatic}
            playsInline
            loop={automatic}
            preload="none"
            aria-label={automatic ? undefined : title}
            aria-hidden={automatic || undefined}
            className={(automatic ? playing : started) ? "video-visible" : ""}
            onPlay={() => {
              setStarted(true);
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
              setRequested(false);
            }}
            onEnded={() => {
              setRequested(false);
              setPlaying(false);
            }}
            onError={() => {
              video.current?.pause();
              setFailed(true);
              setPlaying(false);
              setRequested(false);
            }}
          >
            {captions.map((caption) => (
              <track
                key={caption.src}
                kind="captions"
                src={caption.src}
                srcLang={caption.language}
                label={caption.label}
                default={caption.default}
              />
            ))}
          </video>
        )}
        {src && !failed && !automatic && !started && (
          <button
            type="button"
            className="video-play-button"
            onClick={() => {
              setPageActive(!document.hidden);
              setRequested(true);
            }}
            aria-label={"Play " + title}
          >
            <span aria-hidden="true">▶</span>
            <span>Play walkthrough</span>
          </button>
        )}
      </div>
      {failed && !automatic && (
        <p className="video-fallback-note" role="status">
          Video unavailable. The preview image is shown instead.
        </p>
      )}
      {transcript && !automatic && (
        <details className="video-transcript">
          <summary>Read the video transcript</summary>
          <p>{transcript}</p>
        </details>
      )}
    </div>
  );
}
