import type {
  Appointment,
  AppointmentSessionType,
  AppointmentStatus,
  AvailableSlot,
  DoctorAppointmentRow,
  DoctorAvailabilityRule,
  DoctorTimeOff,
  PatientAppointmentRow,
} from "@/types/appointments";
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
      doctor_availability_rules: TableDefinition<
        DoctorAvailabilityRule,
        DoctorAvailabilityRuleInsert,
        DoctorAvailabilityRuleUpdate
      >;
      doctor_time_off: TableDefinition<
        DoctorTimeOff,
        DoctorTimeOffInsert,
        DoctorTimeOffUpdate
      >;
      appointments: TableDefinition<
        Appointment,
        AppointmentInsert,
        AppointmentUpdate
      >;
    };
    Views: {
      public_doctor_profiles: TableDefinition<
        PublicDoctorProfile,
        never,
        never
      >;
    };
    Functions: {
      get_available_slots: {
        Args: {
          p_doctor_profile_id: string;
          p_from_date?: string;
          p_to_date?: string;
        };
        Returns: AvailableSlot[];
      };
      book_appointment: {
        Args: {
          p_doctor_profile_id: string;
          p_starts_at: string;
          p_ends_at: string;
          p_session_type: AppointmentSessionType;
          p_patient_message?: string | null;
        };
        Returns: Array<
          Pick<
            Appointment,
            "id" | "starts_at" | "ends_at" | "status" | "session_type"
          >
        >;
      };
      cancel_patient_appointment: {
        Args: {
          p_appointment_id: string;
          p_cancellation_reason?: string | null;
        };
        Returns: Array<{ id: string; status: AppointmentStatus }>;
      };
      update_doctor_appointment_status: {
        Args: {
          p_appointment_id: string;
          p_next_status: AppointmentStatus;
          p_note?: string | null;
        };
        Returns: Array<{ id: string; status: AppointmentStatus }>;
      };
      get_patient_appointments: {
        Args: Record<string, never>;
        Returns: PatientAppointmentRow[];
      };
      get_doctor_appointments: {
        Args: Record<string, never>;
        Returns: DoctorAppointmentRow[];
      };
    };
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

export type DoctorAvailabilityRuleInsert = {
  id?: string;
  doctor_profile_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone?: string;
  slot_duration_minutes?: number;
  buffer_minutes?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DoctorAvailabilityRuleUpdate = Partial<
  Omit<DoctorAvailabilityRuleInsert, "id" | "doctor_profile_id">
>;

export type DoctorTimeOffInsert = {
  id?: string;
  doctor_profile_id: string;
  starts_at: string;
  ends_at: string;
  reason?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DoctorTimeOffUpdate = Partial<
  Omit<DoctorTimeOffInsert, "id" | "doctor_profile_id">
>;

export type AppointmentInsert = {
  id?: string;
  patient_profile_id: string;
  doctor_profile_id: string;
  starts_at: string;
  ends_at: string;
  status?: AppointmentStatus;
  session_type?: AppointmentSessionType;
  patient_message?: string | null;
  doctor_response_note?: string | null;
  cancellation_reason?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AppointmentUpdate = Partial<
  Omit<AppointmentInsert, "id" | "patient_profile_id" | "doctor_profile_id">
>;
