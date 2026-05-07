import type { VerificationStatus } from "@/types/profiles";

export function getVerificationStatusLabel(status: VerificationStatus) {
  if (status === "approved") {
    return "Approved";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return "Pending review";
}

export function getVerificationStatusTone(status: VerificationStatus) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected") {
    return "danger" as const;
  }

  return "warning" as const;
}
