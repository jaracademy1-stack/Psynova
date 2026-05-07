import Link from "next/link";
import { Card, EmptyState } from "@heroui/react";
import { ArrowLeft, Search, UserCheck } from "lucide-react";

import { DoctorApplicationCard } from "@/components/admin/doctor-application-card";
import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDoctorApplications } from "@/services/admin/queries";
import type { AdminDoctorFilters, DoctorApplicationStatus } from "@/types/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doctor Applications",
};

const statusOptions: Array<{
  label: string;
  value: AdminDoctorFilters["status"];
}> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];

const sortOptions: Array<{ label: string; value: AdminDoctorFilters["sort"] }> =
  [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Experience", value: "experience_desc" },
  ];

function parseStatus(value?: string): AdminDoctorFilters["status"] {
  const allowed = new Set([
    "all",
    "pending",
    "approved",
    "rejected",
    "public",
    "private",
  ]);

  return allowed.has(value ?? "")
    ? (value as DoctorApplicationStatus | "all")
    : "all";
}

function parseSort(value?: string): AdminDoctorFilters["sort"] {
  if (value === "oldest" || value === "experience_desc") {
    return value;
  }

  return "newest";
}

export default async function AdminDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: AdminDoctorFilters = {
    status: parseStatus(
      typeof params.status === "string" ? params.status : undefined
    ),
    search: typeof params.search === "string" ? params.search : "",
    sort: parseSort(typeof params.sort === "string" ? params.sort : undefined),
  };

  const applications = await getDoctorApplications(filters);

  return (
    <PageShell className="flex flex-col gap-8">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="flex flex-col gap-3">
        <StatusBadge>Admin verification</StatusBadge>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          Doctor applications
        </h1>
        <p className="max-w-2xl leading-7 text-muted-foreground">
          Review professional profiles, license details, public visibility, and
          verification status. This admin view does not include patient data.
        </p>
      </div>

      <Card className="border bg-card shadow-sm">
        <Card.Content className="p-5">
          <form className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  name="search"
                  defaultValue={filters.search}
                  placeholder="Name, title, specialty, language"
                  className="h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Status</span>
              <select
                name="status"
                defaultValue={filters.status}
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Sort</span>
              <select
                name="sort"
                defaultValue={filters.sort}
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button className={cn(buttonVariants(), "h-11 px-5")}>
                Apply
              </button>
              <Link
                href="/dashboard/doctors"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-5"
                )}
              >
                Reset
              </Link>
            </div>
          </form>
        </Card.Content>
      </Card>

      <section className="grid gap-4">
        {applications.length ? (
          applications.map((application) => (
            <DoctorApplicationCard
              key={application.id}
              application={application}
            />
          ))
        ) : (
          <EmptyState className="rounded-3xl border bg-card p-10 text-center">
            <UserCheck className="mx-auto mb-3 size-6 text-secondary" />
            <h2 className="text-xl font-semibold">No applications found</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Adjust filters or wait for new doctor registrations.
            </p>
          </EmptyState>
        )}
      </section>
    </PageShell>
  );
}
