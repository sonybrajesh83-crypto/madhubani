"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customization } from "@/lib/format";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  motifKey: string;
  imageUrl?: string | null;
  type: "PAINTING" | "SAREE";
  customization: Customization;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

function makeKey(productId: string, customization: Customization) {
  return `${productId}:${JSON.stringify(customization)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = makeKey(item.productId, item.customization);
        const existing = get().items.find((entry) => entry.key === key);
        if (existing) {
          set({
            items: get().items.map((entry) =>
              entry.key === key
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry,
            ),
          });
          return;
        }
        set({ items: [...get().items, { ...item, key }] });
      },
      removeItem: (key) =>
        set({ items: get().items.filter((entry) => entry.key !== key) }),
      updateQuantity: (key, quantity) =>
        set({
          items: get().items
            .map((entry) =>
              entry.key === key ? { ...entry, quantity } : entry,
            )
            .filter((entry) => entry.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "smp-cart" },
  ),
);
