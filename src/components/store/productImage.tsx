"use client";

import Image from "next/image";
import { MadhubaniArt } from "@/components/graphics/madhubaniArt";
import { cn } from "@/lib/cn";

type Props = {
  imageUrl?: string | null;
  motifKey: string;
  alt: string;
  className?: string;
  dedication?: string;
  priority?: boolean;
};

export function ProductImage({
  imageUrl,
  motifKey,
  alt,
  className,
  dedication,
  priority = false,
}: Props) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-[#111]", className)}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {dedication ? (
          <div className="absolute inset-x-4 bottom-4 rounded-sm bg-[#0B1D36]/80 px-3 py-2 text-center text-xs tracking-wide text-[#F4C430]">
            {dedication}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <MadhubaniArt
      motifKey={motifKey}
      dedication={dedication}
      className={className}
    />
  );
}
