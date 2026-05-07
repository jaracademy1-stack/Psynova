"use client";

import { DoctorEmptyState } from "@/components/doctors/doctor-empty-state";
import { PageShell } from "@/components/shared/page-shell";

export default function DoctorsError() {
  return (
    <PageShell>
      <DoctorEmptyState
        mode="error"
        message="We could not load the directory. Please refresh the page or try again later."
      />
    </PageShell>
  );
}
