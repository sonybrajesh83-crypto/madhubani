import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createProductId } from "@/lib/ids";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/format";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(type === "PAINTING" || type === "SAREE" ? { type } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: { category: true, reviews: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body: unknown = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const id = createProductId();
    const product = await prisma.product.create({
      data: {
        id,
        name: parsed.data.name,
        slug: `${slugify(parsed.data.name)}-${id.slice(-4).toLowerCase()}`,
        description: parsed.data.description,
        longDescription: parsed.data.longDescription,
        price: parsed.data.price,
        compareAtPrice: parsed.data.compareAtPrice ?? null,
        categoryId: parsed.data.categoryId,
        type: parsed.data.type,
        motifKey: parsed.data.motifKey,
        stock: parsed.data.stock,
        featured: parsed.data.featured ?? false,
        customizable: parsed.data.customizable ?? true,
        artistNote: parsed.data.artistNote,
        sizesJson: JSON.stringify(["a4", "a3", "a2", "custom"]),
        framesJson: JSON.stringify(["none", "teak", "black", "float"]),
        colorsJson: JSON.stringify([
          "classic",
          "monochrome",
          "peacock",
          "lotus",
          "custom",
        ]),
        bordersJson: JSON.stringify(
          parsed.data.type === "SAREE"
            ? ["temple", "peacock", "fish", "minimal"]
            : ["fish", "lotus", "peacock", "geometric", "none"],
        ),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
