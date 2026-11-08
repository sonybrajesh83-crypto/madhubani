"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsapClient";

type Props = {
  title: string;
  subtitle: string;
  count: number;
};

export function CollectionHeader({ title, subtitle, count }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collection-eyebrow",
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
      );
      gsap.fromTo(
        ".collection-title",
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, delay: 0.08, ease: "power3.out" },
      );
      gsap.fromTo(
        ".collection-copy",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, delay: 0.16, ease: "power3.out" },
      );
      gsap.fromTo(
        ".collection-meta",
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, delay: 0.24, ease: "power3.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mx-auto max-w-4xl px-4 pb-8 pt-10 text-center md:px-8 md:pt-14">
      <p className="collection-eyebrow text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--saffron-deep)]">
        Handmade collection
      </p>
      <h1 className="collection-title mt-3 font-[family-name:var(--font-serif)] text-4xl leading-tight text-[var(--ink)] md:text-6xl">
        {title}
      </h1>
      <p className="collection-copy mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-black/60 md:text-base">
        {subtitle}
      </p>
      <p className="collection-meta mt-4 text-xs uppercase tracking-[0.18em] text-black/40">
        {count} artworks · ₹1,200 – ₹2,500
      </p>
    </div>
  );
}
