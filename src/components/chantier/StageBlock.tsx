"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { STATUS_LABEL, type Media, type Stage } from "@/content/types";

// Asymmetric rhythm: one wide image, then alternating tall / landscape pairs.
const LAYOUT = [
  "col-span-6 aspect-[16/9]",
  "col-span-6 aspect-[4/5] md:col-span-3",
  "col-span-6 aspect-[4/5] md:col-span-3 md:mt-20",
  "col-span-6 aspect-[4/3] md:col-span-4",
  "col-span-6 aspect-[3/4] md:col-span-2 md:-mt-10",
];
const layoutFor = (i: number) => (i === 0 ? LAYOUT[0] : LAYOUT[1 + ((i - 1) % 4)]);
// The grid shows one full rhythm; the last tile opens the viewer on the rest.
const MAX_TILES = LAYOUT.length;

const STATUS_STYLE = {
  realise: "bg-menthe text-foret",
  "en-cours": "bg-terracotta text-ivoire",
  "a-venir": "border border-encre/25 text-encre/70",
} as const;

type Props = {
  stage: Stage;
  number: number;
  total: number;
  onOpen: (media: Media[], index: number, label: string) => void;
};

const StageBlock = forwardRef<HTMLElement, Props>(function StageBlock({ stage, number, total, onOpen }, ref) {
  const n = String(number).padStart(2, "0");
  const hasMedia = stage.media.length > 0 || (stage.videos?.length ?? 0) > 0;

  return (
    <article
      ref={ref}
      id={stage.slug}
      data-stage-block
      aria-labelledby={`${stage.slug}-title`}
      className="relative grid scroll-mt-24 grid-cols-12 gap-x-[var(--gutter)] gap-y-8 border-t border-encre/15 py-16 md:py-24"
    >
      {/* Dot sitting on the vertical rail */}
      <span
        data-stage-dot
        aria-hidden="true"
        className={`absolute -left-8 -top-[7px] h-[13px] md:-left-14 w-[13px] rounded-full border-2 border-ivoire ${
          stage.status === "realise" ? "bg-foret" : stage.status === "en-cours" ? "bg-terracotta" : "bg-sable"
        }`}
      />

      <header className="col-span-12 md:col-span-4">
        <div className="md:sticky md:top-28">
          <p className="eyebrow text-pierre">
            Étape {n} <span className="text-encre/30">/ {String(total).padStart(2, "0")}</span>
          </p>
          <p data-stage-num aria-hidden="true" className="outline-text mt-4 text-[clamp(5.5rem,12vw,11rem)] leading-[0.8] text-sauge [--stroke:2px]">
            {n}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] ${STATUS_STYLE[stage.status]}`}>
              {STATUS_LABEL[stage.status]}
            </span>
            {stage.source === "demo" && (
              <span className="rounded-full border border-dashed border-terracotta px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-terracotta">
                Exemple
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-encre/60">
            {stage.publishedAt
              ? new Date(stage.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
              : stage.dateLabel ?? "Date à venir"}
          </p>
        </div>
      </header>

      <div className="col-span-12 md:col-span-8">
        <h2 id={`${stage.slug}-title`} data-stage-title className="display text-[clamp(2.4rem,5.4vw,5.6rem)]">
          {stage.title}
        </h2>
        <p data-stage-fade className="mt-6 max-w-2xl text-lg leading-relaxed text-encre/75">
          {stage.description}
        </p>

        {stage.highlights && (
          <ul data-stage-fade className="mt-8 grid max-w-2xl gap-x-8 sm:grid-cols-2">
            {stage.highlights.map((h) => (
              <li key={h} className="flex gap-3 border-t border-encre/10 py-3 text-sm text-encre/80">
                <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                {h}
              </li>
            ))}
          </ul>
        )}

        {hasMedia ? (
          <div className="mt-12 grid grid-cols-6 gap-3 md:gap-4">
            {stage.media.slice(0, MAX_TILES).map((m, i) => {
              const more = i === MAX_TILES - 1 ? stage.media.length - MAX_TILES : 0;
              return (
              <button
                key={m.src}
                type="button"
                data-media
                onClick={() => onOpen(stage.media, i, stage.title)}
                aria-label={more > 0 ? `Voir les ${stage.media.length} photographies de l'étape` : `Agrandir : ${m.caption ?? m.alt}`}
                className={`group relative overflow-hidden bg-ivoire ${layoutFor(i)}`}
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  quality={80}
                  sizes={i === 0 ? "(min-width: 768px) 62vw, 100vw" : "(min-width: 768px) 32vw, 100vw"}
                  className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-encre/70 to-transparent p-4 text-left text-xs text-ivoire opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span>{m.caption ?? m.alt}</span>
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivoire text-encre">+</span>
                </span>
                {more > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-foret/70 text-ivoire transition-colors duration-500 group-hover:bg-foret/80">
                    <span className="text-center">
                      <span className="display block text-[clamp(2.4rem,4vw,3.6rem)] leading-none">+{more}</span>
                      <span className="eyebrow mt-2 block text-ivoire/75">photos</span>
                    </span>
                  </span>
                )}
              </button>
              );
            })}
            {stage.videos?.map((v) => (
              <figure key={v.src} className="col-span-6">
                <video controls preload="none" poster={v.poster} className="aspect-video w-full rounded-[2px] bg-encre">
                  <source src={v.src} />
                </video>
                <figcaption className="mt-3 text-sm text-encre/60">{v.title}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div data-stage-fade className="mt-12 flex items-center gap-6 rounded-[2px] border border-dashed border-encre/20 p-6 md:gap-10 md:p-10">
            <svg viewBox="0 0 60 80" className="h-20 w-16 shrink-0 text-sable" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path data-arch-path d="M2 78V30a28 28 0 0 1 56 0v48Z" />
            </svg>
            <p className="max-w-md text-sm leading-relaxed text-encre/60">
              Les photographies et vidéos de cette étape seront publiées ici au fil du chantier.
            </p>
          </div>
        )}
      </div>
    </article>
  );
});

export default StageBlock;
