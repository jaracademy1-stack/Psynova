import Link from "next/link";
import { EmptyState } from "@heroui/react";
import { SearchX } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <PageShell>
      <EmptyState className="rounded-3xl border bg-card p-10 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <SearchX className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold">Page unavailable</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
          This page may have moved, or it may require a different account role.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-9 px-4")}
        >
          Back home
        </Link>
      </EmptyState>
    </PageShell>
  );
}
