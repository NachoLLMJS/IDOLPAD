import Image from "next/image";

export const demoIdols = [
  { name: "BRUCE LEE", ticker: "BRUCE", niche: "martial arts icon", tone: "gold", mcap: "AI CONCEPT" },
  { name: "CZ", ticker: "CZAI", niche: "crypto founder", tone: "black", mcap: "AI CONCEPT" },
  { name: "YI HE", ticker: "YIHE", niche: "brand strategist", tone: "yellow", mcap: "AI CONCEPT" },
  { name: "MILO BYTE", ticker: "MILO", niche: "culture signal", tone: "olive", mcap: "CONCEPT" },
  { name: "NOVA RAE", ticker: "NOVA", niche: "fashion editor", tone: "cream", mcap: "CONCEPT" },
  { name: "ARIA MODE", ticker: "ARIA", niche: "performance artist", tone: "burgundy", mcap: "CONCEPT" },
];

const portraitAssets = [
  { src: "/idols/bruce-lee-idol.png", alt: "AI-generated editorial portrait inspired by Bruce Lee" },
  { src: "/idols/cz-idol.png", alt: "AI-generated editorial portrait inspired by CZ" },
  { src: "/idols/yi-he-idol.png", alt: "AI-generated editorial portrait inspired by Yi He" },
  { src: "/idols/original-olive-idol.png", alt: "AI-generated original male idol in olive tailoring" },
  { src: "/idols/original-cream-idol.png", alt: "AI-generated original female idol in cream tailoring" },
  { src: "/idols/original-burgundy-idol.png", alt: "AI-generated original male idol in burgundy tailoring" },
];

export function IdolPortrait({ index = 0, tall = false }: { index?: number; tall?: boolean }) {
  const portrait = portraitAssets[index % portraitAssets.length];
  return <div className={`idol-portrait photo-portrait portrait-${index % portraitAssets.length} ${tall ? "tall" : ""}`} aria-label={portrait.alt}>
    <Image src={portrait.src} alt={portrait.alt} fill sizes={tall ? "(max-width: 850px) 70vw, 34vw" : "(max-width: 520px) 50vw, 18vw"} loading="eager"/>
    <div className="idol-label">AI</div>
  </div>;
}

export function IdolCard({ idol, index }: { idol: typeof demoIdols[number]; index: number }) {
  return <article className="idol-card"><IdolPortrait index={index}/><div className="card-copy"><span className="ai-tag">AI-GENERATED · PREVIEW</span><h3>{idol.name}</h3><p>${idol.ticker} · {idol.niche}</p><b>{idol.mcap}</b></div></article>;
}
