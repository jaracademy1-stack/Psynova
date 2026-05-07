import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "muted";
};

const toneClasses = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  muted: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({ children, tone = "muted" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
