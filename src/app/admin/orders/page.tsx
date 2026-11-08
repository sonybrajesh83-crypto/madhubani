import { OrderManager } from "@/components/admin/orderManager";
import { prisma } from "@/lib/prisma";


export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Accept orders, update fulfillment, and open WhatsApp with the customer.
      </p>
      <div className="mt-8">
        <OrderManager orders={orders} />
      </div>
    </div>
  );
}
