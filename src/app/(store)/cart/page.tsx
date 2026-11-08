"use client";

import Link from "next/link";
import { ProductImage } from "@/components/store/productImage";
import { Button } from "@/components/ui/button";
import { FRAME_OPTIONS } from "@/lib/constants";
import { useCartStore } from "@/lib/cartStore";
import { formatInr } from "@/lib/format";

function frameLabel(frameId: string | undefined) {
  if (!frameId) return null;
  const match = FRAME_OPTIONS.find((entry) => entry.id === frameId);
  return match?.label ?? `Frame ${frameId}`;
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.total());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 text-[var(--ink)]/60">
          Cart is empty.{" "}
          <Link href="/shop" className="text-[var(--vermillion)]">
            Browse the atelier
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="grid gap-4 border border-[var(--ink)]/10 bg-white p-4 md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative h-36 overflow-hidden border border-[var(--ink)]/10">
                <ProductImage
                  imageUrl={item.imageUrl}
                  motifKey={item.motifKey}
                  alt={item.name}
                  dedication={item.customization.dedication}
                  className="h-full w-full"
                />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{item.name}</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
                  {item.productId} · {item.type}
                </p>
                <p className="mt-2 text-sm text-[var(--ink)]/60">
                  {item.customization.sizeId ? `Size ${item.customization.sizeId}` : null}
                  {item.customization.frameId
                    ? `${item.customization.sizeId ? " · " : ""}${frameLabel(item.customization.frameId)}`
                    : null}
                  {item.customization.paletteId
                    ? ` · ${item.customization.paletteId} palette`
                    : null}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    className="h-8 w-8 rounded-full border"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="h-8 w-8 rounded-full border"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-sm text-[var(--vermillion)]"
                    onClick={() => removeItem(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatInr(item.price * item.quantity)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[var(--ink)]/10 pt-6">
            <div className="text-2xl font-semibold">{formatInr(total)}</div>
            <Link href="/checkout">
              <Button size="lg">Proceed to checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
