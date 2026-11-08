"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { useCartStore } from "@/lib/cartStore";
import { cn } from "@/lib/cn";
import { getGsap } from "@/lib/gsapClient";

type Props = {
  userName?: string | null;
  isAdmin?: boolean;
};

export function Navbar({ userName, isAdmin }: Props) {
  const count = useCartStore((state) => state.count());
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const header = headerRef.current;
    if (header) {
      gsap.fromTo(
        header,
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out" },
      );
    }

    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow",
        scrolled ? "border-black/10 shadow-sm" : "border-black/5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="min-w-0">
          <div className="font-[family-name:var(--font-serif)] text-xl leading-none text-[var(--ink)] md:text-2xl">
            {COMPANY.shortName}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--saffron-deep)]">
            Reflections of Mithila · {COMPANY.artist}
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-[13px] font-medium text-[var(--ink)] lg:flex">
          <Link href="/" className="hover:text-[var(--saffron-deep)]">
            Home
          </Link>
          <Link href="/shop?sort=newest" className="hover:text-[var(--saffron-deep)]">
            New Arrivals
          </Link>
          <Link href="/shop?sort=featured" className="hover:text-[var(--saffron-deep)]">
            Bestsellers
          </Link>
          <Link href="/shop" className="hover:text-[var(--saffron-deep)]">
            Wall Art
          </Link>
          <Link href="/shop?category=wedding-kohbar" className="hover:text-[var(--saffron-deep)]">
            Wedding Art
          </Link>
          <Link href="/about" className="hover:text-[var(--saffron-deep)]">
            Atelier
          </Link>
          <Link href="/shop" className="inline-flex items-center gap-1 hover:text-[var(--saffron-deep)]">
            Handmade
            <span className="rounded bg-[#2f80ed] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-black/10 px-3 py-1.5 text-xs md:inline"
            >
              Admin
            </Link>
          ) : null}
          <Link href="/shop" className="rounded-full p-2 hover:bg-black/5" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/account" className="rounded-full p-2 hover:bg-black/5" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href={userName ? "/account" : "/login"}
            className="rounded-full p-2 hover:bg-black/5"
            aria-label="Account"
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 hover:bg-black/5"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--saffron)] px-1 text-[10px] font-bold text-[var(--ink)]">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
