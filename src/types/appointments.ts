export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "declined"
  | "cancelled_by_patient"
  | "cancelled_by_doctor"
  | "completed"
  | "no_show";

export type AppointmentSessionType = "online" | "in_person";

export type DoctorAvailabilityRule = {
  id: string;
  doctor_profile_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  slot_duration_minutes: number;
  buffer_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DoctorTimeOff = {
  id: string;
  doctor_profile_id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  patient_profile_id: string;
  doctor_profile_id: string;
  starts_at: string;
  ends_at: string;
  appointment_range?: string;
  status: AppointmentStatus;
  session_type: AppointmentSessionType;
  patient_message: string | null;
  doctor_response_note: string | null;
  cancellation_reason: string | null;
  meeting_url: string | null;
  meeting_url_updated_at: string | null;
  meeting_url_updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AvailableSlot = {
  starts_at: string;
  ends_at: string;
  session_types: AppointmentSessionType[];
  label: string;
};

export type BookingPayload = {
  doctorProfileId: string;
  startsAt: string;
  endsAt: string;
  sessionType: AppointmentSessionType;
  patientMessage?: string;
};

export type AppointmentActionResult = {
  error?: string;
  success?: string;
  appointmentId?: string;
};

export type PatientAppointmentRow = {
  id: string;
  doctor_profile_id: string;
  doctor_display_name: string;
  doctor_professional_title: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  session_type: AppointmentSessionType;
  patient_message: string | null;
  doctor_response_note: string | null;
  cancellation_reason: string | null;
  meeting_url: string | null;
  meeting_url_updated_at: string | null;
};

export type DoctorAppointmentRow = {
  id: string;
  patient_display_name: string;
  patient_phone: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  session_type: AppointmentSessionType;
  patient_message: string | null;
  doctor_response_note: string | null;
  cancellation_reason: string | null;
  meeting_url: string | null;
  meeting_url_updated_at: string | null;
};
