import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";
import { announcement as base } from "@/content/navigation";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const announcement = s["announcement.enabled"] === "1" ? { ...base, text: s["announcement.text"] } : null;

  return (
    <>
      <a href="#contenu" className="sr-only z-[200] rounded bg-blanc px-4 py-2 text-encre focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Aller au contenu
      </a>
      <SmoothScroll />
      <Header announcement={announcement} />
      <main id="contenu">{children}</main>
      <Footer />
    </>
  );
}
