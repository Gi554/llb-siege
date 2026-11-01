"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { NEWS_CATEGORIES, type NewsItem } from "@/content/types";
import NewsCard from "./NewsCard";

const ALL = "Toutes";

export default function NewsList({ items }: { items: NewsItem[] }) {
  const root = useRef<HTMLElement>(null);
  const [cat, setCat] = useState<string>(ALL);
  const featured = items.find((n) => n.source !== "demo") ?? items[0];
  const rest = useMemo(
    () => items.filter((n) => n !== featured && (cat === ALL || n.category === cat)),
    [items, featured, cat],
  );
  const showFeatured = cat === ALL || featured.category === cat;
  const count = (c: string) => (c === ALL ? items.length : items.filter((n) => n.category === c).length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-nl-title] > span", { yPercent: 30, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        gsap.from("[data-nl-feat]", { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "[data-nl-feat]", start: "top 85%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Cards fade in each time the filter changes.
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo("[data-nl-card]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" });
    },
    { scope: root, dependencies: [cat] },
  );

  return (
    <section ref={root} id="a-la-une" aria-label="Toutes les actualités" className="scroll-mt-24 bg-ivoire pb-28 pt-24">
      <div className="container-site">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-5 md:pb-6">
            <p className="font-mono text-[17px] text-encre/60">Le journal</p>
            <span className="mt-6 block h-px w-[215px] bg-encre/60" aria-hidden="true" />
          </div>
          <h2 data-nl-title className="outline-text text-[clamp(4rem,8vw,7.2rem)] text-foret [--stroke:1.8px] md:col-span-7">
            <span className="block">les</span>
            <span className="block">actualités</span>
          </h2>
        </div>

        <div role="group" aria-label="Filtrer par catégorie" className="mt-14 flex flex-wrap gap-2">
          {[ALL, ...NEWS_CATEGORIES].map((c) => {
            const on = cat === c;
            const n = count(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                disabled={n === 0}
                onClick={() => setCat(c)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 disabled:opacity-35 ${
                  on ? "border-foret bg-foret text-blanc" : "border-encre/20 hover:border-foret"
                }`}
              >
                {c}
                <span className={`text-xs tabular-nums ${on ? "text-blanc/60" : "text-encre/45"}`}>{n}</span>
              </button>
            );
          })}
        </div>

        {showFeatured && (
          <article data-nl-feat className="group mt-12 grid overflow-hidden bg-blanc md:grid-cols-2">
            <Link href={`/actualites/${featured.slug}`} className="relative block aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[440px]">
              <Image src={featured.image.src} alt={featured.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </Link>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-[11px] uppercase tracking-[0.12em] text-terracotta">À la une · {featured.category}</p>
              <p className="mt-2 text-[12px] text-encre/55">{featured.dateLabel}</p>
              <h3 className="display mt-6 text-[clamp(2rem,3vw,2.8rem)] leading-[1.02] text-encre">{featured.title}</h3>
              <p className="mono mt-6 text-[13px] text-encre/80">{featured.excerpt}</p>
              <div className="mt-10">
                <Link href={`/actualites/${featured.slug}`} className="pill h-[54px] bg-foret px-7 text-[15px] text-blanc hover:bg-foret-2">
                  Lire l&apos;article
                </Link>
              </div>
            </div>
          </article>
        )}

        {rest.length > 0 && (
          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {rest.map((n) => (
              <li key={n.slug} data-nl-card>
                <NewsCard item={n} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
