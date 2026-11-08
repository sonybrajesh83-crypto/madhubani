import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CustomerRow = Prisma.UserGetPayload<{
  include: {
    _count: { select: { orders: true; conversations: true } };
  };
}>;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true, conversations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Customers</h1>
      <div className="mt-8 overflow-x-auto border border-[var(--ink)]/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--ink)]/10 text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
            <tr>
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Chats</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: CustomerRow) => (
              <tr key={customer.id} className="border-b border-[var(--ink)]/5">
                <td className="px-4 py-3 font-medium">{customer.id}</td>
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3">
                  <div>{customer.email}</div>
                  <div className="text-[var(--ink)]/50">{customer.phone}</div>
                </td>
                <td className="px-4 py-3">{customer._count.orders}</td>
                <td className="px-4 py-3">{customer._count.conversations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
