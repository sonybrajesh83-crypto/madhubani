"use client";

import { useEffect, useRef } from "react";
import { IndianRupee, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { getGsap } from "@/lib/gsapClient";

const items = [
  { icon: Truck, title: "Pan-India Delivery", copy: "Secure packaging for every canvas" },
  { icon: Sparkles, title: "Hand-Painted", copy: "Original Madhubani by Sharda Jha" },
  { icon: IndianRupee, title: "₹1,200 – ₹2,500", copy: "Fair atelier pricing" },
  { icon: ShieldCheck, title: "Secure Razorpay", copy: "UPI · Cards · Netbanking" },
];

export function TrustStrip() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".trust-item",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="border-y border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-8">
        {items.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="trust-item flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--saffron)]/20 text-[var(--ink)]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-1 text-xs text-black/50">{copy}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
