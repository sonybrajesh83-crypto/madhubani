import { NextResponse } from "next/server";
import crypto from "crypto";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await requireUser();
    const body: {
      orderId?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      demo?: boolean;
    } = await request.json();

    if (!body.orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const demoMode =
      body.demo ||
      process.env.DEMO_PAYMENT_MODE === "true" ||
      !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET.includes("replace");

    if (!demoMode) {
      const payload = `${body.razorpayOrderId}|${body.razorpayPaymentId}`;
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(payload)
        .digest("hex");
      if (expected !== body.razorpaySignature) {
        await prisma.order.update({
          where: { id: body.orderId },
          data: { paymentStatus: "FAILED" },
        });
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const order = await prisma.order.update({
      where: { id: body.orderId },
      data: {
        paymentStatus: "PAID",
        status: "ACCEPTED",
        paymentId: body.razorpayPaymentId || `pay_demo_${Date.now()}`,
        razorpayOrderId: body.razorpayOrderId,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
