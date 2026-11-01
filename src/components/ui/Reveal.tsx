"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** "lines": children are `.line-mask > span`; "fade": the block itself rises in. */
  mode?: "lines" | "fade";
  start?: string;
};

export default function Reveal({ children, as: Tag = "div", className, delay = 0, mode = "fade", start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = mode === "lines" ? ref.current!.querySelectorAll(".line-mask > span") : ref.current;
        gsap.from(targets, {
          ...(mode === "lines" ? { yPercent: 115 } : { y: 40, opacity: 0 }),
          duration: 1.3,
          delay,
          stagger: 0.09,
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Splits a string into masked lines, one per `\n`. */
export function Lines({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="line-mask">
          <span className={className}>{line}</span>
        </span>
      ))}
    </>
  );
}
