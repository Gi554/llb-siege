"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STATUS_LABEL, type Media, type Stage, type StageStatus } from "@/content/types";
import StageBlock from "./StageBlock";
import Lightbox from "@/components/Lightbox";
import DemoBadge from "@/components/ui/DemoBadge";

type Filter = "tout" | StageStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "tout", label: "Toutes les étapes" },
  { key: "realise", label: STATUS_LABEL.realise },
  { key: "en-cours", label: STATUS_LABEL["en-cours"] },
  { key: "a-venir", label: STATUS_LABEL["a-venir"] },
];

export default function Timeline({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLElement>(null);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const [filter, setFilter] = useState<Filter>("tout");
  const [active, setActive] = useState(0);
  const [dock, setDock] = useState(false);
  const [viewer, setViewer] = useState<{ items: Media[]; index: number; label: string } | null>(null);

  const visible = useMemo(() => (filter === "tout" ? stages : stages.filter((s) => s.status === filter)), [stages, filter]);
  const count = (f: Filter) => (f === "tout" ? stages.length : stages.filter((s) => s.status === f).length);
  const hasDemo = stages.some((s) => s.source === "demo");

  useGSAP(
    () => {
      const els = blocks.current.slice(0, visible.length).filter(Boolean) as HTMLElement[];

      const tracking = els.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      tracking.push(
        ScrollTrigger.create({
          trigger: "[data-rail-zone]",
          start: "top 70%",
          end: "bottom 80%",
          onToggle: (self) => setDock(self.isActive),
        }),
      );

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-rail-progress]", { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-rail-zone]", start: "top 55%", end: "bottom 55%", scrub: true },
        });
        els.forEach((el) => {
          const q = gsap.utils.selector(el);
          gsap.timeline({ scrollTrigger: { trigger: el, start: "top 78%", once: true } })
            .from(q("[data-stage-dot]"), { scale: 0, duration: 0.8, ease: "back.out(3)" })
            .from(q("[data-stage-title]"), { y: 60, opacity: 0, duration: 1.3 }, 0.05)
            .from(q("[data-stage-fade]"), { y: 30, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.2);
          gsap.fromTo(q("[data-stage-num]"), { yPercent: 25 }, {
            yPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
          q("[data-media]").forEach((m, i) => {
            gsap.from(m, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.4,
              ease: "expo.inOut",
              delay: (i % 2) * 0.12,
              scrollTrigger: { trigger: m, start: "top 92%", once: true },
            });
            gsap.fromTo(m.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: m, start: "top 92%", once: true } });
          });
          el.querySelectorAll<SVGPathElement>("[data-arch-path]").forEach((p) => {
            const len = p.getTotalLength();
            gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 90%", once: true } });
          });
        });
      });

      ScrollTrigger.refresh();
      return () => {
        tracking.forEach((t) => t.kill());
        mm.revert();
      };
    },
    { scope: root, dependencies: [visible], revertOnUpdate: true },
  );

  const scrollToStage = (i: number) => {
    const el = blocks.current[i];
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const current = visible[active] ?? visible[0];

  return (
    <section ref={root} aria-label="Chronologie du chantier" id="chronologie" className="scroll-mt-24 bg-blanc pb-32 pt-[clamp(5rem,9vw,8rem)]">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-terracotta">Chronologie</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.8rem)]">
              {visible.length} étape{visible.length > 1 ? "s" : ""}, <em className="italic text-terracotta">une histoire.</em>
            </h2>
            {hasDemo && <DemoBadge className="mt-6 text-terracotta" label="Étapes d'exemple à remplacer depuis l'administration" />}
          </div>

          <div role="group" aria-label="Filtrer les étapes" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const n = count(f.key);
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  disabled={n === 0}
                  onClick={() => {
                    setFilter(f.key);
                    setActive(0);
                  }}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-35 ${
                    on ? "border-foret bg-foret text-blanc" : "border-encre/20 hover:border-foret"
                  }`}
                >
                  {f.label}
                  <span className={`tabular-nums text-xs ${on ? "text-ivoire/60" : "text-encre/45"}`}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div data-rail-zone className="relative mt-16 pl-8 md:mt-24 md:pl-14">
          <span aria-hidden="true" className="absolute bottom-0 left-[6px] top-0 w-px bg-encre/12" />
          <span aria-hidden="true" data-rail-progress className="absolute bottom-0 left-[6px] top-0 w-px origin-top bg-terracotta" />
          {visible.map((s, i) => (
            <StageBlock
              key={s.slug}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              stage={s}
              number={stages.indexOf(s) + 1}
              total={stages.length}
              onOpen={(items, index, label) => setViewer({ items, index, label })}
            />
          ))}
        </div>
      </div>

      {/* Floating stage navigator */}
      <nav
        aria-label="Naviguer entre les étapes"
        className={`fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] md:bottom-6 ${
          dock ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
        }`}
      >
        <div className="flex max-w-full items-center gap-3 rounded-full bg-foret py-2 pl-2 pr-5 text-blanc shadow-[0_20px_60px_rgba(0,0,0,.25)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => scrollToStage(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Étape précédente"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ivoire/10 transition-colors hover:bg-ivoire/20 disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 -rotate-90" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <ol className="hidden items-center gap-1.5 md:flex">
            {visible.map((s, i) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => scrollToStage(i)}
                  aria-label={`${s.title} (${STATUS_LABEL[s.status]})`}
                  aria-current={i === active ? "step" : undefined}
                  className="group grid h-7 place-items-center px-1"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8" : "w-1.5 group-hover:w-3"} ${
                      s.status === "realise" ? "bg-menthe" : s.status === "en-cours" ? "bg-terracotta" : i === active ? "bg-blanc" : "bg-blanc/35"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => scrollToStage(Math.min(visible.length - 1, active + 1))}
            disabled={active >= visible.length - 1}
            aria-label="Étape suivante"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ivoire/10 transition-colors hover:bg-ivoire/20 disabled:opacity-30 md:order-last"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          {current && (
            <p className="min-w-0 truncate text-sm" aria-live="polite">
              <span className="mr-2 tabular-nums text-ivoire/50">{String(stages.indexOf(current) + 1).padStart(2, "0")}</span>
              {current.title}
            </p>
          )}
        </div>
      </nav>

      <Lightbox items={viewer?.items ?? []} index={viewer ? viewer.index : null} label={viewer?.label} onClose={() => setViewer(null)} />
    </section>
  );
}
