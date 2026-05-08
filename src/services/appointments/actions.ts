"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AppointmentActionResult,
  AppointmentSessionType,
  AppointmentStatus,
} from "@/types/appointments";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDatabaseError(message?: string) {
  if (!message) {
    return "We could not complete this action. Please try again.";
  }

  if (message.includes("time slot")) {
    return "This time slot is no longer available. Please choose another time.";
  }

  if (message.includes("Only patient")) {
    return "Only patient accounts can book sessions.";
  }

  if (message.includes("log in")) {
    return "Please log in to continue.";
  }

  if (message.includes("consent")) {
    return "Please complete consent before booking.";
  }

  return "We could not complete this action. Please try again.";
}

function parseMeetingUrl(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return { meetingUrl: null, error: null };
  }

  if (value.length > 500) {
    return {
      meetingUrl: null,
      error: "Meeting links must be 500 characters or fewer.",
    };
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return {
        meetingUrl: null,
        error: "Enter a valid meeting link starting with http:// or https://.",
      };
    }

    return { meetingUrl: value, error: null };
  } catch {
    return {
      meetingUrl: null,
      error: "Enter a valid meeting link starting with http:// or https://.",
    };
  }
}

export async function bookAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
): Promise<AppointmentActionResult> {
  const doctorProfileId = getString(formData, "doctorProfileId");
  const startsAt = getString(formData, "startsAt");
  const endsAt = getString(formData, "endsAt");
  const sessionType = getString(formData, "sessionType") as AppointmentSessionType;

  if (!doctorProfileId || !startsAt || !endsAt) {
    return { error: "Choose an available time before booking." };
  }

  if (!["online", "in_person"].includes(sessionType)) {
    return { error: "Choose a valid session type." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("book_appointment", {
    p_doctor_profile_id: doctorProfileId,
    p_starts_at: startsAt,
    p_ends_at: endsAt,
    p_session_type: sessionType,
    p_patient_message: getString(formData, "patientMessage") || null,
  });

  if (error || !data?.[0]) {
    return { error: normalizeDatabaseError(error?.message) };
  }

  revalidatePath(`/doctor/${doctorProfileId}`);
  revalidatePath("/patient/dashboard");
  revalidatePath("/doctor/dashboard");

  return {
    success: "Your appointment request has been sent.",
    appointmentId: data[0].id,
  };
}

export async function cancelPatientAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
): Promise<AppointmentActionResult> {
  const appointmentId = getString(formData, "appointmentId");

  if (!appointmentId) {
    return { error: "Appointment not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("cancel_patient_appointment", {
    p_appointment_id: appointmentId,
    p_cancellation_reason:
      getString(formData, "reason") || getString(formData, "note") || null,
  });

  if (error) {
    return { error: "We could not cancel this appointment." };
  }

  revalidatePath("/patient/dashboard");
  revalidatePath("/doctor/dashboard");
  return { success: "Appointment cancelled." };
}

async function updateDoctorAppointment(
  formData: FormData,
  nextStatus: AppointmentStatus
): Promise<AppointmentActionResult> {
  const appointmentId = getString(formData, "appointmentId");

  if (!appointmentId) {
    return { error: "Appointment not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("update_doctor_appointment_status", {
    p_appointment_id: appointmentId,
    p_next_status: nextStatus,
    p_note: getString(formData, "note") || null,
  });

  if (error) {
    return { error: "We could not update this appointment." };
  }

  revalidatePath("/doctor/dashboard");
  revalidatePath("/patient/dashboard");
  return { success: "Appointment updated." };
}

export async function confirmDoctorAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
) {
  return updateDoctorAppointment(formData, "confirmed");
}

export async function declineDoctorAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
) {
  return updateDoctorAppointment(formData, "declined");
}

export async function cancelDoctorAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
) {
  return updateDoctorAppointment(formData, "cancelled_by_doctor");
}

export async function completeDoctorAppointment(
  _previousState: AppointmentActionResult,
  formData: FormData
) {
  return updateDoctorAppointment(formData, "completed");
}

export async function setDoctorAppointmentMeetingUrl(
  _previousState: AppointmentActionResult,
  formData: FormData
): Promise<AppointmentActionResult> {
  const appointmentId = getString(formData, "appointmentId");
  const parsed = parseMeetingUrl(getString(formData, "meetingUrl"));

  if (!appointmentId) {
    return { error: "Appointment not found." };
  }

  if (parsed.error) {
    return { error: parsed.error };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("set_doctor_appointment_meeting_url", {
    p_appointment_id: appointmentId,
    p_meeting_url: parsed.meetingUrl,
  });

  if (error) {
    if (error.message.includes("valid meeting link")) {
      return {
        error: "Enter a valid meeting link starting with http:// or https://.",
      };
    }

    if (error.message.includes("online")) {
      return { error: "Meeting links are only available for online sessions." };
    }

    if (error.message.includes("active appointments")) {
      return {
        error: "Meeting links can only be changed for requested or confirmed appointments.",
      };
    }

    return { error: "We could not save the meeting link. Please try again." };
  }

  revalidatePath("/doctor/dashboard");
  revalidatePath("/patient/dashboard");

  return {
    success: parsed.meetingUrl
      ? "Meeting link saved."
      : "Meeting link cleared.",
  };
}
