"use client";

import { useMemo, useState } from "react";

import { DoctorCard } from "@/components/doctors/doctor-card";
import { DoctorEmptyState } from "@/components/doctors/doctor-empty-state";
import { DoctorFilters } from "@/components/doctors/doctor-filters";
import {
  defaultDoctorDirectoryFilters,
  filterDoctorsClientSide,
  getDoctorFilterOptions,
} from "@/services/doctors/filtering";
import type {
  DoctorDirectoryFilters,
  PublicDoctorProfile,
} from "@/types/profiles";

type DoctorDirectoryProps = {
  doctors: PublicDoctorProfile[];
  error?: string | null;
};

export function DoctorDirectory({ doctors, error }: DoctorDirectoryProps) {
  const [filters, setFilters] = useState<DoctorDirectoryFilters>(
    defaultDoctorDirectoryFilters
  );

  const options = useMemo(() => getDoctorFilterOptions(doctors), [doctors]);
  const filteredDoctors = useMemo(
    () => filterDoctorsClientSide(doctors, filters),
    [doctors, filters]
  );

  const hasActiveFilters =
    JSON.stringify(filters) !== JSON.stringify(defaultDoctorDirectoryFilters);

  if (error) {
    return <DoctorEmptyState mode="error" message={error} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <DoctorFilters
        filters={filters}
        specialties={options.specialties}
        languages={options.languages}
        resultCount={filteredDoctors.length}
        totalCount={doctors.length}
        onChange={setFilters}
        onClear={() => setFilters(defaultDoctorDirectoryFilters)}
      />

      {filteredDoctors.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <DoctorEmptyState
          mode={doctors.length && hasActiveFilters ? "filtered" : "none"}
          onClear={() => setFilters(defaultDoctorDirectoryFilters)}
        />
      )}
    </div>
  );
}
