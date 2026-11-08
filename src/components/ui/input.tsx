import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--ink)]/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[var(--vermillion)] focus:ring-2 focus:ring-[var(--vermillion)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[var(--ink)]/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[var(--vermillion)] focus:ring-2 focus:ring-[var(--vermillion)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/60",
        className,
      )}
      {...props}
    />
  );
}
