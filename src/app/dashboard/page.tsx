import Link from "next/link";
import { Card, EmptyState } from "@heroui/react";
import { Activity, CalendarDays, ShieldCheck, UserCheck, Users } from "lucide-react";

import { DoctorApplicationCard } from "@/components/admin/doctor-application-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getAdminOverview } from "@/services/admin/queries";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function DashboardPage() {
  const profile = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-3">
          <StatusBadge>Admin workspace</StatusBadge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Review platform activity
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Signed in as {profile.full_name}. Review doctor applications,
            protect public listings, and monitor booking operations.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <DashboardCard
          title="Pending doctors"
          description={`${overview.pendingDoctorApplications} waiting for review.`}
        >
          <UserCheck className="size-8 text-secondary" />
        </DashboardCard>
        <DashboardCard
          title="Public doctors"
          description={`${overview.approvedPublicDoctors} approved public profiles.`}
        >
          <ShieldCheck className="size-8 text-secondary" />
        </DashboardCard>
        <DashboardCard
          title="Requested sessions"
          description={`${overview.requestedAppointments} appointment requests.`}
        >
          <CalendarDays className="size-8 text-muted-foreground" />
        </DashboardCard>
        <DashboardCard
          title="Active users"
          description={`${overview.activeUsers} active platform profiles.`}
        >
          <Users className="size-8 text-muted-foreground" />
        </DashboardCard>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="border bg-card shadow-sm">
          <Card.Header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Card.Title>Pending doctor applications</Card.Title>
              <Card.Description>
                Review professional details before approving public visibility.
              </Card.Description>
            </div>
            <Link
              href="/dashboard/doctors?status=pending"
              className={cn(buttonVariants(), "h-9 px-4")}
            >
              View all
            </Link>
          </Card.Header>
          <Card.Content className="grid gap-4">
            {overview.pendingDoctors.length ? (
              overview.pendingDoctors.map((application) => (
                <DoctorApplicationCard
                  key={application.id}
                  application={application}
                />
              ))
            ) : (
              <EmptyState className="rounded-3xl border bg-background/60 p-8 text-center">
                <UserCheck className="mx-auto mb-3 size-6 text-secondary" />
                <h3 className="font-semibold">No pending applications</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  New doctor applications will appear here after registration.
                </p>
              </EmptyState>
            )}
          </Card.Content>
        </Card>

        <Card className="border bg-card shadow-sm">
          <Card.Header>
            <Card.Title>Recent verification activity</Card.Title>
            <Card.Description>
              Internal review notes stay in admin-only records.
            </Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-3">
            {overview.recentReviews.length ? (
              overview.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      tone={
                        review.decision === "approved" ? "success" : "danger"
                      }
                    >
                      {review.decision === "approved" ? "Approved" : "Rejected"}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(review.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reviewed by {review.reviewer_name || "admin"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
                <Activity className="mb-3 size-5 text-secondary" />
                No verification activity yet.
              </div>
            )}
          </Card.Content>
        </Card>
      </section>
    </PageShell>
  );
}
