"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import type { Media } from "@/content/types";

// The screen opens from a center seam: the drawing on the left, the render on the right.
export default function CompareHero({ before, after }: { before: Media; after: Media }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true });
        tl.from("[data-seam]", { scaleY: 0, duration: 0.9, ease: "expo.inOut" })
          .from("[data-half='l']", { clipPath: "inset(0% 0% 0% 100%)", duration: 1.4, ease: "expo.inOut" }, 0.35)
          .from("[data-half='r']", { clipPath: "inset(0% 100% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.35)
          .from("[data-ca-line]", { yPercent: 115, duration: 1.2, stagger: 0.1 }, 0.8)
          .from("[data-ca-fade]", { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 1.05);
        const off = onReady(() => tl.play());
        gsap.to("[data-half] img", {
          scale: 1.12,
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
    <section ref={root} data-header="on-dark" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-foret text-ivoire">
      <div className="absolute inset-0 grid grid-cols-2">
        <div data-half="l" className="relative overflow-hidden bg-white" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <Image src={before.src} alt={before.alt} fill priority sizes="50vw" className="object-cover object-[30%_50%]" />
        </div>
        <div data-half="r" className="relative overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <Image src={after.src} alt={after.alt} fill priority sizes="(max-aspect-ratio: 1/1) 100vh, 50vw" className="object-cover object-[30%_50%]" />
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,38,32,.55),rgba(13,38,32,.15)_40%,rgba(13,38,32,.9))]" />
      <span data-seam aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px origin-center bg-ivoire" />

      <div className="wrap relative flex h-full flex-col justify-end pb-14 md:pb-20">
        <div className="flex justify-between">
          <span data-ca-fade className="eyebrow text-ivoire/80">Avant · le dessin</span>
          <span data-ca-fade className="eyebrow text-ivoire/80">Après · la réalité</span>
        </div>
        <h1 className="display mt-8 text-center text-[clamp(3.6rem,13vw,13rem)]">
          <span className="line-mask">
            <span data-ca-line>
              Avant <em className="italic text-or">/</em> Après
            </span>
          </span>
        </h1>
        <p data-ca-fade className="mx-auto mt-8 max-w-lg text-center text-ivoire/80">
          Le projet et le chantier, sous le même angle : faites glisser, superposez, comparez.
        </p>
      </div>
    </section>
  );
}
