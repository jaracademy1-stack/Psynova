export type UserRole = "patient" | "doctor" | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PatientProfile = {
  id: string;
  user_id: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  country: string | null;
  city: string | null;
  primary_concern: string | null;
  therapy_goal: string | null;
  preferred_session_type: "online" | "in_person" | "either" | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  consent_accepted: boolean;
  consent_accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DoctorProfile = {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
};

export type PublicDoctorProfile = Pick<
  DoctorProfile,
  | "id"
  | "professional_title"
  | "bio"
  | "specialties"
  | "languages"
  | "years_of_experience"
  | "session_price"
  | "session_duration_minutes"
  | "offers_online"
  | "offers_in_person"
  | "verification_status"
  | "is_public"
  | "created_at"
  | "updated_at"
> & {
  display_name: string;
  avatar_url: string | null;
};

export type SessionTypeFilter = "all" | "online" | "in_person" | "either";

export type DoctorSortOption = "recommended" | "price_asc" | "experience_desc";

export type DoctorDirectoryFilters = {
  search: string;
  specialty: string;
  language: string;
  sessionType: SessionTypeFilter;
  maxPrice: string;
  minExperience: string;
  sort: DoctorSortOption;
};

export type PatientRegistrationPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  consentAccepted: boolean;
};

export type DoctorRegistrationPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  professionalTitle: string;
  specialties: string[];
  languages: string[];
  yearsOfExperience: number;
  licenseNumber: string;
  licenseCountry: string;
  bio: string;
  offersOnline: boolean;
  offersInPerson: boolean;
  sessionPrice: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};
