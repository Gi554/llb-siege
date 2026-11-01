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

/** Logo: filled lamp disc + stacked lowercase wordmark. */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-full ${light ? "bg-menthe text-foret" : "bg-foret text-menthe"}`}>
        <LampMark className="h-5 w-5" />
      </span>
      <span className={`font-display text-[15px] font-medium leading-[0.95] ${light ? "text-ivoire" : "text-foret"}`}>
        le siège
        <br />
        llb · cotonou
      </span>
    </span>
  );
}
