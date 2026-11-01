import type { Metadata } from "next";
import CompareHero from "@/components/avant-apres/CompareHero";
import CompareStudio from "@/components/avant-apres/CompareStudio";
import Viewpoints from "@/components/avant-apres/Viewpoints";
import NextLinks from "@/components/NextLinks";
import Reveal, { Lines } from "@/components/ui/Reveal";
import DemoBadge from "@/components/ui/DemoBadge";
import { getComparisons, getViewpoints } from "@/lib/content";

export const metadata: Metadata = {
  title: "Avant / Après",
  description:
    "Comparez le projet architectural du siège de la LLB et la réalité du chantier, photographiée sous le même angle à chaque étape.",
};

const PROTOCOL = [
  {
    title: "Un point de vue fixe",
    text: "Chaque angle est repéré sur le terrain : même emplacement, même hauteur, même cadrage que la perspective du dossier.",
  },
  {
    title: "Une photo par étape",
    text: "À chaque étape du chantier, l'équipe reprend la photographie depuis ce même point, pour mesurer le chemin parcouru.",
  },
  {
    title: "Une comparaison publiée",
    text: "Depuis l'administration, deux images sont associées, datées et légendées, puis publiées sur cette page.",
  },
];

export default async function AvantApresPage() {
  const [comparisons, viewpoints] = await Promise.all([getComparisons(), getViewpoints()]);
  const featured = comparisons[0];

  return (
    <>
      <CompareHero comparison={featured} />

      <section aria-label="Comparaison à la une" className="bg-blanc py-[clamp(6rem,12vw,11rem)]">
        <div className="container-site">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal className="flex items-center gap-4">
                <span className="eyebrow text-terracotta">01</span>
                <span className="h-px w-10 bg-encre/25" />
                <span className="eyebrow text-pierre">À la une</span>
              </Reveal>
              <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.6rem,5.6vw,5.6rem)]">
                <Lines text={featured.title} />
                <Lines text="du plan au rendu." className="italic text-terracotta" />
              </Reveal>
            </div>
            <Reveal className="flex flex-col gap-5 text-encre/70 md:col-span-4 md:col-start-9 md:self-end" delay={0.15}>
              <p>
                L&apos;élévation technique de NPS GROUP face au rendu architectural. Dès les premières photographies du
                chantier, la réalité prendra la place du rendu.
              </p>
              {featured.source === "demo" && <DemoBadge className="self-start text-terracotta" label="Comparaison de démonstration" />}
            </Reveal>
          </div>
          <Reveal className="mt-12">
            <CompareStudio comparison={featured} />
          </Reveal>
        </div>
      </section>

      <Viewpoints items={viewpoints} />

      <section aria-label="Protocole photographique" className="bg-ocre py-[clamp(6rem,10vw,9rem)]">
        <div className="container-site">
          <Reveal as="h2" className="outline-text stroke-ink text-[clamp(3.6rem,8vw,7.5rem)] [--stroke:2.5px]">
            <span className="block">Même angle,</span>
            <span className="block">autre moment</span>
          </Reveal>
          <span aria-hidden="true" className="mt-10 block h-[2px] w-[180px] bg-encre" />
          <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {PROTOCOL.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.12}>
                <span className="block h-px w-full bg-encre/70" aria-hidden="true" />
                <span className="outline-text stroke-ink mt-6 block text-[clamp(3rem,5vw,4.5rem)] leading-none [--stroke:1.5px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-sans text-[1.5rem] font-medium leading-tight text-encre">{p.title}</h3>
                <p className="mono mt-3 max-w-sm text-[13px] text-encre/80">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <NextLinks
        items={[
          { href: "/chantier", eyebrow: "Suivre", title: "Évolution des travaux", text: "Chaque étape du chantier, de la conception à l'inauguration." },
          { href: "/galerie", eyebrow: "Explorer", title: "Galerie", text: "Toutes les images du projet, filtrables par espace et par étape." },
        ]}
      />
    </>
  );
}
