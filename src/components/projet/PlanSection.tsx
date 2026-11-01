"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Media } from "@/content/types";
import Lightbox from "@/components/Lightbox";

type Fact = { value: number; label: string; note: string };

// Outlined title, the ground-floor plan, its rooms and key figures.
export default function PlanSection({ plan, rooms, facts }: { plan: Media; rooms: string[]; facts: Fact[] }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-pl-title] > span", { yPercent: 30, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        gsap.from("[data-pl-room]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: "[data-pl-rooms]", start: "top 85%", once: true } });
        gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, {
            v: Number(el.dataset.countTo),
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, "0")),
          });
        });
        gsap.fromTo("[data-pl-img]", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-pl-fig]", start: "top bottom", end: "center center", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="plan" aria-label="Le plan" className="scroll-mt-24 bg-blanc py-24 md:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-pl-title className="outline-text stroke-ink text-[clamp(4rem,8vw,7.2rem)] [--stroke:2.5px]">
            <span className="block">le plan</span>
          </h2>
          <span aria-hidden="true" className="mt-8 block h-[2px] w-[180px] bg-encre" />
          <p className="mono mt-8 max-w-sm text-[13px] text-encre/80">
            Librairie, bureaux, salle de réunion et de conférence s&apos;articulent autour d&apos;un patio central, dans un cadre
            paysager de jardins et de terrasses.
          </p>
          <ul data-pl-rooms className="mt-8 flex flex-wrap gap-2">
            {rooms.map((r) => (
              <li key={r} data-pl-room className="rounded-full border border-encre/20 px-4 py-2 text-[13px] text-encre/80">
                {r}
              </li>
            ))}
          </ul>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col border-t border-encre/60 pt-4">
                <dt className="order-2 mt-2 font-sans text-[15px] font-medium text-encre">{f.label}</dt>
                <dd data-count-to={f.value} className="display order-1 text-[3.2rem] leading-none tabular-nums text-foret">
                  {String(f.value).padStart(2, "0")}
                </dd>
                <dd className="mono order-3 mt-1 text-[12px] text-encre/65">{f.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure data-pl-fig className="lg:col-span-7">
          <button
            type="button"
            onClick={() => setOpen(0)}
            aria-label="Agrandir le plan aménagé du rez-de-chaussée"
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-ivoire"
          >
            <Image data-pl-img src={plan.src} alt={plan.alt} fill quality={85} sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain p-2" />
            <span className="pill absolute bottom-4 right-4 h-11 bg-foret px-5 text-[13px] text-blanc group-hover:bg-foret-2">Agrandir le plan</span>
          </button>
          <figcaption className="mt-3 text-[12px] text-encre/60">Plan aménagé du rez-de-chaussée — NPS GROUP</figcaption>
        </figure>
      </div>

      <Lightbox items={[plan]} index={open} label="Le plan" onClose={() => setOpen(null)} />
    </section>
  );
}
