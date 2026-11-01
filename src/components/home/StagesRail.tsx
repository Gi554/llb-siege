"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { STATUS_LABEL, type Stage } from "@/content/types";

// Mint diagonal backdrop, intro on the left, round portraits of each stage scrolling sideways.
export default function StagesRail({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-sr-shape]", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 1.4, ease: "expo.inOut" })
          .from("[data-sr-rule]", { scaleX: 0, transformOrigin: "left", duration: 1, stagger: 0.15, ease: "expo.out" }, 0.3)
          .from("[data-sr-head] > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.4)
          .from("[data-sr-item]", { x: 60, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const onScroll = () => {
    const el = rail.current!;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };
  const nudge = () => rail.current?.scrollBy({ left: rail.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section ref={root} aria-label="Le chantier, étape par étape" className="relative overflow-hidden bg-blanc py-20 md:py-28">
      <span
        data-sr-shape
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[85%] bg-menthe md:w-[34%]"
        style={{ clipPath: "polygon(0 0, 55% 0, 100% 100%, 0 100%)" }}
      />

      <div className="relative grid gap-12 md:grid-cols-[34%_1fr] md:items-center">
        <div data-sr-head className="pl-[var(--gutter)] pr-8 md:pl-[max(var(--gutter),7vw)]">
          <span data-sr-rule aria-hidden="true" className="block h-px w-full max-w-[12rem] bg-terracotta" />
          <h2 className="display mt-8 text-[clamp(2.3rem,3.4vw,3rem)] leading-[1] text-encre">
            Le chantier,
            <br />
            étape par étape
          </h2>
          <p className="mt-6 max-w-[16rem] text-[13px] text-encre/75">
            De la conception à l&apos;inauguration, chaque étape sera documentée ici.
          </p>
          <Link href="/chantier" className="group mt-10 flex max-w-[12rem] items-center text-terracotta" aria-label="Voir l'évolution des travaux">
            <span data-sr-rule className="block h-px flex-1 bg-current" />
            <svg viewBox="0 0 24 24" className="-ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div>
          <ul ref={rail} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-10 overflow-x-auto px-[var(--gutter)] pb-2 md:pl-0">
            {stages.map((s, k) => (
              <li key={s.slug} data-sr-item className="w-[220px] shrink-0 snap-start text-center md:w-[240px]">
                <div className="relative mx-auto aspect-square w-[190px] overflow-hidden rounded-full bg-lin md:w-[210px]">
                  {s.media[0] ? (
                    <Image src={s.media[0].src} alt={s.media[0].alt} fill sizes="210px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center rounded-full border-2 border-dashed border-encre/20">
                      <span className="display text-5xl text-encre/25">{String(k + 1).padStart(2, "0")}</span>
                    </span>
                  )}
                </div>
                <h3 className="display mt-7 text-[1.65rem] leading-tight text-encre">{s.title}</h3>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-terracotta">
                  {STATUS_LABEL[s.status]}
                  {s.dateLabel ? ` · ${s.dateLabel}` : ""}
                  {s.source === "demo" ? " · exemple" : ""}
                </p>
                <p className="mx-auto mt-3 max-w-[15rem] text-[12px] leading-relaxed text-encre/75">{s.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-6 px-[var(--gutter)] md:pl-0">
            <span className="relative block h-[3px] w-[60px] overflow-hidden rounded-full bg-encre/10" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-encre/60 transition-transform duration-150" style={{ transform: `translateX(${progress * 100}%)` }} />
            </span>
            <button type="button" onClick={nudge} className="text-[12px] text-encre/70 underline underline-offset-4">
              Étapes suivantes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
