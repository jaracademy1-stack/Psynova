import type {
  DoctorDirectoryFilters,
  PublicDoctorProfile,
} from "@/types/profiles";

export const defaultDoctorDirectoryFilters: DoctorDirectoryFilters = {
  search: "",
  specialty: "all",
  language: "all",
  sessionType: "all",
  maxPrice: "",
  minExperience: "",
  sort: "recommended",
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function parseNumberFilter(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getDoctorFilterOptions(doctors: PublicDoctorProfile[]) {
  return {
    specialties: uniqueSorted(doctors.flatMap((doctor) => doctor.specialties)),
    languages: uniqueSorted(doctors.flatMap((doctor) => doctor.languages)),
  };
}

export function filterDoctorsClientSide(
  doctors: PublicDoctorProfile[],
  filters: DoctorDirectoryFilters
) {
  const search = normalize(filters.search);
  const maxPrice = parseNumberFilter(filters.maxPrice);
  const minExperience = parseNumberFilter(filters.minExperience);

  const filtered = doctors.filter((doctor) => {
    const searchText = [
      doctor.display_name,
      doctor.professional_title,
      doctor.bio,
      ...doctor.specialties,
      ...doctor.languages,
    ]
      .map(normalize)
      .join(" ");

    if (search && !searchText.includes(search)) {
      return false;
    }

    if (
      filters.specialty !== "all" &&
      !doctor.specialties.some(
        (specialty) => normalize(specialty) === normalize(filters.specialty)
      )
    ) {
      return false;
    }

    if (
      filters.language !== "all" &&
      !doctor.languages.some(
        (language) => normalize(language) === normalize(filters.language)
      )
    ) {
      return false;
    }

    if (filters.sessionType === "online" && !doctor.offers_online) {
      return false;
    }

    if (filters.sessionType === "in_person" && !doctor.offers_in_person) {
      return false;
    }

    if (
      filters.sessionType === "either" &&
      !doctor.offers_online &&
      !doctor.offers_in_person
    ) {
      return false;
    }

    if (maxPrice !== null) {
      if (doctor.session_price === null || doctor.session_price > maxPrice) {
        return false;
      }
    }

    if (
      minExperience !== null &&
      doctor.years_of_experience < minExperience
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "price_asc") {
      const aPrice = a.session_price ?? Number.POSITIVE_INFINITY;
      const bPrice = b.session_price ?? Number.POSITIVE_INFINITY;
      return aPrice - bPrice;
    }

    if (filters.sort === "experience_desc") {
      return b.years_of_experience - a.years_of_experience;
    }

    return 0;
  });
}
