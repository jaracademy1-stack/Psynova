import type {
  DoctorProfile,
  PatientProfile,
  Profile,
  PublicDoctorProfile,
} from "@/types/profiles";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<Profile, ProfileInsert, ProfileUpdate>;
      patient_profiles: TableDefinition<
        PatientProfile,
        PatientProfileInsert,
        PatientProfileUpdate
      >;
      doctor_profiles: TableDefinition<
        DoctorProfile,
        DoctorProfileInsert,
        DoctorProfileUpdate
      >;
    };
    Views: {
      public_doctor_profiles: TableDefinition<
        PublicDoctorProfile,
        never,
        never
      >;
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileInsert = {
  id: string;
  role: Profile["role"];
  full_name: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  onboarding_completed?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<Omit<ProfileInsert, "id">>;

export type PatientProfileInsert = {
  id?: string;
  user_id: string;
  preferred_name?: string | null;
  date_of_birth?: string | null;
  gender?: PatientProfile["gender"];
  country?: string | null;
  city?: string | null;
  primary_concern?: string | null;
  therapy_goal?: string | null;
  preferred_session_type?: PatientProfile["preferred_session_type"];
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  consent_accepted?: boolean;
  consent_accepted_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PatientProfileUpdate = Partial<
  Omit<PatientProfileInsert, "id" | "user_id">
>;

export type DoctorProfileInsert = {
  id?: string;
  user_id: string;
  professional_title?: string | null;
  bio?: string | null;
  specialties?: string[];
  languages?: string[];
  years_of_experience?: number;
  license_number?: string | null;
  license_country?: string | null;
  education?: string | null;
  session_price?: number | null;
  session_duration_minutes?: number;
  offers_online?: boolean;
  offers_in_person?: boolean;
  clinic_address?: string | null;
  verification_status?: DoctorProfile["verification_status"];
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DoctorProfileUpdate = Partial<
  Omit<DoctorProfileInsert, "id" | "user_id">
>;
