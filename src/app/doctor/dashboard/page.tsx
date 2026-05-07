import { Card } from "@heroui/react";
import { ClipboardList, EyeOff, Stethoscope } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Dashboard",
};

const statusCopy = {
  pending: {
    label: "Pending review",
    tone: "warning" as const,
    text: "Your profile is under review. It will not appear publicly until an admin approves it.",
  },
  approved: {
    label: "Approved",
    tone: "success" as const,
    text: "Your profile is approved. It appears publicly only when marked public by admin workflow.",
  },
  rejected: {
    label: "Needs support",
    tone: "danger" as const,
    text: "Your application needs follow-up. Please contact platform support for next steps.",
  },
};

export default async function DoctorDashboardPage() {
  const profile = await requireRole(["doctor"]);
  const supabase = await createSupabaseServerClient();
  const { data: doctorProfile } = await supabase
    .from("doctor_profiles")
    .select("professional_title, bio, verification_status, is_public")
    .eq("user_id", profile.id)
    .maybeSingle();

  const status =
    statusCopy[doctorProfile?.verification_status ?? "pending"];

  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-3">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Welcome, {profile.full_name}
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Manage your professional profile and prepare for appointment tools
            coming in later phases.
          </p>
        </div>
        <LogoutButton />
      </div>

      <Card className="border bg-card">
        <Card.Header>
          <Card.Title>Verification status</Card.Title>
          <Card.Description>{status.text}</Card.Description>
        </Card.Header>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Profile preview"
          description={
            doctorProfile?.professional_title ||
            "Professional title not available"
          }
        >
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <Stethoscope className="size-8 text-secondary" />
            <p>{doctorProfile?.bio || "Profile details are being prepared."}</p>
          </div>
        </DashboardCard>
        <DashboardCard
          title="Public listing"
          description={
            doctorProfile?.is_public
              ? "Your public profile flag is enabled."
              : "Your profile is not public yet."
          }
        >
          <EyeOff className="size-8 text-muted-foreground" />
        </DashboardCard>
        <DashboardCard
          title="Future appointments"
          description="Appointments and availability are intentionally out of scope for Phase 2."
        >
          <ClipboardList className="size-8 text-muted-foreground" />
        </DashboardCard>
      </div>
    </PageShell>
  );
}
