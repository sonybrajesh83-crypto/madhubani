import type { Category, Product } from "@prisma/client";
import Link from "next/link";
import { CollectionHeader } from "@/components/store/collectionHeader";
import { ProductCard } from "@/components/store/productCard";
import { TrustStrip } from "@/components/store/trustStrip";
import { cn } from "@/lib/cn";
import { parseJsonArray } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    type?: string;
    category?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const type =
    params.type === "PAINTING" || params.type === "SAREE" ? params.type : undefined;
  const sort = params.sort || "featured";

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(params.category ? { category: { slug: params.category } } : {}),
        ...(params.q
          ? {
              OR: [
                { name: { contains: params.q } },
                { description: { contains: params.q } },
                { tagline: { contains: params.q } },
              ],
            }
          : {}),
      },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "price-desc"
            ? { price: "desc" }
            : sort === "newest"
              ? { createdAt: "desc" }
              : [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="bg-white">
      <CollectionHeader
        title="Genuine Madhubani Paintings & Artworks"
        subtitle="Ten original hand-painted Madhubani canvases by Sharda Jha — each listing shows multiple studio photos of the same painting. Customize, Add to Cart, or Buy Now with Razorpay."
        count={products.length}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/shop" active={!type && !params.category}>
            All
          </FilterChip>
          <FilterChip href="/shop?type=PAINTING" active={type === "PAINTING"}>
            Paintings
          </FilterChip>
          {categories.map((category: Category) => (
            <FilterChip
              key={category.id}
              href={`/shop?category=${category.slug}`}
              active={params.category === category.slug}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search artworks"
              className="min-w-[180px] rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--saffron)]"
            />
            <button className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white">
              Search
            </button>
          </form>
          <div className="flex gap-2 text-xs">
            <SortLink href="/shop?sort=featured" active={sort === "featured"}>
              Best selling
            </SortLink>
            <SortLink href="/shop?sort=price-asc" active={sort === "price-asc"}>
              Price ↑
            </SortLink>
            <SortLink href="/shop?sort=price-desc" active={sort === "price-desc"}>
              Price ↓
            </SortLink>
            <SortLink href="/shop?sort=newest" active={sort === "newest"}>
              Newest
            </SortLink>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-12 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 md:px-8">
        {products.map((product: Product, index: number) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            motifKey={product.motifKey}
            type={product.type}
            description={product.description}
            imageUrl={product.imageUrl}
            tagline={product.tagline}
            tags={parseJsonArray(product.tagsJson)}
            index={index}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="pb-20 text-center text-black/45">No pieces matched your filters.</p>
      ) : null}

      <TrustStrip />

      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--ink)]">
          About Madhubani Art
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-black/60 md:text-base">
          Madhubani painting, also known as Mithila art, fills every inch of the canvas with
          meaning — fish for fertility, peacocks for love, trees for long life, lotus for the
          feminine divine. At SHARDA MADHUBANI PAINTINGS, every piece is hand-painted by
          founder-artist Sharda Jha, with co-founder Ayush Aryan bringing the atelier online so
          collectors can customize, order, and connect with the studio.
        </p>
      </section>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition",
        active
          ? "border-[var(--saffron)] bg-[var(--saffron)] text-[var(--ink)]"
          : "border-black/10 bg-white text-black/70 hover:border-[var(--saffron)]",
      )}
    >
      {children}
    </Link>
  );
}

function SortLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 uppercase tracking-[0.12em]",
        active ? "bg-black/5 text-[var(--ink)]" : "text-black/40 hover:text-[var(--ink)]",
      )}
    >
      {children}
    </Link>
  );
}
