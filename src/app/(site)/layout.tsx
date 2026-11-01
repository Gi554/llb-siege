import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenu" className="sr-only z-[200] rounded bg-blanc px-4 py-2 text-encre focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Aller au contenu
      </a>
      <SmoothScroll />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
    </>
  );
}
