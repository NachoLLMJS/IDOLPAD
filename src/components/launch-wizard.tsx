"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Flame, Plus, ShieldAlert, Upload, WalletCards } from "lucide-react";
import { IdolPortrait } from "@/components/idol-art";
import { WalletButton } from "@/components/wallet-button";
import { normalizeTicker, suggestIdentity, validateTicker } from "@/lib/identity";
import { computeFeeSplit, validateDevBuy } from "@/lib/idolpad-economics";

const ideas = ["A sharp culture commentator from Seoul", "A calm market explainer", "A chaotic gaming host", "A sunrise fitness coach"];
const looks = [0, 1];

type Draft = {
  description: string; lookText: string; look: number; name: string; ticker: string;
  beneficiary: string; devBuy: string; burnPct: number; treasuryPct: number; accepted: boolean;
};

const initial: Draft = { description: "", lookText: "", look: 3, name: "", ticker: "", beneficiary: "", devBuy: "0", burnPct: 30, treasuryPct: 35, accepted: false };

export function LaunchWizard({ launchReady }: { launchReady: boolean }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState("");
  useEffect(() => { localStorage.setItem("idolpad-draft", JSON.stringify(draft)); }, [draft]);
  useEffect(() => () => { if (referencePreview) URL.revokeObjectURL(referencePreview); }, [referencePreview]);

  const suggestions = useMemo(() => suggestIdentity(draft.description || "original digital creator"), [draft.description]);
  const displayName = draft.name || suggestions[0].name;
  const ticker = draft.ticker || normalizeTicker(displayName);
  const feeSplit = computeFeeSplit(draft.burnPct, draft.treasuryPct);
  const devBuy = validateDevBuy(draft.devBuy);
  const canNext = step === 1 ? draft.description.trim().length >= 8 : step === 2 ? validateTicker(ticker).ok && displayName.length >= 2 : draft.accepted && Boolean(draft.beneficiary) && feeSplit.ok && devBuy.ok;

  async function generate() {
    setBusy(true); setMessage("");
    try {
      const request = referenceFile ? (() => {
        const body = new FormData();
        body.set("description", draft.description);
        body.set("lookText", draft.lookText);
        body.set("name", displayName);
        body.set("referenceImage", referenceFile);
        return { method: "POST", body };
      })() : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ description: draft.description, lookText: draft.lookText, name: displayName }) };
      const response = await fetch("/api/ai/character", request);
      const data = await response.json();
      setMessage(response.ok ? "Generation job accepted" : data.error?.message || "Generation unavailable");
    } catch { setMessage("Generation service is unreachable. No credit was used"); } finally { setBusy(false); }
  }

  function selectReference(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      setMessage("Choose a JPG, PNG or WebP image up to 8 MB");
      return;
    }
    if (referencePreview) URL.revokeObjectURL(referencePreview);
    setReferenceFile(file);
    setReferencePreview(URL.createObjectURL(file));
    setMessage("");
  }

  async function preflight() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/launch/preflight", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: displayName, symbol: ticker, beneficiary: draft.beneficiary, devBuyBnb: draft.devBuy, buybackBurnPct: draft.burnPct, treasuryPct: draft.treasuryPct, creatorPct: feeSplit.creatorPct }) });
      const data = await response.json();
      setMessage(data.error?.message || data.message || "Preflight finished");
    } catch { setMessage("Preflight unavailable. No transaction was requested"); } finally { setBusy(false); }
  }

  return <div className="launch-layout"><div className="wizard"><div className="step-tabs">{["1 Describe", "2 Name", "3 Launch"].map((label, index) => <button key={label} className={step === index + 1 ? "active" : ""} onClick={() => index + 1 < step && setStep(index + 1)}>{label}</button>)}</div>
    {step === 1 && <><h2 className="app-title">WHO IS YOUR AI?</h2><p className="app-lead">One sentence is enough. Create an original fictional identity rather than impersonating a real person</p><label className="field"><span>Describe your AI idol</span><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="A sharp culture commentator with dry humor and a love of underground music" maxLength={500}/></label><div className="chips">{ideas.map((idea) => <button className="chip" key={idea} onClick={() => setDraft({ ...draft, description: idea })}>{idea}</button>)}</div><label className="field"><span>Describe the look (optional)</span><textarea value={draft.lookText} onChange={(event) => setDraft({ ...draft, lookText: event.target.value })} placeholder="Silver buzz cut, oversized black jacket, BNB-yellow sunglasses" maxLength={500}/></label><div className="form-card"><b>START FROM A LOOK</b><p className="app-lead">Choose a starting look or upload your own image as the visual reference for identity and video generation</p><div className="look-grid compact">{looks.map((look) => <button aria-label={`Look ${look + 1}`} key={look} className={`look ${!referenceFile && draft.look === look ? "selected" : ""}`} onClick={() => { if (referencePreview) URL.revokeObjectURL(referencePreview); setReferenceFile(null); setReferencePreview(""); setDraft({ ...draft, look }); }}><IdolPortrait index={look}/></button>)}<label role="button" tabIndex={0} aria-label="Upload your own reference image" className={`look upload-look ${referenceFile ? "selected" : ""}`}><input aria-label="Reference image file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectReference(event.target.files?.[0])}/>{referencePreview ? <><Image src={referencePreview} alt="Uploaded character reference" fill unoptimized/><span className="upload-name">{referenceFile?.name}</span></> : <span className="upload-plus"><Plus size={35}/><small>YOUR IMAGE</small></span>}</label></div></div><div className="form-card"><b>CREATE A CUSTOM CHARACTER</b><p className="app-lead">Your selected look or uploaded reference is sent only when you request generation</p><button className="button primary full-button" onClick={generate} disabled={busy || draft.description.length < 8}>{busy ? "CHECKING…" : <><Upload size={15}/> GENERATE IDENTITY</>}</button></div></>}

    {step === 2 && <><h2 className="app-title">NAME YOUR IDOL</h2><p className="app-lead">The token shares the idol&apos;s identity. You can edit both before launch</p><div className="form-card"><b>SUGGESTIONS</b><div className="chips" style={{ marginTop: 14 }}>{suggestions.map((suggestion) => <button key={suggestion.name} className="chip" onClick={() => setDraft({ ...draft, name: suggestion.name, ticker: suggestion.ticker })}>{suggestion.name} · ${suggestion.ticker}</button>)}</div></div><label className="field"><span>Idol name</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, ticker: normalizeTicker(event.target.value) })} placeholder={suggestions[0].name}/></label><label className="field"><span>Ticker · 3-8 uppercase letters or numbers</span><input value={draft.ticker || ticker} onChange={(event) => setDraft({ ...draft, ticker: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) })}/></label><div className="form-card"><b>PUBLIC IDENTITY</b><div className="review-list" style={{ marginTop: 14 }}><div><span>Label</span><b>AI-GENERATED</b></div><div><span>Network</span><b>BNB CHAIN</b></div><div><span>Launch venue</span><b>FLAP</b></div></div></div></>}

    {step === 3 && <><h2 className="app-title">DESIGN THE LAUNCH</h2><p className="app-lead">Choose how the AI Idol&apos;s fee revenue is allocated. Creator share is calculated automatically so the split always totals 100%</p><div className="notice"><ShieldAlert size={15}/> Exact automated splitting and $IDOL buyback require the planned IDOLPAD Vault. {launchReady ? "Server variables found; live preflight is still required" : "Writes remain disabled until the Vault and launch adapter are configured"}.</div>
      <label className="field"><span>Creator / beneficiary wallet</span><input value={draft.beneficiary} onChange={(event) => setDraft({ ...draft, beneficiary: event.target.value })} placeholder="0x…"/></label>
      <div className="allocation-editor"><div className="allocation-card burn"><Flame/><div><b>BUY & BURN $IDOL</b><p>Vault revenue used to buy the platform token and send it to the burn destination</p></div><strong>{draft.burnPct}%</strong><input aria-label="Buy and burn percentage" type="range" min="0" max="100" value={draft.burnPct} onChange={(event) => setDraft({ ...draft, burnPct: Number(event.target.value) })}/><input aria-label="Buy and burn numeric percentage" type="number" min="0" max="100" value={draft.burnPct} onChange={(event) => setDraft({ ...draft, burnPct: Number(event.target.value) })}/></div>
        <div className="allocation-card treasury"><WalletCards/><div><b>AI IDOL TREASURY</b><p>Operating budget for approved image, video, voice, storage and social actions</p></div><strong>{draft.treasuryPct}%</strong><input aria-label="Treasury percentage" type="range" min="0" max="100" value={draft.treasuryPct} onChange={(event) => setDraft({ ...draft, treasuryPct: Number(event.target.value) })}/><input aria-label="Treasury numeric percentage" type="number" min="0" max="100" value={draft.treasuryPct} onChange={(event) => setDraft({ ...draft, treasuryPct: Number(event.target.value) })}/></div>
        <div className="allocation-card creator"><div><b>CREATOR WALLET</b><p>The remainder is routed to the creator after buy & burn and treasury allocation</p></div><strong>{feeSplit.creatorPct}%</strong></div></div>
      {!feeSplit.ok && <div className="error-box">{feeSplit.error}</div>}
      <label className="field dev-buy"><span>Optional dev buy at launch · BNB</span><input type="number" min="0" step="0.001" value={draft.devBuy} onChange={(event) => setDraft({ ...draft, devBuy: event.target.value })}/><small>The connected creator wallet funds this initial purchase. It is included in the same reviewed launch transaction value</small></label>
      {!devBuy.ok && <div className="error-box">{devBuy.error}</div>}
      <div className="review-list"><div><span>Token</span><b>{displayName} · ${ticker}</b></div><div><span>Version</span><b>FLAP TAX TOKEN V3 + IDOLPAD VAULT</b></div><div><span>Trading tax</span><b>1% BUY · 1% SELL</b></div><div><span>Buy & burn $IDOL</span><b>{draft.burnPct}%</b></div><div><span>AI treasury</span><b>{draft.treasuryPct}%</b></div><div><span>Creator wallet</span><b>{feeSplit.creatorPct}%</b></div><div><span>Dev buy</span><b>{draft.devBuy} BNB</b></div><div><span>Required chain</span><b>BNB · 56</b></div></div>
      <label className="field"><span><input type="checkbox" checked={draft.accepted} onChange={(event) => setDraft({ ...draft, accepted: event.target.checked })} style={{ width: "auto", marginRight: 8 }}/>I understand the token is speculative and does not grant ownership of the idol or media</span></label><WalletButton onReady={(address) => setDraft((current) => ({ ...current, beneficiary: current.beneficiary || address }))}/><button className="button primary full-button" disabled={!canNext || busy} onClick={preflight}>{busy ? "RUNNING CHECKS…" : "RUN LIVE PREFLIGHT"}</button></>}

    {message && <div className={message.includes("accepted") ? "success-box" : "error-box"}>{message}</div>}
    <div className="form-actions">{step > 1 ? <button className="button ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16}/> Back</button> : <span/>}{step < 3 && <button className="button primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue <ArrowRight size={16}/></button>}</div>
  </div><aside className="preview-panel"><div className={`preview-split ${referencePreview ? "reference-preview" : ""}`}>{referencePreview ? <><div><Image src={referencePreview} alt="Uploaded character reference preview" fill unoptimized/></div><div><Image src={referencePreview} alt="Uploaded character reference detail" fill unoptimized/></div></> : <><IdolPortrait index={draft.look} tall/><IdolPortrait index={draft.look}/></>}</div><div className="preview-copy"><span className="ai-tag">{referenceFile ? "UPLOADED REFERENCE" : "AI-GENERATED IDOL"}</span><h3>{displayName} <span>${ticker}</span></h3><p>{draft.description || "Describe your idol and it will take shape here"}</p></div><div className="review-list"><div><span>Identity</span><b>{draft.description ? "DRAFTED" : "WAITING"}</b></div><div><span>Fee split</span><b>{draft.burnPct}/{draft.treasuryPct}/{feeSplit.creatorPct}</b></div><div><span>Dev buy</span><b>{draft.devBuy} BNB</b></div><div><span>Launch</span><b>FAIL-CLOSED</b></div></div></aside></div>;
}