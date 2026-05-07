import type { ReactNode } from "react";
import { Card } from "@heroui/react";
import { Clock, Languages, Monitor, Wallet } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import {
  formatDoctorPrice,
  getSessionTypeLabels,
} from "@/lib/doctors";
import type { PublicDoctorProfile } from "@/types/profiles";

type DoctorSessionInfoCardProps = {
  doctor: PublicDoctorProfile;
};

export function DoctorSessionInfoCard({
  doctor,
}: DoctorSessionInfoCardProps) {
  const sessionTypes = getSessionTypeLabels(doctor);

  return (
    <Card className="border bg-card shadow-sm">
      <Card.Header>
        <Card.Title>Session information</Card.Title>
        <Card.Description>
          Review the public session details before choosing an available time.
        </Card.Description>
      </Card.Header>
      <Card.Content className="grid gap-4">
        <InfoRow
          icon={<Clock className="size-4" />}
          label="Duration"
          value={`${doctor.session_duration_minutes} minutes`}
        />
        <InfoRow
          icon={<Wallet className="size-4" />}
          label="Session price"
          value={formatDoctorPrice(doctor.session_price)}
        />
        <InfoRow
          icon={<Monitor className="size-4" />}
          label="Session options"
          value={sessionTypes.length ? sessionTypes.join(", ") : "Not listed"}
        />
        <InfoRow
          icon={<Languages className="size-4" />}
          label="Languages"
          value={
            doctor.languages.length ? doctor.languages.join(", ") : "Not listed"
          }
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {sessionTypes.map((sessionType) => (
            <StatusBadge key={sessionType} tone="success">
              {sessionType}
            </StatusBadge>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-background/60 p-4">
      <div className="mt-0.5 text-secondary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
}
