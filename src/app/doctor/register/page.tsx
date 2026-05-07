import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { DoctorRegisterForm } from "@/components/auth/doctor-register-form";

export const metadata = {
  title: "Doctor Application",
};

export default function DoctorRegisterPage() {
  return (
    <AuthShell
      title="Apply as a professional"
      description="Submit your professional profile for manual review. Approved profiles can be made public in a later admin phase."
      footer={
        <>
          Applying as a patient instead?{" "}
          <Link href="/register" className="font-medium text-primary">
            Create a patient account
          </Link>
          .
        </>
      }
    >
      <DoctorRegisterForm />
    </AuthShell>
  );
}
