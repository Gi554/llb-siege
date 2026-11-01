"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Space } from "@/content/types";

// Giant outlined word behind a large picture card. The list of spaces on the
// left and the caption + controls on the right balance the composition.
export default function SpacesCarousel({ spaces }: { spaces: Space[] }) {
  const root = useRef<HTMLElement>(null);
  const touch = useRef<number | null>(null);
  const [i, setI] = useState(0);
  const s = spaces[i];
  const go = (d: number) => setI((v) => (v + d + spaces.length) % spaces.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The inner span drifts; the outer wrapper keeps the centering.
        gsap.fromTo("[data-sc-word]", { xPercent: 4 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
          .from("[data-sc-card]", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" })
          .from("[data-sc-side] > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.06, ease: "power3.out" }, 0.25);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Caption text slides in on each change; pictures crossfade in CSS.
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo("[data-sc-caption] > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" });
    },
    { scope: root, dependencies: [i] },
  );

  const arrow = (d: -1 | 1, tone: "light" | "dark") => (
    <button
      type="button"
      onClick={() => go(d)}
      aria-label={d < 0 ? "Espace précédent" : "Espace suivant"}
      className={`grid h-12 w-12 place-items-center rounded-full border transition-colors ${
        tone === "dark" ? "border-encre/20 text-encre hover:border-foret hover:bg-foret hover:text-blanc" : "border-blanc/40 text-blanc hover:bg-blanc hover:text-terracotta"
      }`}
    >
      <svg viewBox="0 0 24 24" className={`h-4 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );

  return (
    <section
      ref={root}
      aria-roledescription="carrousel"
      aria-label="Les espaces du siège"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="relative overflow-hidden bg-blanc py-24 md:py-32"
    >
      {/* Outlined word across the top; the card overlaps its lower half */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-14 flex justify-center md:top-20">
        <span data-sc-word className="outline-text select-none whitespace-nowrap text-[clamp(6rem,20vw,19rem)] text-sauge [--stroke:2.5px]">
          espaces
        </span>
      </div>

      <div className="container-site relative grid items-end gap-10 pt-[clamp(3.5rem,11vw,10.5rem)] lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
        {/* Index of spaces */}
        <div data-sc-side className="hidden pb-4 lg:block">
          <p className="font-mono text-[13px] text-encre/55">Les espaces du siège</p>
          <ol className="mt-6 space-y-1" role="tablist" aria-label="Choisir un espace">
            {spaces.map((sp, k) => (
              <li key={sp.slug}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setI(k)}
                  className={`group flex w-full items-baseline gap-4 rounded-full py-1.5 text-left transition-colors ${k === i ? "text-encre" : "text-encre/45 hover:text-encre"}`}
                >
                  <span className="font-mono text-[11px] tabular-nums">{sp.index}</span>
                  <span className={`font-display text-[1.15rem] leading-tight transition-transform duration-300 ${k === i ? "translate-x-1 font-medium" : "group-hover:translate-x-1"}`}>{sp.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Card */}
        <div data-sc-card className="mx-auto w-full max-w-[min(86vw,440px)] lg:w-[min(32vw,440px)]">
          <div
            className="relative aspect-[4/5] overflow-hidden bg-sable shadow-[0_40px_80px_rgba(20,31,28,.18)]"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current === null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touch.current = null;
            }}
          >
            {spaces.map((sp, k) => (
              <Image
                key={sp.slug}
                src={sp.image.src}
                alt={k === i ? sp.image.alt : ""}
                aria-hidden={k !== i}
                fill
                quality={85}
                loading={k === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 440px, 86vw"
                className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${k === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
              />
            ))}
            <span className="absolute left-4 top-4 rounded-full bg-blanc/90 px-3 py-1 font-mono text-[12px] tabular-nums text-encre">
              {s.index} / {String(spaces.length).padStart(2, "0")}
            </span>
          </div>
          <div className="bg-terracotta px-6 pb-6 pt-5 text-blanc">
            <div data-sc-caption aria-live="polite" className="min-h-[6.5rem]">
              <p className="font-display text-[1.7rem] font-medium leading-tight">{s.title}</p>
              <p className="mt-2 text-[13px] leading-snug text-blanc/85">{s.lede}</p>
            </div>
            {/* Mobile controls */}
            <div className="mt-5 flex items-center justify-between lg:hidden">
              <div className="flex gap-1.5" aria-hidden="true">
                {spaces.map((sp, k) => (
                  <span key={sp.slug} className={`h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-blanc" : "w-1.5 bg-blanc/45"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                {arrow(-1, "light")}
                {arrow(1, "light")}
              </div>
            </div>
          </div>
        </div>

        {/* Caption side + controls */}
        <div data-sc-side className="hidden pb-4 lg:flex lg:flex-col lg:items-start">
          <p className="mono max-w-[17rem] text-[13px] text-encre/75">
            Sept lieux imaginés par NPS GROUP pour accueillir, travailler, se réunir et transmettre.
          </p>
          <div className="mt-8 flex gap-3">
            {arrow(-1, "dark")}
            {arrow(1, "dark")}
          </div>
          <Link href="/galerie" className="mt-10 inline-flex items-center gap-2 font-display text-[15px] font-semibold text-encre">
            Toutes les images <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
