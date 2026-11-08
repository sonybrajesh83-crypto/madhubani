import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin, requireUser } from "@/lib/auth";
import { createOrderId } from "@/lib/ids";
import { checkoutSchema, customizationSchema } from "@/lib/validators";
import { computeUnitPrice } from "@/lib/pricing";
import type { Customization } from "@/lib/format";

type CartPayloadItem = {
  productId: string;
  quantity: number;
  customization: Customization;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (user.role === "ADMIN") {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  }

  const orders = await prisma.order.findMany({
    where: { customerId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: {
      checkout?: unknown;
      items?: CartPayloadItem[];
    } = await request.json();

    const checkout = checkoutSchema.safeParse(body.checkout);
    if (!checkout.success || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const lineItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      customizationJson: string;
    }> = [];

    let total = 0;

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} missing` },
          { status: 400 },
        );
      }
      const customization = customizationSchema.parse(item.customization || {});
      const unitPrice = computeUnitPrice(product.price, customization);
      const quantity = Math.max(1, item.quantity || 1);
      total += unitPrice * quantity;
      lineItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        customizationJson: JSON.stringify(customization),
      });
    }

    const order = await prisma.order.create({
      data: {
        id: createOrderId(),
        customerId: user.id,
        total,
        shippingName: checkout.data.shippingName,
        shippingAddress: checkout.data.shippingAddress,
        shippingCity: checkout.data.shippingCity,
        shippingState: checkout.data.shippingState,
        shippingPincode: checkout.data.shippingPincode,
        phone: checkout.data.phone,
        notes: checkout.data.notes,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: { create: lineItems },
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body: { id?: string; status?: string } = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const allowed = [
      "PENDING",
      "ACCEPTED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ] as const;

    if (!allowed.includes(body.status as (typeof allowed)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status as (typeof allowed)[number] },
    });

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
