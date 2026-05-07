import type { UserRole } from "@/types/profiles";

export function getRedirectPathForRole(role: UserRole) {
  if (role === "admin") {
    return "/dashboard";
  }

  if (role === "doctor") {
    return "/doctor/dashboard";
  }

  return "/patient/dashboard";
}
