import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/services/auth/session";
import type {
  AdminDoctorFilters,
  AdminOverview,
  DoctorApplication,
  DoctorVerificationReview,
} from "@/types/admin";
import type { Profile } from "@/types/profiles";

const doctorApplicationSelect = `
  id,
  user_id,
  professional_title,
  bio,
  specialties,
  languages,
  years_of_experience,
  license_number,
  license_country,
  education,
  session_price,
  session_duration_minutes,
  offers_online,
  offers_in_person,
  clinic_address,
  verification_status,
  is_public,
  rejection_reason,
  verified_at,
  verified_by,
  created_at,
  updated_at
`;

const profileSelect = `
  id,
  full_name,
  email,
  phone,
  avatar_url,
  is_active
`;

type ProfileSummary = Pick<
  Profile,
  "id" | "full_name" | "email" | "phone" | "avatar_url" | "is_active"
>;

type DoctorApplicationRow = Omit<
  DoctorApplication,
  "full_name" | "email" | "phone" | "avatar_url" | "is_active"
>;

function mergeDoctorApplications(
  doctors: DoctorApplicationRow[],
  profiles: ProfileSummary[]
): DoctorApplication[] {
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return doctors.map((doctor) => {
    const profile = profileById.get(doctor.user_id);

    return {
      ...doctor,
      full_name: profile?.full_name ?? "Doctor applicant",
      email: profile?.email ?? null,
      phone: profile?.phone ?? null,
      avatar_url: profile?.avatar_url ?? null,
      is_active: profile?.is_active ?? false,
    };
  });
}

function filterDoctorApplications(
  applications: DoctorApplication[],
  filters: AdminDoctorFilters
) {
  const search = filters.search.toLowerCase().trim();

  return [...applications]
    .filter((application) => {
      if (filters.status === "public") {
        return application.is_public;
      }

      if (filters.status === "private") {
        return !application.is_public;
      }

      if (filters.status !== "all") {
        return application.verification_status === filters.status;
      }

      return true;
    })
    .filter((application) => {
      if (!search) {
        return true;
      }

      return [
        application.full_name,
        application.professional_title,
        application.license_country,
        ...application.specialties,
        ...application.languages,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search);
    })
    .toSorted((first, second) => {
      if (filters.sort === "oldest") {
        return (
          new Date(first.created_at).getTime() -
          new Date(second.created_at).getTime()
        );
      }

      if (filters.sort === "experience_desc") {
        return second.years_of_experience - first.years_of_experience;
      }

      return (
        new Date(second.created_at).getTime() -
        new Date(first.created_at).getTime()
      );
    });
}

export async function getDoctorApplications(
  filters: AdminDoctorFilters = {
    status: "all",
    search: "",
    sort: "newest",
  }
): Promise<DoctorApplication[]> {
  await requireRole(["admin"]);

  const supabase = await createSupabaseServerClient();
  const { data: doctors } = await supabase
    .from("doctor_profiles")
    .select(doctorApplicationSelect)
    .order("created_at", { ascending: false });

  const doctorRows = (doctors ?? []) as DoctorApplicationRow[];
  const userIds = doctorRows.map((doctor) => doctor.user_id);

  if (!userIds.length) {
    return [];
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select(profileSelect)
    .in("id", userIds);

  return filterDoctorApplications(
    mergeDoctorApplications(doctorRows, (profiles ?? []) as ProfileSummary[]),
    filters
  );
}

export async function getDoctorApplicationById(
  id: string
): Promise<DoctorApplication | null> {
  await requireRole(["admin"]);

  const supabase = await createSupabaseServerClient();
  const { data: doctor } = await supabase
    .from("doctor_profiles")
    .select(doctorApplicationSelect)
    .eq("id", id)
    .maybeSingle();

  if (!doctor) {
    return null;
  }

  const doctorRow = doctor as DoctorApplicationRow;
  const { data: profile } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", doctorRow.user_id)
    .maybeSingle();

  return mergeDoctorApplications(
    [doctorRow],
    profile ? ([profile] as ProfileSummary[]) : []
  )[0];
}

export async function getDoctorVerificationReviews(
  doctorProfileId?: string,
  limit = 8
): Promise<DoctorVerificationReview[]> {
  await requireRole(["admin"]);

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("doctor_verification_reviews")
    .select("id, doctor_profile_id, reviewed_by, decision, review_note, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (doctorProfileId) {
    query = query.eq("doctor_profile_id", doctorProfileId);
  }

  const { data: reviews } = await query;
  const rows = reviews ?? [];
  const reviewerIds = rows
    .map((review) => review.reviewed_by)
    .filter((id): id is string => Boolean(id));

  if (!reviewerIds.length) {
    return rows.map((review) => ({ ...review, reviewer_name: null }));
  }

  const { data: reviewers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", reviewerIds);

  const reviewerById = new Map(
    (reviewers ?? []).map((reviewer) => [reviewer.id, reviewer.full_name])
  );

  return rows.map((review) => ({
    ...review,
    reviewer_name: review.reviewed_by
      ? (reviewerById.get(review.reviewed_by) ?? null)
      : null,
  }));
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await requireRole(["admin"]);

  const supabase = await createSupabaseServerClient();
  const [applications, requestedAppointments, activeUsers, recentReviews] =
    await Promise.all([
      getDoctorApplications(),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("status", "requested"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      getDoctorVerificationReviews(undefined, 6),
    ]);

  const pendingDoctors = applications.filter(
    (doctor) => doctor.verification_status === "pending"
  );

  return {
    pendingDoctorApplications: pendingDoctors.length,
    approvedPublicDoctors: applications.filter(
      (doctor) =>
        doctor.verification_status === "approved" && doctor.is_public
    ).length,
    requestedAppointments: requestedAppointments.count ?? 0,
    activeUsers: activeUsers.count ?? 0,
    pendingDoctors: pendingDoctors.slice(0, 5),
    recentReviews,
  };
}
