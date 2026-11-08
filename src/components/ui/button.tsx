import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition active:scale-[0.98] disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--vermillion)] text-white hover:bg-[#c92f24]",
        variant === "secondary" &&
          "border border-[var(--ink)]/20 bg-white text-[var(--ink)] hover:border-[var(--vermillion)]",
        variant === "ghost" && "bg-transparent text-[var(--ink)] hover:bg-black/5",
        variant === "danger" && "bg-[#8B1E1E] text-white hover:bg-[#6f1616]",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-base",
        className,
      )}
      {...props}
    />
  );
}
