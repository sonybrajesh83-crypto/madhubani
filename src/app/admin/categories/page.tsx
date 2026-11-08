import { CategoryManager } from "@/components/admin/categoryManager";
import { prisma } from "@/lib/prisma";


export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Categories</h1>
      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
