import { MadhubaniArt } from "@/components/graphics/madhubaniArt";
import { COMPANY } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--vermillion)]">Atelier</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">
          {COMPANY.name}
        </h1>
        <p className="mt-6 text-lg text-[var(--ink)]/70">{COMPANY.tagline}</p>
        <div className="mt-8 space-y-4 text-[var(--ink)]/75">
          <p>
            <strong>Artist & Founder:</strong> {COMPANY.founder} — keeping Mithila’s line,
            myth, and color alive through paintings and hand-painted sarees.
          </p>
          <p>
            <strong>Co-founder:</strong> {COMPANY.coFounder} — building a digital atelier so
            collectors everywhere can customize, order, and converse with the studio.
          </p>
          <p>{COMPANY.address}</p>
        </div>
      </div>
      <div className="overflow-hidden border border-[var(--ink)]/10 bg-white">
        <MadhubaniArt motifKey="treeOfLife" className="aspect-[3/4] w-full" />
      </div>
    </div>
  );
}
