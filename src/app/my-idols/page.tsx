"use client";
import { Bot } from "lucide-react";
import { Header } from "@/components/shell";
import { WalletButton } from "@/components/wallet-button";
export default function MyIdols(){return <div className="app-page"><Header/><main className="app-shell"><span className="eyebrow">OWNER DASHBOARD</span><h1 className="app-title">MY IDOLS</h1><div className="empty-connect"><div><Bot size={44} color="#f3ff32"/><h2>CONNECT YOUR WALLET</h2><p>Your verified creations, media jobs, treasury status and launched tokens will appear here. Wallet connection alone does not authorize backend writes</p><WalletButton/></div></div></main></div>}
