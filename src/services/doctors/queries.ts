import { getOptionalSupabaseBrowserEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PublicDoctorProfile } from "@/types/profiles";

const publicDoctorSelect = `
  id,
  display_name,
  avatar_url,
  professional_title,
  bio,
  specialties,
  languages,
  years_of_experience,
  session_price,
  session_duration_minutes,
  offers_online,
  offers_in_person,
  verification_status,
  is_public,
  created_at,
  updated_at
`;

export async function getPublicDoctors(): Promise<PublicDoctorProfile[]> {
  const result = await getPublicDoctorsResult();
  return result.doctors;
}

export async function getPublicDoctorsResult(): Promise<{
  doctors: PublicDoctorProfile[];
  error: string | null;
}> {
  if (!getOptionalSupabaseBrowserEnv()) {
    return {
      doctors: [],
      error:
        "The doctor directory is unavailable because Supabase is not configured.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("public_doctor_profiles")
    .select(publicDoctorSelect)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return {
      doctors: [],
      error:
        "We could not load the doctor directory right now. Please try again.",
    };
  }

  return {
    doctors: data,
    error: null,
  };
}

export async function getPublicDoctorById(
  id: string
): Promise<PublicDoctorProfile | null> {
  if (!getOptionalSupabaseBrowserEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("public_doctor_profiles")
    .select(publicDoctorSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export const getApprovedPublicDoctors = getPublicDoctors;
export const getApprovedPublicDoctorById = getPublicDoctorById;
