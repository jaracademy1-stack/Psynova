import { StatusBadge } from "@/components/shared/status-badge";
import {
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/lib/appointments";
import type { AppointmentStatus } from "@/types/appointments";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
};

export function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  return (
    <StatusBadge tone={getAppointmentStatusTone(status)}>
      {getAppointmentStatusLabel(status)}
    </StatusBadge>
  );
}
