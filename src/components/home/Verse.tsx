"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { LampMark } from "@/components/Preloader";

const VERSE = "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.";

export default function Verse() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const paths = gsap.utils.toArray<SVGPathElement>("[data-draw]");
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } });
        tl.to(paths, { strokeDashoffset: 0, duration: 2, stagger: 0.2, ease: "power2.inOut" })
          .from("[data-verse-word]", { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.035 }, 0.2)
          .from("[data-verse-ref]", { opacity: 0, y: 20, duration: 1 }, "-=0.6");
        gsap.to("[data-glow]", {
          scale: 1.4,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-dark" aria-label="Verset" className="grain relative overflow-hidden bg-terracotta py-[clamp(7rem,15vw,14rem)] text-ivoire">
      <div data-glow aria-hidden="true" className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,162,59,.55),rgba(216,162,59,0)_60%)] opacity-30" />
      <div className="wrap relative flex flex-col items-center text-center">
        <LampMark className="h-16 w-16 text-or md:h-20 md:w-20" />
        <blockquote className="mt-10">
          <p className="display mx-auto max-w-[18ch] text-[clamp(2.4rem,6.2vw,6.4rem)] leading-[1.02]">
            {VERSE.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span data-verse-word className={`inline-block ${w === "lampe" || w === "lumière" ? "italic text-or" : ""}`}>
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </p>
          <footer data-verse-ref className="eyebrow mt-10 text-ivoire/75">Psaume 119.105</footer>
        </blockquote>
      </div>
    </section>
  );
}
