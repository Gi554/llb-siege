import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LookAround from "@/components/home/LookAround";
import SpacesCarousel from "@/components/home/SpacesCarousel";
import Included from "@/components/home/Included";
import StagesRail from "@/components/home/StagesRail";
import Journal from "@/components/home/Journal";
import Partners from "@/components/home/Partners";
import { getNews, getProjet, getStages } from "@/lib/content";
import { getSettings, heroImage } from "@/lib/settings";
import { getPartners } from "@/lib/partners";

// Admin changes refresh the page at once; this also picks up data changed directly in the database.
export const revalidate = 300;

export default async function HomePage() {
  const [{ spaces }, stages, news, s, partners] = await Promise.all([getProjet(), getStages(), getNews(3), getSettings(), getPartners()]);

  return (
    <>
      <Hero eyebrow={s["home.eyebrow"]} title={s["home.title"]} text={s["home.text"]} image={await heroImage(s)} />
      <Features />
      <LookAround />
      <SpacesCarousel spaces={spaces} />
      <Included />
      <StagesRail stages={stages} />
      <Journal items={news} />
      <Partners partners={partners} />
    </>
  );
}
