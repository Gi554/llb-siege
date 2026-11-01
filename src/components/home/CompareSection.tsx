import Link from "next/link";
import type { Comparison } from "@/content/types";
import BeforeAfter from "@/components/BeforeAfter";
import Reveal, { Lines } from "@/components/ui/Reveal";
import DemoBadge from "@/components/ui/DemoBadge";

export default function CompareSection({ comparison }: { comparison: Comparison }) {
  return (
    <section data-header="on-light" aria-label="Avant / Après" className="bg-ivoire py-[clamp(6rem,12vw,11rem)]">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-8">
          <div className="col-span-12 md:col-span-7">
            <Reveal className="flex items-center gap-4">
              <span className="eyebrow text-terracotta">06</span>
              <span className="h-px w-10 bg-encre/25" />
              <span className="eyebrow text-pierre">Avant / Après</span>
            </Reveal>
            <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.8rem,6.4vw,6.6rem)]">
              <Lines text={"Du dessin"} />
              <Lines text={"à la réalité."} className="italic text-terracotta" />
            </Reveal>
          </div>
          <Reveal className="col-span-12 flex flex-col justify-end gap-5 text-encre/70 md:col-span-4 md:col-start-9" delay={0.15}>
            <p>
              Faites glisser le curseur pour comparer deux vues prises sous le même angle : plan et rendu aujourd&apos;hui,
              rendu et photographie du chantier demain.
            </p>
            <DemoBadge className="self-start text-terracotta" label="Comparaison de démonstration" />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <BeforeAfter comparison={comparison} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-encre/60">
            <span>{comparison.title} — documents NPS GROUP</span>
            <Link href="/avant-apres" className="link-underline pb-0.5 font-medium text-encre">
              Toutes les comparaisons
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
