"use client";

import { IdolPortrait } from "@/components/idol-art";

export function HeroCast() {
  return <div className="hp-hero-cast">
    <div className="hp-hero-ring"/>
    <div className="hp-cast hp-cast-left rectangular" data-testid="hero-cast-left"><IdolPortrait index={1} tall/></div>
    <div className="hp-cast hp-cast-center rectangular video-cast" data-testid="hero-cast-center">
      <video data-testid="hero-dance-video" src="/media/new-dances.mp4" poster="/media/new-dances-poster.jpg" muted loop playsInline preload="metadata" onMouseEnter={(event) => void event.currentTarget.play()} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0 }}/>
      <span>AI VIDEO</span>
    </div>
    <div className="hp-cast hp-cast-right rectangular video-cast" data-testid="hero-cast-right">
      <video data-testid="hero-diving-video" src="/media/rio-dod-diving.mp4" muted loop playsInline preload="metadata" onMouseEnter={(event) => void event.currentTarget.play()} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0 }}/>
      <span>AI VIDEO</span>
    </div>
    <span className="hp-cast-label">CREATE · ANIMATE · LAUNCH</span>
  </div>;
}
