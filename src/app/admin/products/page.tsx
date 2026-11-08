import { ProductManager } from "@/components/admin/productManager";
import { prisma } from "@/lib/prisma";


export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Products</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Add products, update prices, stock, and artwork motifs. Product IDs auto-generate.
      </p>
      <div className="mt-8">
        <ProductManager products={products} categories={categories} />
      </div>
    </div>
  );
}
