"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, FileText, Rocket, Search, Sparkles, Video } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { demoIdols, IdolPortrait } from "@/components/idol-art";
import type { VideoTemplate } from "@/lib/video-templates";

export default function ExplorePage(){
  const [templates,setTemplates]=useState<VideoTemplate[]>([])
  useEffect(()=>{void fetch("/api/templates").then(r=>r.json()).then((d:{items?:VideoTemplate[]})=>setTemplates(d.items?.slice(0,10)||[])).catch(()=>undefined)},[])
  return <div className="market-shell">
    <aside className="market-sidebar"><Link href="/" className="brand"><span className="brand-mark"><Sparkles size={14}/></span>IDOLPAD</Link><nav><Link href="/launch"><Rocket size={16}/>Launch</Link><Link className="active" href="/explore"><Compass size={16}/>Explore</Link><Link href="/my-idols"><Sparkles size={16}/>My Idols</Link><Link href="/studio"><Video size={16}/>Studio</Link></nav><nav className="market-secondary"><Link href="/docs"><FileText size={16}/>Docs</Link></nav></aside>
    <div className="market-main"><header className="market-top"><Link href="/launch" className="button primary">LAUNCH</Link><WalletButton compact/></header><main className="market-content">
      <div className="market-heading"><span className="eyebrow">MARKETPLACE</span><h1>EXPLORE</h1><p>Discover AI Idol concepts, current public motion references and receipt-verified launches when they become available</p></div>

      <section className="market-section"><div className="market-section-title"><div><h2>NEW VIDEOS</h2><p>Public Higgsfield community motions currently surfaced through Higgspad</p></div><Link href="/studio">Open studio</Link></div><div className="market-video-row">{templates.map(template=><button key={template.id} className="market-video"><video src={template.previewUrl} poster={template.posterUrl} muted loop playsInline preload="metadata" onMouseEnter={e=>void e.currentTarget.play()} onMouseLeave={e=>{e.currentTarget.pause();e.currentTarget.currentTime=0}}/><span>{template.title}</span><small>{template.durationSec.toFixed(1)} SEC</small></button>)}</div></section>

      <section className="market-section"><div className="market-section-title"><div><h2>MEET THE IDOLS</h2><p>Original IDOLPAD concept identities</p></div><span>AI-GENERATED</span></div><div className="market-head-row">{[...demoIdols,...demoIdols].map((idol,index)=><Link href="/launch" key={`${idol.ticker}-${index}`}><IdolPortrait index={index%6}/><b>{idol.name}</b><small>${idol.ticker}</small><em>CONCEPT</em></Link>)}</div></section>

      <section className="market-trending"><article><span>01</span><b>NOVA RAE</b><small>$NOVA · CONCEPT</small></article><article><span>02</span><b>ARIA MODE</b><small>$ARIA · CONCEPT</small></article><article><span>03</span><b>KAI PULSE</b><small>$KAI · CONCEPT</small></article></section>

      <section className="market-section token-list"><div className="market-section-title"><div><h2>ALL AI TOKENS</h2><p>No market data is shown until a launch receipt is verified on BNB Chain</p></div></div><div className="token-tools"><div className="chips"><button className="chip selected">Trending</button><button className="chip">New</button><button className="chip">Most followed</button><button className="chip">Biggest</button></div><label><Search size={15}/><input placeholder="Search by name or $symbol"/></label></div><div className="token-table">{demoIdols.map((idol,index)=><Link href="/launch" key={idol.ticker}><IdolPortrait index={index}/><div><b>{idol.name}</b><small>${idol.ticker}</small></div><span>CONCEPT</span><em>NOT LAUNCHED</em></Link>)}</div></section>
    </main></div>
  </div>
}