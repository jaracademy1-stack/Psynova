"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth/session";
import type { AdminActionResult } from "@/types/admin";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAdminError(message?: string) {
  if (!message) {
    return "We could not complete this admin action. Please try again.";
  }

  if (message.includes("Only admins")) {
    return "Only admin accounts can perform this action.";
  }

  if (message.includes("not found")) {
    return "This doctor application could not be found.";
  }

  if (message.includes("approved doctors")) {
    return "Only approved doctors can be made public.";
  }

  if (message.includes("own account")) {
    return "You cannot deactivate your own admin account.";
  }

  return "We could not complete this admin action. Please try again.";
}

function revalidateAdminPaths(doctorProfileId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/doctors");
  revalidatePath("/doctors");

  if (doctorProfileId) {
    revalidatePath(`/dashboard/doctors/${doctorProfileId}`);
    revalidatePath(`/doctor/${doctorProfileId}`);
  }
}

export async function approveDoctorApplication(
  _previousState: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  await requireRole(["admin"]);

  const doctorProfileId = getString(formData, "doctorProfileId");

  if (!doctorProfileId) {
    return { error: "Doctor application not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_approve_doctor", {
    p_doctor_profile_id: doctorProfileId,
    p_make_public: formData.get("makePublic") === "on",
    p_review_note: getString(formData, "reviewNote") || null,
  });

  if (error) {
    return { error: normalizeAdminError(error.message) };
  }

  revalidateAdminPaths(doctorProfileId);
  return { success: "Doctor application approved." };
}

export async function rejectDoctorApplication(
  _previousState: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  await requireRole(["admin"]);

  const doctorProfileId = getString(formData, "doctorProfileId");

  if (!doctorProfileId) {
    return { error: "Doctor application not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_reject_doctor", {
    p_doctor_profile_id: doctorProfileId,
    p_review_note: getString(formData, "reviewNote") || null,
  });

  if (error) {
    return { error: normalizeAdminError(error.message) };
  }

  revalidateAdminPaths(doctorProfileId);
  return { success: "Doctor application rejected." };
}

export async function setDoctorPublicStatus(
  _previousState: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  await requireRole(["admin"]);

  const doctorProfileId = getString(formData, "doctorProfileId");

  if (!doctorProfileId) {
    return { error: "Doctor application not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_doctor_public_status", {
    p_doctor_profile_id: doctorProfileId,
    p_is_public: formData.get("isPublic") === "true",
  });

  if (error) {
    return { error: normalizeAdminError(error.message) };
  }

  revalidateAdminPaths(doctorProfileId);
  return { success: "Public listing status updated." };
}

export async function setProfileActiveStatus(
  _previousState: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  await requireRole(["admin"]);

  const profileId = getString(formData, "profileId");
  const doctorProfileId = getString(formData, "doctorProfileId");

  if (!profileId) {
    return { error: "Profile not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_profile_active_status", {
    p_profile_id: profileId,
    p_is_active: formData.get("isActive") === "true",
  });

  if (error) {
    return { error: normalizeAdminError(error.message) };
  }

  revalidateAdminPaths(doctorProfileId || undefined);
  return { success: "Profile active status updated." };
}
