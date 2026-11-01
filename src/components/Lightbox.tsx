"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Media } from "@/content/types";

type Props = {
  items: Media[];
  index: number | null;
  onClose: () => void;
  /** Label read before the counter, e.g. the stage title. */
  label?: string;
};

/** Full-screen photo viewer: arrows, swipe, Escape, focus kept inside. */
export default function Lightbox({ items, index, onClose, label }: Props) {
  const [current, setCurrent] = useState(index ?? 0);
  const [visible, setVisible] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  const go = useCallback((delta: number) => setCurrent((c) => (c + delta + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    setCurrent(index!);
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      dialog.current?.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const f = dialog.current!.querySelectorAll<HTMLElement>("button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!open || typeof document === "undefined") return null;
  const item = items[current];

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={label ? `${label} — visionneuse` : "Visionneuse de photographies"}
      className={`fixed inset-0 z-[90] flex flex-col bg-encre/95 text-ivoire backdrop-blur-sm transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="wrap flex items-center justify-between py-5">
        <p className="eyebrow text-ivoire/60">
          {label && <span className="mr-3 text-ivoire">{label}</span>}
          <span className="tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </p>
        <button data-close type="button" onClick={onClose} className="group flex items-center gap-3 text-sm">
          Fermer
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-ivoire/40 transition-colors group-hover:bg-ivoire group-hover:text-encre">
            <span className="absolute h-px w-4 rotate-45 bg-current" />
            <span className="absolute h-px w-4 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <figure className="relative mx-[var(--gutter)] flex-1">
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          quality={90}
          sizes="100vw"
          className={`object-contain transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        />
      </figure>

      <div className="wrap flex items-center justify-between gap-6 py-5">
        <p className="max-w-xl text-sm text-ivoire/75" aria-live="polite">
          {item.caption ?? item.alt}
        </p>
        {items.length > 1 && (
          <div className="flex shrink-0 gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={d < 0 ? "Photographie précédente" : "Photographie suivante"}
                className="grid h-12 w-12 place-items-center rounded-full border border-ivoire/30 transition-colors hover:bg-ivoire hover:text-encre"
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
