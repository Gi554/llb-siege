import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import ValuesBand from "@/components/home/ValuesBand";
import PatioReveal from "@/components/home/PatioReveal";
import Spaces from "@/components/home/Spaces";
import PlanFacts from "@/components/home/PlanFacts";
import ProgressPreview from "@/components/home/ProgressPreview";
import CompareSection from "@/components/home/CompareSection";
import Verse from "@/components/home/Verse";
import NewsPreview from "@/components/home/NewsPreview";
import { getComparisons, getNews, getStages } from "@/lib/content";

export default async function HomePage() {
  const [stages, comparisons, news] = await Promise.all([getStages(), getComparisons(), getNews(3)]);

  return (
    <>
      <Hero />
      <Manifesto />
      <ValuesBand />
      <PatioReveal />
      <Spaces />
      <PlanFacts />
      <ProgressPreview stages={stages.slice(0, 4)} />
      <CompareSection comparison={comparisons[0]} />
      <Verse />
      <NewsPreview items={news} />
    </>
  );
}
