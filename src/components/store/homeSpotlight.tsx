"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { formatInr } from "@/lib/format";
import { getGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/cn";

type Piece = {
  id: string;
  name: string;
  tagline: string | null;
  description: string;
  price: number;
  imageUrl: string | null;
};

export function HomeSpotlight({
  piece,
  reverse = false,
}: {
  piece: Piece;
  reverse?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".spot-stage",
        { y: 36 },
        {
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        },
      );
      gsap.fromTo(
        ".spot-copy > *",
        { y: 20 },
        {
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 68%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(
        "px-4 py-20 md:px-8 md:py-28",
        reverse ? "bg-[#eef2f5]" : "bg-[#f6f7f9]",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16",
          reverse && "md:[&>*:first-child]:order-2",
        )}
      >
        <div className="spot-stage relative aspect-[3/4] overflow-hidden bg-[#1f1a14] md:aspect-[4/5]">
          <Image
            src={piece.imageUrl || "/products/painting-01/01.jpg"}
            alt={piece.name}
            fill
            className="object-cover object-center"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="spot-copy">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--saffron-deep)]">
            Spotlight · by {COMPANY.artist}
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-serif)] text-4xl text-[var(--ink)] md:text-5xl lg:text-6xl">
            {piece.name}
          </h2>
          {piece.tagline ? (
            <p className="mt-4 text-lg italic text-[var(--teal)]">{piece.tagline}</p>
          ) : null}
          <p className="mt-5 max-w-md text-black/60">{piece.description}</p>
          <p className="mt-6 text-2xl font-semibold text-[var(--ink)]">
            {formatInr(piece.price)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/product/${piece.id}`}>
              <Button className="rounded-full bg-[var(--saffron)] text-[var(--ink)] hover:bg-[#f0a020]">
                View painting
              </Button>
            </Link>
            <Link href={`/customize/${piece.id}`}>
              <Button variant="secondary" className="rounded-full">
                Customize
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
