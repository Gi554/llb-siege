"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { announcement as fallback, headerLinks, nav } from "@/content/navigation";
import { projet } from "@/content/projet";
import { Logo } from "@/components/ui/LampMark";

/** `announcement` comes from the page texts (null when the bar is switched off). */
export default function Header({ announcement = fallback }: { announcement?: { text: string; href: string; cta: string } | null }) {
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();
  // Pages opening with a split hero get the green block behind the logo.
  const [split, setSplit] = useState(false);
  useEffect(() => setSplit(!!document.querySelector("[data-split-hero]")), [pathname]);

  // The dark block behind the logo only exists from tablet width up.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const d = ctx.conditions?.motion ? 1 : 0.01;
        tl.current = gsap
          .timeline({ paused: true })
          .set(menu.current, { visibility: "visible" })
          .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 * d, ease: "expo.inOut" })
          .from("[data-menu-link]", { yPercent: 110, duration: 0.8 * d, stagger: 0.05 }, "-=0.4")
          .from("[data-menu-fade]", { opacity: 0, y: 12, duration: 0.6 * d, stagger: 0.05 }, "-=0.5");
      });
      return () => mm.revert();
    },
    { scope: menu },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      window.__lenis?.stop();
      tl.current.timeScale(1).play();
    } else {
      window.__lenis?.start();
      tl.current.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The hero's green panel rises behind the logo while at the top.
  const panel = split && atTop && !open && wide;

  return (
    <>
      {bar && announcement && (
        <div className="relative z-50 bg-brume">
          <p className="wrap flex min-h-11 items-center justify-center gap-2 py-2 pr-12 text-center text-[11px] uppercase tracking-[0.12em] text-encre/80">
            <span>{announcement.text}</span>
            <Link href={announcement.href} className="font-medium normal-case tracking-normal text-encre underline underline-offset-2">
              {announcement.cta}
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setBar(false)}
            aria-label="Fermer l'annonce"
            className="absolute right-[var(--gutter)] top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow] duration-300 ${
          open ? "bg-foret" : "bg-blanc"
        } ${!atTop && !open ? "shadow-[0_1px_0_rgba(20,31,28,.08)]" : ""}`}
      >
        {/* Dark block continuing the hero panel (home, top of page) */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-[34%] bg-foret transition-opacity duration-300 ${panel ? "opacity-100" : "opacity-0"}`}
        />
        <div className="wrap relative flex h-full items-center justify-between">
          <Link href="/" aria-label="Accueil — Siège de la LLB">
            <Logo tone={panel || open ? "light" : "dark"} />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 lg:gap-8">
            <nav aria-label="Navigation principale" className="hidden items-center gap-8 text-[14px] lg:flex">
              {headerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`link-underline pb-0.5 ${open ? "text-ivoire" : "text-encre"} aria-[current=page]:bg-[length:100%_1px]`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/chantier"
              className={`pill hidden h-[51px] px-5 text-[15px] xl:inline-flex ${open ? "bg-menthe text-foret" : "bg-foret text-blanc hover:bg-foret-2"}`}
            >
              Suivre le chantier
            </Link>
            <Link
              href="/faire-un-don"
              aria-current={pathname === "/faire-un-don" ? "page" : undefined}
              className="pill h-11 bg-or px-4 text-[14px] text-foret hover:bg-ocre sm:h-[51px] sm:px-5 sm:text-[15px]"
            >
              Faire un don
            </Link>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-principal"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={`relative grid h-11 w-11 place-items-center rounded-full border ${open ? "border-ivoire/40 text-ivoire" : "border-encre/20 text-encre"}`}
            >
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="menu-principal"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        aria-hidden={!open}
        inert={!open}
        className="invisible fixed inset-0 z-40 bg-foret pt-[calc(var(--header-h)+2rem)] text-ivoire"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="container-site grid h-full content-start gap-12 overflow-y-auto pb-10 md:grid-cols-12">
          <nav aria-label="Menu" className="md:col-span-8">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.href} className="line-mask">
                  <span data-menu-link>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="group flex items-baseline gap-5"
                    >
                      <span className="font-mono text-xs text-ivoire/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display text-[clamp(2.4rem,6vw,5rem)] text-menthe transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-blanc aria-[current=page]:text-blanc">
                        {item.label}
                      </span>
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mono space-y-6 text-ivoire/70 md:col-span-4 md:pt-4">
            <p data-menu-fade>
              Maître d&apos;ouvrage
              <br />
              <span className="text-ivoire">{projet.owner}</span>
            </p>
            <p data-menu-fade>
              Architecture
              <br />
              <span className="text-ivoire">{projet.architect}</span>
            </p>
            <p data-menu-fade>
              Lieu
              <br />
              <span className="text-ivoire">{projet.city}, {projet.country}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
