import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review" }, { status: 400 });
    }

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId: parsed.data.productId,
        order: {
          customerId: user.id,
          paymentStatus: "PAID",
        },
      },
    });

    if (!purchased) {
      return NextResponse.json(
        { error: "Purchase this product before reviewing" },
        { status: 403 },
      );
    }

    const review = await prisma.review.upsert({
      where: {
        productId_customerId: {
          productId: parsed.data.productId,
          customerId: user.id,
        },
      },
      create: {
        productId: parsed.data.productId,
        customerId: user.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
      },
      update: {
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
