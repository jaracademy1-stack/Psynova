import { Languages, Stethoscope } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import {
  getDoctorDisplayName,
  getDoctorInitials,
  getDoctorTitle,
  getSessionTypeLabels,
} from "@/lib/doctors";
import type { PublicDoctorProfile } from "@/types/profiles";

type DoctorProfileHeaderProps = {
  doctor: PublicDoctorProfile;
};

export function DoctorProfileHeader({ doctor }: DoctorProfileHeaderProps) {
  const sessionTypes = getSessionTypeLabels(doctor);

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
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

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <StatusBadge tone="success">Approved public profile</StatusBadge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              {getDoctorDisplayName(doctor)}
            </h1>
            <p className="text-lg font-medium text-secondary">
              {getDoctorTitle(doctor)}
            </p>
          </div>

          <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-start gap-2">
              <Stethoscope className="mt-0.5 size-4 text-secondary" />
              <span>
                {doctor.specialties.length
                  ? doctor.specialties.join(", ")
                  : "Specialties not listed"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Languages className="mt-0.5 size-4 text-secondary" />
              <span>
                {doctor.languages.length
                  ? doctor.languages.join(", ")
                  : "Languages not listed"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sessionTypes.map((sessionType) => (
              <StatusBadge key={sessionType} tone="success">
                {sessionType}
              </StatusBadge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
