import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth/session";
import type { AvailableSlot } from "@/types/appointments";

const platformTimezone = "Africa/Cairo";

function formatDateForTimezone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export async function getCurrentDoctorAvailability() {
  const profile = await requireRole(["doctor"]);
  const supabase = await createSupabaseServerClient();

  const { data: doctorProfile } = await supabase
    .from("doctor_profiles")
    .select("id, professional_title, verification_status, is_public")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!doctorProfile) {
    return {
      doctorProfile: null,
      rules: [],
      timeOff: [],
    };
  }

  const [rulesResult, timeOffResult] = await Promise.all([
    supabase
      .from("doctor_availability_rules")
      .select(
        "id, doctor_profile_id, day_of_week, start_time, end_time, timezone, slot_duration_minutes, buffer_minutes, is_active, created_at, updated_at"
      )
      .eq("doctor_profile_id", doctorProfile.id)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true }),
    supabase
      .from("doctor_time_off")
      .select(
        "id, doctor_profile_id, starts_at, ends_at, reason, created_at, updated_at"
      )
      .eq("doctor_profile_id", doctorProfile.id)
      .gte("ends_at", new Date().toISOString())
      .order("starts_at", { ascending: true }),
  ]);

  return {
    doctorProfile,
    rules: rulesResult.data ?? [],
    timeOff: timeOffResult.data ?? [],
  };
}

export async function getAvailableSlotsForDoctor(
  doctorProfileId: string,
  days = 14
): Promise<AvailableSlot[]> {
  const supabase = await createSupabaseServerClient();
  const today = new Date();
  const toDate = new Date(today);
  toDate.setDate(today.getDate() + days);

  const { data, error } = await supabase.rpc("get_available_slots", {
    p_doctor_profile_id: doctorProfileId,
    p_from_date: formatDateForTimezone(today, platformTimezone),
    p_to_date: formatDateForTimezone(toDate, platformTimezone),
  });

  if (error || !data) {
    return [];
  }

  return data;
}
