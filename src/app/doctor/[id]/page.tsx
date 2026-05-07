import Link from "next/link";
import { EmptyState } from "@heroui/react";
import { ArrowLeft, SearchX } from "lucide-react";

import { DoctorProfileAbout } from "@/components/doctors/doctor-profile-about";
import { DoctorBookingPanel } from "@/components/doctors/doctor-booking-panel";
import { DoctorProfileHeader } from "@/components/doctors/doctor-profile-header";
import { DoctorSessionInfoCard } from "@/components/doctors/doctor-session-info-card";
import { SafePublicDataNotice } from "@/components/doctors/safe-public-data-notice";
import { PageShell } from "@/components/shared/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAvailableSlotsForDoctor } from "@/services/availability/queries";
import { getCurrentUserProfile } from "@/services/auth/session";
import { getPublicDoctorById } from "@/services/doctors/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Profile",
};

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doctor, viewerProfile] = await Promise.all([
    getPublicDoctorById(id),
    getCurrentUserProfile(),
  ]);

  if (!doctor) {
    return (
      <PageShell>
        <EmptyState className="rounded-3xl border bg-card p-10 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <SearchX className="size-5" />
          </div>
          <h1 className="text-2xl font-semibold">Profile unavailable</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
            This public profile is not available. It may not exist or may not be
            approved for public listing.
          </p>
          <Link
            href="/doctors"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-6 h-9 px-4"
            )}
          >
            Back to doctors
          </Link>
        </EmptyState>
      </PageShell>
    );
  }

  const slots = await getAvailableSlotsForDoctor(doctor.id);

  return (
    <PageShell className="flex flex-col gap-6">
      <Link
        href="/doctors"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to doctors
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <DoctorProfileHeader doctor={doctor} />
          <DoctorProfileAbout doctor={doctor} />
          <SafePublicDataNotice />
        </div>

        <aside className="flex flex-col gap-6">
          <DoctorSessionInfoCard doctor={doctor} />
          <DoctorBookingPanel
            doctor={doctor}
            slots={slots}
            viewerRole={viewerProfile?.role ?? null}
          />
        </aside>
      </div>
    </PageShell>
  );
}
