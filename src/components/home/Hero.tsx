"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";
import { images, projet } from "@/content/projet";

// Split hero: deep green panel with the message, photograph on the right.
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.from("[data-hero-img]", { scale: 1.12, duration: 1.8, ease: "expo.out" })
          .from("[data-hero-fade]", { y: 28, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.15);
        return onReady(() => tl.play());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-split-hero className="relative bg-blanc">
      <div className="grid min-h-[calc(100svh-var(--header-h)-44px)] md:grid-cols-[34%_1fr]">
        <div className="relative z-10 flex flex-col justify-center bg-foret px-[var(--gutter)] py-16 text-blanc md:py-12 md:pl-[max(var(--gutter),7vw)] md:pr-[3vw]">
          <p data-hero-fade className="font-display text-[15px] font-medium">
            {projet.city}, {projet.country}
          </p>
          <h1 data-hero-fade className="display mt-4 text-[clamp(2.8rem,4vw,3.6rem)] text-menthe">
            Une vision prend vie.
          </h1>
          <p data-hero-fade className="mono mt-8 max-w-[22rem] text-blanc/90">
            Le futur siège de la Ligue pour la Lecture de la Bible : une librairie, des bureaux, une salle de conférence et
            un patio planté, réunis de plain-pied au cœur de Cotonou.
          </p>
          <div data-hero-fade className="mt-12">
            <Link href="/projet" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
              Découvrir le projet
            </Link>
          </div>
        </div>

        <div className="relative min-h-[60vh] overflow-hidden md:min-h-0">
          <div data-hero-img className="absolute inset-0">
            <Image
              src={images.facade.src}
              alt={images.facade.alt}
              fill
              priority
              unoptimized
              className="object-cover object-[66%_50%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
