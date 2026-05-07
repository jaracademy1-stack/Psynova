import type { PublicDoctorProfile } from "@/types/profiles";

export function getDoctorDisplayName(doctor: PublicDoctorProfile) {
  return doctor.display_name || "Mental health professional";
}

export function getDoctorTitle(doctor: PublicDoctorProfile) {
  return doctor.professional_title || "Licensed mental health professional";
}

export function getDoctorInitials(doctor: PublicDoctorProfile) {
  const source = getDoctorDisplayName(doctor);
  const initials = source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "DR";
}

export function formatDoctorPrice(price: number | null) {
  if (price === null) {
    return "Price not listed";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getSessionTypeLabels(doctor: PublicDoctorProfile) {
  return [
    doctor.offers_online ? "Online" : null,
    doctor.offers_in_person ? "In person" : null,
  ].filter((value): value is string => Boolean(value));
}

export function getBioPreview(doctor: PublicDoctorProfile, maxLength = 170) {
  const bio =
    doctor.bio ||
    "This professional has an approved public profile. More details will be added as profile editing expands.";

  if (bio.length <= maxLength) {
    return bio;
  }

  return `${bio.slice(0, maxLength).trim()}...`;
}
