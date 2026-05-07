import { EmptyState } from "@heroui/react";
import { SearchX, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

type DoctorEmptyStateProps = {
  mode: "none" | "filtered" | "error";
  message?: string;
  onClear?: () => void;
};

export function DoctorEmptyState({
  mode,
  message,
  onClear,
}: DoctorEmptyStateProps) {
  const isFiltered = mode === "filtered";
  const isError = mode === "error";

  return (
    <EmptyState className="rounded-3xl border bg-card p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        {isFiltered || isError ? (
          <SearchX className="size-5" />
        ) : (
          <ShieldCheck className="size-5" />
        )}
      </div>
      <h2 className="text-2xl font-semibold">
        {isError
          ? "Directory unavailable"
          : isFiltered
            ? "No doctors match these filters"
            : "No approved doctors yet"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
        {message ??
          (isFiltered
            ? "Try clearing one or more filters to see more approved public profiles."
            : "Public profiles appear only after manual approval and publication. This protects patients from unverified listings.")}
      </p>
      {isFiltered && onClear ? (
        <Button type="button" className="mt-6 h-10 px-5" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </EmptyState>
  );
}
