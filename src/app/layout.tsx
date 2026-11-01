import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Urbanist } from "next/font/google";
import "./globals.css";

// Urbanist and DM Sans are variable fonts: no weight list needed.
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Une vision prend vie — Siège de la LLB, Cotonou",
    template: "%s — Siège de la LLB",
  },
  description:
    "Découvrez le futur siège de la Ligue pour la Lecture de la Bible à Cotonou (Bénin) et suivez l'évolution de sa construction, étape par étape.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Siège de la LLB",
    images: [{ url: "/images/projet/facade-principale.jpg", width: 3150, height: 1053, alt: "Façade principale du futur siège de la LLB" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#062521",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${urbanist.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
