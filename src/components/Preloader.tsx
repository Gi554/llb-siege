"use client";

import { useRef, useState } from "react";
import { gsap, markReady, MOTION_OK, useGSAP } from "@/lib/gsap";
import { projet } from "@/content/projet";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { v: 0 };
        const num = root.current!.querySelector<HTMLElement>("[data-count]")!;
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");

        const tl = gsap.timeline({
          onComplete: () => setDone(true),
        });
        tl.from("[data-lamp]", { opacity: 0, y: 20, duration: 0.9 })
          .to(counter, {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
          }, 0.1);
        words.forEach((w, i) => {
          tl.fromTo(w, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, 0.1 + i * 0.45);
          if (i < words.length - 1) tl.to(w, { yPercent: -110, duration: 0.45, ease: "power3.in" }, 0.1 + i * 0.45 + 0.4);
        });
        tl.add(markReady, "-=0.15")
          .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, "-=0.2");
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        markReady();
        setDone(true);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="grain fixed inset-0 z-[100] flex flex-col justify-between bg-foret p-[var(--gutter)] text-ivoire"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex items-start justify-between">
        <span className="eyebrow text-ivoire/60">{projet.short}</span>
        <span className="eyebrow text-ivoire/60">{projet.city}, {projet.country}</span>
      </div>

      <div data-lamp className="mx-auto">
        <LampMark className="h-16 w-16 text-or md:h-20 md:w-20" />
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="relative h-[1.2em] overflow-hidden font-display text-2xl italic md:text-4xl">
          {projet.values.map((v) => (
            <span key={v} data-word className="absolute left-0 top-0 translate-y-[110%] capitalize">
              {v}
            </span>
          ))}
        </div>
        <span data-count className="display text-[22vw] leading-[0.8] tabular-nums md:text-[13vw]">
          000
        </span>
      </div>
    </div>
  );
}

export function LampMark({ className = "" }: { className?: string }) {
  // Simple oil-lamp line drawing — a nod to the light of the Word.
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path data-draw d="M32 6c4 6 6 9.5 6 13a6 6 0 0 1-12 0c0-3.5 2-7 6-13Z" />
      <path data-draw d="M8 34h48c-2 10-11 16-24 16S10 44 8 34Z" />
      <path data-draw d="M56 34c3 0 5 2 5 4.5S59 43 56 43" />
      <path data-draw d="M22 56h20M32 50v6" />
    </svg>
  );
}
