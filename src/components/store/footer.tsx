import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="font-[family-name:var(--font-serif)] text-2xl">{COMPANY.name}</div>
          <p className="mt-3 max-w-md text-sm text-white/65">{COMPANY.tagline}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--saffron)]">
            Artist & Founder · {COMPANY.founder}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">
            Co-founder · {COMPANY.coFounder}
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.16em] text-white/40">Shop</div>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <Link href="/shop">All Madhubani</Link>
            <Link href="/shop?sort=featured">Bestsellers</Link>
            <Link href="/shop?category=wedding-kohbar">Wedding art</Link>
            <Link href="/shop?category=nature-folklore">Nature folklore</Link>
          </div>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.16em] text-white/40">Studio</div>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <Link href="/about">About us</Link>
            <Link href="/chat">Studio chat</Link>
            <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <p className="pt-2 text-white/55">{COMPANY.email}</p>
            <p className="text-white/55">{COMPANY.phone}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
