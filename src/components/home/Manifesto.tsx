"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { images, projet } from "@/content/projet";
import Reveal from "@/components/ui/Reveal";

// Words wrapped in *asterisks* are set in italic terracotta.
const STATEMENT =
  "Un lieu pensé pour *l'accueil,* la *sérénité,* le *partage* et la *transmission.* Un siège de plain-pied où librairie, bureaux et salle de conférence s'organisent autour d'un patio central, au milieu des jardins.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-detail-img]",
          { scale: 1.25, yPercent: -6 },
          { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: "[data-detail]", start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from("[data-detail]", {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-detail]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projet" data-header="on-light" className="relative bg-ivoire py-[clamp(6rem,14vw,13rem)]">
      <div className="wrap grid grid-cols-12 gap-x-[var(--gutter)] gap-y-12">
        <div className="col-span-12 md:col-span-3">
          <Reveal className="flex items-center gap-4">
            <span className="eyebrow text-terracotta">01</span>
            <span className="h-px w-10 bg-encre/25" />
            <span className="eyebrow text-pierre">Le projet</span>
          </Reveal>
        </div>

        <p data-statement className="display col-span-12 text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.06] md:col-span-9">
          {STATEMENT.split(" ").map((w, i) => {
            const accent = w.startsWith("*");
            const clean = w.replaceAll("*", "");
            return (
              <span key={i} data-word className={accent ? "italic text-terracotta" : undefined}>
                {clean}{" "}
              </span>
            );
          })}
        </p>

        <div className="col-span-12 mt-10 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10 md:mt-24">
          <div data-detail className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-[2px] md:col-span-5 md:col-start-2" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
            <Image data-detail-img src={images.facadeDetail.src} alt={images.facadeDetail.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          </div>
          <div className="col-span-12 flex flex-col justify-end md:col-span-5 md:col-start-8">
            <Reveal>
              <p className="text-lg leading-relaxed text-encre/80">{projet.descriptif[0]}</p>
              <p className="mt-5 leading-relaxed text-encre/60">{projet.descriptif[1]}</p>
              <Link href="/projet" className="group mt-10 inline-flex items-center gap-4 text-sm font-medium">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-encre/20 transition-colors duration-500 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-ivoire">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
                <span className="link-underline pb-0.5">Découvrir le projet</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
