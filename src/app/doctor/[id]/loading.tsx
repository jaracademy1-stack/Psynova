import { DoctorCardSkeleton } from "@/components/doctors/doctor-card-skeleton";
import { PageShell } from "@/components/shared/page-shell";

export default function DoctorProfileLoading() {
  return (
    <PageShell className="flex flex-col gap-6">
      <div className="h-5 w-32 rounded-full bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="flex gap-5">
              <div className="size-20 rounded-full bg-muted" />
              <div className="flex flex-1 flex-col gap-3">
                <div className="h-6 w-40 rounded-full bg-muted" />
                <div className="h-10 max-w-md rounded-2xl bg-muted" />
                <div className="h-5 max-w-sm rounded-full bg-muted" />
              </div>
            </div>
          </div>
          <DoctorCardSkeleton />
        </div>
        <DoctorCardSkeleton />
      </div>
    </PageShell>
  );
}
