"use client";

import { EmptyState } from "@heroui/react";
import { AlertCircle } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <PageShell>
      <EmptyState className="rounded-3xl border bg-card p-10 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-700">
          <AlertCircle className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
          We could not load this page safely. Please try again.
        </p>
        <Button type="button" className="mt-6 h-9 px-4" onClick={reset}>
          Try again
        </Button>
      </EmptyState>
    </PageShell>
  );
}
