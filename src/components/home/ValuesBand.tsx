"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { projet } from "@/content/projet";

export default function ValuesBand() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo("[data-row='a']", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-row='b']", { xPercent: -28 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = [...projet.values, ...projet.values, ...projet.values];

  return (
    <div ref={root} data-header="on-light" aria-label={`Valeurs : ${projet.values.join(", ")}`} role="img" className="overflow-hidden bg-ivoire pb-[clamp(4rem,9vw,8rem)]">
      {(["a", "b"] as const).map((key) => (
        <div key={key} data-row={key} className="display flex w-max items-center gap-[4vw] whitespace-nowrap text-[clamp(3.5rem,11vw,11rem)] leading-[1.05]">
          {row.map((v, i) => (
            <span key={i} className="flex items-center gap-[4vw]">
              <span className={(i + (key === "b" ? 1 : 0)) % 2 ? "italic text-terracotta" : "text-encre"}>{v}</span>
              <span aria-hidden="true" className="inline-block h-[0.16em] w-[0.16em] rounded-full bg-or" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
