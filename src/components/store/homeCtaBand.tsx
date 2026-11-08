"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { getGsap } from "@/lib/gsapClient";

export function HomeCtaBand() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-copy > *",
        { y: 24 },
        {
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/products/painting-08/01.jpg"
          alt="Madhubani painting by Sharda Jha"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1a1510]/78" />
      </div>
      <div className="cta-copy relative mx-auto max-w-4xl px-4 py-24 text-center text-white md:py-32">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--saffron)]">
          Founded by {COMPANY.founder}
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-serif)] text-4xl md:text-6xl">
          Bring Mithila home
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70">
          Choose a painting, customize it, and order with Add to Cart or Buy Now.
          Co-founded by {COMPANY.coFounder}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop">
            <Button className="rounded-full bg-[var(--saffron)] text-[var(--ink)] hover:bg-[#f0a020]">
              Shop all 10 paintings
            </Button>
          </Link>
          <Link href="/chat">
            <Button
              variant="secondary"
              className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              Talk to studio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
