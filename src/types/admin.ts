import type { VerificationStatus } from "@/types/profiles";

export type DoctorApplicationStatus = VerificationStatus | "public" | "private";

export type DoctorVerificationReviewRow = {
  id: string;
  doctor_profile_id: string;
  reviewed_by: string | null;
  decision: "approved" | "rejected";
  review_note: string | null;
  created_at: string;
};

export type DoctorVerificationReview = DoctorVerificationReviewRow & {
  reviewer_name: string | null;
};

export type AdminAuditAction =
  | "doctor_approved"
  | "doctor_rejected"
  | "doctor_public_status_changed"
  | "profile_active_status_changed";

export type AdminAuditEntityType = "doctor_profile" | "profile";

export type AdminAuditEvent = {
  id: string;
  actor_profile_id: string | null;
  action: AdminAuditAction;
  entity_type: AdminAuditEntityType;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type DoctorApplication = {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  avatar_url: string | null;
  professional_title: string | null;
  bio: string | null;
  specialties: string[];
  languages: string[];
  years_of_experience: number;
  license_number: string | null;
  license_country: string | null;
  education: string | null;
  session_price: number | null;
  session_duration_minutes: number;
  offers_online: boolean;
  offers_in_person: boolean;
  clinic_address: string | null;
  verification_status: VerificationStatus;
  is_public: boolean;
  rejection_reason: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminOverview = {
  pendingDoctorApplications: number;
  approvedPublicDoctors: number;
  requestedAppointments: number;
  activeUsers: number;
  pendingDoctors: DoctorApplication[];
  recentReviews: DoctorVerificationReview[];
};

export type AdminDoctorFilters = {
  status: DoctorApplicationStatus | "all";
  search: string;
  sort: "newest" | "oldest" | "experience_desc";
};

export type AdminActionResult = {
  error?: string;
  success?: string;
};

export type AdminRpcResult = {
  doctor_profile_id?: string;
  profile_id?: string;
  verification_status?: VerificationStatus;
  is_public?: boolean;
  is_active?: boolean;
};
