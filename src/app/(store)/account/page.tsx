import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/store/logoutButton";
import { formatInr } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  const orders = await prisma.order.findMany({
    where: { customerId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--vermillion)]">
            Customer ID · {user.id}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            Hello, {user.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--ink)]/60">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/orders" className="rounded-full border px-4 py-2 text-sm">
          Orders
        </Link>
        <Link href="/chat" className="rounded-full border px-4 py-2 text-sm">
          Studio chat
        </Link>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Recent orders</h2>
        {orders.map((order: OrderWithItems) => (
          <article key={order.id} className="border border-[var(--ink)]/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{order.id}</div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
                  {order.status} · {order.paymentStatus}
                </div>
              </div>
              <div className="font-semibold">{formatInr(order.total)}</div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-[var(--ink)]/70">
              {order.items.map((item: OrderWithItems["items"][number]) => (
                <li key={item.id}>
                  {item.product.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--ink)]/50">No orders yet.</p>
        ) : null}
      </section>
    </div>
  );
}
