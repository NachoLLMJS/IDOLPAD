import Link from "next/link";
import { ArrowRight, Ban, Bot, ShieldCheck, WandSparkles, Zap } from "lucide-react";
import { Footer, Header } from "@/components/shell";
import { demoIdols, IdolCard } from "@/components/idol-art";
import { HomeVideoShowcase } from "@/components/home-video-showcase";
import { HeroCast } from "@/components/hero-cast";

const tickerTape = ["$NOVA", "$MIRA", "$KAI", "$LUMA", "$VIBE", "$ARIA", "$ZEN", "$ONYX", "$ECHO", "$RUNE", "$AURA", "$BYTE"];

export default function Home() {
  return <div className="reference-home"><Header/><main>
    <section className="hp-hero section-shell">
      <div className="hp-hero-copy"><span className="eyebrow"><i/> BUILT ON BNB CHAIN</span><h1>LAUNCH AN AI<br/>IDOL <em>WITH ITS OWN TOKEN</em></h1><p>Create the identity, turn it into short-form video and launch its token through Flap</p><div className="hero-actions"><Link className="button primary" href="/launch">Launch your AI idol <ArrowRight size={17}/></Link><Link className="button ghost" href="/explore">Meet the idols</Link></div><small>Original identities · AI-generated labels · Wallet-signed launches</small></div>
      <HeroCast/>
    </section>

    <section className="section-shell hp-demo"><div className="hp-section-intro centered"><span className="eyebrow">PRODUCT DEMO</span><h2>SEE IT IN ACTION</h2><p>Public motion references shown inside the same cinematic containers used throughout the product</p></div><div className="hp-demo-frame"><HomeVideoShowcase variant="hero" limit={1}/></div></section>

    <section className="section-shell hp-steps"><div className="hp-section-intro"><span className="eyebrow">THE SIMPLE FLOW</span><h2>THREE CLICKS<br/>NO PROMPT SKILLS</h2></div><div className="hp-step-grid">
      <article><div className="hp-step-visual create"><WandSparkles/><span>Describe your idol</span><b>Generate identity</b></div><strong>01</strong><h3>CREATE YOUR IDOL</h3><p>One sentence is enough to establish the personality, look and consistent portrait system</p></article>
      <article><div className="hp-step-visual name"><span>NAME</span><b>NOVA</b><small>BECOMES</small><em>$NOVA</em></div><strong>02</strong><h3>NAME IT</h3><p>The idol and token share one recognizable name and ticker</p></article>
      <article><div className="hp-step-visual launch"><span>BNB CHAIN</span><b>LAUNCH ON FLAP</b><small>WALLET SIGNATURE REQUIRED</small></div><strong>03</strong><h3>LAUNCH IT</h3><p>Review the fee split and optional dev buy before your wallet signs</p></article>
    </div></section>

    <section className="hp-trends"><div className="section-shell"><div className="hp-section-intro row"><div><span className="eyebrow">VIDEO STUDIO</span><h2>ANY TREND</h2><p>Pick a motion or a trending format and decide when it posts</p></div><Link href="/studio">Browse all in the studio <ArrowRight size={15}/></Link></div><HomeVideoShowcase variant="rail" limit={8}/></div></section>


    <div className="hp-ticker"><div>{[...tickerTape,...tickerTape].map((ticker,index)=><span key={`${ticker}-${index}`}>{ticker}</span>)}</div></div>


    <section className="section-shell hp-live"><div className="hp-section-intro row"><div><span className="eyebrow">DISCOVER</span><h2>LIVE AI IDOLS</h2><p>Concept previews remain clearly separated from receipt-verified launches</p></div><Link href="/explore">Explore all <ArrowRight size={15}/></Link></div><div className="idol-grid">{demoIdols.slice(0,4).map((idol,index)=><IdolCard key={idol.ticker} idol={idol} index={index}/>)}</div></section>

    <section className="section-shell hp-burn"><div><span className="eyebrow">IDOL ECONOMICS</span><h2>EVERY TRADE<br/>BUILDS THE SYSTEM</h2><p>Creators choose a transparent split between $IDOL buy and burn, the AI treasury and their own wallet</p></div><div className="hp-burn-stats"><div><b>EDITABLE</b><span>Buy and burn</span></div><div><b>EDITABLE</b><span>AI treasury</span></div><div><b>REMAINDER</b><span>Creator wallet</span></div></div></section>

    <section className="section-shell hp-safety"><div className="hp-section-intro"><span className="eyebrow">CONTROL LAYER</span><h2>TRADING FEES FUND THE AI<br/>NOT THE OTHER WAY AROUND</h2></div><div className="hp-safety-grid">{[[ShieldCheck,"BOUNDED SPENDING","Daily and monthly limits can constrain approved services"],[Bot,"POLICY ENGINE","Generation and social actions require explicit authorization"],[Ban,"KILL SWITCH","Planned emergency controls stop spending and posting together"],[Zap,"AUDITABLE ACTIONS","Verified operations keep transaction and provider references"]].map(([Icon,title,text])=><article key={String(title)}><Icon size={24}/><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></section>

    <section className="section-shell hp-final"><span>WHO WILL YOU LAUNCH</span><h2>BUILD THE NEXT<br/>AI IDOL ON BNB</h2><Link className="button primary" href="/launch">Launch your AI idol <ArrowRight size={17}/></Link></section>
  </main><Footer/></div>
}