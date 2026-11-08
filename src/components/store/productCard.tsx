"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/store/productImage";
import { COMPANY } from "@/lib/constants";
import { formatInr } from "@/lib/format";
import { getGsap } from "@/lib/gsapClient";
import { useCartStore } from "@/lib/cartStore";

type Props = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  motifKey: string;
  type: string;
  description: string;
  imageUrl?: string | null;
  tagline?: string | null;
  tags?: string[];
  index?: number;
};

export function ProductCard({
  id,
  name,
  price,
  compareAtPrice,
  motifKey,
  type,
  imageUrl,
  tagline,
  index = 0,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const savePercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  useEffect(() => {
    const { gsap } = getGsap();
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          delay: (index % 6) * 0.06,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
          },
        },
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  function onEnter() {
    const { gsap } = getGsap();
    const image = imageWrapRef.current?.querySelector("img");
    const quickCart = cardRef.current?.querySelector(".quick-cart");
    if (image) {
      gsap.to(image, { scale: 1.08, duration: 0.7, ease: "power2.out" });
    }
    if (quickCart) {
      gsap.to(quickCart, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
    }
  }

  function onLeave() {
    const { gsap } = getGsap();
    const image = imageWrapRef.current?.querySelector("img");
    const quickCart = cardRef.current?.querySelector(".quick-cart");
    if (image) {
      gsap.to(image, { scale: 1, duration: 0.7, ease: "power2.out" });
    }
    if (quickCart) {
      gsap.to(quickCart, { y: 18, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }

  function quickAdd(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      motifKey,
      imageUrl,
      type: type === "SAREE" ? "SAREE" : "PAINTING",
      customization: {},
    });
  }

  return (
    <article
      ref={cardRef}
      className="group text-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link href={`/product/${id}`} className="block">
        <div
          ref={imageWrapRef}
          className="relative aspect-square overflow-hidden rounded-md bg-[#f3f3f3] shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <ProductImage
            imageUrl={imageUrl}
            motifKey={motifKey}
            alt={name}
            className="h-full w-full"
          />
          {savePercent > 0 ? (
            <span className="absolute left-3 top-3 rounded-sm bg-[var(--saffron)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
              Save {savePercent}%
            </span>
          ) : null}
          <button
            type="button"
            onClick={quickAdd}
            className="quick-cart absolute inset-x-4 bottom-4 translate-y-[18px] rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white opacity-0"
          >
            Add To Cart
          </button>
        </div>
        <h3 className="mt-4 px-2 font-[family-name:var(--font-serif)] text-lg leading-snug text-[var(--ink)] transition group-hover:text-[var(--saffron-deep)] md:text-xl">
          {name}
        </h3>
        <p className="mt-1 text-xs tracking-wide text-black/45">
          Madhubani Art | By {COMPANY.artist}
        </p>
        {tagline ? (
          <p className="mx-auto mt-2 max-w-[34ch] text-xs italic text-black/40 line-clamp-1">
            {tagline}
          </p>
        ) : null}
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          {compareAtPrice ? (
            <span className="text-black/35 line-through">{formatInr(compareAtPrice)}</span>
          ) : null}
          <span className="font-semibold text-[var(--ink)]">{formatInr(price)}</span>
          {savePercent > 0 ? (
            <span className="text-xs font-semibold text-[var(--saffron-deep)]">
              | Save {savePercent}%
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
