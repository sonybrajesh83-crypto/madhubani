"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getGsap } from "@/lib/gsapClient";

type Props = {
  images: string[];
  alt: string;
};

export function ImageGallery({ images, alt }: Props) {
  const safeImages = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const main = mainRef.current;
    if (!main) return;
    gsap.fromTo(
      main,
      { autoAlpha: 0.4, scale: 1.02 },
      { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" },
    );
  }, [active]);

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-[#f3f3f3] text-sm text-black/40">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={mainRef}
        className="relative aspect-square overflow-hidden rounded-md bg-[#f3f3f3] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      >
        <Image
          src={safeImages[active]}
          alt={`${alt} — view ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] text-white">
          {active + 1} / {safeImages.length}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {safeImages.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-sm border-2 transition",
              active === index
                ? "border-[var(--saffron)]"
                : "border-transparent opacity-75 hover:opacity-100",
            )}
          >
            <Image
              src={src}
              alt={`${alt} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
