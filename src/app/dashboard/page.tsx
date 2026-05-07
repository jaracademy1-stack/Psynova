import { Users, UserCheck, CalendarDays } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function DashboardPage() {
  const profile = await requireRole(["admin"]);

  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-3">
          <StatusBadge>Admin workspace</StatusBadge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Review platform activity
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Signed in as {profile.full_name}. Admin management screens are
            intentionally placeholders until the admin phase.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard
          title="User management"
          description="User lists and suspension workflows are coming later."
        >
          <Users className="size-8 text-muted-foreground" />
        </DashboardCard>
        <DashboardCard
          title="Doctor verification"
          description="Approval and rejection tools will be added in the admin phase."
        >
          <UserCheck className="size-8 text-muted-foreground" />
        </DashboardCard>
        <DashboardCard
          title="Appointment monitoring"
          description="Appointment overview arrives after booking is implemented."
        >
          <CalendarDays className="size-8 text-muted-foreground" />
        </DashboardCard>
      </div>
    </PageShell>
  );
}
