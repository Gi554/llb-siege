"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { STATUS_LABEL, type Stage } from "@/content/types";

// Mint diagonal backdrop, intro on the left, round portraits of each stage scrolling sideways.
export default function StagesRail({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-sr-shape]", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 1.4, ease: "expo.inOut" })
          .from("[data-sr-rule]", { scaleX: 0, transformOrigin: "left", duration: 1, stagger: 0.15, ease: "expo.out" }, 0.3)
          .from("[data-sr-head] > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.4)
          .from("[data-sr-item]", { x: 60, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const [ends, setEnds] = useState({ start: true, end: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onScroll = () => {
    const el = rail.current!;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEnds({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  };
  const step = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>("[data-sr-item]");
    // One card (plus the gap) per click.
    el.scrollBy({ left: dir * ((item?.offsetWidth ?? 240) + 40), behavior: "smooth" });
  };

  // Trackpad side swipes and shift+wheel scroll the rail; the smooth page
  // scroll would otherwise swallow them. Vertical wheel keeps scrolling the page.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    onScroll();
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((dx < 0 && el.scrollLeft <= 0) || (dx > 0 && el.scrollLeft >= max)) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += dx;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Click-and-drag with a mouse (touch already scrolls natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: rail.current!.scrollLeft, moved: false };
    rail.current!.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    rail.current!.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    rail.current!.style.scrollSnapType = "";
  };

  return (
    <section ref={root} aria-label="Le chantier, étape par étape" className="relative overflow-hidden bg-blanc py-20 md:py-28">
      <span
        data-sr-shape
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[85%] bg-menthe md:w-[34%]"
        style={{ clipPath: "polygon(0 0, 55% 0, 100% 100%, 0 100%)" }}
      />

      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-[34%_minmax(0,1fr)] md:items-center">
        <div data-sr-head className="pl-[var(--gutter)] pr-8 md:pl-[max(var(--gutter),7vw)]">
          <span data-sr-rule aria-hidden="true" className="block h-px w-full max-w-[12rem] bg-terracotta" />
          <h2 className="display mt-8 text-[clamp(2.3rem,3.4vw,3rem)] leading-[1] text-encre">
            Le chantier,
            <br />
            étape par étape
          </h2>
          <p className="mt-6 max-w-[16rem] text-[13px] text-encre/75">
            De la conception à l&apos;inauguration, chaque étape sera documentée ici.
          </p>
          <Link href="/chantier" className="group mt-10 flex max-w-[12rem] items-center text-terracotta" aria-label="Voir l'évolution des travaux">
            <span data-sr-rule className="block h-px flex-1 bg-current" />
            <svg viewBox="0 0 24 24" className="-ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="min-w-0">
          <ul
            ref={rail}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onDragStart={(e) => e.preventDefault()}
            tabIndex={0}
            aria-label="Étapes du chantier, faire défiler horizontalement"
            className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-10 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pb-2 select-none active:cursor-grabbing md:pl-0"
          >
            {stages.map((s, k) => (
              <li key={s.slug} data-sr-item className="w-[220px] shrink-0 snap-start text-center md:w-[240px]">
                <div className="relative mx-auto aspect-square w-[190px] overflow-hidden rounded-full bg-lin md:w-[210px]">
                  {s.media[0] ? (
                    <Image src={s.media[0].src} alt={s.media[0].alt} fill sizes="210px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center rounded-full border-2 border-dashed border-encre/20">
                      <span className="display text-5xl text-encre/25">{String(k + 1).padStart(2, "0")}</span>
                    </span>
                  )}
                </div>
                <h3 className="display mt-7 text-[1.65rem] leading-tight text-encre">{s.title}</h3>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-terracotta">
                  {STATUS_LABEL[s.status]}
                  {s.dateLabel ? ` · ${s.dateLabel}` : ""}
                  {s.source === "demo" ? " · exemple" : ""}
                </p>
                <p className="mx-auto mt-3 max-w-[15rem] text-[12px] leading-relaxed text-encre/75">{s.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-6 px-[var(--gutter)] md:pl-0">
            <span className="relative block h-[3px] w-[60px] overflow-hidden rounded-full bg-encre/10" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-encre/60 transition-transform duration-150" style={{ transform: `translateX(${progress * 100}%)` }} />
            </span>
            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => step(dir)}
                  disabled={dir < 0 ? ends.start : ends.end}
                  aria-label={dir < 0 ? "Étapes précédentes" : "Étapes suivantes"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-encre/20 text-encre transition-colors hover:border-foret hover:bg-foret hover:text-blanc disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
