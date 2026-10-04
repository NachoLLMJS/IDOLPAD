"use client";

import { useEffect, useState } from "react";
import { Film, Play, Upload, WandSparkles } from "lucide-react";
import { Header } from "@/components/shell";
import { WalletButton } from "@/components/wallet-button";
import type { VideoTemplate } from "@/lib/video-templates";

export default function Studio() {
  const [wallet, setWallet] = useState("");
  const [mode, setMode] = useState("template");
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/templates", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { items?: VideoTemplate[] }) => setTemplates(data.items || []))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  function chooseTemplate(template: VideoTemplate) {
    setSelected(template.id);
    setMode("template");
    setPrompt(template.title);
  }

  async function submit() {
    setMessage("");
    try {
      const response = await fetch("/api/idols/demo/video", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode, prompt, durationSec: 5, resolution: "720p" }) });
      const data = await response.json();
      setMessage(data.error?.message || "Job accepted");
    } catch { setMessage("Video service unreachable. No credit was used"); }
  }

  return <div className="app-page"><Header/><main className="app-shell">
    <span className="eyebrow">CONSISTENT SHORT-FORM MEDIA</span><h1 className="app-title">IDOL STUDIO</h1>
    <p className="app-lead">Choose a public Higgsfield community motion currently surfaced by Higgspad, describe a new clip, or upload footage you have the rights to use</p>

    <section className="community-library"><div className="section-heading"><div><span className="eyebrow">LIVE REFERENCE LIBRARY</span><h2>HIGGSFIELD MOTIONS</h2><p>Public community templates from Higgspad&apos;s current feed. Hover to preview</p></div><span className="source-pill">SOURCE · HIGGSPAD / HIGGSFIELD</span></div>
      <div className="video-template-grid">{templates.map((template) => <button key={template.id} className={`video-template-card ${selected === template.id ? "selected" : ""}`} onClick={() => chooseTemplate(template)}>
        {template.previewUrl ? <video src={template.previewUrl} poster={template.posterUrl} muted loop playsInline preload="metadata" onMouseEnter={(event) => void event.currentTarget.play()} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }}/> : <div className="template-fallback"><Film/></div>}
        <span className="video-play"><Play size={12} fill="currentColor"/></span><div><b>{template.title}</b><small>{template.durationSec.toFixed(1)}s · {template.width}×{template.height}</small></div>
      </button>)}</div>
      <p className="template-rights">Availability and reuse rights are controlled by the source service. IDOLPAD will verify provider access before generation</p>
    </section>

    {!wallet ? <div className="empty-connect"><div><Film size={44} color="#f3ba2f"/><h2>CONNECT TO CREATE</h2><p>You can browse motions publicly. Connect the verified owner wallet to apply one to an AI Idol</p><WalletButton onReady={setWallet}/></div></div> : <div className="studio-grid">
      <aside className="studio-sidebar"><b>YOUR IDOLS</b><div className="notice">No receipt-verified idols found for {wallet.slice(0,6)}…{wallet.slice(-4)}.</div><p className="app-lead">Launch an idol first. Preview identities cannot be used as owned identities</p></aside>
      <section className="studio-workspace"><div className="chips"><button className={`chip ${mode === "describe" ? "selected" : ""}`} onClick={() => setMode("describe")}><WandSparkles size={13}/> Describe</button><button className={`chip ${mode === "template" ? "selected" : ""}`} onClick={() => setMode("template")}>Higgsfield template</button><button className={`chip ${mode === "upload" ? "selected" : ""}`} onClick={() => setMode("upload")}><Upload size={13}/> Upload</button></div>
        {mode === "upload" && <div className="form-card"><b>UPLOAD A MOTION REFERENCE</b><p className="app-lead">MP4 · 4-15 seconds · up to 100 MB. You must own the footage or have consent from everyone shown</p><input type="file" accept="video/mp4" disabled/></div>}
        <label className="field"><span>{mode === "template" ? "Selected motion and optional adaptation" : "Motion prompt"} · 3-400 characters</span><textarea value={prompt} onChange={(event) => setPrompt(event.target.value.slice(0,400))} placeholder="Walks toward the camera, pauses, and smiles with understated confidence"/></label>
        <div className="review-list"><div><span>Resolution</span><b>720P</b></div><div><span>Duration</span><b>5 SECONDS</b></div><div><span>Provider</span><b>SERVER CONFIG REQUIRED</b></div></div>
        <button className="button primary full-button" disabled={prompt.length < 3} onClick={submit}>GENERATE VIDEO</button>{message && <div className="error-box">{message}</div>}
      </section>
    </div>}
  </main></div>;
}