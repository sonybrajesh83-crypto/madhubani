import Link from "next/link";
import { notFound } from "next/navigation";
import { AmazonBuyBox } from "@/components/store/amazonBuyBox";
import { ImageGallery } from "@/components/store/imageGallery";
import { ProductPageMotion } from "@/components/store/productPageClient";
import { ReviewForm } from "@/components/store/reviewForm";
import { COMPANY } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { parseJsonArray } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) notFound();

  const user = await getCurrentUser();
  const tags = parseJsonArray(product.tagsJson);
  const gallery = parseJsonArray(product.imagesJson);
  const images =
    gallery.length > 0
      ? gallery
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const avg =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <ProductPageMotion>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="product-media">
            <ImageGallery images={images} alt={product.name} />
          </div>

          <div className="product-info space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--saffron-deep)]">
                {product.category.name} · {product.id}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-black/45">
                Madhubani Art | By {COMPANY.artist}
              </p>
              {product.tagline ? (
                <p className="mt-3 text-lg italic text-[var(--teal)]">
                  {product.tagline}
                </p>
              ) : null}
              {avg > 0 ? (
                <p className="mt-2 text-sm text-black/55">
                  {avg.toFixed(1)} ★ · {product.reviews.length} reviews
                </p>
              ) : null}
            </div>

            <p className="text-[var(--ink)]/70">
              {product.longDescription || product.description}
            </p>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.12em] text-black/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {product.artistNote ? (
              <p className="border-l-2 border-[var(--saffron)] pl-4 text-sm italic text-black/65">
                {product.artistNote}
              </p>
            ) : null}

            <AmazonBuyBox
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                motifKey: product.motifKey,
                imageUrl: product.imageUrl,
                type: product.type,
                stock: product.stock,
              }}
            />
          </div>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl">
              Collector reviews
            </h2>
            <div className="mt-6 space-y-4">
              {product.reviews.map((review) => (
                <article
                  key={review.id}
                  className="border border-black/10 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{review.title}</h3>
                    <span className="text-sm">{review.rating} ★</span>
                  </div>
                  <p className="mt-2 text-sm text-black/65">{review.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-black/35">
                    {review.customer.name}
                  </p>
                </article>
              ))}
              {product.reviews.length === 0 ? (
                <p className="text-sm text-black/45">
                  No reviews yet — be the first.
                </p>
              ) : null}
            </div>
          </div>
          {user ? (
            <ReviewForm productId={product.id} />
          ) : (
            <div className="border border-black/10 bg-white p-5 text-sm">
              <Link href="/login" className="text-[var(--saffron-deep)]">
                Sign in
              </Link>{" "}
              after purchase to write a review.
            </div>
          )}
        </section>
      </div>
    </ProductPageMotion>
  );
}
