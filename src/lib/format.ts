export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed: string[] = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type Customization = {
  sizeId?: string;
  frameId?: string;
  paletteId?: string;
  borderId?: string;
  sareeBorderId?: string;
  dedication?: string;
  customNotes?: string;
  referenceImageUrl?: string;
  playMotif?: string;
};

export function parseCustomization(value: string): Customization {
  try {
    const parsed: Customization = JSON.parse(value);
    return parsed ?? {};
  } catch {
    return {};
  }
}
