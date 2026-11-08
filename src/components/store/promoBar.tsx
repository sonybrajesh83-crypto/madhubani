"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsapClient";

export function PromoBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const track = trackRef.current;
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  const text =
    "Handmade by Sharda Jha  ·  Prices ₹1,200–₹2,500  ·  Customize any painting  ·  Free India shipping above ₹2,000  ·  WhatsApp the atelier  ·  ";

  return (
    <div className="overflow-hidden border-b border-black/5 bg-[var(--saffron)] text-[var(--ink)]">
      <div ref={trackRef} className="flex w-max whitespace-nowrap py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
      </div>
    </div>
  );
}
