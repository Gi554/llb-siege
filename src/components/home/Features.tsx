"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { images } from "@/content/projet";

const FEATURES = [
  {
    title: "Une librairie ouverte",
    text: "Ouverte sur la rue par une large vitrine, elle accueille le public et donne à voir la mission de la Ligue.",
  },
  {
    title: "Des bureaux réunis",
    text: "Direction, secrétariat et ministère biblique travaillent de plain-pied, autour d'un même cœur.",
  },
  {
    title: "Se réunir, transmettre",
    text: "Une salle de réunion et de conférence pour former, partager et accueillir les rencontres.",
  },
  {
    title: "Un patio, des jardins",
    text: "Un patio planté au centre du bâtiment, prolongé par des jardins, une pergola et des terrasses.",
  },
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-feat]", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from("[data-feat-rule]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.fromTo("[data-feat-main]", { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo("[data-feat-card]", { yPercent: 25 }, { yPercent: -15, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Le futur siège" className="overflow-hidden bg-blanc py-24 md:py-36">
      <div className="container-site grid items-center gap-16 lg:grid-cols-12">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:col-span-6">
          {FEATURES.map((f) => (
            <article key={f.title} data-feat>
              <span data-feat-rule aria-hidden="true" className="block h-px w-full bg-encre/70" />
              <h2 className="mt-4 font-sans text-[clamp(1.4rem,1.9vw,1.65rem)] font-medium leading-tight text-encre">{f.title}</h2>
              <p className="mono mt-4 text-[13px] text-encre/80">{f.text}</p>
            </article>
          ))}
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:col-span-6">
          <div data-feat-main className="absolute right-0 top-0 h-[85%] w-[78%] overflow-hidden">
            <Image src={images.librairieHd.src} alt={images.librairieHd.alt} fill sizes="(min-width: 1024px) 70vw, 150vw" className="object-cover" />
          </div>
          <figure data-feat-card className="absolute bottom-0 left-0 w-[62%] overflow-hidden bg-foret shadow-[0_30px_60px_rgba(6,37,33,.25)]">
            <div className="relative aspect-[16/10]">
              <Image src={images.conference.src} alt={images.conference.alt} fill sizes="(min-width: 1024px) 42vw, 84vw" className="object-cover" />
            </div>
            <figcaption className="flex items-center gap-3 px-4 py-3 text-blanc">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-menthe text-foret">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <span className="font-display text-[15px] font-medium leading-tight">
                Salle de conférence
                <span className="block font-sans text-[11px] font-normal text-blanc/60">Perspective 4 — NPS GROUP</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
