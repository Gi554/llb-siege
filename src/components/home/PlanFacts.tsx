"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { facts, images, materials, planRooms } from "@/content/projet";
import Reveal, { Lines } from "@/components/ui/Reveal";

export default function PlanFacts() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
          const to = Number(el.dataset.countTo);
          const o = { v: 0 };
          gsap.to(o, {
            v: to,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, "0")),
          });
        });
        gsap.fromTo("[data-plan-img]", { scale: 1.6, rotate: -4 }, {
          scale: 1.08,
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-plan]", start: "top bottom", end: "center center", scrub: true },
        });
        gsap.from("[data-swatch]", {
          clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)",
          duration: 1.4,
          ease: "expo.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-swatches]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-light" aria-label="Le plan et les matériaux" className="bg-lin py-[clamp(6rem,12vw,11rem)]">
      <div className="wrap grid grid-cols-12 gap-x-[var(--gutter)] gap-y-14">
        {/* Plan */}
        <div className="col-span-12 lg:col-span-6">
          <Reveal className="flex items-center gap-4">
            <span className="eyebrow text-terracotta">04</span>
            <span className="h-px w-10 bg-encre/25" />
            <span className="eyebrow text-pierre">Le plan</span>
          </Reveal>
          <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.6rem,5.6vw,5.6rem)]">
            <Lines text={"Tout s'organise\nautour du patio."} />
          </Reveal>
          <Reveal className="mt-10 max-w-lg" delay={0.15}>
            <ul className="flex flex-wrap gap-2">
              {planRooms.map((r) => (
                <li key={r} className="rounded-full border border-encre/15 px-4 py-2 text-sm text-encre/75">
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <dl className="mt-16 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 border-t border-encre/15 pt-10">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span data-count-to={f.value} className="display block text-[clamp(3.5rem,7vw,6.5rem)] leading-none tabular-nums text-terracotta">
                    {String(f.value).padStart(2, "0")}
                  </span>
                  <span className="mt-3 block font-medium">{f.label}</span>
                  <span className="mt-1 block text-sm text-encre/60">{f.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure data-plan className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-[2px] bg-white lg:col-span-6 lg:aspect-auto lg:min-h-[44rem]">
          <Image data-plan-img src={images.plan.src} alt={images.plan.alt} fill quality={85} sizes="(min-width: 1024px) 85vw, 170vw" className="object-cover object-[50%_50%]" />
          <figcaption className="eyebrow absolute bottom-4 left-4 rounded-full bg-ivoire/90 px-3 py-1.5 text-[0.62rem] text-encre/70 backdrop-blur">
            Plan aménagé RDC — NPS GROUP
          </figcaption>
        </figure>

        {/* Materials */}
        <div className="col-span-12 mt-10 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10 border-t border-encre/15 pt-14 md:mt-20">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow text-pierre">Matériaux de façade</p>
            <Reveal as="h3" mode="lines" className="display mt-5 text-[clamp(2rem,3.6vw,3.4rem)]">
              <Lines text={"Une palette sobre,\nancrée dans Cotonou."} />
            </Reveal>
          </div>
          <ul data-swatches className="col-span-12 grid grid-cols-2 gap-[var(--gutter)] md:col-span-8 md:grid-cols-4">
            {materials.map((m) => (
              <li key={m.name} className="group">
                <div
                  data-swatch
                  className="relative aspect-[3/4] overflow-hidden rounded-t-full"
                  style={{ backgroundColor: m.tone, clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)" }}
                >
                  <Image src={m.texture} alt="" fill sizes="(min-width: 768px) 16vw, 45vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
                </div>
                <p className="mt-4 font-medium leading-snug">{m.name}</p>
                <p className="mt-1 text-sm text-encre/60">{m.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
