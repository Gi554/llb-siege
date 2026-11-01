"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, onReady, useGSAP } from "@/lib/gsap";

type Props = {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  /** Extra content under the text (buttons, figures…). */
  footer?: ReactNode;
  /** Right-hand side: a picture or an interactive element. */
  children: ReactNode;
};

/**
 * Page opener shared by the site: deep green panel with the message on the
 * left, visual on the right. The header extends the panel behind the logo
 * while the page is at the top (see `data-split-hero`).
 */
export default function SplitHero({ eyebrow, title, text, footer, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.from("[data-sh-media]", { scale: 1.08, opacity: 0, duration: 1.4, ease: "expo.out" })
          .from("[data-sh-fade]", { y: 28, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1);
        return onReady(() => tl.play());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-split-hero className="relative bg-blanc">
      <div className="grid min-h-[calc(100svh-var(--header-h)-44px)] md:grid-cols-[34%_1fr]">
        <div className="relative z-10 flex flex-col justify-center bg-foret px-[var(--gutter)] py-16 text-blanc md:py-12 md:pl-[max(var(--gutter),7vw)] md:pr-[3vw]">
          <p data-sh-fade className="font-display text-[15px] font-medium">
            {eyebrow}
          </p>
          <h1 data-sh-fade className="display mt-4 text-[clamp(2.6rem,4vw,3.6rem)] text-menthe">
            {title}
          </h1>
          {text && (
            <div data-sh-fade className="mono mt-8 max-w-[22rem] text-blanc/90">
              {text}
            </div>
          )}
          {footer && (
            <div data-sh-fade className="mt-10">
              {footer}
            </div>
          )}
        </div>
        <div data-sh-media className="relative min-h-[58vh] overflow-hidden md:min-h-0">
          {children}
        </div>
      </div>
    </section>
  );
}
