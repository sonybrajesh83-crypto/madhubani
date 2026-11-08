"use client";

import { useEffect, useRef } from "react";
import { COMPANY } from "@/lib/constants";
import { getGsap } from "@/lib/gsapClient";

export function WhatsappFab() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 1, ease: "back.out(1.6)" },
    );

    const pulse = gsap.to(el, {
      scale: 1.05,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2,
    });

    return () => {
      pulse.kill();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi Sharda Madhubani studio!")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-5 z-[55] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">WA</span>
      WhatsApp Us
    </a>
  );
}
