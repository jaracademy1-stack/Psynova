import Link from "next/link";
import { Card, EmptyState } from "@heroui/react";
import { CalendarCheck, Search } from "lucide-react";

import { AppointmentActionForm } from "@/components/appointments/appointment-action-form";
import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, formatTimeRange } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { cancelPatientAppointment } from "@/services/appointments/actions";
import type { PatientAppointmentRow } from "@/types/appointments";

type PatientAppointmentsSectionProps = {
  appointments: PatientAppointmentRow[];
};

export function PatientAppointmentsSection({
  appointments,
}: PatientAppointmentsSectionProps) {
  const activeAppointments = appointments.filter((appointment) =>
    ["requested", "confirmed"].includes(appointment.status)
  );
  const history = appointments.filter(
    (appointment) => !["requested", "confirmed"].includes(appointment.status)
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Appointments</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Booking requests and confirmed sessions appear here. You can cancel
            requested or confirmed appointments from this dashboard.
          </p>
        </div>
        <Link
          href="/doctors"
          className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}
        >
          Browse doctors
        </Link>
      </div>

      {appointments.length ? (
        <div className="grid gap-4">
          <Card className="border bg-accent/70">
            <Card.Content className="p-4 text-sm leading-6 text-accent-foreground">
              Requested appointments are waiting for doctor review. Confirmed
              appointments are accepted. Cancelled, declined, completed, and
              no-show appointments move into recent history.
            </Card.Content>
          </Card>
          {activeAppointments.map((appointment) => (
            <PatientAppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
          {history.length ? (
            <Card className="border bg-card">
              <Card.Header>
                <Card.Title>Recent history</Card.Title>
              </Card.Header>
              <Card.Content className="grid gap-3">
                {history.slice(0, 4).map((appointment) => (
                  <PatientAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    compact
                  />
                ))}
              </Card.Content>
            </Card>
          ) : null}
        </div>
      ) : (
        <EmptyState className="rounded-3xl border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <CalendarCheck className="size-5" />
          </div>
          <h3 className="text-xl font-semibold">No appointments yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            When you request a session, the appointment will appear here.
          </p>
          <Link
            href="/doctors"
            className={cn(buttonVariants(), "mt-5 h-9 gap-2 px-4")}
          >
            <Search className="size-4" />
            Find a doctor
          </Link>
        </EmptyState>
      )}
    </section>
  );
}

function PatientAppointmentCard({
  appointment,
  compact = false,
}: {
  appointment: PatientAppointmentRow;
  compact?: boolean;
}) {
  const canCancel = ["requested", "confirmed"].includes(appointment.status);

  return (
    <Card className="border bg-card shadow-sm">
      <Card.Content className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <AppointmentStatusBadge status={appointment.status} />
            <span className="text-sm text-muted-foreground">
              {appointment.session_type === "online" ? "Online" : "In person"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">
              {appointment.doctor_display_name || "Mental health professional"}
            </h3>
            <p className="text-sm text-secondary">
              {appointment.doctor_professional_title ||
                "Mental health professional"}
            </p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {formatDateTime(appointment.starts_at)} -{" "}
            {formatTimeRange(appointment.starts_at, appointment.ends_at)}
          </p>
          {!compact && appointment.doctor_response_note ? (
            <p className="rounded-2xl bg-muted p-3 text-sm leading-6 text-muted-foreground">
              Doctor note: {appointment.doctor_response_note}
            </p>
          ) : null}
        </div>
        {canCancel && !compact ? (
          <div className="flex flex-col gap-2 md:max-w-56">
            <AppointmentActionForm
              appointmentId={appointment.id}
              label="Cancel"
              action={cancelPatientAppointment}
              tone="danger"
              notePlaceholder="Optional reason"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Cancelling releases the request from your active appointments.
            </p>
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
}
