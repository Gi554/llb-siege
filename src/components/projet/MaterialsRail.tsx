"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Material } from "@/content/types";

// Mint diagonal backdrop with the façade materials shown as round swatches.
export default function MaterialsRail({ materials }: { materials: Material[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-mr-shape]", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 1.4, ease: "expo.inOut" })
          .from("[data-mr-head] > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.3)
          .from("[data-mr-item]", { scale: 0.85, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.45);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Les matériaux de façade" className="relative overflow-hidden bg-blanc py-20 md:py-28">
      <span
        data-mr-shape
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[85%] bg-menthe md:w-[34%]"
        style={{ clipPath: "polygon(0 0, 55% 0, 100% 100%, 0 100%)" }}
      />
      <div className="relative grid gap-14 md:grid-cols-[34%_1fr] md:items-center">
        <div data-mr-head className="pl-[var(--gutter)] pr-8 md:pl-[max(var(--gutter),7vw)]">
          <span aria-hidden="true" className="block h-px w-full max-w-[12rem] bg-terracotta" />
          <h2 className="display mt-8 text-[clamp(2.3rem,3.4vw,3rem)] leading-[1] text-encre">
            Une palette
            <br />
            de matériaux
          </h2>
          <p className="mt-6 max-w-[17rem] text-[13px] text-encre/75">
            Une palette volontairement sobre, qui donne au bâtiment une expression contemporaine tout en favorisant son
            intégration à Calavi.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 px-[var(--gutter)] sm:grid-cols-4 md:pl-0">
          {materials.map((m) => (
            <li key={m.name} data-mr-item className="text-center">
              <div className="relative mx-auto aspect-square w-[min(38vw,170px)] overflow-hidden rounded-full shadow-[0_20px_40px_rgba(20,31,28,.12)]" style={{ backgroundColor: m.tone }}>
                <Image src={m.texture} alt="" fill sizes="170px" className="object-cover" />
              </div>
              <h3 className="display mt-6 text-[1.35rem] leading-tight text-encre">{m.name}</h3>
              <p className="mx-auto mt-2 max-w-[13rem] text-[12px] leading-relaxed text-encre/70">{m.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
