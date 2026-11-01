"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import { images, projet } from "@/content/projet";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({ paused: true });
        intro
          .fromTo("[data-hero-media]", { scale: 1.35 }, { scale: 1, duration: 2.4, ease: "expo.out" })
          .from("[data-hero-line]", { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.15)
          .from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.6)
          .from("[data-hero-badge]", { scale: 0, rotate: -90, duration: 1.4 }, 0.8);
        const off = onReady(() => intro.play());

        // On scroll the full-bleed image folds into a framed card.
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to("[data-hero-frame]", { clipPath: "inset(7% 4% 7% 4% round 28px)", ease: "none" }, 0)
          .to("[data-hero-img]", { yPercent: 18, ease: "none" }, 0)
          .to("[data-hero-copy]", { yPercent: -40, opacity: 0, ease: "none" }, 0);

        return off;
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ivoire text-ivoire">
      <div data-hero-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}>
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <div data-hero-img className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src={images.facade.src}
              alt={images.facade.alt}
              fill
              priority
              unoptimized
              className="object-cover object-[64%_55%]"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,38,32,.55)_0%,rgba(13,38,32,0)_32%,rgba(13,38,32,.15)_55%,rgba(13,38,32,.82)_100%)]" />
      </div>

      <div data-hero-copy className="wrap relative flex h-full flex-col justify-end pb-[max(2rem,5vh)]">
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:mb-10">
          <span data-hero-fade className="eyebrow text-ivoire/80">{projet.city}, {projet.country}</span>
          <span data-hero-fade className="h-px w-10 bg-ivoire/40" />
          <span data-hero-fade className="eyebrow text-ivoire/80">Futur siège de la LLB</span>
        </div>

        <h1 className="display text-[clamp(3.6rem,13.5vw,15.5rem)]">
          <span className="line-mask"><span data-hero-line>Une vision</span></span>
          <span className="line-mask">
            <span data-hero-line>
              prend <em className="font-normal italic text-or">vie.</em>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-md text-base leading-relaxed text-ivoire/85 md:text-lg">
            À Cotonou, la Ligue pour la Lecture de la Bible construit son nouveau siège. Suivez la naissance d&apos;un lieu
            dédié à l&apos;accueil, au partage et à la transmission.
          </p>
          <div data-hero-fade className="flex items-center gap-6">
            <span className="eyebrow hidden text-ivoire/60 md:inline">Défiler</span>
            <span className="relative block h-14 w-px overflow-hidden bg-ivoire/25">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-in-out-quart)_infinite] bg-ivoire" />
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/chantier"
        data-hero-badge
        aria-label="Suivre le chantier"
        className="group absolute right-[var(--gutter)] top-[22%] hidden h-32 w-32 place-items-center md:grid lg:h-36 lg:w-36"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_18s_linear_infinite] text-ivoire" aria-hidden="true">
          <defs>
            <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-current text-[8.4px] uppercase">
            <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">Suivre le chantier · Cotonou ·</textPath>
          </text>
        </svg>
        <span className="grid h-14 w-14 place-items-center rounded-full bg-terracotta text-ivoire transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-125">
          <svg viewBox="0 0 24 24" className="h-5 w-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
