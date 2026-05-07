import Link from "next/link";
import { Card } from "@heroui/react";
import { Clock, Languages, Stethoscope, Wallet } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  formatDoctorPrice,
  getBioPreview,
  getDoctorDisplayName,
  getDoctorInitials,
  getDoctorTitle,
  getSessionTypeLabels,
} from "@/lib/doctors";
import { cn } from "@/lib/utils";
import type { PublicDoctorProfile } from "@/types/profiles";

type DoctorCardProps = {
  doctor: PublicDoctorProfile;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  const displayName = getDoctorDisplayName(doctor);
  const title = getDoctorTitle(doctor);
  const sessionTypes = getSessionTypeLabels(doctor);

  return (
    <Card className="group border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Card.Header>
        <div className="flex min-h-32 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent font-semibold text-accent-foreground">
            {doctor.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doctor.avatar_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              getDoctorInitials(doctor)
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <Card.Title className="text-xl">{displayName}</Card.Title>
            <p className="text-sm font-medium text-secondary">{title}</p>
            <Card.Description className="line-clamp-3 leading-6">
              {getBioPreview(doctor)}
            </Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {doctor.specialties.slice(0, 3).map((specialty) => (
            <StatusBadge key={specialty}>{specialty}</StatusBadge>
          ))}
          {doctor.specialties.length > 3 ? (
            <StatusBadge>+{doctor.specialties.length - 3} more</StatusBadge>
          ) : null}
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-secondary" />
            {doctor.years_of_experience} years of experience
          </div>
          <div className="flex items-center gap-2">
            <Languages className="size-4 text-secondary" />
            {doctor.languages.length
              ? doctor.languages.join(", ")
              : "Languages not listed"}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-secondary" />
            {doctor.session_duration_minutes} minute sessions
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-secondary" />
            {formatDoctorPrice(doctor.session_price)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sessionTypes.map((sessionType) => (
            <StatusBadge key={sessionType} tone="success">
              {sessionType}
            </StatusBadge>
          ))}
        </div>

        <Link
          href={`/doctor/${doctor.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full px-4"
          )}
        >
          View profile
        </Link>
      </Card.Content>
    </Card>
  );
}
