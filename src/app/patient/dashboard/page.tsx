import Link from "next/link";
import { Card } from "@heroui/react";
import { CalendarCheck, ClipboardCheck, Search } from "lucide-react";

import { PatientAppointmentsSection } from "@/components/appointments/patient-appointments-section";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { requireRole } from "@/services/auth/session";
import { getPatientAppointments } from "@/services/appointments/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Patient Dashboard",
};

export default async function PatientDashboardPage() {
  const profile = await requireRole(["patient"]);
  const supabase = await createSupabaseServerClient();
  const [patientProfileResult, appointments] = await Promise.all([
    supabase
      .from("patient_profiles")
      .select("preferred_name, consent_accepted")
      .eq("user_id", profile.id)
      .maybeSingle(),
    getPatientAppointments(),
  ]);

  const patientProfile = patientProfileResult.data;
  const activeAppointments = appointments.filter((appointment) =>
    ["requested", "confirmed"].includes(appointment.status)
  );

  const completionItems = [
    Boolean(profile.full_name),
    Boolean(profile.phone),
    Boolean(patientProfile?.consent_accepted),
  ];
  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex flex-col gap-3">
          <StatusBadge tone="success">Patient dashboard</StatusBadge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            Welcome, {patientProfile?.preferred_name || profile.full_name}
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Your care, in one private place. Booking requests and confirmed
            sessions appear here after you choose a time with a professional.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Profile completion"
          description="Basic account and consent readiness."
        >
          <div className="flex items-end justify-between gap-4">
            <span className="text-4xl font-semibold">{completion}%</span>
            <ClipboardCheck className="size-8 text-secondary" />
          </div>
        </DashboardCard>
        <DashboardCard
          title="Upcoming sessions"
          description={
            activeAppointments.length
              ? `${activeAppointments.length} active appointment request${activeAppointments.length === 1 ? "" : "s"}.`
              : "No active appointments yet."
          }
        >
          <CalendarCheck className="size-8 text-muted-foreground" />
        </DashboardCard>
        <DashboardCard
          title="Recommended next step"
          description="Browse approved public professionals when available."
        >
          <Link
            href="/doctors"
            className={cn(buttonVariants(), "h-9 gap-2 px-4")}
          >
            <Search className="size-4" />
            Browse doctors
          </Link>
        </DashboardCard>
      </div>

      <Card className="border bg-card">
        <Card.Header>
          <Card.Title>Privacy note</Card.Title>
          <Card.Description>
            Patient profile information is protected by RLS. Public pages never
            show your private details; assigned providers only see the minimum
            appointment coordination details needed for booked sessions.
          </Card.Description>
        </Card.Header>
      </Card>

      <PatientAppointmentsSection appointments={appointments} />
    </PageShell>
  );
}
