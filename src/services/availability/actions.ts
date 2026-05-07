"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth/session";
import type { AppointmentActionResult } from "@/types/appointments";

const availabilityPath = "/doctor/dashboard/availability";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string, fallback: number) {
  const parsed = Number(getString(formData, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getCurrentDoctorProfileId() {
  const profile = await requireRole(["doctor"]);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("doctor_profiles")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  return data?.id ?? null;
}

export async function addAvailabilityRule(
  _previousState: AppointmentActionResult,
  formData: FormData
): Promise<AppointmentActionResult> {
  const doctorProfileId = await getCurrentDoctorProfileId();

  if (!doctorProfileId) {
    return { error: "Your doctor profile is not ready yet." };
  }

  const dayOfWeek = getNumber(formData, "dayOfWeek", -1);
  const startTime = getString(formData, "startTime");
  const endTime = getString(formData, "endTime");
  const slotDuration = getNumber(formData, "slotDuration", 50);
  const buffer = getNumber(formData, "buffer", 10);

  if (dayOfWeek < 0 || dayOfWeek > 6 || !startTime || !endTime) {
    return { error: "Choose a valid day and time range." };
  }

  if (startTime >= endTime) {
    return { error: "End time must be after start time." };
  }

  if (slotDuration < 15 || slotDuration > 180 || buffer < 0 || buffer > 60) {
    return { error: "Check the slot duration and buffer values." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("doctor_availability_rules").insert({
    doctor_profile_id: doctorProfileId,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    timezone: getString(formData, "timezone") || "Africa/Cairo",
    slot_duration_minutes: slotDuration,
    buffer_minutes: buffer,
    is_active: true,
  });

  if (error) {
    return { error: "We could not save this availability rule." };
  }

  revalidatePath(availabilityPath);
  return { success: "Availability rule added." };
}

export async function deleteAvailabilityRule(formData: FormData) {
  await requireRole(["doctor"]);
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("doctor_availability_rules").delete().eq("id", id);
  revalidatePath(availabilityPath);
}

export async function addDoctorTimeOff(
  _previousState: AppointmentActionResult,
  formData: FormData
): Promise<AppointmentActionResult> {
  const doctorProfileId = await getCurrentDoctorProfileId();

  if (!doctorProfileId) {
    return { error: "Your doctor profile is not ready yet." };
  }

  const startsAt = getString(formData, "startsAt");
  const endsAt = getString(formData, "endsAt");

  if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) {
    return { error: "Choose a valid blocked time range." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("doctor_time_off").insert({
    doctor_profile_id: doctorProfileId,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: new Date(endsAt).toISOString(),
    reason: getString(formData, "reason") || null,
  });

  if (error) {
    return { error: "We could not save this blocked time." };
  }

  revalidatePath(availabilityPath);
  return { success: "Blocked time added." };
}

export async function deleteDoctorTimeOff(formData: FormData) {
  await requireRole(["doctor"]);
  const id = getString(formData, "id");

  if (!id) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("doctor_time_off").delete().eq("id", id);
  revalidatePath(availabilityPath);
}
