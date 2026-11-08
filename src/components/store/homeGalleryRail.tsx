"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatInr } from "@/lib/format";
import { getGsap } from "@/lib/gsapClient";

type Piece = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  tagline: string | null;
};

export function HomeGalleryRail({ pieces }: { pieces: Piece[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set(".rail-heading", { clearProps: "opacity,visibility" });
      gsap.fromTo(
        ".rail-heading",
        { y: 24 },
        {
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        ".rail-card",
        { y: 28 },
        {
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".rail-track", start: "top 85%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [pieces.length]);

  return (
    <section ref={rootRef} className="relative bg-[#e8ecef] py-16 md:py-24">
      <div className="rail-heading mx-auto mb-10 max-w-7xl px-4 md:px-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--saffron-deep)]">
          Full collection
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl text-[var(--ink)] md:text-6xl">
          Walk the gallery wall
        </h2>
        <p className="mt-3 max-w-xl text-sm text-black/55 md:text-base">
          Swipe through all ten originals — each canvas photographed for the detail that makes Mithila sing.
        </p>
      </div>

      <div className="rail-track overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-5 px-4 md:gap-7 md:px-8">
          {pieces.map((piece) => (
            <Link
              key={piece.id}
              href={`/product/${piece.id}`}
              className="rail-card group w-[78vw] shrink-0 sm:w-[46vw] md:w-[30vw] lg:w-[24vw]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1f1a14]">
                <Image
                  src={piece.imageUrl || "/products/painting-01/01.jpg"}
                  alt={piece.name}
                  fill
                  className="object-cover object-center transition duration-700 group-hover:scale-[1.04]"
                  sizes="30vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-[var(--ink)] md:text-2xl">
                  {piece.name}
                </h3>
                {piece.tagline ? (
                  <p className="mt-1 line-clamp-1 text-sm italic text-black/50">
                    {piece.tagline}
                  </p>
                ) : null}
                <p className="mt-2 text-sm font-semibold">{formatInr(piece.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
