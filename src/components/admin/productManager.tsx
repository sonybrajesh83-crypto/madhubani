"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { formatInr } from "@/lib/format";
import { MOTIF_KEYS } from "@/lib/constants";
import { productSchema } from "@/lib/validators";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  type: "PAINTING" | "SAREE";
  featured: boolean;
  categoryId: string;
  motifKey: string;
  description: string;
};

type Category = { id: string; name: string };

type FormValues = z.infer<typeof productSchema>;

export function ProductManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 3000,
      stock: 10,
      type: "PAINTING",
      motifKey: "peacock",
      categoryId: categories[0]?.id || "",
      featured: false,
      customizable: true,
    },
  });

  function startEdit(product: Product) {
    setEditingId(product.id);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      type: product.type,
      motifKey: product.motifKey,
      categoryId: product.categoryId,
      featured: product.featured,
      customizable: true,
    });
  }

  async function onSubmit(values: FormValues) {
    setMessage("");
    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );
    const data: { error?: string; product?: { id: string } } = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setMessage(editingId ? "Product updated" : `Product created · ${data.product?.id}`);
    setEditingId(null);
    reset();
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-[var(--ink)]/10 bg-white p-4"
          >
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
                {product.id} · {product.type} · Stock {product.stock}
              </div>
              <div className="mt-1 text-sm">{formatInr(product.price)}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => startEdit(product)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => remove(product.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 border border-[var(--ink)]/10 bg-white p-5"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          {editingId ? "Update product" : "Add product"}
        </h2>
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Price (INR)</Label>
            <Input type="number" {...register("price", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" {...register("stock", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Type</Label>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" {...register("type")}>
              <option value="PAINTING">Painting</option>
              <option value="SAREE">Saree</option>
            </select>
          </div>
          <div>
            <Label>Motif</Label>
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm"
              {...register("motifKey")}
            >
              {MOTIF_KEYS.map((motif) => (
                <option key={motif} value={motif}>
                  {motif}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <select
            className="w-full rounded-xl border px-3 py-2 text-sm"
            {...register("categoryId")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} />
          Featured
        </label>
        {message ? <p className="text-sm text-[var(--teal)]">{message}</p> : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add product"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                reset();
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
