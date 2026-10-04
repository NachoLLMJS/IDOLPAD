"use client";

import { Play } from "lucide-react";

type Motion = { id: string; title: string; previewUrl: string; posterUrl: string; source?: string };

const origin = "https://www.higgspad.com";

const referenceMotions: Motion[] = [
  { id: "rio-diving", title: "RIO DIVING", previewUrl: "/media/rio-dod-diving.mp4", posterUrl: "/media/rio-dod-diving-poster.jpg", source: "UPLOADED REFERENCE VIDEO" },
  { id: "cream-tuxedo", title: "BALLROOM", previewUrl: `${origin}/media/hero/cream-tuxedo.mp4`, posterUrl: `${origin}/media/hero/cream-tuxedo-poster.webp` },
  { id: "red-bob", title: "FACE CAM", previewUrl: `${origin}/media/hero/red-bob.mp4`, posterUrl: `${origin}/media/hero/red-bob-poster.webp` },
  { id: "green-suit", title: "STAGE", previewUrl: `${origin}/media/hero/green-suit.mp4`, posterUrl: `${origin}/media/hero/green-suit-poster.webp` },
  { id: "burgundy-dancer", title: "DANCE", previewUrl: `${origin}/media/hero/burgundy-suit-dancer.mp4`, posterUrl: `${origin}/media/hero/burgundy-suit-dancer-poster.webp` },
  { id: "motion-01", title: "HALLWAY WALK", previewUrl: `${origin}/media/motion/motion-01.mp4`, posterUrl: `${origin}/media/motion/motion-01.webp` },
  { id: "motion-02", title: "BALLROOM", previewUrl: `${origin}/media/motion/motion-02.mp4`, posterUrl: `${origin}/media/motion/motion-02.webp` },
  { id: "motion-03", title: "AIRPORT", previewUrl: `${origin}/media/motion/motion-03.mp4`, posterUrl: `${origin}/media/motion/motion-03.webp` },
];

const heroMotion: Motion = { id: "launch-demo", title: "IDOLPAD WORKFLOW", previewUrl: `${origin}/media/home/launch-video.mp4`, posterUrl: `${origin}/media/home/launch-video-poster.webp` };
const featureMotion: Motion = { id: "feature-trend", title: "ANY TREND", previewUrl: `${origin}/media/home/features_item-2.mp4`, posterUrl: `${origin}/media/home/features_item-2-poster.webp` };

export function HomeVideoShowcase({ variant, limit }: { variant: "hero" | "rail" | "feature"; limit: number }) {
  const source = variant === "hero" ? [heroMotion] : variant === "feature" ? [featureMotion, referenceMotions[4]] : referenceMotions;
  const items = source.slice(0, limit);
  return <div className={`home-video-showcase ${variant}`}>
    {items.map((item) => <article className="home-video-container" key={item.id}>
      <video data-testid="public-motion-video" src={item.previewUrl} poster={item.posterUrl} muted loop playsInline preload={variant === "hero" ? "metadata" : "none"} onMouseEnter={(event) => void event.currentTarget.play()} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0 }}/>
      <span className="home-video-play"><Play size={13} fill="currentColor"/></span>
      <div className="home-video-copy"><b>{item.title}</b><small>{item.source || "HIGGSPAD REFERENCE VIDEO"}</small></div>
    </article>)}
  </div>
}