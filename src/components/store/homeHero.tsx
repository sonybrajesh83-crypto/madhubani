"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { COMPANY } from "@/lib/constants";
import { getGsap } from "@/lib/gsapClient";

const HERO_SLIDES = [
  {
    src: "/products/painting-04/01.jpg",
    alt: "Lord Ganesha Madhubani painting by Sharda Jha",
  },
  {
    src: "/products/painting-05/01.jpg",
    alt: "Krishna and Gopis Madhubani painting by Sharda Jha",
  },
  {
    src: "/products/painting-01/01.jpg",
    alt: "Madhubani painting from Sharda Madhubani collection",
  },
  {
    src: "/products/painting-08/01.jpg",
    alt: "Hand-painted Mithila artwork by Sharda Jha",
  },
  {
    src: "/products/painting-02/01.jpg",
    alt: "Original Madhubani canvas by Sharda Jha",
  },
  {
    src: "/products/painting-06/01.jpg",
    alt: "Mithila folk painting by Sharda Jha",
  },
  {
    src: "/products/painting-09/01.jpg",
    alt: "Traditional Madhubani painting by Sharda Jha",
  },
  {
    src: "/products/painting-07/01.jpg",
    alt: "Hand-painted Madhubani scene by Sharda Jha",
  },
] as const;

const SLIDE_MS = 4000;

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set([".hero-brand", ".hero-line", ".hero-cta", ".hero-media"], {
        clearProps: "opacity,visibility",
      });
      gsap.fromTo(
        ".hero-media",
        { scale: 1.06 },
        { scale: 1, duration: 2.2, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-brand",
        { y: 28 },
        { y: 0, duration: 0.9, delay: 0.15, ease: "power3.out", stagger: 0.08 },
      );
      gsap.fromTo(
        ".hero-line",
        { y: 18 },
        { y: 0, duration: 0.7, delay: 0.35, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-cta",
        { y: 14 },
        { y: 0, duration: 0.6, delay: 0.48, ease: "power3.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#1a1510]"
    >
      <div className="hero-media absolute inset-0 will-change-transform">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === active ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-[center_20%]"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1510]/92 via-[#1a1510]/35 to-transparent md:from-[#1a1510]/85 md:via-[#1a1510]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/75 via-transparent to-[#1a1510]/20" />
      </div>

      <div className="relative flex min-h-[100svh] items-end px-4 pb-16 pt-28 md:items-center md:px-10 md:pb-24 md:pt-32">
        <div className="mx-auto w-full max-w-7xl">
          <p className="hero-brand text-[11px] uppercase tracking-[0.38em] text-[var(--saffron)]">
            Atelier of {COMPANY.artist}
          </p>
          <h1 className="hero-brand mt-4 max-w-[11ch] font-[family-name:var(--font-serif)] text-5xl leading-[0.9] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)] md:text-7xl lg:text-[6.25rem]">
            {COMPANY.name}
          </h1>
          <p className="hero-line mt-5 max-w-md text-base leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] md:mt-6 md:text-lg">
            Ten original Madhubani canvases. Painted by hand in Mithila — collected
            like a private gallery visit.
          </p>
          <div className="hero-cta mt-7 flex flex-wrap gap-3 md:mt-8">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full bg-[var(--saffron)] px-8 text-[var(--ink)] hover:bg-[#f0a020]"
              >
                Enter collection
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Meet the artist
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2" aria-label="Hero slides">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show painting ${index + 1}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === active
                    ? "w-8 bg-[var(--saffron)]"
                    : "w-1.5 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
