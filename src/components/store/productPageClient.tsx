"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsapClient";

export function ProductPageMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-media",
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        ".product-info > *",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
          clearProps: "transform",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
