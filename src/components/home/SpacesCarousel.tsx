"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Space } from "@/content/types";

// Giant outlined word with a single card carousel sitting on top of it.
export default function SpacesCarousel({ spaces }: { spaces: Space[] }) {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const s = spaces[i];
  const go = (d: number) => setI((v) => (v + d + spaces.length) % spaces.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-sc-word]", { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from("[data-sc-card]", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Crossfade the image each time the slide changes.
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo("[data-sc-img]", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
      gsap.fromTo("[data-sc-caption] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" });
    },
    { scope: root, dependencies: [i] },
  );

  return (
    <section ref={root} aria-roledescription="carrousel" aria-label="Les espaces du siège" className="relative overflow-hidden bg-blanc py-24 md:py-32">
      <p
        data-sc-word
        aria-hidden="true"
        className="outline-text pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(7rem,23vw,21rem)] text-sauge [--stroke:2.7px]"
      >
        espaces
      </p>

      <div data-sc-card className="relative mx-auto w-[min(78vw,300px)]">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-sable">
            <Image key={s.slug} data-sc-img src={s.image.src} alt={s.image.alt} fill sizes="300px" className="object-cover" />
          </div>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? "Espace précédent" : "Espace suivant"}
              className={`absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-blanc/90 text-encre shadow-md transition-transform hover:scale-110 ${d < 0 ? "left-3" : "right-3"}`}
            >
              <svg viewBox="0 0 24 24" className={`h-4 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
        <div className="bg-terracotta px-5 pb-5 pt-4 text-blanc">
          <div className="flex justify-center gap-1.5" role="tablist" aria-label="Choisir un espace">
            {spaces.map((sp, k) => (
              <button
                key={sp.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={sp.title}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-4 bg-blanc" : "w-1.5 bg-blanc/45"}`}
              />
            ))}
          </div>
          <div data-sc-caption aria-live="polite" className="mt-4">
            <p className="font-display text-[1.6rem] font-medium leading-tight">{s.title}</p>
            <p className="mt-1 text-[13px] leading-snug text-blanc/85">{s.lede}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
