import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatInr } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

type Props = { searchParams: Promise<{ success?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const orders = await prisma.order.findMany({
    where: { customerId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Your orders</h1>
      {params.success ? (
        <div className="mt-4 border border-[var(--teal)]/30 bg-[var(--teal)]/10 px-4 py-3 text-sm">
          Payment successful for order <strong>{params.success}</strong>. The studio has accepted it.
        </div>
      ) : null}
      <div className="mt-8 space-y-4">
        {orders.map((order: OrderWithItems) => (
          <article key={order.id} className="border border-[var(--ink)]/10 bg-white p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="font-semibold">{order.id}</div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
                  {order.status} · Payment {order.paymentStatus}
                </div>
              </div>
              <div className="font-semibold">{formatInr(order.total)}</div>
            </div>
            <ul className="mt-3 text-sm text-[var(--ink)]/70">
              {order.items.map((item: OrderWithItems["items"][number]) => (
                <li key={item.id}>
                  <Link href={`/product/${item.productId}`} className="hover:text-[var(--vermillion)]">
                    {item.product.name}
                  </Link>{" "}
                  × {item.quantity}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--ink)]/50">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
