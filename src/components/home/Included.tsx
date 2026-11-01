"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Line icons, 24px grid.
const ICONS: Record<string, React.ReactNode> = {
  livres: <path d="M4 5h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z" />,
  bureau: <path d="M3 10h18M5 10v9M19 10v9M8 6h8v4H8z" />,
  salle: (
    <>
      <rect x="5" y="9" width="14" height="6" rx="1" />
      <path d="M7 6v3M12 6v3M17 6v3M7 15v3M12 15v3M17 15v3" />
    </>
  ),
  patio: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M12 16v-5M12 11c-2.5-3-5-2-5-2s1.5 3 5 2zM12 11c2.5-3 5-2 5-2s-1.5 3-5 2z" />
    </>
  ),
  jardin: <path d="M12 21V11M12 11C12 6 8 4 5 4c0 4 3 7 7 7zM12 14c0-4 3-6 7-6 0 4-3 6-7 6zM4 21h16" />,
  cour: (
    <>
      <path d="M3 19h18M5 19V9l7-5 7 5v10" />
      <path d="M9 19v-5h6v5" />
    </>
  ),
};

const ITEMS = [
  { icon: "livres", label: "Librairie" },
  { icon: "bureau", label: "Bureaux" },
  { icon: "salle", label: "Salle de conférence" },
  { icon: "patio", label: "Patio central" },
  { icon: "jardin", label: "Jardins et terrasses" },
  { icon: "cour", label: "Cour et garage" },
];

export default function Included() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        tl.from("[data-in-head] > *", { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" })
          .from("[data-in-item]", { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="inclus-titre" className="bg-blanc pb-28 pt-8 md:pb-36">
      <div className="container-site">
        <div data-in-head className="mx-auto max-w-2xl text-center">
          <h2 id="inclus-titre" className="display text-[clamp(2.3rem,3.6vw,3.2rem)] leading-tight text-encre">
            Ce que réunit le siège
          </h2>
          <p className="mono mx-auto mt-8 max-w-md text-[13px] text-encre/80">
            Un lieu de travail, d&apos;accueil et de rencontre, organisé de plain-pied autour d&apos;un patio central, dans un cadre
            de jardins et de terrasses.
          </p>
        </div>
        <ul className="mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {ITEMS.map((it) => (
            <li key={it.label} data-in-item className="flex flex-col items-center gap-4 text-center">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-encre" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[it.icon]}
              </svg>
              <span className="text-[15px] text-encre">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
