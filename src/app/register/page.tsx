import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { PatientRegisterForm } from "@/components/auth/patient-register-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create a patient account"
      description="Create a private account so booking and profile details can stay connected to you securely."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary">
            Login
          </Link>
          .
        </>
      }
    >
      <PatientRegisterForm />
    </AuthShell>
  );
}
