import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AvailabilityManagement } from "@/components/availability/availability-management";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCurrentDoctorAvailability } from "@/services/availability/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Availability",
};

export default async function DoctorAvailabilityPage() {
  const { doctorProfile, rules, timeOff } =
    await getCurrentDoctorAvailability();

  return (
    <PageShell className="flex flex-col gap-8">
      <Link
        href="/doctor/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="flex flex-col gap-3">
        <StatusBadge>Doctor workspace</StatusBadge>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          Manage availability
        </h1>
        <p className="max-w-2xl leading-7 text-muted-foreground">
          Define weekly booking windows and block unavailable times. Public
          profile pages only show open slots, never private blocked reasons.
        </p>
      </div>

      {doctorProfile ? (
        <AvailabilityManagement rules={rules} timeOff={timeOff} />
      ) : (
        <div className="rounded-3xl border bg-card p-8 text-muted-foreground">
          Your doctor profile is not ready yet.
        </div>
      )}
    </PageShell>
  );
}
