import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://builtbyaziz.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Aziz Eljurf — Automation and AI infrastructure",
  description:
    "I build automation and AI infrastructure that agencies resell under their own name. n8n, Claude API, Python, Next.js. US citizen, working your hours in your time zone.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aziz Eljurf — Automation and AI infrastructure",
    description:
      "White-label automation builds for agencies. Eight systems shipped, four running in production.",
    url: SITE,
    siteName: "Built by Aziz",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aziz Eljurf" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aziz Eljurf — Automation and AI infrastructure",
    description:
      "White-label automation builds for agencies. Eight systems shipped, four running in production.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        {/* Typed headings render empty until their effect runs, so without JS
            they would be blank. Fall back to the plain text instead. */}
        <noscript>
          <style>{`
            .sec-type-vis { display: none !important; }
            .sec-type .sr-only {
              position: static !important;
              width: auto !important; height: auto !important;
              margin: 0 !important; clip-path: none !important;
              white-space: normal !important;
            }
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
