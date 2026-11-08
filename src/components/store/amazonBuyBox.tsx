"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BUY_WITH_FRAME_PRICE } from "@/lib/constants";
import { useCartStore } from "@/lib/cartStore";
import { cn } from "@/lib/cn";
import { formatInr } from "@/lib/format";
import { computeUnitPrice } from "@/lib/pricing";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
    motifKey: string;
    imageUrl?: string | null;
    type: "PAINTING" | "SAREE";
    stock: number;
  };
};

export function AmazonBuyBox({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [qty, setQty] = useState(1);
  const [withFrame, setWithFrame] = useState(false);
  const [added, setAdded] = useState(false);

  const customization = withFrame ? { frameId: "withFrame" } : { frameId: "none" };
  const unitPrice = computeUnitPrice(product.price, customization);

  const savePercent =
    product.compareAtPrice && product.compareAtPrice > unitPrice
      ? Math.round(
          ((product.compareAtPrice - unitPrice) / product.compareAtPrice) * 100,
        )
      : 0;

  function pushToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity: qty,
      motifKey: product.motifKey,
      imageUrl: product.imageUrl,
      type: product.type,
      customization,
    });
  }

  function onAddToCart() {
    pushToCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function onBuyNow() {
    pushToCart();
    router.push("/checkout");
  }

  return (
    <div className="rounded-md border border-black/10 bg-[#fafafa] p-5">
      <div className="flex flex-wrap items-baseline gap-2">
        {product.compareAtPrice ? (
          <span className="text-base text-black/35 line-through">
            {formatInr(product.compareAtPrice)}
          </span>
        ) : null}
        <span className="text-3xl font-semibold text-[var(--ink)]">
          {formatInr(unitPrice)}
        </span>
        {savePercent > 0 ? (
          <span className="text-sm font-semibold text-[#cc0c39]">
            Save {savePercent}%
          </span>
        ) : null}
      </div>
      {withFrame ? (
        <p className="mt-1 text-sm text-black/55">
          Includes frame · +{formatInr(BUY_WITH_FRAME_PRICE)}
        </p>
      ) : null}
      <p className="mt-2 text-sm text-[#007600]">In stock</p>
      <p className="mt-1 text-xs text-black/50">
        Sold by SHARDA MADHUBANI PAINTINGS · Ships from atelier
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-[var(--ink)]">Frame</legend>
        <div className="mt-2 grid gap-2">
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-md border bg-white px-3 py-3 text-sm transition",
              !withFrame
                ? "border-[var(--saffron)] ring-1 ring-[var(--saffron)]"
                : "border-black/10 hover:border-black/25",
            )}
          >
            <input
              type="radio"
              name="frame-option"
              className="mt-1"
              checked={!withFrame}
              onChange={() => setWithFrame(false)}
            />
            <span>
              <span className="block font-medium text-[var(--ink)]">
                Without frame
              </span>
              <span className="block text-xs text-black/50">
                Rolled canvas · {formatInr(product.price)}
              </span>
            </span>
          </label>
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-md border bg-white px-3 py-3 text-sm transition",
              withFrame
                ? "border-[var(--saffron)] ring-1 ring-[var(--saffron)]"
                : "border-black/10 hover:border-black/25",
            )}
          >
            <input
              type="radio"
              name="frame-option"
              className="mt-1"
              checked={withFrame}
              onChange={() => setWithFrame(true)}
            />
            <span>
              <span className="block font-medium text-[var(--ink)]">
                Buy with frame
              </span>
              <span className="block text-xs text-black/50">
                Ready to hang · +{formatInr(BUY_WITH_FRAME_PRICE)} →{" "}
                {formatInr(product.price + BUY_WITH_FRAME_PRICE)}
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm text-black/60" htmlFor="qty">
          Qty:
        </label>
        <select
          id="qty"
          value={qty}
          onChange={(event) => setQty(Number(event.target.value))}
          className="rounded border border-black/15 bg-white px-3 py-1.5 text-sm"
        >
          {Array.from({ length: Math.min(5, product.stock) }, (_, i) => i + 1).map(
            (value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        <Button
          type="button"
          onClick={onAddToCart}
          className="w-full rounded-full bg-[#ffd814] text-[var(--ink)] hover:bg-[#f7ca00]"
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </Button>
        <Button
          type="button"
          onClick={onBuyNow}
          className="w-full rounded-full bg-[#ffa41c] text-[var(--ink)] hover:bg-[#fa8900]"
        >
          Buy Now
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-full"
          onClick={() => router.push(`/customize/${product.id}`)}
        >
          Customize before buying
        </Button>
      </div>

      <ul className="mt-4 space-y-1 text-xs text-black/55">
        <li>· Secure Razorpay checkout (UPI / Cards)</li>
        <li>· Hand-packed from Madhubani atelier</li>
        <li>· Order ID generated instantly after payment</li>
      </ul>
    </div>
  );
}
