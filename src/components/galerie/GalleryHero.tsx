"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import type { GalleryItem } from "@/content/types";

// Floating collage around the title; each frame drifts at its own speed.
const FRAMES = [
  { id: "patio", cls: "left-[4%] top-[18%] w-[22vw] aspect-[3/4] md:w-[15vw]", speed: -30 },
  { id: "librairie-hd", cls: "right-[5%] top-[12%] w-[30vw] aspect-[4/3] md:w-[20vw]", speed: -55 },
  { id: "jardin", cls: "left-[14%] bottom-[8%] w-[26vw] aspect-[4/3] md:w-[17vw]", speed: -80 },
  { id: "direction", cls: "right-[12%] bottom-[14%] w-[20vw] aspect-[4/5] md:w-[12vw]", speed: -40 },
];

export default function GalleryHero({ items, documented }: { items: GalleryItem[]; documented: number }) {
  const root = useRef<HTMLElement>(null);
  const byId = (id: string) => items.find((i) => i.id === id)!;

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
    <section ref={root} data-header="on-light" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ivoire">
      {FRAMES.map((f) => {
        const m = byId(f.id);
        return (
          <div key={f.id} data-gh-frame data-speed={f.speed} className={`absolute overflow-hidden rounded-[2px] ${f.cls}`} style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
            <Image src={m.src} alt="" fill priority sizes="(min-width: 768px) 22vw, 32vw" className="object-cover" />
          </div>
        );
      })}

      <div data-gh-title className="relative flex h-full flex-col items-center justify-center px-[var(--gutter)] text-center">
        <p data-gh-fade className="eyebrow text-terracotta">Le projet en images</p>
        <h1 className="display mt-5 text-[clamp(4.5rem,19vw,20rem)] leading-[0.82]">
          <span className="line-mask"><span data-gh-line>Gale<em className="italic text-terracotta">rie</em></span></span>
        </h1>
        <p data-gh-fade className="mt-8 max-w-md text-encre/70">
          Perspectives, plans et, bientôt, photographies du chantier : toutes les images du futur siège réunies.
        </p>
        <p data-gh-fade className="mt-6 flex items-center gap-4 text-sm text-encre/60">
          <span><span className="tabular-nums text-encre">{items.length}</span> images</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-or" />
          <span><span className="tabular-nums text-encre">{documented}</span> étape documentée{documented > 1 ? "s" : ""}</span>
        </p>
      </div>
    </section>
  );
}
