"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { images } from "@/content/projet";

// Warm band: outlined title on the left, two staggered pictures breaking out of it.
export default function LookAround() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-la-title] > span", { yPercent: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" })
          .from("[data-la-rule]", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.out" }, 0.3)
          .from("[data-la-text]", { y: 20, opacity: 0, duration: 0.9 }, 0.45);
        gsap.fromTo("[data-la-a]", { yPercent: 12 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo("[data-la-b]", { yPercent: 30 }, { yPercent: -5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Visiter le siège" className="relative bg-blanc pt-10 md:pt-24">
      <div className="relative bg-ocre pb-20 pt-16 md:pb-0 md:pt-0">
        <div className="container-site relative grid gap-12 md:min-h-[560px] md:grid-cols-12">
          <div className="relative z-10 flex flex-col justify-center md:col-span-5 md:py-24">
            <h2 data-la-title className="outline-text stroke-ink text-[clamp(4rem,8.7vw,7.8rem)] [--stroke:2.5px]">
              <span className="block">Visitez</span>
              <span className="block">le siège</span>
            </h2>
            <span data-la-rule aria-hidden="true" className="mt-10 block h-[2px] w-[180px] bg-encre" />
            <div data-la-text>
              <p className="mono mt-8 max-w-[19rem] text-[13px] text-encre/85">
                De la vitrine de la librairie au patio planté, parcourez les espaces imaginés pour accueillir, partager et
                transmettre.
              </p>
              <Link href="/galerie" className="mt-6 inline-flex items-center gap-2 font-display text-[15px] font-semibold text-encre">
                Voir la galerie <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>

          <div className="relative h-[460px] md:col-span-7 md:h-auto">
            <figure data-la-a className="absolute left-0 top-0 w-[48%] md:-top-24 md:left-[4%] md:w-[40%]">
              <div className="relative aspect-[3/4] overflow-hidden shadow-[0_30px_60px_rgba(20,31,28,.18)]">
                <Image src={images.patio.src} alt={images.patio.alt} fill sizes="(min-width: 768px) 70vw, 140vw" className="object-cover object-[45%_50%]" />
              </div>
              <figcaption className="absolute -right-6 bottom-0 rotate-180 whitespace-nowrap font-sans text-[12px] text-encre/80 [writing-mode:vertical-rl]">
                Le patio central
              </figcaption>
            </figure>
            <figure data-la-b className="absolute bottom-0 right-0 w-[56%] md:bottom-10 md:w-[46%]">
              <div className="relative aspect-[4/5] overflow-hidden shadow-[0_30px_60px_rgba(20,31,28,.18)]">
                <Image src={images.jardin.src} alt={images.jardin.alt} fill sizes="(min-width: 768px) 78vw, 155vw" className="object-cover object-[60%_50%]" />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
