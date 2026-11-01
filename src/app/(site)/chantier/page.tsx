import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import ChantierHero from "@/components/chantier/ChantierHero";
import Timeline from "@/components/chantier/Timeline";
import NextLinks from "@/components/NextLinks";
import { getStages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Évolution des travaux",
  description:
    "Suivez étape par étape la construction du siège de la Ligue pour la Lecture de la Bible à Cotonou : photographies, vidéos et comptes rendus.",
};

export default async function ChantierPage() {
  const [stages, s] = await Promise.all([getStages(), getSettings()]);

  return (
    <>
      <ChantierHero stages={stages} title={s["chantier.title"]} text={s["chantier.text"]} />
      <Timeline stages={stages} />
      <NextLinks
        items={[
          { href: "/avant-apres", eyebrow: "Comparer", title: "Avant / Après", text: "Le projet et la réalité, sous le même angle." },
          { href: "/actualites", eyebrow: "S'informer", title: "Actualités", text: "Annonces, comptes rendus et événements du chantier." },
        ]}
      />
    </>
  );
}
