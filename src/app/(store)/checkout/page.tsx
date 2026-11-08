"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useCartStore } from "@/lib/cartStore";
import { formatInr } from "@/lib/format";
import { checkoutSchema } from "@/lib/validators";

type FormValues = z.infer<typeof checkoutSchema>;

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void;
  theme: { color: string };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clear = useCartStore((state) => state.clear);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  async function loadRazorpay() {
    if (window.Razorpay) return true;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay failed to load"));
      document.body.appendChild(script);
    });
    return true;
  }

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError("");
    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkout: values,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customization: item.customization,
          })),
        }),
      });
      const orderData: { order?: { id: string }; error?: string } =
        await orderResponse.json();
      if (!orderResponse.ok || !orderData.order) {
        setError(orderData.error || "Could not create order. Please login first.");
        setLoading(false);
        return;
      }

      const payResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.order.id }),
      });
      const payData: {
        demo?: boolean;
        key?: string;
        amount?: number;
        currency?: string;
        razorpayOrderId?: string;
        orderId?: string;
        error?: string;
      } = await payResponse.json();

      if (!payResponse.ok) {
        setError(payData.error || "Payment init failed");
        setLoading(false);
        return;
      }

      if (payData.demo) {
        const verify = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.order.id,
            razorpayOrderId: payData.razorpayOrderId,
            demo: true,
          }),
        });
        if (!verify.ok) {
          setError("Demo payment failed");
          setLoading(false);
          return;
        }
        clear();
        router.push(`/orders?success=${orderData.order.id}`);
        return;
      }

      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay unavailable");

      const rzp = new window.Razorpay({
        key: payData.key || "",
        amount: payData.amount || total * 100,
        currency: payData.currency || "INR",
        name: "SHARDA MADHUBANI PAINTINGS",
        description: `Order ${orderData.order.id}`,
        order_id: payData.razorpayOrderId || "",
        handler: async (response) => {
          await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.order?.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          clear();
          router.push(`/orders?success=${orderData.order?.id}`);
        },
        theme: { color: "#E6392B" },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Checkout</h1>
        <p className="text-sm text-[var(--ink)]/60">
          Secure Razorpay payments. Demo mode is on until you add live keys in `.env`.
        </p>
        <Field label="Full name" error={errors.shippingName?.message}>
          <Input {...register("shippingName")} />
        </Field>
        <Field label="Address" error={errors.shippingAddress?.message}>
          <Textarea rows={3} {...register("shippingAddress")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" error={errors.shippingCity?.message}>
            <Input {...register("shippingCity")} />
          </Field>
          <Field label="State" error={errors.shippingState?.message}>
            <Input {...register("shippingState")} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pincode" error={errors.shippingPincode?.message}>
            <Input {...register("shippingPincode")} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} />
          </Field>
        </div>
        <Field label="Order notes">
          <Textarea rows={3} {...register("notes")} />
        </Field>
        {error ? <p className="text-sm text-[var(--vermillion)]">{error}</p> : null}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Processing..." : `Pay ${formatInr(total)}`}
        </Button>
      </form>

      <aside className="h-fit border border-[var(--ink)]/10 bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Order summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between gap-3 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatInr(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-[var(--ink)]/10 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatInr(total)}</span>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-[var(--vermillion)]">{error}</p> : null}
    </div>
  );
}
