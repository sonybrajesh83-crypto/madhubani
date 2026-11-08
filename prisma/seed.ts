import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  createCategoryId,
  createCustomerId,
  createProductId,
} from "../src/lib/ids";
import { CATALOG } from "./catalog";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      id: createCustomerId(),
      email: "admin@shardamadhubani.com",
      name: "Sharda Jha",
      phone: "9876543210",
      role: "ADMIN",
      passwordHash: await bcrypt.hash("admin123", 10),
      address: "Mithila Art Atelier",
      city: "Madhubani",
      state: "Bihar",
      pincode: "847211",
    },
  });

  const customer = await prisma.user.create({
    data: {
      id: createCustomerId(),
      email: "collector@example.com",
      name: "Priya Sharma",
      phone: "9123456780",
      role: "CUSTOMER",
      passwordHash: await bcrypt.hash("collector123", 10),
      address: "12 Lake View Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
  });

  const categoryDefs = [
    {
      name: "Wall Paintings",
      slug: "wall-paintings",
      description: "Framed and unframed Madhubani canvases for living spaces.",
    },
    {
      name: "Madhubani Sarees",
      slug: "madhubani-sarees",
      description: "Hand-painted silk and cotton sarees with Mithila motifs.",
    },
    {
      name: "Wedding & Kohbar",
      slug: "wedding-kohbar",
      description: "Ceremonial Kohbar, vivah, and wedding blessing artworks.",
    },
    {
      name: "Nature Folklore",
      slug: "nature-folklore",
      description: "Forest, deer, garden, and tree-of-life storytelling pieces.",
    },
  ];

  const categories = [];
  for (const def of categoryDefs) {
    categories.push(
      await prisma.category.create({
        data: {
          id: createCategoryId(),
          name: def.name,
          slug: def.slug,
          description: def.description,
        },
      }),
    );
  }

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const createdProducts = [];
  for (const item of CATALOG) {
    const id = createProductId();
    const slug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(-4).toLowerCase()}`;
    const product = await prisma.product.create({
      data: {
        id,
        slug,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        longDescription: item.longDescription,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        categoryId: bySlug[item.categorySlug].id,
        type: "PAINTING",
        motifKey: item.motifKey,
        imageUrl: item.images[0],
        imagesJson: JSON.stringify(item.images),
        tagsJson: JSON.stringify(item.tags),
        featured: item.featured,
        artistNote: item.artistNote,
        sizesJson: JSON.stringify(["a4", "a3", "a2", "custom"]),
        framesJson: JSON.stringify(["none", "teak", "black", "float"]),
        colorsJson: JSON.stringify([
          "classic",
          "monochrome",
          "peacock",
          "lotus",
          "custom",
        ]),
        bordersJson: JSON.stringify([
          "fish",
          "lotus",
          "peacock",
          "geometric",
          "none",
        ]),
        stock: 5,
        customizable: true,
      },
    });
    createdProducts.push(product);
  }

  const reviewTarget =
    createdProducts.find((p) => p.featured) || createdProducts[0];
  if (reviewTarget) {
    await prisma.review.create({
      data: {
        productId: reviewTarget.id,
        customerId: customer.id,
        rating: 5,
        title: "Feels like a real gallery piece",
        body: "Photos matched the painting perfectly. Multiple angles helped me choose with confidence.",
      },
    });
  }

  console.log(`Seeded ${createdProducts.length} paintings (with galleries)`);
  console.log("Admin:", admin.email, "/ admin123");
  console.log("Customer:", customer.email, "/ collector123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
