"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px)";

/** Fired once the preloader has left the screen. */
export const READY_EVENT = "llb:ready";

export function onReady(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as unknown as { __llbReady?: boolean }).__llbReady) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}

export function markReady() {
  (window as unknown as { __llbReady?: boolean }).__llbReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

export { gsap, ScrollTrigger, useGSAP };
