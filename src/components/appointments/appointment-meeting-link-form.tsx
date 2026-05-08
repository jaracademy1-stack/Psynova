"use client";

import { useActionState } from "react";
import { Button } from "@heroui/react";
import { ExternalLink } from "lucide-react";

import { setDoctorAppointmentMeetingUrl } from "@/services/appointments/actions";

type AppointmentMeetingLinkFormProps = {
  appointmentId: string;
  meetingUrl: string | null;
};

export function AppointmentMeetingLinkForm({
  appointmentId,
  meetingUrl,
}: AppointmentMeetingLinkFormProps) {
  const [state, formAction, isPending] = useActionState(
    setDoctorAppointmentMeetingUrl,
    {}
  );

  return (
    <div className="rounded-2xl border bg-background p-3">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-medium">Meeting link</p>
          <p className="text-xs leading-5 text-muted-foreground">
            Add a secure online meeting URL for this appointment. Patients will
            see it in their dashboard.
          </p>
        </div>

        {meetingUrl ? (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 break-all text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="size-4 shrink-0" />
            {meetingUrl}
          </a>
        ) : (
          <p className="text-xs leading-5 text-muted-foreground">
            No meeting link saved yet.
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="intent" value="save" />
          <input
            name="meetingUrl"
            type="url"
            inputMode="url"
            defaultValue={meetingUrl ?? ""}
            placeholder="https://meet.google.com/..."
            className="h-10 rounded-xl border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
          <Button
            type="submit"
            size="sm"
            className="w-fit bg-primary text-primary-foreground"
            isDisabled={isPending}
          >
            {isPending ? "Saving..." : "Save meeting link"}
          </Button>
          {state.error ? (
            <p className="text-xs leading-5 text-destructive">{state.error}</p>
          ) : null}
          {state.success ? (
            <p className="text-xs leading-5 text-emerald-700">
              {state.success}
            </p>
          ) : null}
        </form>
        {meetingUrl ? (
          <form action={formAction}>
            <input type="hidden" name="appointmentId" value={appointmentId} />
            <input type="hidden" name="intent" value="clear" />
            <input type="hidden" name="meetingUrl" value="" />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              isDisabled={isPending}
            >
              Clear meeting link
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
