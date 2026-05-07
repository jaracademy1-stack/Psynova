import { DoctorDirectory } from "@/components/doctors/doctor-directory";
import { DoctorDirectoryHeader } from "@/components/doctors/doctor-directory-header";
import { PageShell } from "@/components/shared/page-shell";
import { getPublicDoctorsResult } from "@/services/doctors/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctors",
};

export default async function DoctorsPage() {
  const { doctors, error } = await getPublicDoctorsResult();

  return (
    <PageShell className="flex flex-col gap-8">
      <DoctorDirectoryHeader totalDoctors={doctors.length} />
      <DoctorDirectory doctors={doctors} error={error} />
    </PageShell>
  );
}
