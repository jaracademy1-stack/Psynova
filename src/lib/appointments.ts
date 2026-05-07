import type { AppointmentStatus } from "@/types/appointments";

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  const labels: Record<AppointmentStatus, string> = {
    requested: "Requested",
    confirmed: "Confirmed",
    declined: "Declined",
    cancelled_by_patient: "Cancelled by patient",
    cancelled_by_doctor: "Cancelled by doctor",
    completed: "Completed",
    no_show: "No show",
  };

  return labels[status];
}

export function getAppointmentStatusTone(status: AppointmentStatus) {
  if (status === "confirmed" || status === "completed") {
    return "success" as const;
  }

  if (status === "requested") {
    return "warning" as const;
  }

  if (
    status === "declined" ||
    status === "cancelled_by_patient" ||
    status === "cancelled_by_doctor"
  ) {
    return "danger" as const;
  }

  return "muted" as const;
}
