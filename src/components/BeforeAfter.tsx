"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Comparison } from "@/content/types";
import { gsap, MOTION_OK } from "@/lib/gsap";

/**
 * Drag (mouse, touch or keyboard) to compare two images shot from the same
 * angle. A native range input carries the accessible value.
 */
export default function BeforeAfter({ comparison, className = "" }: { comparison: Comparison; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const { before, after } = comparison;

  const fromClientX = useCallback((x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => dragging.current && fromClientX(e.clientX);
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [fromClientX]);

  // A short hint sweep the first time the component enters the viewport.
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const o = { v: 50 };
      gsap.timeline()
        .to(o, { v: 30, duration: 0.9, ease: "power2.inOut", onUpdate: () => !dragging.current && setPos(o.v) })
        .to(o, { v: 64, duration: 1.1, ease: "power2.inOut", onUpdate: () => !dragging.current && setPos(o.v) })
        .to(o, { v: 50, duration: 0.8, ease: "power2.inOut", onUpdate: () => !dragging.current && setPos(o.v) });
    }, { threshold: 0.6 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={className}>
      <div
        ref={box}
        className="relative aspect-[16/9] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[2px] bg-lin md:aspect-[21/9]"
        onPointerDown={(e) => {
          dragging.current = true;
          fromClientX(e.clientX);
        }}
      >
        <Image src={after.src} alt={after.alt} fill sizes="100vw" className="pointer-events-none object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="100vw" className="pointer-events-none object-cover" draggable={false} />
        </div>

        <span className="eyebrow pointer-events-none absolute left-4 top-4 rounded-full bg-encre/70 px-3 py-1.5 text-[0.62rem] text-ivoire backdrop-blur">
          {before.label}{before.date ? ` · ${before.date}` : ""}
        </span>
        <span className="eyebrow pointer-events-none absolute right-4 top-4 rounded-full bg-encre/70 px-3 py-1.5 text-[0.62rem] text-ivoire backdrop-blur">
          {after.label}{after.date ? ` · ${after.date}` : ""}
        </span>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <span className="absolute inset-y-0 -left-px w-[2px] bg-ivoire" />
          <span className="absolute left-0 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivoire text-encre shadow-[0_10px_40px_rgba(0,0,0,.25)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Comparer : ${before.label} et ${after.label}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          onPointerDown={(e) => e.preventDefault()}
        />
      </div>
    </figure>
  );
}
