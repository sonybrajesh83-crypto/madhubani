"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loginSchema } from "@/lib/validators";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: FormValues) {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data: { role?: string; error?: string } = await response.json();
    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(data.role === "ADMIN" ? "/admin" : "/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Customer demo: collector@example.com / collector123 · Admin: admin@shardamadhubani.com / admin123
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" {...register("password")} />
        </div>
        {error ? <p className="text-sm text-[var(--vermillion)]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        New collector?{" "}
        <Link href="/register" className="text-[var(--vermillion)]">
          Create account
        </Link>
      </p>
    </div>
  );
}
