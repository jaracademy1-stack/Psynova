import { Card, EmptyState } from "@heroui/react";
import { CalendarClock } from "lucide-react";

import { AppointmentActionForm } from "@/components/appointments/appointment-action-form";
import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { formatDateTime, formatTimeRange } from "@/lib/dates";
import {
  cancelDoctorAppointment,
  completeDoctorAppointment,
  confirmDoctorAppointment,
  declineDoctorAppointment,
} from "@/services/appointments/actions";
import type { DoctorAppointmentRow } from "@/types/appointments";

type DoctorAppointmentsSectionProps = {
  appointments: DoctorAppointmentRow[];
};

export function DoctorAppointmentsSection({
  appointments,
}: DoctorAppointmentsSectionProps) {
  const requested = appointments.filter(
    (appointment) => appointment.status === "requested"
  );
  const active = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );
  const history = appointments.filter(
    (appointment) => !["requested", "confirmed"].includes(appointment.status)
  );

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Appointment requests</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Review requests and manage confirmed sessions. Patient contact details
          are not shown in this phase.
        </p>
      </div>

      {appointments.length ? (
        <div className="grid gap-4">
          {requested.map((appointment) => (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
          {active.map((appointment) => (
            <DoctorAppointmentCard
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
                  <DoctorAppointmentCard
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
            <CalendarClock className="size-5" />
          </div>
          <h3 className="text-xl font-semibold">No appointment requests yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Requests will appear here after patients book available public
            slots.
          </p>
        </EmptyState>
      )}
    </section>
  );
}

function DoctorAppointmentCard({
  appointment,
  compact = false,
}: {
  appointment: DoctorAppointmentRow;
  compact?: boolean;
}) {
  return (
    <Card className="border bg-card shadow-sm">
      <Card.Content className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <AppointmentStatusBadge status={appointment.status} />
            <span className="text-sm text-muted-foreground">
              {appointment.session_type === "online" ? "Online" : "In person"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{appointment.patient_display_name}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {formatDateTime(appointment.starts_at)} -{" "}
              {formatTimeRange(appointment.starts_at, appointment.ends_at)}
            </p>
          </div>
          {!compact && appointment.patient_message ? (
            <p className="rounded-2xl bg-muted p-3 text-sm leading-6 text-muted-foreground">
              Patient message: {appointment.patient_message}
            </p>
          ) : null}
        </div>

        {!compact ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-56">
            {appointment.status === "requested" ? (
              <>
                <AppointmentActionForm
                  appointmentId={appointment.id}
                  label="Confirm"
                  action={confirmDoctorAppointment}
                  tone="primary"
                />
                <AppointmentActionForm
                  appointmentId={appointment.id}
                  label="Decline"
                  action={declineDoctorAppointment}
                  tone="danger"
                />
              </>
            ) : null}
            {appointment.status === "confirmed" ? (
              <>
                <AppointmentActionForm
                  appointmentId={appointment.id}
                  label="Complete"
                  action={completeDoctorAppointment}
                  tone="primary"
                />
                <AppointmentActionForm
                  appointmentId={appointment.id}
                  label="Cancel"
                  action={cancelDoctorAppointment}
                  tone="danger"
                  notePlaceholder="Reason"
                />
              </>
            ) : null}
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
}
