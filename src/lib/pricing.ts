import {
  COLOR_PALETTES,
  FRAME_OPTIONS,
  PAINTING_SIZES,
  SAREE_BORDERS,
} from "@/lib/constants";
import type { Customization } from "@/lib/format";

export function computeUnitPrice(basePrice: number, customization: Customization) {
  let total = basePrice;

  const size = PAINTING_SIZES.find((entry) => entry.id === customization.sizeId);
  if (size) total += size.priceDelta;

  const frame = FRAME_OPTIONS.find((entry) => entry.id === customization.frameId);
  if (frame) total += frame.priceDelta;

  if (customization.paletteId === "custom") total += 150;
  if (customization.dedication?.trim()) total += 100;
  if (customization.referenceImageUrl) total += 200;
  if (customization.customNotes && customization.customNotes.length > 40) {
    total += 150;
  }

  if (customization.sareeBorderId) {
    const border = SAREE_BORDERS.find(
      (entry) => entry.id === customization.sareeBorderId,
    );
    if (border && border.id !== "minimal") total += 200;
  }

  void COLOR_PALETTES;
  return total;
}
