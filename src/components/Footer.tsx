"use client";

import Link from "next/link";
import { nav } from "@/content/navigation";
import { projet } from "@/content/projet";
import { Logo } from "@/components/ui/LampMark";

export default function Footer() {
  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-foret text-blanc">
      <button
        type="button"
        onClick={toTop}
        className="absolute left-1/2 top-0 grid h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-foret text-[11px] leading-none text-blanc ring-4 ring-transparent transition-transform duration-300 hover:-translate-y-[60%]"
        aria-label="Revenir en haut de la page"
      >
        <span className="flex flex-col items-center gap-0.5">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
          haut
        </span>
      </button>

      <div className="container-site grid gap-12 pb-12 pt-24 md:grid-cols-12 md:pt-28">
        <div className="md:col-span-4">
          <Logo tone="light" className="h-16 md:h-20" />
        </div>

        <nav aria-label="Pied de page" className="md:col-span-3">
          <p className="font-display text-base font-medium">le projet</p>
          <ul className="mt-5 space-y-2.5 text-[12px] tracking-[0.04em] text-blanc/85">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline pb-0.5 hover:text-menthe">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 md:pt-10">
          <p className="font-display text-base font-medium">informations</p>
          <ul className="mt-5 space-y-2.5 text-[12px] tracking-[0.04em] text-blanc/85">
            <li>{projet.owner}</li>
            <li>
              {projet.city}, {projet.country}
            </li>
            <li>Architecture : {projet.architect}</li>
          </ul>
        </div>

        <div className="flex items-start md:col-span-2 md:justify-end">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-blanc/25 text-menthe" aria-hidden="true">
            <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M32 6c4 6 6 9.5 6 13a6 6 0 0 1-12 0c0-3.5 2-7 6-13Z" />
              <path d="M8 34h48c-2 10-11 16-24 16S10 44 8 34Z" />
            </svg>
          </span>
        </div>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-blanc/10 py-6 text-[11px] tracking-[0.04em] text-blanc/50 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {projet.owner}</span>
        <span>Visuels : perspectives architecturales {projet.architect}</span>
      </div>
    </footer>
  );
}
