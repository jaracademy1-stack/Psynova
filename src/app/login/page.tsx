import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Access your private dashboard for appointments, profile details, and role-specific workspace tools."
      footer={
        <>
          Need a new account?{" "}
          <Link href="/register" className="font-medium text-primary">
            Register as a patient
          </Link>
          .
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
