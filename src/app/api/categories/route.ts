import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createCategoryId } from "@/lib/ids";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/format";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body: unknown = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        id: createCategoryId(),
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
