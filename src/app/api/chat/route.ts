import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin, requireUser } from "@/lib/auth";
import { messageSchema } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (user.role === "ADMIN") {
    const conversations = await prisma.conversation.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ conversations });
  }

  const conversations = await prisma.conversation.findMany({
    where: { customerId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    let conversationId = parsed.data.conversationId;

    if (!conversationId) {
      if (user.role === "ADMIN") {
        return NextResponse.json(
          { error: "Admin must reply in an existing conversation" },
          { status: 400 },
        );
      }
      const conversation = await prisma.conversation.create({
        data: {
          customerId: user.id,
          subject: parsed.data.subject || "Studio enquiry",
        },
      });
      conversationId = conversation.id;
    } else if (user.role === "ADMIN") {
      await requireAdmin();
    } else {
      const owned = await prisma.conversation.findFirst({
        where: { id: conversationId, customerId: user.id },
      });
      if (!owned) {
        return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        body: parsed.data.body,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date(), status: "OPEN" },
    });

    return NextResponse.json({ conversationId, message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
