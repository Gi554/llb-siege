"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Viewpoint } from "@/content/types";
import BeforeAfter from "@/components/BeforeAfter";
import Lightbox from "@/components/Lightbox";
import Reveal, { Lines } from "@/components/ui/Reveal";

export default function Viewpoints({ items }: { items: Viewpoint[] }) {
  const root = useRef<HTMLElement>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const waiting = items.filter((v) => !v.photo).length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch("[data-vp]", {
          start: "top 90%",
          once: true,
          onEnter: (els) => {
            gsap.from(els, { y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" });
            gsap.from(els.map((e) => e.querySelector("[data-vp-pending]")), {
              scaleX: 0,
              transformOrigin: "right",
              duration: 1.3,
              stagger: 0.1,
              delay: 0.3,
              ease: "expo.inOut",
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-light" aria-label="Points de vue suivis" className="bg-lin py-[clamp(6rem,12vw,11rem)]">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal className="flex items-center gap-4">
              <span className="eyebrow text-terracotta">02</span>
              <span className="h-px w-10 bg-encre/25" />
              <span className="eyebrow text-pierre">Points de vue suivis</span>
            </Reveal>
            <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.6rem,5.6vw,5.6rem)]">
              <Lines text={`${items.length} angles,`} />
              <Lines text="photographiés à chaque étape." className="italic text-terracotta" />
            </Reveal>
          </div>
          <Reveal className="text-encre/70 md:col-span-4 md:col-start-9 md:self-end" delay={0.15}>
            <p>
              Chaque perspective du dossier devient un point de vue fixe. Au fil du chantier, la photographie prise au même
              endroit viendra se placer face au rendu.
            </p>
            <p className="mt-4 text-sm text-encre/50">
              {waiting === items.length ? "Aucune photographie n'est encore publiée." : `${items.length - waiting} sur ${items.length} déjà photographiés.`}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map((v, i) => (
            <li key={v.slug} data-vp className={i % 3 === 1 ? "lg:mt-16" : undefined}>
              {v.photo ? (
                <BeforeAfter
                  frameClass="aspect-[4/3]"
                  comparison={{
                    slug: v.slug,
                    title: v.title,
                    before: { ...v.render, label: "Rendu" },
                    after: { ...v.photo, label: "Photo", date: v.photo.date },
                    source: "projet",
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setViewer(i)}
                  aria-label={`Voir le rendu : ${v.title}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-sable"
                >
                  <Image src={v.render.src} alt={v.render.alt} fill sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                  {/* The half that will hold the site photograph */}
                  <span
                    data-vp-pending
                    className="absolute inset-y-0 right-0 flex w-[42%] flex-col items-center justify-center gap-2 border-l-2 border-ivoire bg-[repeating-linear-gradient(135deg,rgba(243,238,229,.94)_0_10px,rgba(233,225,211,.94)_10px_20px)] px-3 text-center transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-[30%]"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-terracotta" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                      <circle cx="12" cy="13" r="3.5" />
                    </svg>
                    <span className="text-[0.68rem] font-medium uppercase leading-tight tracking-[0.12em] text-encre/70">Photo à venir</span>
                  </span>
                  <span className="eyebrow absolute left-3 top-3 rounded-full bg-encre/70 px-2.5 py-1 text-[0.6rem] text-ivoire backdrop-blur">Rendu</span>
                </button>
              )}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="display text-[clamp(1.4rem,2vw,1.9rem)] leading-none">
                  <span className="mr-3 align-middle font-sans text-xs tabular-nums text-encre/40">{String(i + 1).padStart(2, "0")}</span>
                  {v.title}
                </h3>
                <span className="text-xs text-encre/50">{v.espace}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox items={items.map((v) => v.render)} index={viewer} label="Points de vue" onClose={() => setViewer(null)} />
    </section>
  );
}
