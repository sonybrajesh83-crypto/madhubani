"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatInr, parseCustomization } from "@/lib/format";

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  phone: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  notes: string | null;
  customer: { id: string; name: string; email: string; phone: string | null };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    customizationJson: string;
    product: { name: string; id: string };
  }>;
};

const statuses = [
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export function OrderManager({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function setStatus(id: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article key={order.id} className="border border-[var(--ink)]/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{order.id}</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
                {order.status} · Payment {order.paymentStatus}
              </div>
              <div className="mt-2 text-sm">
                {order.customer.name} · {order.customer.id} · {order.customer.email}
              </div>
              <div className="text-sm text-[var(--ink)]/60">
                {order.shippingName}, {order.shippingAddress}, {order.shippingCity},{" "}
                {order.shippingState} {order.shippingPincode} · {order.phone}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatInr(order.total)}</div>
              <a
                href={`https://wa.me/91${order.phone.replace(/\D/g, "").slice(-10)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--teal)]"
              >
                WhatsApp customer
              </a>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item) => {
              const customization = parseCustomization(item.customizationJson);
              return (
                <li key={item.id} className="border-t border-[var(--ink)]/5 pt-2">
                  {item.product.name} ({item.product.id}) × {item.quantity} ·{" "}
                  {formatInr(item.unitPrice)}
                  <div className="text-xs text-[var(--ink)]/50">
                    {customization.dedication
                      ? `Dedication: ${customization.dedication} · `
                      : ""}
                    {customization.customNotes || "No custom notes"}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={order.status === status ? "primary" : "secondary"}
                onClick={() => setStatus(order.id, status)}
              >
                {status === "ACCEPTED" ? "Accept" : status}
              </Button>
            ))}
          </div>
        </article>
      ))}
      {orders.length === 0 ? (
        <p className="text-sm text-[var(--ink)]/50">No orders yet.</p>
      ) : null}
    </div>
  );
}
