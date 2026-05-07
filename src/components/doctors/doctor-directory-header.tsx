import { ShieldCheck, SlidersHorizontal } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";

type DoctorDirectoryHeaderProps = {
  totalDoctors: number;
};

export function DoctorDirectoryHeader({
  totalDoctors,
}: DoctorDirectoryHeaderProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-4">
          <StatusBadge tone="success">Approved professional directory</StatusBadge>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl lg:text-5xl">
              Find the right mental health professional
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Browse approved public profiles, compare session options, and
              choose a professional to learn more about. Booking opens in the
              next phase.
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:min-w-80">
          <div className="rounded-2xl bg-accent p-4 text-accent-foreground">
            <ShieldCheck className="mb-3 size-5" />
            <p className="font-medium">Only approved public profiles appear</p>
          </div>
          <div className="rounded-2xl bg-muted p-4 text-muted-foreground">
            <SlidersHorizontal className="mb-3 size-5 text-secondary" />
            <p className="font-medium text-foreground">{totalDoctors}</p>
            <p>profiles available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
