"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatInr } from "@/lib/format";
import { getGsap } from "@/lib/gsapClient";
import { cn } from "@/lib/cn";

type Piece = {
  id: string;
  name: string;
  tagline: string | null;
  price: number;
  imageUrl: string | null;
};

export function HomeFeaturedWall({ pieces }: { pieces: Piece[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [lead, a, b, c] = pieces;

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set([".wall-title", ".wall-piece"], { clearProps: "opacity,visibility" });
      gsap.fromTo(
        ".wall-title",
        { y: 36 },
        {
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
      gsap.fromTo(
        ".wall-piece",
        { y: 48 },
        {
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".wall-grid", start: "top 78%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  if (!lead) return null;

  return (
    <section ref={rootRef} className="bg-[#12100e] px-4 py-20 text-white md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="wall-title mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--saffron)]">
            Featured wall
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-4xl md:text-6xl">
            Artworks that hold a room
          </h2>
          <p className="mt-4 max-w-lg text-sm text-white/55 md:text-base">
            Full compositions on a dark gallery wall — click any piece to explore angles.
          </p>
        </div>

        <div className="wall-grid grid gap-5 md:grid-cols-12 md:gap-6">
          <Link href={`/product/${lead.id}`} className="wall-piece group md:col-span-7">
            <Frame
              src={lead.imageUrl || "/products/painting-01/01.jpg"}
              alt={lead.name}
              sizes="(max-width:768px) 100vw, 58vw"
              className="aspect-[4/5] md:min-h-[560px]"
            />
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl">
                  {lead.name}
                </h3>
                {lead.tagline ? (
                  <p className="mt-1 text-sm text-white/55">{lead.tagline}</p>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-[var(--saffron)]">
                {formatInr(lead.price)}
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-5 md:col-span-5 md:gap-6">
            {a ? (
              <Link href={`/product/${a.id}`} className="wall-piece group flex-1">
                <Frame
                  src={a.imageUrl || "/products/painting-02/01.jpg"}
                  alt={a.name}
                  sizes="(max-width:768px) 100vw, 40vw"
                  className="aspect-[3/4] md:aspect-auto md:h-full md:min-h-[280px]"
                />
                <p className="mt-3 font-[family-name:var(--font-serif)] text-xl">{a.name}</p>
                <p className="mt-1 text-sm text-[var(--saffron)]">{formatInr(a.price)}</p>
              </Link>
            ) : null}
            <div className="grid grid-cols-2 gap-5">
              {b ? (
                <Link href={`/product/${b.id}`} className="wall-piece group">
                  <Frame
                    src={b.imageUrl || "/products/painting-03/01.jpg"}
                    alt={b.name}
                    sizes="20vw"
                    className="aspect-[3/4]"
                  />
                  <p className="mt-3 font-[family-name:var(--font-serif)] text-lg leading-snug">
                    {b.name}
                  </p>
                </Link>
              ) : null}
              {c ? (
                <Link href={`/product/${c.id}`} className="wall-piece group">
                  <Frame
                    src={c.imageUrl || "/products/painting-04/01.jpg"}
                    alt={c.name}
                    sizes="20vw"
                    className="aspect-[3/4]"
                  />
                  <p className="mt-3 font-[family-name:var(--font-serif)] text-lg leading-snug">
                    {c.name}
                  </p>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Frame({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#2a241c]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
        sizes={sizes}
      />
    </div>
  );
}
