import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DoctorAppointmentRow,
  PatientAppointmentRow,
} from "@/types/appointments";

export async function getPatientAppointments(): Promise<
  PatientAppointmentRow[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_patient_appointments");

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getDoctorAppointments(): Promise<DoctorAppointmentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_doctor_appointments");

  if (error || !data) {
    return [];
  }

  return data;
}
