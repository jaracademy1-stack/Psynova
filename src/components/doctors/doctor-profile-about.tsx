import { Card } from "@heroui/react";

import { StatusBadge } from "@/components/shared/status-badge";
import type { PublicDoctorProfile } from "@/types/profiles";

type DoctorProfileAboutProps = {
  doctor: PublicDoctorProfile;
};

export function DoctorProfileAbout({ doctor }: DoctorProfileAboutProps) {
  return (
    <Card className="border bg-card shadow-sm">
      <Card.Header>
        <Card.Title>About this professional</Card.Title>
        <Card.Description className="leading-7">
          {doctor.bio ||
            "This professional has an approved public profile. More profile details can be added as the doctor profile editor expands."}
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Experience</p>
            <p className="mt-1 text-xl font-semibold">
              {doctor.years_of_experience} years
            </p>
          </div>
          <div className="rounded-2xl border bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Session length</p>
            <p className="mt-1 text-xl font-semibold">
              {doctor.session_duration_minutes} minutes
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Focus areas</p>
          <div className="flex flex-wrap gap-2">
            {doctor.specialties.length ? (
              doctor.specialties.map((specialty) => (
                <StatusBadge key={specialty}>{specialty}</StatusBadge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Focus areas have not been listed yet.
              </span>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
