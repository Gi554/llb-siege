"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { images } from "@/content/projet";

// The arch echoes the carved panels of the patio wall: the image opens from
// that shape to full screen as the visitor scrolls.
export default function PatioReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", scrub: 0.6, pin: "[data-pin]" },
        });
        tl.fromTo(
          "[data-arch]",
          {
            clipPath: () =>
              window.innerWidth < 768
                ? "inset(18% 12% 10% 12% round 999px 999px 0px 0px)"
                : "inset(16% 34% 6% 34% round 999px 999px 0px 0px)",
          },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power2.inOut" },
          0,
        )
          .fromTo("[data-arch-img]", { scale: 1.45 }, { scale: 1, ease: "power2.inOut" }, 0)
          .to("[data-side='l']", { xPercent: -60, opacity: 0, ease: "power2.in" }, 0)
          .to("[data-side='r']", { xPercent: 60, opacity: 0, ease: "power2.in" }, 0)
          .from("[data-patio-caption] > *", { y: 40, opacity: 0, stagger: 0.05, duration: 0.3 }, 0.72);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="on-light" aria-labelledby="patio-title" className="relative bg-ivoire">
      <div data-pin className="relative h-[100svh] overflow-hidden">
        <div aria-hidden="true" className="display pointer-events-none absolute inset-0 hidden items-center justify-between px-[var(--gutter)] text-[clamp(3rem,8vw,9rem)] text-encre md:flex">
          <span data-side="l">Le</span>
          <span data-side="r" className="italic text-terracotta">patio</span>
        </div>

        <div data-arch className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" }}>
          <Image data-arch-img src={images.patio.src} alt={images.patio.alt} fill quality={85} sizes="(max-aspect-ratio: 2/1) 215vh, 100vw" className="object-cover object-[48%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-foret/80 via-foret/10 to-transparent" />
        </div>

        <div data-patio-caption className="wrap absolute inset-x-0 bottom-0 grid gap-6 pb-10 text-ivoire md:grid-cols-12 md:pb-14">
          <p className="eyebrow text-or md:col-span-12">02 — Le cœur du bâtiment</p>
          <h2 id="patio-title" className="display text-[clamp(2.6rem,6.5vw,6.5rem)] md:col-span-8">
            Un patio planté, <em className="italic">ouvert sur le ciel.</em>
          </h2>
          <p className="max-w-sm self-end leading-relaxed text-ivoire/80 md:col-span-4 md:justify-self-end">
            Les bureaux, la salle de réunion et les circulations se répartissent autour de ce jardin intérieur.
          </p>
        </div>
      </div>
    </section>
  );
}
