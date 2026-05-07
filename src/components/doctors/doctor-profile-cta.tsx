import { Card } from "@heroui/react";
import { CalendarClock, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DoctorProfileCTA() {
  return (
    <Card className="border bg-card shadow-sm lg:sticky lg:top-24">
      <Card.Header>
        <Card.Title>Book a session</Card.Title>
        <Card.Description>
          Booking and availability selection will be available in the next
          phase.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <Button type="button" disabled className="h-11 w-full px-5">
          <CalendarClock className="size-4" />
          Booking coming next phase
        </Button>

        <div className="rounded-2xl bg-accent p-4 text-sm leading-6 text-accent-foreground">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <LockKeyhole className="size-4" />
            Private booking flow
          </div>
          <p>
            When booking is enabled, appointment details will be visible only to
            authorized users.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
}
