"use client";

import { useEffect, useRef, useState } from "react";
import { COMPANY } from "@/lib/constants";
import { getGsap } from "@/lib/gsapClient";

const STORAGE_KEY = "smp-gallery-entered";

export function GallerySplash() {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.set(
        [
          ".splash-veil",
          ".splash-frame",
          ".splash-line",
          ".splash-brand",
          ".splash-sub",
          ".splash-cta",
          ".splash-motif",
        ],
        { clearProps: "opacity,visibility" },
      );
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".splash-frame", { scale: 0.94, y: 12 }, { scale: 1, y: 0, duration: 0.8 })
        .fromTo(".splash-line", { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, "-=0.4")
        .fromTo(".splash-brand", { y: 24 }, { y: 0, duration: 0.7 }, "-=0.35")
        .fromTo(".splash-sub", { y: 14 }, { y: 0, duration: 0.55, stagger: 0.06 }, "-=0.4")
        .fromTo(".splash-cta", { y: 12 }, { y: 0, duration: 0.5 }, "-=0.25")
        .fromTo(
          ".splash-motif",
          { rotate: -6 },
          { rotate: 0, opacity: 0.18, duration: 1 },
          "-=0.8",
        );
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [visible]);

  function enterGallery() {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
      return;
    }

    gsap.to(root, {
      autoAlpha: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        document.body.style.overflow = "";
        setVisible(false);
      },
    });
  }

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0c0c] text-white"
    >
      <div className="splash-veil absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,166,35,0.22),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(13,115,119,0.2),transparent_35%)]" />
      <div className="splash-motif pointer-events-none absolute inset-8 border border-[var(--saffron)]/30" />
      <div className="splash-frame relative mx-4 max-w-2xl border border-white/15 px-8 py-14 text-center md:px-16">
        <div className="splash-line mx-auto mb-8 h-px w-24 origin-left bg-[var(--saffron)]" />
        <p className="splash-sub text-[11px] uppercase tracking-[0.35em] text-[var(--saffron)]">
          You are entering
        </p>
        <h1 className="splash-brand mt-4 font-[family-name:var(--font-serif)] text-4xl leading-tight md:text-6xl">
          {COMPANY.name}
        </h1>
        <p className="splash-sub mx-auto mt-5 max-w-md text-sm text-white/65 md:text-base">
          An intimate Madhubani gallery of 10 original paintings by {COMPANY.artist}.
          Walk slowly. Look closely. Collect what moves you.
        </p>
        <button
          type="button"
          onClick={enterGallery}
          className="splash-cta mt-10 rounded-full bg-[var(--saffron)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[#f0a020]"
        >
          Enter the gallery
        </button>
      </div>
    </div>
  );
}
