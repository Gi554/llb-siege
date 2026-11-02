"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Comparison } from "@/content/types";
import BeforeAfter from "@/components/BeforeAfter";

const MODES = [
  { key: "curseur", label: "Curseur" },
  { key: "cote", label: "Côte à côte" },
  { key: "fondu", label: "Fondu" },
] as const;
type Mode = (typeof MODES)[number]["key"];

const Label = ({ children, side }: { children: React.ReactNode; side: "left" | "right" }) => (
  <span className={`eyebrow pointer-events-none absolute rounded-full bg-encre/70 px-3 py-1.5 text-[0.62rem] text-ivoire backdrop-blur ${side === "left" ? "left-4 top-4" : "bottom-4 right-4 md:bottom-auto md:top-4"}`}>
    {children}
  </span>
);

/** One comparison, three ways to read it: drag, side by side, or crossfade. */
export default function CompareStudio({ comparison, dark = false }: { comparison: Comparison; dark?: boolean }) {
  const [mode, setMode] = useState<Mode>("curseur");
  const [fade, setFade] = useState(50);
  const id = useId();
  const { before, after } = comparison;
  const tag = (m: typeof before) => `${m.label}${m.date ? ` · ${m.date}` : ""}`;

  return (
    <div>
      <div role="tablist" aria-label="Mode de comparaison" className={`inline-flex rounded-full border p-1 ${dark ? "border-ivoire/20" : "border-encre/15"}`}>
        {MODES.map((m) => {
          const on = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              role="tab"
              id={`${id}-${m.key}`}
              aria-selected={on}
              aria-controls={`${id}-panel`}
              onClick={() => setMode(m.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                on ? (dark ? "bg-menthe text-foret" : "bg-foret text-blanc") : dark ? "text-ivoire/70 hover:text-ivoire" : "text-encre/65 hover:text-encre"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${mode}`} className="mt-6">
        {mode === "curseur" && <BeforeAfter comparison={comparison} frameClass="aspect-[4/3] md:aspect-[16/7]" />}

        {mode === "cote" && (
          <div className="grid gap-3 md:grid-cols-2">
            {[before, after].map((m, i) => (
              <figure key={m.src} className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-lin">
                <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 83vw, 165vw" className="object-cover" />
                <Label side={i === 0 ? "left" : "right"}>{tag(m)}</Label>
              </figure>
            ))}
          </div>
        )}

        {mode === "fondu" && (
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-lin md:aspect-[16/7]">
              <Image src={before.src} alt={before.alt} fill sizes="(min-width: 768px) 100vw, 165vw" className="object-cover" />
              <Image src={after.src} alt={after.alt} fill sizes="(min-width: 768px) 100vw, 165vw" className="object-cover" style={{ opacity: fade / 100 }} />
              <Label side="left">{tag(before)}</Label>
              <Label side="right">{tag(after)}</Label>
            </div>
            <label className={`mt-5 flex items-center gap-4 text-sm ${dark ? "text-ivoire/70" : "text-encre/65"}`}>
              <span className="shrink-0">{before.label}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={fade}
                onChange={(e) => setFade(Number(e.target.value))}
                aria-label={`Fondu entre ${before.label} et ${after.label}`}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-current/20 accent-terracotta"
              />
              <span className="shrink-0">{after.label}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
