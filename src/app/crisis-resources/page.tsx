import Link from "next/link";
import { Card } from "@heroui/react";
import { AlertTriangle, HeartHandshake, PhoneCall } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Crisis Resources",
};

export default function CrisisResourcesPage() {
  return (
    <PageShell className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <StatusBadge tone="danger">Crisis resources</StatusBadge>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          If this is urgent, use emergency support now
        </h1>
        <p className="leading-7 text-muted-foreground">
          Psynova is a booking platform and is not monitored as an emergency
          service. Use immediate local support if you or someone else may be in
          danger.
        </p>
      </div>

      <Card className="border bg-red-50 shadow-sm">
        <Card.Content className="flex gap-3 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-700" />
          <p className="text-sm leading-6 text-muted-foreground">
            This page is a product placeholder and should be reviewed by a
            qualified legal/compliance professional before launch.
          </p>
        </Card.Content>
      </Card>

      <div className="grid gap-4">
        <Card className="border bg-card shadow-sm">
          <Card.Content className="flex gap-4 p-5">
            <PhoneCall className="mt-1 size-6 shrink-0 text-secondary" />
            <div>
              <h2 className="font-semibold">Immediate danger</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Contact your local emergency number, go to the nearest
                emergency department, or ask a trusted person nearby to help you
                reach emergency support.
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border bg-card shadow-sm">
          <Card.Content className="flex gap-4 p-5">
            <HeartHandshake className="mt-1 size-6 shrink-0 text-secondary" />
            <div>
              <h2 className="font-semibold">Not immediate, but you need help</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                If you are distressed but not in immediate danger, consider
                contacting a trusted person, a local crisis line, or a licensed
                healthcare professional in your area.
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>

      <Link
        href="/doctors"
        className={cn(buttonVariants({ variant: "outline" }), "h-11 w-fit px-5")}
      >
        Browse non-urgent appointments
      </Link>
    </PageShell>
  );
}
