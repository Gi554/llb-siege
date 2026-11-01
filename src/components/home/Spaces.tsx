"use client";

import Image from "next/image";
import { useRef } from "react";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { spaces } from "@/content/projet";
import Reveal, { Lines } from "@/components/ui/Reveal";

export default function Spaces() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: the cards travel horizontally while the section is pinned.
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const move = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-spaces-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-space-img]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -10 }, {
            xPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          });
        });
        gsap.to("[data-spaces-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-spaces-pin]", start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });

      // Mobile: each card simply rises into view.
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-space]").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1.2, scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="espaces" data-header="on-dark" aria-label="Les espaces du futur siège"className="grain relative bg-foret text-ivoire">
      <div data-spaces-pin className="relative flex flex-col overflow-hidden pt-[clamp(6rem,12vw,10rem)] pb-16 md:h-[100svh] md:pt-28 md:pb-10">
        <div className="wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="eyebrow text-or">03</span>
              <span className="h-px w-10 bg-ivoire/25" />
              <span className="eyebrow text-ivoire/60">Les espaces</span>
            </Reveal>
            <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.8rem,7vw,7.5rem)]">
              <Lines text={"Sept lieux,\nune même âme."} />
            </Reveal>
          </div>
          <Reveal className="max-w-sm text-ivoire/70 md:pb-3" delay={0.2}>
            <p>De la vitrine sur rue aux jardins, découvrez les espaces imaginés par NPS GROUP à travers les perspectives du dossier architectural.</p>
          </Reveal>
        </div>

        <div className="mt-12 flex-1 md:mt-10 md:min-h-0">
          <div ref={track} className="wrap flex h-full flex-col gap-14 md:w-max md:flex-row md:items-stretch md:gap-[3vw] md:pr-[12vw]">
            {spaces.map((s) => (
              <article key={s.slug} data-space className="group flex flex-col md:h-full md:w-[min(58vw,118vh)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] md:aspect-auto md:min-h-0 md:flex-1">
                  <Image
                    data-space-img
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    quality={85}
                    sizes="(min-width: 768px) 75vw, 130vw"
                    className="scale-[1.22] object-cover transition-[filter] duration-700 md:scale-[1.22]"
                  />
                </div>
                <div className="mt-5 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 md:mt-6">
                  <span className="eyebrow tabular-nums text-or">{s.index}</span>
                  <h3 className="display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none">{s.title}</h3>
                  <p className="col-start-2 max-w-md text-sm leading-relaxed text-ivoire/65">{s.lede}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="wrap mt-8 hidden md:block">
          <div className="h-px w-full bg-ivoire/15">
            <div data-spaces-progress className="h-px origin-left scale-x-0 bg-or" />
          </div>
        </div>
      </div>
    </section>
  );
}
