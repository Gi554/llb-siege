import { useId } from "react";

/** Simple oil-lamp line drawing — a nod to the light of the Word. */
export default function LampMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path data-draw d="M32 6c4 6 6 9.5 6 13a6 6 0 0 1-12 0c0-3.5 2-7 6-13Z" />
      <path data-draw d="M8 34h48c-2 10-11 16-24 16S10 44 8 34Z" />
      <path data-draw d="M56 34c3 0 5 2 5 4.5S59 43 56 43" />
      <path data-draw d="M22 56h20M32 50v6" />
    </svg>
  );
}

/**
 * The Ligue's logo, cut from the official artwork: the green disc with the
 * golden lamp, the wordmark and the green-yellow-red rule. Coordinates are
 * the artwork's own pixels. The wordmark is a mask so it can turn ivory on
 * dark backgrounds while the disc and the rule keep their colours.
 */
export function Logo({ tone = "dark", className = "h-11" }: { tone?: "dark" | "light"; className?: string }) {
  const mask = useId();
  return (
    <svg viewBox="55 157 341 119" className={`w-auto ${className}`} role="img" aria-label="Ligue pour la Lecture de la Bible">
      <defs>
        <mask id={mask} style={{ maskType: "alpha" }}>
          <image href="/brand/llb-texte.png" x="176" y="158" width="220" height="112" />
        </mask>
      </defs>
      <image href="/brand/llb-embleme.png" x="55.3" y="157.3" width="116.5" height="116.5" />
      <rect x="176" y="158" width="220" height="112" fill={tone === "light" ? "#f1ece0" : "#008d53"} mask={`url(#${mask})`} />
      <rect x="180" y="271" width="71" height="4" fill="#00814d" />
      <rect x="251" y="271" width="71" height="4" fill="#fece31" />
      <rect x="322" y="271" width="71" height="4" fill="#e71b23" />
    </svg>
  );
}
