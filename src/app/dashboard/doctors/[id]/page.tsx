import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Card } from "@heroui/react";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Languages,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { DoctorApplicationActions } from "@/components/admin/doctor-application-actions";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  getVerificationStatusLabel,
  getVerificationStatusTone,
} from "@/lib/admin";
import { formatDateTime } from "@/lib/dates";
import {
  getDoctorApplicationById,
  getDoctorVerificationReviews,
} from "@/services/admin/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Application",
};

export default async function AdminDoctorApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [application, reviews] = await Promise.all([
    getDoctorApplicationById(id),
    getDoctorVerificationReviews(id, 8),
  ]);

  if (!application) {
    notFound();
  }

  return (
    <PageShell className="flex flex-col gap-8">
      <Link
        href="/dashboard/doctors"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applications
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <main className="flex flex-col gap-6">
          <Card className="border bg-card shadow-sm">
            <Card.Content className="flex flex-col gap-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  tone={getVerificationStatusTone(
                    application.verification_status
                  )}
                >
                  {getVerificationStatusLabel(
                    application.verification_status
                  )}
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
                <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                  {application.full_name}
                </h1>
                <p className="mt-2 text-lg text-secondary">
                  {application.professional_title ||
                    "Professional title missing"}
                </p>
              </div>

              <p className="max-w-3xl leading-7 text-muted-foreground">
                {application.bio || "No professional bio was provided."}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<ShieldCheck className="size-5 text-secondary" />}
                  label="License"
                  value={application.license_number || "Missing"}
                  detail={application.license_country || "Country missing"}
                />
                <InfoItem
                  icon={<BriefcaseBusiness className="size-5 text-secondary" />}
                  label="Experience"
                  value={`${application.years_of_experience} years`}
                  detail={application.education || "Education not provided"}
                />
                <InfoItem
                  icon={<BadgeCheck className="size-5 text-secondary" />}
                  label="Session settings"
                  value={`${application.session_duration_minutes} minutes`}
                  detail={
                    application.session_price
                      ? `$${application.session_price}`
                      : "Price not set"
                  }
                />
                <InfoItem
                  icon={<MapPin className="size-5 text-secondary" />}
                  label="Location"
                  value={
                    application.offers_in_person
                      ? "In-person available"
                      : "Online only"
                  }
                  detail={application.clinic_address || "No public address"}
                />
              </div>
            </Card.Content>
          </Card>

          <Card className="border bg-card shadow-sm">
            <Card.Header>
              <Card.Title>Specialties and languages</Card.Title>
              <Card.Description>
                These fields can appear publicly after approval and publication.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-5 sm:grid-cols-2">
              <TagGroup title="Specialties" values={application.specialties} />
              <TagGroup
                title="Languages"
                values={application.languages}
                icon={<Languages className="size-4 text-secondary" />}
              />
            </Card.Content>
          </Card>

          <Card className="border bg-card shadow-sm">
            <Card.Header>
              <Card.Title>Review history</Card.Title>
              <Card.Description>
                Internal notes are admin-only and are never shown publicly.
              </Card.Description>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {reviews.length ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        tone={
                          review.decision === "approved"
                            ? "success"
                            : "danger"
                        }
                      >
                        {review.decision === "approved"
                          ? "Approved"
                          : "Rejected"}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(review.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Reviewed by {review.reviewer_name || "admin"}
                    </p>
                    {review.review_note ? (
                      <p className="mt-3 rounded-xl bg-muted p-3 text-sm leading-6 text-muted-foreground">
                        {review.review_note}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
                  No review decisions have been recorded yet.
                </p>
              )}
            </Card.Content>
          </Card>
        </main>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DoctorApplicationActions application={application} />
        </aside>
      </div>
    </PageShell>
  );
}

function InfoItem({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="font-semibold">{value}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}

function TagGroup({
  title,
  values,
  icon,
}: {
  title: string;
  values: string[];
  icon?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {values.length ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">Not provided</span>
        )}
      </div>
    </div>
  );
}
