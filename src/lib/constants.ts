export const COMPANY = {
  name: "SHARDA MADHUBANI PAINTINGS",
  shortName: "Sharda Madhubani",
  artist: "Sharda Jha",
  founder: "Sharda Jha",
  coFounder: "Ayush Aryan",
  tagline: "Hand-painted folklore from Mithila, made for your home.",
  email: "hello@shardamadhubani.com",
  phone: "+91 98765 43210",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    "919876543210",
  address: "Mithila Art Atelier, Madhubani, Bihar, India",
} as const;

export const PAINTING_SIZES = [
  { id: "a4", label: "A4 (8×12 in)", priceDelta: 0 },
  { id: "a3", label: "A3 (12×16 in)", priceDelta: 300 },
  { id: "a2", label: "A2 (16×24 in)", priceDelta: 600 },
  { id: "custom", label: "Custom size", priceDelta: 900 },
] as const;

export const FRAME_OPTIONS = [
  { id: "none", label: "Rolled canvas / unframed", priceDelta: 0 },
  { id: "withFrame", label: "Buy with frame", priceDelta: 1000 },
  { id: "teak", label: "Teak wood frame", priceDelta: 250 },
  { id: "black", label: "Matte black frame", priceDelta: 200 },
  { id: "float", label: "Museum float frame", priceDelta: 400 },
] as const;

export const BUY_WITH_FRAME_PRICE = 1000;

export const COLOR_PALETTES = [
  { id: "classic", label: "Classic Mithila", swatches: ["#E6392B", "#F4C430", "#0B1D36", "#1F4D3A"] },
  { id: "monochrome", label: "Kohbar black & white", swatches: ["#111111", "#FAFAF8", "#555555"] },
  { id: "peacock", label: "Peacock teal", swatches: ["#0D7377", "#14A3A8", "#F4C430", "#E6392B"] },
  { id: "lotus", label: "Lotus dusk", swatches: ["#D94F70", "#7B2D8E", "#F4C430", "#0B1D36"] },
  { id: "custom", label: "Tell us your colors", swatches: ["#CCCCCC", "#999999"] },
] as const;

export const BORDER_MOTIFS = [
  { id: "fish", label: "Fish border" },
  { id: "lotus", label: "Lotus vines" },
  { id: "peacock", label: "Peacock feathers" },
  { id: "geometric", label: "Geometric lattice" },
  { id: "none", label: "No border" },
] as const;

export const SAREE_BORDERS = [
  { id: "temple", label: "Temple border" },
  { id: "peacock", label: "Peacock border" },
  { id: "fish", label: "Fish & lotus" },
  { id: "minimal", label: "Minimal line work" },
] as const;

export const MOTIF_KEYS = [
  "peacock",
  "fish",
  "lotus",
  "treeOfLife",
  "kohbar",
  "radhaKrishna",
  "elephant",
  "sun",
] as const;

export type MotifKey = (typeof MOTIF_KEYS)[number];
