"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { Button } from "@heroui/react";

import type { AdminActionResult } from "@/types/admin";

type AdminActionFormProps = {
  action: (
    previousState: AdminActionResult,
    formData: FormData
  ) => Promise<AdminActionResult>;
  children: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  tone?: "primary" | "danger" | "neutral";
  isDisabled?: boolean;
};

export function AdminActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Working...",
  tone = "neutral",
  isDisabled = false,
}: AdminActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  const buttonClass =
    tone === "danger"
      ? "bg-destructive text-white"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {children}
      <Button
        type="submit"
        className={buttonClass}
        isDisabled={isPending || isDisabled}
        size="sm"
      >
        {isPending ? pendingLabel : submitLabel}
      </Button>
      {state.error ? (
        <p className="text-sm leading-6 text-destructive">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm leading-6 text-emerald-700">{state.success}</p>
      ) : null}
    </form>
  );
}
