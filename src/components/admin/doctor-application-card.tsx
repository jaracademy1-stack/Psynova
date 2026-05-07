import Link from "next/link";
import { Card } from "@heroui/react";
import { CalendarDays, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/dates";
import {
  getVerificationStatusLabel,
  getVerificationStatusTone,
} from "@/lib/admin";
import { cn } from "@/lib/utils";
import type { DoctorApplication } from "@/types/admin";

type DoctorApplicationCardProps = {
  application: DoctorApplication;
};

export function DoctorApplicationCard({
  application,
}: DoctorApplicationCardProps) {
  return (
    <Card className="border bg-card shadow-sm">
      <Card.Content className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              tone={getVerificationStatusTone(
                application.verification_status
              )}
            >
              {getVerificationStatusLabel(application.verification_status)}
            </StatusBadge>
            {application.is_public ? (
              <StatusBadge tone="success">Public</StatusBadge>
            ) : (
              <StatusBadge>Private</StatusBadge>
            )}
            {!application.is_active ? (
              <StatusBadge tone="danger">Inactive account</StatusBadge>
            ) : null}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{application.full_name}</h3>
            <p className="text-sm text-secondary">
              {application.professional_title || "Professional title missing"}
            </p>
          </div>

          <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {application.bio || "No bio provided yet."}
          </p>

          <div className="flex flex-wrap gap-2">
            {application.specialties.slice(0, 4).map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-secondary" />
              {application.license_country || "License country missing"}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-secondary" />
              Applied {formatDateTime(application.created_at)}
            </span>
            <span>{application.years_of_experience} years experience</span>
          </div>
        </div>

        <Link
          href={`/dashboard/doctors/${application.id}`}
          className={cn(buttonVariants(), "h-9 w-fit px-4")}
        >
          View application
        </Link>
      </Card.Content>
    </Card>
  );
}
