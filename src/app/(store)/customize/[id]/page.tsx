import { notFound } from "next/navigation";
import { CustomizeStudio } from "@/components/store/customizeStudio";
import { prisma } from "@/lib/prisma";


type Props = { params: Promise<{ id: string }> };

export default async function CustomizePage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <CustomizeStudio
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          motifKey: product.motifKey,
          type: product.type,
          imageUrl: product.imageUrl,
          tagline: product.tagline,
        }}
      />
    </div>
  );
}
