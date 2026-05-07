import { redirect } from "next/navigation";

import { getOptionalSupabaseBrowserEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRedirectPathForRole } from "@/services/auth/redirects";
import type { Profile, UserRole } from "@/types/profiles";

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

export async function getCurrentUserProfile(): Promise<Profile | null> {
  if (!getOptionalSupabaseBrowserEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || !data.is_active) {
    return null;
  }

  return data;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await requireProfile();

  if (!allowedRoles.includes(profile.role)) {
    redirect(getRedirectPathForRole(profile.role));
  }

  return profile;
}
