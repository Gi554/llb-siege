import Image from "next/image";
import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import { images } from "@/content/projet";
import { STATUS_LABEL, type Stage, type StageStatus } from "@/content/types";

export default function ChantierHero({ stages }: { stages: Stage[] }) {
  const done = stages.filter((s) => s.status === "realise");
  const last = done[done.length - 1];
  const count = (st: StageStatus) => stages.filter((s) => s.status === st).length;

  return (
    <SplitHero
      eyebrow="Suivi de construction"
      title="Évolution des travaux."
      text={
        <p>
          De la conception à l&apos;inauguration, chaque étape du chantier est documentée ici par des photographies, des
          vidéos et des comptes rendus.
        </p>
      }
      footer={
        <Link href="#chronologie" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
          Voir la chronologie
        </Link>
      }
    >
      <Image src={images.cour.src} alt={images.cour.alt} fill priority quality={85} sizes="(min-width: 768px) 66vw, 100vw" className="object-cover object-[55%_50%]" />

      {/* Status card laid over the picture */}
      <div className="absolute bottom-0 left-0 w-full bg-blanc p-6 shadow-[0_30px_60px_rgba(6,37,33,.2)] sm:w-[min(30rem,80%)] md:bottom-10 md:left-10 md:p-7">
        <dl className="grid grid-cols-3 gap-4">
          {(["realise", "en-cours", "a-venir"] as const).map((st) => (
            <div key={st}>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-encre/55">{STATUS_LABEL[st]}</dt>
              <dd className="display mt-1 text-[2.6rem] leading-none tabular-nums text-encre">{String(count(st)).padStart(2, "0")}</dd>
            </div>
          ))}
        </dl>
        {/* One segment per stage; filled segments are completed stages */}
        <div className="mt-5 flex gap-1" aria-hidden="true">
          {stages.map((s) => (
            <span key={s.slug} className={`h-2 flex-1 rounded-full ${s.status === "realise" ? "bg-foret" : s.status === "en-cours" ? "bg-terracotta" : "bg-encre/10"}`} />
          ))}
        </div>
        <p className="mono mt-4 text-[12px] text-encre/70">
          {last ? (
            <>
              Dernière étape réalisée : <span className="text-encre">{last.title}</span>
              {last.dateLabel && <> — {last.dateLabel}</>}
            </>
          ) : (
            "Aucune étape réalisée pour le moment."
          )}
        </p>
      </div>
    </SplitHero>
  );
}
