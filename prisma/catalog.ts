export type CatalogItem = {
  folder: string;
  images: string[];
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice: number;
  categorySlug: string;
  motifKey: string;
  tags: string[];
  featured: boolean;
  artistNote: string;
};

function gallery(folder: string, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `/products/${folder}/${n}.jpg`;
  });
}

/** Exactly 10 original paintings — each folder is one artwork with multiple studio photos */
export const CATALOG: CatalogItem[] = [
  {
    folder: "painting-01",
    images: gallery("painting-01", 4),
    name: "Symphony of the Woods",
    tagline: "Where music meets the Mithila forest.",
    description:
      "Two women in a dense Madhubani grove — one with a veena — framed by kalash and leaf-pot borders.",
    longDescription:
      "Hand-painted on canvas by Sharda Jha. A lyrical forest narrative with kachni linework, earthen pots, and traditional double borders. Multiple studio angles included in the gallery.",
    price: 2200,
    compareAtPrice: 2500,
    categorySlug: "nature-folklore",
    motifKey: "treeOfLife",
    tags: ["forest", "veena", "women", "handmade"],
    featured: true,
    artistNote: "Original canvas · 4 studio photos",
  },
  {
    folder: "painting-02",
    images: gallery("painting-02", 4),
    name: "Woman & Spotted Deer",
    tagline: "A bond beyond words.",
    description:
      "Village woman with a golden spotted deer beside a yellow cottage — harmony of human and nature.",
    longDescription:
      "Warm Madhubani storytelling with petal borders and striped tree trunks. A cheerful piece for family living rooms.",
    price: 2300,
    compareAtPrice: 2500,
    categorySlug: "nature-folklore",
    motifKey: "elephant",
    tags: ["deer", "cottage", "nature", "harmony"],
    featured: true,
    artistNote: "Original canvas · 4 studio photos",
  },
  {
    folder: "painting-03",
    images: gallery("painting-03", 5),
    name: "Radha Krishna Whisper",
    tagline: "Eternal love, drawn in Mithila ink.",
    description:
      "Radha and Krishna in divine closeness with peacock, lotus river, and ornate Mithila borders.",
    longDescription:
      "Mythological Madhubani of eternal love — peacock accents, jewelry detail, and Yamuna lotus fields. Perfect wedding or anniversary gift.",
    price: 2400,
    compareAtPrice: 2500,
    categorySlug: "wedding-kohbar",
    motifKey: "radhaKrishna",
    tags: ["radha krishna", "peacock", "love", "wedding gift"],
    featured: true,
    artistNote: "Original canvas · 5 studio photos",
  },
  {
    folder: "painting-04",
    images: gallery("painting-04", 4),
    name: "Lord Ganesha on Lotus",
    tagline: "Begin every home with blessings.",
    description:
      "Four-armed Ganesha on a pink lotus with mushika, radiant halo, and vine border.",
    longDescription:
      "Auspicious Madhubani Ganesha for entrances, offices, and Griha Pravesh. Hand-painted by Sharda Jha with classic bharni fills.",
    price: 2500,
    compareAtPrice: 2800,
    categorySlug: "wall-paintings",
    motifKey: "lotus",
    tags: ["ganesha", "auspicious", "lotus", "entrance"],
    featured: true,
    artistNote: "Original canvas · 4 studio photos",
  },
  {
    folder: "painting-05",
    images: gallery("painting-05", 7),
    name: "Krishna & Gopis at Yamuna",
    tagline: "Divine play on the riverbank.",
    description:
      "Krishna with flute under the kadamba tree as gopis rise from blue Yamuna waters with lotus blooms.",
    longDescription:
      "Full narrative Madhubani of Krishna leela — leaf canopy, river ripples, and floral outer border. A statement mythology piece.",
    price: 2500,
    compareAtPrice: 2800,
    categorySlug: "wedding-kohbar",
    motifKey: "radhaKrishna",
    tags: ["krishna", "gopis", "yamuna", "leela"],
    featured: true,
    artistNote: "Original canvas · 7 studio photos",
  },
  {
    folder: "painting-06",
    images: gallery("painting-06", 4),
    name: "Fish Pond & Forest Duet",
    tagline: "Water, love, and birdsong in one canvas.",
    description:
      "Triptych Madhubani — fish & lotus pond above, couple in the middle, birds in a flowering forest below.",
    longDescription:
      "Dense storytelling panel uniting fertility fish motifs with romantic foliage. Rich red-green diamond borders.",
    price: 2350,
    compareAtPrice: 2600,
    categorySlug: "nature-folklore",
    motifKey: "fish",
    tags: ["fish", "lotus", "forest", "birds"],
    featured: true,
    artistNote: "Original canvas · 4 studio photos",
  },
  {
    folder: "painting-07",
    images: gallery("painting-07", 4),
    name: "Family Blessings",
    tagline: "Love cradled in Mithila green.",
    description:
      "Two tender family scenes — parents with child above, mother cradling infant below — among peacocks and flowers.",
    longDescription:
      "Warm Madhubani celebrating kinship and motherhood. Ideal gift for new parents and family homes.",
    price: 2100,
    compareAtPrice: 2400,
    categorySlug: "wall-paintings",
    motifKey: "peacock",
    tags: ["family", "motherhood", "peacock", "gift"],
    featured: false,
    artistNote: "Original canvas · 4 studio photos",
  },
  {
    folder: "painting-08",
    images: gallery("painting-08", 6),
    name: "Mithila Vivah Ceremony",
    tagline: "A hand-painted tale of tradition.",
    description:
      "Vertical wedding ceremony with jaimala, offerings, and five ceremonial figures in festive attire.",
    longDescription:
      "Authentic Sharda Jha vivah panel — dense pattern, festive palette, sawtooth border. Made for mandap and wedding décor walls.",
    price: 2500,
    compareAtPrice: 2800,
    categorySlug: "wedding-kohbar",
    motifKey: "kohbar",
    tags: ["wedding", "jaimala", "ceremony", "vertical"],
    featured: true,
    artistNote: "Original canvas · 6 studio photos",
  },
  {
    folder: "painting-09",
    images: gallery("painting-09", 5),
    name: "Enchanted Garden Gopis",
    tagline: "Every stroke tells a garden story.",
    description:
      "Five gopis in a flowering blue-green garden framed by a red diamond Madhubani border.",
    longDescription:
      "Lush vertical garden narrative for feature walls and studios. Blue sky patches through dense green leaves.",
    price: 2450,
    compareAtPrice: 2750,
    categorySlug: "nature-folklore",
    motifKey: "treeOfLife",
    tags: ["gopis", "garden", "vertical", "folklore"],
    featured: true,
    artistNote: "Original canvas · 5 studio photos",
  },
  {
    folder: "painting-10",
    images: gallery("painting-10", 7),
    name: "Bridal Doli Procession",
    tagline: "A journey of tradition — the Vidai ceremony.",
    description:
      "Bride in a fish-crowned palanquin carried by bearers through a flowering Madhubani landscape.",
    longDescription:
      "Classic Madhubani doli scene symbolising fertility and new beginnings. Intricate blue-pink geometric border.",
    price: 2400,
    compareAtPrice: 2700,
    categorySlug: "wedding-kohbar",
    motifKey: "kohbar",
    tags: ["doli", "wedding", "vidai", "bride"],
    featured: true,
    artistNote: "Original canvas · 7 studio photos",
  },
];
