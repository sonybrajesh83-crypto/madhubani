"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ProductImage } from "@/components/store/productImage";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  BORDER_MOTIFS,
  COLOR_PALETTES,
  FRAME_OPTIONS,
  PAINTING_SIZES,
  SAREE_BORDERS,
} from "@/lib/constants";
import { useCartStore } from "@/lib/cartStore";
import type { Customization } from "@/lib/format";
import { formatInr } from "@/lib/format";
import { computeUnitPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    motifKey: string;
    type: "PAINTING" | "SAREE";
    imageUrl?: string | null;
    tagline?: string | null;
  };
};

export function CustomizeStudio({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [play, setPlay] = useState(false);
  const [customization, setCustomization] = useState<Customization>({
    sizeId: product.type === "PAINTING" ? "a3" : undefined,
    frameId: product.type === "PAINTING" ? "teak" : undefined,
    paletteId: "classic",
    borderId: "peacock",
    sareeBorderId: product.type === "SAREE" ? "peacock" : undefined,
    dedication: "",
    customNotes: "",
    playMotif: product.motifKey,
  });

  const unitPrice = useMemo(
    () => computeUnitPrice(product.price, customization),
    [product.price, customization],
  );

  function update<K extends keyof Customization>(key: K, value: Customization[K]) {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data: { url?: string; error?: string } = await response.json();
    if (data.url) update("referenceImageUrl", data.url);
  }

  function addToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      quantity: 1,
      motifKey: product.motifKey,
      imageUrl: product.imageUrl,
      type: product.type,
      customization,
    });
    router.push("/cart");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative">
        <motion.div
          layout
          animate={play ? { boxShadow: "0 0 0 4px rgba(230,57,43,0.35)" } : { boxShadow: "0 30px 80px rgba(11,29,54,0.12)" }}
          className="overflow-hidden border border-[var(--ink)]/10 bg-white"
        >
          <ProductImage
            imageUrl={product.imageUrl}
            motifKey={customization.playMotif || product.motifKey}
            alt={product.name}
            dedication={customization.dedication}
            className="aspect-[4/5] w-full"
          />
        </motion.div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setPlay((v) => !v)}>
            {play ? "Pause preview glow" : "Play preview glow"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--vermillion)]">
            Customize Studio
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            {product.name}
          </h1>
          {product.tagline ? (
            <p className="mt-2 text-sm italic text-[var(--teal)]">{product.tagline}</p>
          ) : null}
          <p className="mt-2 text-sm text-[var(--ink)]/60">
            Shape size, frame, color story, borders, dedication — anything you want. Your photo stays the hero.
          </p>
          <p className="mt-4 text-2xl font-semibold">{formatInr(unitPrice)}</p>
        </div>

        {product.type === "PAINTING" ? (
          <>
            <OptionGroup label="Size">
              {PAINTING_SIZES.map((size) => (
                <Choice
                  key={size.id}
                  active={customization.sizeId === size.id}
                  onClick={() => update("sizeId", size.id)}
                  title={size.label}
                  subtitle={size.priceDelta ? `+${formatInr(size.priceDelta)}` : "Base"}
                />
              ))}
            </OptionGroup>
            <OptionGroup label="Frame">
              {FRAME_OPTIONS.map((frame) => (
                <Choice
                  key={frame.id}
                  active={customization.frameId === frame.id}
                  onClick={() => update("frameId", frame.id)}
                  title={frame.label}
                  subtitle={frame.priceDelta ? `+${formatInr(frame.priceDelta)}` : "Included"}
                />
              ))}
            </OptionGroup>
            <OptionGroup label="Border motif">
              {BORDER_MOTIFS.map((border) => (
                <Choice
                  key={border.id}
                  active={customization.borderId === border.id}
                  onClick={() => update("borderId", border.id)}
                  title={border.label}
                />
              ))}
            </OptionGroup>
          </>
        ) : (
          <OptionGroup label="Saree border">
            {SAREE_BORDERS.map((border) => (
              <Choice
                key={border.id}
                active={customization.sareeBorderId === border.id}
                onClick={() => update("sareeBorderId", border.id)}
                title={border.label}
              />
            ))}
          </OptionGroup>
        )}

        <OptionGroup label="Color palette">
          {COLOR_PALETTES.map((paletteOption) => (
            <button
              key={paletteOption.id}
              type="button"
              onClick={() => update("paletteId", paletteOption.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2 text-left",
                customization.paletteId === paletteOption.id
                  ? "border-[var(--vermillion)]"
                  : "border-[var(--ink)]/10",
              )}
            >
              <div className="flex gap-1">
                {paletteOption.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ background: swatch }}
                  />
                ))}
              </div>
              <span className="text-sm">{paletteOption.label}</span>
            </button>
          ))}
        </OptionGroup>

        <div>
          <Label htmlFor="dedication">Dedication / text on art</Label>
          <Input
            id="dedication"
            maxLength={120}
            placeholder="For Aanya & Kabir — forever in Mithila light"
            value={customization.dedication || ""}
            onChange={(event) => update("dedication", event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Anything you want (custom request)</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="Describe blouse painting, family names, wedding date, preferred motifs, gift wrapping..."
            value={customization.customNotes || ""}
            onChange={(event) => update("customNotes", event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="ref">Upload reference photo</Label>
          <Input
            id="ref"
            type="file"
            accept="image/*"
            onChange={(event) => onUpload(event.target.files?.[0] || null)}
          />
          {customization.referenceImageUrl ? (
            <p className="mt-2 text-xs text-[var(--teal)]">
              Reference uploaded for the artist.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" size="lg" onClick={addToCart}>
            Add customized piece
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            Back to product
          </Button>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/50">
        {label}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Choice({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2 text-left transition",
        active
          ? "border-[var(--vermillion)] bg-[var(--vermillion)]/5"
          : "border-[var(--ink)]/10 hover:border-[var(--ink)]/30",
      )}
    >
      <div className="text-sm font-medium">{title}</div>
      {subtitle ? (
        <div className="text-xs text-[var(--ink)]/50">{subtitle}</div>
      ) : null}
    </button>
  );
}
