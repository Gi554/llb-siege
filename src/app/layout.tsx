import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  themeColor: "#0d2620",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a href="#contenu" className="sr-only z-[200] rounded bg-ivoire px-4 py-2 text-encre focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Aller au contenu
        </a>
        <SmoothScroll />
        <Preloader />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
