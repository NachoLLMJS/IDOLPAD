import Link from "next/link";
import { Sparkles } from "lucide-react";
import { WalletButton } from "./wallet-button";

export function Header() {
  return <header className="site-header">
    <Link href="/" className="brand"><span className="brand-mark"><Sparkles size={15}/></span>IDOLPAD</Link>
    <nav><Link href="/explore">Explore</Link><Link href="/launch">Launch <b>NEW</b></Link><Link href="/my-idols">My Idols</Link><Link href="/studio">Studio</Link><Link href="/docs">Docs</Link></nav>
    <WalletButton compact />
  </header>;
}

export function Footer() {
  return <footer className="footer"><div><Link href="/" className="brand">IDOLPAD</Link><p>Launch an AI-generated idol with its own token on BNB Chain</p></div><div><b>PRODUCT</b><Link href="/explore">Explore</Link><Link href="/launch">Launch</Link><Link href="/studio">Studio</Link></div><div><b>LEGAL</b><span>AI-generated identities</span><span>Speculative tokens</span><span>Not investment advice</span></div></footer>;
}
