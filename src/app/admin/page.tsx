import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { formatInr } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type RecentOrder = Prisma.OrderGetPayload<{
  include: { customer: true };
}>;

export default async function AdminDashboardPage() {
  const [productCount, orderCount, customerCount, openChats, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.conversation.count({ where: { status: "OPEN" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),
    ]);

  const stats = [
    ["Products", productCount, "/admin/products"],
    ["Orders", orderCount, "/admin/orders"],
    ["Customers", customerCount, "/admin/customers"],
    ["Open chats", openChats, "/admin/chat"],
  ] as const;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Manage catalog, accept orders, and talk to collectors.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, href]) => (
          <Link
            key={label}
            href={href}
            className="border border-[var(--ink)]/10 bg-white p-5 transition hover:-translate-y-1"
          >
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--ink)]/40">
              {label}
            </div>
            <div className="mt-3 font-[family-name:var(--font-display)] text-4xl">
              {value}
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-10 border border-[var(--ink)]/10 bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Latest orders</h2>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order: RecentOrder) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ink)]/5 pb-3 text-sm"
            >
              <div>
                <div className="font-medium">{order.id}</div>
                <div className="text-[var(--ink)]/50">
                  {order.customer.name} · {order.status}
                </div>
              </div>
              <div className="font-semibold">{formatInr(order.total)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
