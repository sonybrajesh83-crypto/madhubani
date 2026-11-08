"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const schema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3),
  body: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function ReviewForm({ productId }: { productId: string }) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, title: "", body: "" },
  });

  async function onSubmit(values: FormValues) {
    setMessage("");
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, productId }),
    });
    const data: { error?: string } = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Could not save review");
      return;
    }
    setMessage("Review published. Thank you!");
    reset({ rating: 5, title: "", body: "" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border border-[var(--ink)]/10 bg-white p-5">
      <h3 className="font-[family-name:var(--font-display)] text-xl">Write a review</h3>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input id="rating" type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
        {errors.rating ? <p className="text-xs text-[var(--vermillion)]">{errors.rating.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title ? <p className="text-xs text-[var(--vermillion)]">{errors.title.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="body">Your experience</Label>
        <Textarea id="body" rows={4} {...register("body")} />
        {errors.body ? <p className="text-xs text-[var(--vermillion)]">{errors.body.message}</p> : null}
      </div>
      {message ? <p className="text-sm text-[var(--teal)]">{message}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Publish review"}
      </Button>
    </form>
  );
}
