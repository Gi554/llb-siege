"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import { images } from "@/content/projet";
import { STATUS_LABEL, type Stage, type StageStatus } from "@/content/types";

export default function ChantierHero({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLElement>(null);
  const done = stages.filter((s) => s.status === "realise");
  const last = done[done.length - 1];
  const count = (st: StageStatus) => stages.filter((s) => s.status === st).length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo("[data-ch-img]", { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2 })
          .from("[data-ch-line]", { yPercent: 115, duration: 1.3, stagger: 0.1 }, 0.1)
          .from("[data-ch-fade]", { opacity: 0, y: 24, duration: 1.1, stagger: 0.07 }, 0.5)
          .from("[data-ch-tick]", { scaleY: 0, transformOrigin: "bottom", duration: 0.9, stagger: 0.05, ease: "power3.out" }, 0.7);
        const off = onReady(() => tl.play());
        gsap.to("[data-ch-img]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-dark" className="grain relative overflow-hidden bg-foret text-ivoire">
      <div className="absolute inset-0">
        <div data-ch-img className="absolute -inset-y-[8%] inset-x-0">
          <Image src={images.cour.src} alt="" fill priority sizes="(max-aspect-ratio: 2/1) 220vh, 100vw" quality={85} className="object-cover object-[60%_50%] opacity-40" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,38,32,.7),rgba(13,38,32,.35)_40%,#0d2620_100%)]" />
      </div>

      <div className="wrap relative flex min-h-[92svh] flex-col justify-end pb-14 pt-40 md:pb-20">
        <p data-ch-fade className="eyebrow text-or">Suivi de construction · Cotonou</p>
        <h1 className="display mt-6 text-[clamp(3.4rem,11vw,12rem)]">
          <span className="line-mask"><span data-ch-line>Évolution</span></span>
          <span className="line-mask"><span data-ch-line>des <em className="italic text-or">travaux.</em></span></span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-ivoire/15 pt-8 md:grid-cols-12">
          <p data-ch-fade className="max-w-md text-ivoire/75 md:col-span-5">
            De la conception à l&apos;inauguration, chaque étape du chantier est documentée ici par des photographies,
            des vidéos et des comptes rendus.
          </p>

          <dl className="grid grid-cols-3 gap-6 md:col-span-6 md:col-start-7">
            {(["realise", "en-cours", "a-venir"] as const).map((st) => (
              <div key={st} data-ch-fade>
                <dt className="eyebrow text-ivoire/50">{STATUS_LABEL[st]}</dt>
                <dd className="display mt-2 text-[clamp(2.4rem,4vw,3.6rem)] leading-none tabular-nums">
                  {String(count(st)).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* One tick per stage; filled ticks are stages marked as completed. */}
        <div className="mt-10 flex items-end gap-1.5" aria-hidden="true">
          {stages.map((s) => (
            <span
              key={s.slug}
              data-ch-tick
              className={`h-8 flex-1 rounded-[1px] ${s.status === "realise" ? "bg-or" : s.status === "en-cours" ? "bg-terracotta" : "bg-ivoire/15"}`}
            />
          ))}
        </div>
        <p data-ch-fade className="mt-4 text-sm text-ivoire/60">
          {last ? (
            <>
              Dernière étape réalisée : <span className="text-ivoire">{last.title}</span>
              {last.dateLabel && <> — {last.dateLabel}</>}
            </>
          ) : (
            "Aucune étape réalisée pour le moment."
          )}
        </p>
      </div>
    </section>
  );
}
