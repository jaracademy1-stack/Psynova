import Link from "next/link";
import { Card } from "@heroui/react";
import { CalendarClock, ClipboardList, EyeOff, Stethoscope } from "lucide-react";

import { DoctorAppointmentsSection } from "@/components/appointments/doctor-appointments-section";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getDoctorAppointments } from "@/services/appointments/queries";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Dashboard",
};

const statusCopy = {
  pending: {
    label: "Pending review",
    tone: "warning" as const,
    text: "Your profile is under review. Admin will review your professional details before public listing and booking are available.",
  },
  approved: {
    label: "Approved",
    tone: "success" as const,
    text: "Your profile is approved. Public visibility is controlled by the admin verification workflow.",
  },
  rejected: {
    label: "Needs support",
    tone: "danger" as const,
    text: "Your application needs attention. Please contact platform support for the next steps.",
  },
};

export default async function DoctorDashboardPage() {
  const profile = await requireRole(["doctor"]);
  const supabase = await createSupabaseServerClient();
  const [doctorProfileResult, appointments] = await Promise.all([
    supabase
      .from("doctor_profiles")
      .select("id, professional_title, bio, verification_status, is_public")
      .eq("user_id", profile.id)
      .maybeSingle(),
    getDoctorAppointments(),
  ]);

  const doctorProfile = doctorProfileResult.data;
  const requestedAppointments = appointments.filter(
    (appointment) => appointment.status === "requested"
  );

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
            Manage your professional profile, weekly availability, and booking
            requests.
          </p>
          <Link
            href="/doctor/dashboard/availability"
            className={cn(buttonVariants(), "h-9 w-fit gap-2 px-4")}
          >
            <CalendarClock className="size-4" />
            Manage availability
          </Link>
        </div>
        <LogoutButton />
      </div>

      <Card className="border bg-card">
        <Card.Header>
          <Card.Title>Verification status</Card.Title>
          <Card.Description>{status.text}</Card.Description>
        </Card.Header>
        {doctorProfile?.verification_status === "approved" &&
        doctorProfile.is_public ? (
          <Card.Content>
            <Link
              href={`/doctor/${doctorProfile.id}`}
              className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}
            >
              View public profile
            </Link>
          </Card.Content>
        ) : null}
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
          title="Appointment requests"
          description={
            requestedAppointments.length
              ? `${requestedAppointments.length} request${requestedAppointments.length === 1 ? "" : "s"} waiting for review.`
              : "No pending appointment requests."
          }
        >
          <ClipboardList className="size-8 text-muted-foreground" />
        </DashboardCard>
      </div>

      <DoctorAppointmentsSection appointments={appointments} />
    </PageShell>
  );
}
