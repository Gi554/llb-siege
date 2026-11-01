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
      <CompareHero before={featured.before} after={featured.after} />

      <section data-header="on-light" aria-label="Comparaison à la une" className="bg-ivoire py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
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

      <section data-header="on-dark" aria-label="Protocole photographique" className="grain relative bg-foret py-[clamp(6rem,12vw,11rem)] text-ivoire">
        <div className="wrap">
          <Reveal className="flex items-center gap-4">
            <span className="eyebrow text-or">03</span>
            <span className="h-px w-10 bg-ivoire/25" />
            <span className="eyebrow text-ivoire/60">Le protocole</span>
          </Reveal>
          <Reveal as="h2" mode="lines" className="display mt-6 max-w-4xl text-[clamp(2.6rem,5.6vw,5.6rem)]">
            <Lines text="Même angle," />
            <Lines text="autre moment." className="italic text-or" />
          </Reveal>
          <ol className="mt-16 grid gap-12 border-t border-ivoire/15 pt-12 md:grid-cols-3 md:gap-[var(--gutter)]">
            {PROTOCOL.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.12}>
                <span className="display block text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-or">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-medium">{p.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-ivoire/65">{p.text}</p>
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
