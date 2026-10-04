import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Oswald({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "IDOLPAD — Launch an AI idol on BNB", template: "%s · IDOLPAD" },
  description: "Create an original AI idol, generate content, and launch its token through Flap on BNB Chain",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${geist.variable} ${mono.variable} ${display.variable}`}><body>{children}</body></html>;
}