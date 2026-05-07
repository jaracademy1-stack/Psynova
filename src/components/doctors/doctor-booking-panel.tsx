"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Button, Card, EmptyState } from "@heroui/react";
import { CalendarClock, LockKeyhole } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, formatTimeRange } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { bookAppointment } from "@/services/appointments/actions";
import type { AppointmentSessionType, AvailableSlot } from "@/types/appointments";
import type { PublicDoctorProfile, UserRole } from "@/types/profiles";

type DoctorBookingPanelProps = {
  doctor: PublicDoctorProfile;
  slots: AvailableSlot[];
  viewerRole: UserRole | null;
};

export function DoctorBookingPanel({
  doctor,
  slots,
  viewerRole,
}: DoctorBookingPanelProps) {
  const [state, formAction, isPending] = useActionState(bookAppointment, {});
  const [selectedSlotKey, setSelectedSlotKey] = useState("");
  const [sessionType, setSessionType] = useState<AppointmentSessionType>(
    doctor.offers_online ? "online" : "in_person"
  );

  const selectedSlot = useMemo(
    () =>
      slots.find(
        (slot) => `${slot.starts_at}|${slot.ends_at}` === selectedSlotKey
      ) ?? null,
    [selectedSlotKey, slots]
  );

  if (!viewerRole) {
    return (
      <Card className="border bg-card shadow-sm lg:sticky lg:top-24">
        <Card.Header>
          <Card.Title>Book a session</Card.Title>
          <Card.Description>
            Log in with a patient account to request an available time.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <Link href="/login" className={cn(buttonVariants(), "h-11 px-5")}>
            Log in to book
          </Link>
          <PrivacyNote />
        </Card.Content>
      </Card>
    );
  }

  if (viewerRole !== "patient") {
    return (
      <Card className="border bg-card shadow-sm lg:sticky lg:top-24">
        <Card.Header>
          <Card.Title>Book a session</Card.Title>
          <Card.Description>
            Only patient accounts can book sessions.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <PrivacyNote />
        </Card.Content>
      </Card>
    );
  }

  if (state.success) {
    return (
      <Card className="border bg-card shadow-sm lg:sticky lg:top-24">
        <Card.Header>
          <StatusBadge tone="success">Request sent</StatusBadge>
          <Card.Title>Appointment requested</Card.Title>
          <Card.Description>
            Your request is now visible in your patient dashboard.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Link
            href="/patient/dashboard"
            className={cn(buttonVariants(), "h-11 w-full px-5")}
          >
            View dashboard
          </Link>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="border bg-card shadow-sm lg:sticky lg:top-24">
      <Card.Header>
        <Card.Title>Book a session</Card.Title>
        <Card.Description>
          Choose an available time. The doctor can confirm or decline your
          request.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {slots.length ? (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="doctorProfileId" value={doctor.id} />
            <input
              type="hidden"
              name="startsAt"
              value={selectedSlot?.starts_at ?? ""}
            />
            <input
              type="hidden"
              name="endsAt"
              value={selectedSlot?.ends_at ?? ""}
            />

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Session type</span>
              <select
                name="sessionType"
                value={sessionType}
                onChange={(event) =>
                  setSessionType(event.target.value as AppointmentSessionType)
                }
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              >
                {doctor.offers_online ? (
                  <option value="online">Online</option>
                ) : null}
                {doctor.offers_in_person ? (
                  <option value="in_person">In person</option>
                ) : null}
              </select>
            </label>

            <div className="grid max-h-80 gap-2 overflow-y-auto pr-1">
              {slots.slice(0, 12).map((slot) => {
                const key = `${slot.starts_at}|${slot.ends_at}`;
                const isSelected = key === selectedSlotKey;

                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-3 text-left text-sm transition",
                      isSelected
                        ? "border-primary bg-accent text-accent-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                    onClick={() => setSelectedSlotKey(key)}
                  >
                    <span className="font-medium">
                      {formatDateTime(slot.starts_at)}
                    </span>
                    <span className="mt-1 block text-muted-foreground">
                      {formatTimeRange(slot.starts_at, slot.ends_at)}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Message to doctor</span>
              <textarea
                name="patientMessage"
                maxLength={500}
                rows={4}
                placeholder="Optional short booking note"
                className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
              <span className="text-xs leading-5 text-muted-foreground">
                Please do not include urgent crisis information here. If this is
                an emergency, contact local emergency services.
              </span>
            </label>

            {state.error ? (
              <p className="text-sm leading-6 text-destructive">
                {state.error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11"
              isDisabled={isPending || !selectedSlot}
            >
              {isPending ? "Requesting..." : "Request appointment"}
            </Button>
            <PrivacyNote />
          </form>
        ) : (
          <EmptyState className="rounded-3xl border bg-background/60 p-6 text-center">
            <CalendarClock className="mx-auto mb-3 size-6 text-secondary" />
            <h3 className="font-semibold">No available slots right now</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This doctor has not opened future public slots, or existing slots
              are already requested.
            </p>
          </EmptyState>
        )}
      </Card.Content>
    </Card>
  );
}

function PrivacyNote() {
  return (
    <div className="rounded-2xl bg-accent p-4 text-sm leading-6 text-accent-foreground">
      <div className="mb-2 flex items-center gap-2 font-medium">
        <LockKeyhole className="size-4" />
        Private booking flow
      </div>
      <p>
        Appointment details are visible only to the patient and the selected
        professional.
      </p>
    </div>
  );
}
