"use client";

import NewsCard from "@/components/actualites/NewsCard";
import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { NewsItem } from "@/content/types";

export default function Journal({ items }: { items: NewsItem[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-jn-title] > span", { yPercent: 30, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        gsap.from("[data-jn-card]", { y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "[data-jn-grid]", start: "top 85%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Actualités" className="relative bg-blanc">
      {/* mint slanted strip, as a seam between white and the beige block */}
      <span aria-hidden="true" className="absolute left-0 top-0 h-14 w-[16%] bg-menthe" style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }} />
      <div className="bg-ivoire pb-28 pt-24">
        <div className="container-site">
          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-5 md:pb-6">
              <p className="font-mono text-[17px] text-encre/60">À la une</p>
              <span className="mt-6 block h-px w-[215px] bg-encre/60" aria-hidden="true" />
            </div>
            <h2 data-jn-title className="outline-text text-[clamp(4rem,8vw,7.2rem)] text-foret [--stroke:1.8px] md:col-span-7">
              <span className="block">Les</span>
              <span className="block">actualités</span>
            </h2>
          </div>

          <ul data-jn-grid className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {items.map((n) => (
              <li key={n.slug} data-jn-card>
                <NewsCard item={n} />
              </li>
            ))}
          </ul>

          <div className="mt-14 flex justify-center">
            <Link href="/actualites" className="pill h-[58px] bg-foret px-7 text-[16px] text-blanc hover:bg-foret-2">
              Toutes les actualités
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
