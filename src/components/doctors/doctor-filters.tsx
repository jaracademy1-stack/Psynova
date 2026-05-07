"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  DoctorDirectoryFilters,
  DoctorSortOption,
  SessionTypeFilter,
} from "@/types/profiles";

type DoctorFiltersProps = {
  filters: DoctorDirectoryFilters;
  specialties: string[];
  languages: string[];
  resultCount: number;
  totalCount: number;
  onChange: (filters: DoctorDirectoryFilters) => void;
  onClear: () => void;
};

export function DoctorFilters({
  filters,
  specialties,
  languages,
  resultCount,
  totalCount,
  onChange,
  onClear,
}: DoctorFiltersProps) {
  function update<K extends keyof DoctorDirectoryFilters>(
    key: K,
    value: DoctorDirectoryFilters[K]
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-secondary" />
          <h2 className="text-base font-semibold">Search and filters</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {totalCount}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))_auto]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Search</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(event) => update("search", event.target.value)}
              placeholder="Name, specialty, language, or title"
              className="h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
            />
          </span>
        </label>

        <FilterSelect
          label="Specialty"
          value={filters.specialty}
          onChange={(value) => update("specialty", value)}
          options={specialties}
        />

        <FilterSelect
          label="Language"
          value={filters.language}
          onChange={(value) => update("language", value)}
          options={languages}
        />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Session</span>
          <select
            value={filters.sessionType}
            onChange={(event) =>
              update("sessionType", event.target.value as SessionTypeFilter)
            }
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option value="all">All session types</option>
            <option value="online">Online</option>
            <option value="in_person">In person</option>
            <option value="either">Either</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Max price</span>
          <input
            value={filters.maxPrice}
            onChange={(event) => update("maxPrice", event.target.value)}
            inputMode="numeric"
            placeholder="Any"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Experience</span>
          <input
            value={filters.minExperience}
            onChange={(event) => update("minExperience", event.target.value)}
            inputMode="numeric"
            placeholder="Min years"
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              update("sort", event.target.value as DoctorSortOption)
            }
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price low to high</option>
            <option value="experience_desc">Experience high to low</option>
          </select>
        </label>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full px-4"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
