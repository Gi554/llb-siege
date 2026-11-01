"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { STATUS_LABEL as STATUS, type Stage } from "@/content/types";
import Reveal, { Lines } from "@/components/ui/Reveal";
import DemoBadge from "@/components/ui/DemoBadge";

export default function ProgressPreview({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLElement>(null);
  const first = stages[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-rail-fill]", { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-rail]", start: "top 70%", end: "bottom 60%", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el) => {
          gsap.from(el, { x: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          gsap.from(el.querySelector("[data-dot]"), { scale: 0, duration: 0.8, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 70%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-stage-thumb]").forEach((el, i) => {
          gsap.from(el, { clipPath: "inset(0% 100% 0% 0%)", duration: 1.3, delay: i * 0.1, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="chantier" data-header="on-dark" aria-label="Évolution des travaux" className="grain relative bg-foret text-ivoire">
      <div className="wrap grid grid-cols-12 gap-x-[var(--gutter)] gap-y-14 py-[clamp(6rem,12vw,11rem)]">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal className="flex items-center gap-4">
              <span className="eyebrow text-or">05</span>
              <span className="h-px w-10 bg-ivoire/25" />
              <span className="eyebrow text-ivoire/60">Évolution des travaux</span>
            </Reveal>
            <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.8rem,6vw,6.2rem)]">
              <Lines text={"Suivre le chantier,"} />
              <Lines text={"étape par étape."} className="italic text-or" />
            </Reveal>
            <Reveal className="mt-8 max-w-md space-y-6 text-ivoire/70" delay={0.15}>
              <p>
                Chaque étape de la construction sera publiée ici : photographies, vidéos et comptes rendus, de la première
                pierre à l&apos;inauguration.
              </p>
              <DemoBadge className="text-or" label="Étapes suivantes : exemples" />
              <div>
                <Link href="/chantier" className="group inline-flex items-center gap-4 rounded-full bg-ivoire py-2 pl-6 pr-2 text-sm font-medium text-foret transition-colors duration-500 hover:bg-or">
                  Voir la chronologie
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-foret text-ivoire transition-transform duration-500 group-hover:rotate-[-45deg]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <ol data-rail className="relative col-span-12 lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-ivoire/15" />
          <span aria-hidden="true" data-rail-fill className="absolute left-[7px] top-2 h-[18%] w-px origin-top bg-or" />
          {stages.map((s, i) => (
            <li key={s.slug} data-stage className="relative pb-14 pl-12 last:pb-0">
              <span
                data-dot
                aria-hidden="true"
                className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border ${s.status === "realise" ? "border-or bg-or" : "border-ivoire/40 bg-foret"}`}
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="eyebrow tabular-nums text-ivoire/45">Étape {String(i + 1).padStart(2, "0")}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] ${s.status === "realise" ? "bg-or text-foret" : "border border-ivoire/25 text-ivoire/60"}`}>
                  {STATUS[s.status]}
                </span>
                {s.dateLabel && <span className="text-sm text-ivoire/60">{s.dateLabel}</span>}
                {s.source === "demo" && <span className="text-[0.68rem] uppercase tracking-[0.12em] text-ivoire/35">Exemple</span>}
              </div>
              <h3 className={`display mt-3 leading-none ${s === first ? "text-[clamp(2rem,3.4vw,3.2rem)]" : "text-[clamp(1.6rem,2.4vw,2.2rem)] text-ivoire/85"}`}>
                {s.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ivoire/60">{s.description}</p>
              {s.media.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {s.media.slice(0, 3).map((m) => (
                    <div key={m.src} data-stage-thumb className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                      <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-110" />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
