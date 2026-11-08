import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await requireUser();
    const body: { orderId?: string } = await request.json();
    if (!body.orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: body.orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const demoMode =
      process.env.DEMO_PAYMENT_MODE === "true" ||
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID.includes("replace");

    if (demoMode) {
      const razorpayOrderId = `order_demo_${order.id}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId },
      });
      return NextResponse.json({
        demo: true,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.total * 100,
        currency: "INR",
        razorpayOrderId,
        orderId: order.id,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total * 100,
      currency: "INR",
      receipt: order.id,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      demo: false,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      orderId: order.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
