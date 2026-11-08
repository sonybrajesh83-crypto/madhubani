import type { Product } from "@prisma/client";
import { HomeCtaBand } from "@/components/store/homeCtaBand";
import { HomeFeaturedWall } from "@/components/store/homeFeaturedWall";
import { HomeGalleryRail } from "@/components/store/homeGalleryRail";
import { HomeHero } from "@/components/store/homeHero";
import { HomeSpotlight } from "@/components/store/homeSpotlight";
import { TrustStrip } from "@/components/store/trustStrip";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { price: "desc" }],
  });

  const wall = products.slice(0, 4).map((product: Product) => ({
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    price: product.price,
    imageUrl: product.imageUrl,
  }));

  const rail = products.map((product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    tagline: product.tagline,
  }));

  const spotlightA =
    products.find((p: Product) => p.name.includes("Ganesha")) || products[0];
  const spotlightB =
    products.find(
      (p: Product) => p.name.includes("Doli") || p.name.includes("Vivah"),
    ) || products[1];

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <HomeFeaturedWall pieces={wall} />
      {spotlightA ? (
        <HomeSpotlight
          piece={{
            id: spotlightA.id,
            name: spotlightA.name,
            tagline: spotlightA.tagline,
            description: spotlightA.description,
            price: spotlightA.price,
            imageUrl: spotlightA.imageUrl,
          }}
        />
      ) : null}
      <HomeGalleryRail pieces={rail} />
      {spotlightB ? (
        <HomeSpotlight
          reverse
          piece={{
            id: spotlightB.id,
            name: spotlightB.name,
            tagline: spotlightB.tagline,
            description: spotlightB.description,
            price: spotlightB.price,
            imageUrl: spotlightB.imageUrl,
          }}
        />
      ) : null}
      <HomeCtaBand />
    </>
  );
}
