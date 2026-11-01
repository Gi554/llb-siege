"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav } from "@/content/navigation";
import { projet } from "@/content/projet";

export default function Header() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const pathname = usePathname();

  const [tone, setTone] = useState<"on-dark" | "on-light">("on-dark");

  // Hide the bar while scrolling down, bring it back on the way up.
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 200;
        gsap.to(bar.current, { yPercent: hide ? -120 : 0, duration: 0.6, ease: "power3.out", overwrite: true });
      },
    });
    return () => st.kill();
  });

  // Each section declares its background with data-header; the bar follows.
  useGSAP(
    () => {
      const triggers = gsap.utils.toArray<HTMLElement>("[data-header]").map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 48px",
          end: "bottom 48px",
          onToggle: (self) => self.isActive && setTone(el.dataset.header as "on-dark" | "on-light"),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [pathname] },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const motion = ctx.conditions?.motion;
        tl.current = gsap
          .timeline({ paused: true })
          .set(menu.current, { visibility: "visible" })
          .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: motion ? 0.9 : 0.01, ease: "expo.inOut" })
          .from("[data-menu-link]", { yPercent: 110, duration: motion ? 0.9 : 0.01, stagger: 0.05 }, motion ? "-=0.45" : 0)
          .from("[data-menu-fade]", { opacity: 0, y: 16, duration: motion ? 0.8 : 0.01, stagger: 0.06 }, motion ? "-=0.7" : 0)
          .from("[data-menu-visual]", { clipPath: "inset(100% 0% 0% 0%)", duration: motion ? 1.1 : 0.01 }, motion ? "-=0.9" : 0);
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
      menu.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
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

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${open || tone === "on-dark" ? "text-ivoire" : "text-encre"}`}
      >
        <div className="wrap flex items-center justify-between py-5 md:py-7">
          <Link href="/" className="group flex items-baseline gap-3" aria-label="Accueil — Siège de la LLB">
            <span className="display text-2xl tracking-tight md:text-[1.7rem]">LLB</span>
            <span className="eyebrow hidden text-[0.62rem] opacity-80 sm:inline">Le siège · {projet.city}</span>
          </Link>
          <nav aria-label="Navigation rapide" className="hidden items-center gap-8 text-sm lg:flex">
            {nav.slice(1, 4).map((item) => (
              <Link key={item.href} href={item.href} className="link-underline pb-0.5">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-principal"
            className="group flex items-center gap-3 text-sm"
          >
            <span className="relative block h-[1.2em] overflow-hidden">
              <span className={`block transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "-translate-y-full" : ""}`}>Menu</span>
              <span className={`absolute left-0 top-full block transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "-translate-y-full" : ""}`}>Fermer</span>
            </span>
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-current">
              <span className={`absolute h-px w-3.5 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-3.5 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </span>
          </button>
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
        className="grain invisible fixed inset-0 z-40 bg-foret text-ivoire"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="wrap grid h-full grid-cols-1 gap-10 pb-10 pt-28 md:grid-cols-12 md:pt-32">
          <nav aria-label="Menu" className="flex flex-col justify-center md:col-span-7">
            <ul className="space-y-1 md:space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="line-mask">
                  <span data-menu-link>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="group flex items-baseline gap-4 md:gap-6"
                    >
                      <span className="eyebrow w-6 text-ivoire/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display text-[clamp(2.4rem,7vw,6.2rem)] transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-or group-hover:italic aria-[current=page]:text-or">
                        {item.label}
                      </span>
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden flex-col justify-between md:col-span-5 md:flex">
            <div data-menu-visual className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
              {nav.map((item, i) => (
                <Image
                  key={item.href}
                  src={item.image.src}
                  alt=""
                  fill
                  sizes="40vw"
                  className={`object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)] ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                />
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-ivoire/70">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
