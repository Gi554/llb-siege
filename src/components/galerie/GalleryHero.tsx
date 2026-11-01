"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import type { GalleryItem } from "@/content/types";
import { images } from "@/content/projet";

// Floating collage around the title (fixed renders of the architectural file);
// each frame drifts at its own speed.
const FRAMES = [
  { media: images.patio, cls: "left-[4%] top-[18%] w-[22vw] aspect-[3/4] md:w-[15vw]", speed: -30 },
  { media: images.librairieHd, cls: "right-[5%] top-[12%] w-[30vw] aspect-[4/3] md:w-[20vw]", speed: -55 },
  { media: images.jardin, cls: "hidden md:block left-[14%] bottom-[8%] w-[26vw] aspect-[4/3] md:w-[17vw]", speed: -80 },
  { media: images.direction, cls: "hidden md:block right-[12%] bottom-[14%] w-[20vw] aspect-[4/5] md:w-[12vw]", speed: -40 },
];

export default function GalleryHero({ items, documented, text }: { items: GalleryItem[]; documented: number; text: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true });
        tl.from("[data-gh-frame]", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6, stagger: 0.12, ease: "expo.inOut" })
          .from("[data-gh-frame] img", { scale: 1.4, duration: 2, stagger: 0.12, ease: "expo.out" }, 0)
          .from("[data-gh-line]", { yPercent: 115, duration: 1.3, stagger: 0.1 }, 0.3)
          .from("[data-gh-fade]", { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 0.8);
        const off = onReady(() => tl.play());
        gsap.utils.toArray<HTMLElement>("[data-gh-frame]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.speed),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        gsap.to("[data-gh-title]", {
          yPercent: 30,
          opacity: 0.2,
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
    <section ref={root} className="relative h-[calc(100svh-var(--header-h)-44px)] min-h-[600px] overflow-hidden bg-blanc">
      {/* Outlined word behind the collage */}
      <div data-gh-title className="absolute inset-0 flex items-center justify-center">
        <h1 className="outline-text whitespace-nowrap text-[clamp(6rem,24vw,22rem)] text-sauge [--stroke:2.7px]">
          <span className="line-mask"><span data-gh-line>galerie</span></span>
        </h1>
      </div>

      {FRAMES.map((f) => (
        <div key={f.media.src} data-gh-frame data-speed={f.speed} className={`absolute overflow-hidden shadow-[0_30px_60px_rgba(20,31,28,.15)] ${f.cls}`} style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <Image src={f.media.src} alt="" fill priority sizes="(min-width: 768px) 22vw, 32vw" className="object-cover" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-[var(--gutter)] pb-10 text-center">
        <p data-gh-fade className="font-display text-[15px] font-medium text-encre">Le projet en images</p>
        <p data-gh-fade className="mono mt-3 max-w-md text-[13px] text-encre/75">
          {text}
        </p>
        <p data-gh-fade className="mt-4 flex items-center gap-4 text-[12px] uppercase tracking-[0.12em] text-encre/60">
          <span><span className="tabular-nums text-encre">{items.length}</span> images</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-terracotta" />
          <span><span className="tabular-nums text-encre">{documented}</span> étape documentée{documented > 1 ? "s" : ""}</span>
        </p>
      </div>
    </section>
  );
}
