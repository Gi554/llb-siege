"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { GalleryItem, GalleryKind } from "@/content/types";
import Lightbox from "@/components/Lightbox";

type Option = { slug: string; label: string };
type Props = {
  items: GalleryItem[];
  espaces: readonly Option[];
  kinds: { slug: GalleryKind; label: string }[];
  stages: { slug: string; title: string }[];
};
type Filters = { espace: string; etape: string; type: string; date: string };

const ALL = "tout";
const EMPTY: Filters = { espace: ALL, etape: ALL, type: ALL, date: ALL };
const PARAMS: (keyof Filters)[] = ["espace", "etape", "type", "date"];

// Editorial rhythm: desktop pattern of six, mobile alternates one wide / two tall.
const DESKTOP = [
  "md:col-span-7 md:aspect-[16/10]",
  "md:col-span-5 md:aspect-[4/5] md:mt-28",
  "md:col-span-4 md:aspect-[3/4]",
  "md:col-span-8 md:aspect-[16/9] md:mt-16",
  "md:col-span-5 md:col-start-2 md:aspect-square",
  "md:col-span-6 md:aspect-[4/3] md:mt-36",
];
const tileClass = (i: number) => {
  const mobile = i % 3 === 0 ? "col-span-12 aspect-[4/3]" : "col-span-6 aspect-[3/4]";
  return `${mobile} ${DESKTOP[i % DESKTOP.length]}`;
};

const matches = (g: GalleryItem, f: Filters) =>
  (f.espace === ALL || g.espace === f.espace) &&
  (f.etape === ALL || g.etape === f.etape) &&
  (f.type === ALL || g.kind === f.type) &&
  (f.date === ALL || g.dateLabel === f.date);

export default function Gallery({ items, espaces, kinds, stages }: Props) {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [viewer, setViewer] = useState<number | null>(null);
  const [showDock, setShowDock] = useState(false);
  const [more, setMore] = useState(false);

  const visible = useMemo(() => items.filter((g) => matches(g, filters)), [items, filters]);
  const dates = useMemo(() => [...new Set(items.map((g) => g.dateLabel))], [items]);
  const espaceLabel = (slug: string) => espaces.find((e) => e.slug === slug)?.label ?? slug;
  const kindLabel = (slug: string) => kinds.find((k) => k.slug === slug)?.label ?? slug;
  const active = PARAMS.filter((k) => filters[k] !== ALL).length;

  // How many images a value would show, given the other active filters.
  const countFor = (key: keyof Filters, value: string) => items.filter((g) => matches(g, { ...filters, [key]: value })).length;

  // Filters live in the URL so a filtered view can be shared.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next = { ...EMPTY };
    PARAMS.forEach((k) => q.get(k) && (next[k] = q.get(k)!));
    setFilters(next);
  }, []);

  const update = (patch: Partial<Filters>) => {
    if (grid.current && window.matchMedia(MOTION_OK).matches) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-g-item]"));
    }
    setFilters((f) => {
      const next = { ...f, ...patch };
      const q = new URLSearchParams();
      PARAMS.forEach((k) => next[k] !== ALL && q.set(k, next[k]));
      window.history.replaceState(null, "", q.size ? `?${q}` : window.location.pathname);
      return next;
    });
  };

  // Animate the reflow after a filter change.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-g-item]"),
      duration: 0.9,
      ease: "expo.inOut",
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.04, ease: "expo.out" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [visible]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch("[data-g-item]", {
          start: "top 92%",
          once: true,
          onEnter: (els) =>
            gsap.from(els, { clipPath: "inset(100% 0% 0% 0%)", y: 40, duration: 1.3, stagger: 0.1, ease: "expo.out", clearProps: "clipPath,transform" }),
        });
      });
      ScrollTrigger.create({
        trigger: "[data-g-grid-zone]",
        start: "top 30%",
        end: "bottom 70%",
        onToggle: (self) => setShowDock(self.isActive),
      });

      // "Voir" cursor that follows the pointer over images (fine pointers only).
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      gsap.set(cursor.current, { xPercent: -50, yPercent: -50, scale: 0 });
      const xTo = gsap.quickTo(cursor.current, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(cursor.current, "y", { duration: 0.45, ease: "power3" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  const showCursor = (on: boolean) => gsap.to(cursor.current, { scale: on ? 1 : 0, duration: 0.5, ease: "expo.out" });

  const scrollToFilters = () => {
    const el = root.current?.querySelector<HTMLElement>("[data-g-filters]");
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -24, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const select = (key: keyof Filters, label: string, options: Option[]) => (
    <label className="flex flex-col gap-2">
      <span className="eyebrow text-pierre">{label}</span>
      <span className="relative">
        <select
          value={filters[key]}
          onChange={(e) => update({ [key]: e.target.value })}
          className="w-full appearance-none rounded-full border border-encre/20 bg-transparent py-2.5 pl-4 pr-10 text-sm transition-colors hover:border-encre focus-visible:border-encre"
        >
          <option value={ALL}>Toutes</option>
          {options.map((o) => {
            const n = countFor(key, o.slug);
            return (
              <option key={o.slug} value={o.slug} disabled={n === 0}>
                {o.label} ({n})
              </option>
            );
          })}
        </select>
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </label>
  );

  return (
    <section ref={root} aria-label="Images du projet" className="bg-blanc pb-32">
      <div data-g-filters className="wrap border-t border-encre/15 pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="display text-[clamp(2rem,3.6vw,3.4rem)]">
            <span className="tabular-nums">{visible.length}</span> image{visible.length > 1 ? "s" : ""}
            {filters.espace !== ALL && <em className="italic text-terracotta"> · {espaceLabel(filters.espace)}</em>}
          </h2>
          {active > 0 && (
            <button type="button" onClick={() => update(EMPTY)} className="link-underline self-start pb-0.5 text-sm font-medium sm:self-auto">
              Réinitialiser les filtres ({active})
            </button>
          )}
        </div>

        <div role="group" aria-label="Filtrer par espace" className="-mx-[var(--gutter)] mt-8 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {[{ slug: ALL, label: "Tous les espaces" }, ...espaces].map((e) => {
            const on = filters.espace === e.slug;
            const n = countFor("espace", e.slug);
            return (
              <button
                key={e.slug}
                type="button"
                aria-pressed={on}
                disabled={n === 0}
                onClick={() => update({ espace: e.slug })}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-35 ${
                  on ? "border-foret bg-foret text-blanc" : "border-encre/20 hover:border-foret"
                }`}
              >
                {e.label}
                <span className={`text-xs tabular-nums ${on ? "text-ivoire/60" : "text-encre/45"}`}>{n}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMore((m) => !m)}
          aria-expanded={more}
          aria-controls="filtres-avances"
          className="mt-5 flex items-center gap-2 text-sm font-medium sm:hidden"
        >
          Plus de filtres{active - (filters.espace !== ALL ? 1 : 0) > 0 ? ` (${active - (filters.espace !== ALL ? 1 : 0)})` : ""}
          <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform duration-300 ${more ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div id="filtres-avances" className={`mt-6 gap-4 sm:grid sm:grid-cols-3 md:max-w-3xl ${more ? "grid" : "hidden"}`}>
          {select("etape", "Étape", stages.map((s) => ({ slug: s.slug, label: s.title })))}
          {select("type", "Type", kinds)}
          {select("date", "Date", dates.map((d) => ({ slug: d, label: d })))}
        </div>
      </div>

      <div data-g-grid-zone className="wrap mt-14 md:mt-20">
        {visible.length > 0 ? (
          <ul ref={grid} className="grid grid-cols-12 items-start gap-x-3 gap-y-8 md:gap-x-[var(--gutter)] md:gap-y-20">
            {visible.map((g, i) => (
              <li key={g.id} data-g-item data-flip-id={g.id} className={tileClass(i)}>
                <button
                  type="button"
                  onClick={() => setViewer(i)}
                  onPointerEnter={() => showCursor(true)}
                  onPointerLeave={() => showCursor(false)}
                  aria-label={`Ouvrir en plein écran : ${g.caption ?? g.alt}`}
                  className="group relative block h-full w-full overflow-hidden bg-ivoire md:cursor-none"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    quality={80}
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className={`transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${g.kind === "plan" ? "bg-white object-contain p-4" : "object-cover"}`}
                  />
                </button>
                <div className="mt-3 flex items-baseline justify-between gap-4 text-xs md:text-sm">
                  <p className="min-w-0 truncate text-encre/80">
                    <span className="mr-2 tabular-nums text-encre/40">{String(i + 1).padStart(2, "0")}</span>
                    {g.caption ?? g.alt}
                  </p>
                  <span className="hidden shrink-0 text-encre/45 sm:inline">{espaceLabel(g.espace)} · {kindLabel(g.kind)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="display text-3xl">Aucune image pour cette sélection.</p>
            <button type="button" onClick={() => update(EMPTY)} className="pill h-[52px] bg-foret px-6 text-sm text-blanc">
              Voir toutes les images
            </button>
          </div>
        )}
      </div>

      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-24 w-24 place-items-center rounded-full bg-terracotta text-sm font-medium text-ivoire md:grid"
        style={{ transform: "translate(-50%, -50%) scale(0)" }}
      >
        Voir
      </div>

      <div
        className={`fixed inset-x-0 bottom-4 z-30 flex justify-center transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] md:bottom-6 ${
          showDock ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={scrollToFilters}
          className="flex items-center gap-3 rounded-full bg-foret py-2 pl-5 pr-2 text-sm text-blanc shadow-[0_20px_60px_rgba(0,0,0,.25)] backdrop-blur-md"
        >
          <span className="tabular-nums">{visible.length} images</span>
          <span className="grid h-9 place-items-center rounded-full bg-menthe px-4 text-foret">
            Filtrer{active > 0 ? ` (${active})` : ""}
          </span>
        </button>
      </div>

      <Lightbox items={visible} index={viewer} label="Galerie" onClose={() => setViewer(null)} />
    </section>
  );
}
