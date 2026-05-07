import { DoctorCardSkeleton } from "@/components/doctors/doctor-card-skeleton";
import { PageShell } from "@/components/shared/page-shell";

export default function DoctorsLoading() {
  return (
    <PageShell className="flex flex-col gap-8">
      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="h-7 w-56 rounded-full bg-muted" />
        <div className="mt-5 h-12 max-w-3xl rounded-2xl bg-muted" />
        <div className="mt-4 h-6 max-w-2xl rounded-full bg-muted" />
      </div>
      <div className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="h-11 rounded-xl bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DoctorCardSkeleton key={index} />
        ))}
      </div>
    </PageShell>
  );
}
