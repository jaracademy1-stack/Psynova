import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PageShell } from "@/components/shared/page-shell";
import { cn } from "@/lib/utils";

type RoutePlaceholderProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function RoutePlaceholder({
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back to home",
}: RoutePlaceholderProps) {
  return (
    <PageShell className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={primaryHref}
            className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}
          >
            {primaryLabel}
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  );
}
