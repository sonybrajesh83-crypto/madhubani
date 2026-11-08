"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { categorySchema } from "@/lib/validators";

type Category = {
  id: string;
  name: string;
  description: string | null;
  _count: { products: number };
};

type FormValues = z.infer<typeof categorySchema>;

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: FormValues) {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    reset();
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="border border-[var(--ink)]/10 bg-white p-4">
            <div className="font-medium">{category.name}</div>
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/40">
              {category.id} · {category._count.products} products
            </div>
            <p className="mt-2 text-sm text-[var(--ink)]/60">{category.description}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 border border-[var(--ink)]/10 bg-white p-5"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Add category</h2>
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Create category
        </Button>
      </form>
    </div>
  );
}
