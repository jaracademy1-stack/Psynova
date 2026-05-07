"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  doctorRegistrationSchema,
  formatZodFieldErrors,
  formatZodErrors,
  loginSchema,
  patientRegistrationSchema,
  type AuthActionState,
} from "@/lib/validations/auth";
import { getOptionalSupabaseBrowserEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRedirectPathForRole } from "@/services/auth/redirects";

const profileSelect = `
  id,
  role,
  full_name,
  email,
  phone,
  avatar_url,
  onboarding_completed,
  is_active,
  created_at,
  updated_at
`;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getCheckbox(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function assertSupabaseConfigured(): AuthActionState | null {
  if (getOptionalSupabaseBrowserEnv()) {
    return null;
  }

  return {
    error:
      "Supabase environment variables are not configured. Add them to .env.local and restart the dev server.",
  };
}

function normalizePatientSignupError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("already") || normalized.includes("registered")) {
    return "An account may already exist for this email. Try logging in or use another email.";
  }

  if (normalized.includes("password")) {
    return "Use a stronger password with at least 8 characters.";
  }

  if (normalized.includes("email")) {
    return "Enter a valid email address or try another email.";
  }

  return "We could not create this account. Please check your details or try another email.";
}

async function getEmailRedirectTo(path: string) {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return `${origin}${path}`;
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}${path}`;
  }

  return undefined;
}

export async function signInWithPassword(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return formatZodErrors(parsed.error);
  }

  const configError = assertSupabaseConfigured();
  if (configError) {
    return configError;
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword(
    parsed.data
  );

  if (error || !authData.user) {
    return {
      error: "We could not sign you in. Check your email and password.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) {
    return {
      error:
        "Your account profile is not ready yet. Please contact support if this continues.",
    };
  }

  redirect(getRedirectPathForRole(profile.role));
}

export async function signUpPatient(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = patientRegistrationSchema.safeParse({
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
    phone: getString(formData, "phone"),
    consentAccepted: getCheckbox(formData, "consentAccepted"),
  });

  if (!parsed.success) {
    console.warn("VALIDATION_ERROR", {
      action: "signUpPatient",
      fields: Object.keys(parsed.error.flatten().fieldErrors),
    });
    return formatZodFieldErrors(parsed.error);
  }

  const configError = assertSupabaseConfigured();
  if (configError) {
    return configError;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: await getEmailRedirectTo("/login"),
      data: {
        role: "patient",
        full_name: parsed.data.fullName,
        phone: parsed.data.phone ?? "",
        consent_accepted: parsed.data.consentAccepted,
      },
    },
  });

  if (error) {
    console.error("SUPABASE_AUTH_SIGNUP_ERROR", {
      action: "signUpPatient",
      code: error.code,
      status: error.status,
      message: error.message,
    });

    return {
      error: normalizePatientSignupError(error.message),
    };
  }

  if (!data.session) {
    return {
      success:
        "Please check your email to confirm your account, then log in to continue.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", data.user?.id ?? "")
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role !== "patient" ||
    !profile.is_active
  ) {
    console.error("PROFILE_CREATE_ERROR", {
      action: "signUpPatient",
      userId: data.user?.id,
      hasProfile: Boolean(profile),
      profileRole: profile?.role,
      profileIsActive: profile?.is_active,
      message: profileError?.message,
    });

    return {
      error:
        "Your account was created, but the patient profile is not ready yet. Please try signing in again or contact support.",
    };
  }

  redirect("/patient/dashboard");
}

export async function signUpDoctor(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = doctorRegistrationSchema.safeParse({
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
    phone: getString(formData, "phone"),
    professionalTitle: getString(formData, "professionalTitle"),
    specialties: getString(formData, "specialties"),
    languages: getString(formData, "languages"),
    yearsOfExperience: getString(formData, "yearsOfExperience"),
    licenseNumber: getString(formData, "licenseNumber"),
    licenseCountry: getString(formData, "licenseCountry"),
    bio: getString(formData, "bio"),
    offersOnline: getCheckbox(formData, "offersOnline"),
    offersInPerson: getCheckbox(formData, "offersInPerson"),
    sessionPrice: getString(formData, "sessionPrice"),
  });

  if (!parsed.success) {
    return formatZodErrors(parsed.error);
  }

  const configError = assertSupabaseConfigured();
  if (configError) {
    return configError;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: "doctor",
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        professional_title: parsed.data.professionalTitle,
        specialties: parsed.data.specialties,
        languages: parsed.data.languages,
        years_of_experience: parsed.data.yearsOfExperience,
        license_number: parsed.data.licenseNumber,
        license_country: parsed.data.licenseCountry,
        bio: parsed.data.bio,
        offers_online: parsed.data.offersOnline,
        offers_in_person: parsed.data.offersInPerson,
        session_price: parsed.data.sessionPrice,
      },
    },
  });

  if (error) {
    return {
      error: "We could not submit your application. Please try again.",
    };
  }

  redirect("/doctor/dashboard");
}

export async function signOut() {
  if (!getOptionalSupabaseBrowserEnv()) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
