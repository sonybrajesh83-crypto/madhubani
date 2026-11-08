"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--saffron-deep)]">
        Studio notice
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl text-[var(--ink)]">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-black/60">
        The atelier page failed to load. Try again in a moment.
      </p>
      <Button className="mt-6 rounded-full" onClick={reset}>
        Reload
      </Button>
    </div>
  );
}
