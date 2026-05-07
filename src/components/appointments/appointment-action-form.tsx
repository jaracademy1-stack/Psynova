"use client";

import { useActionState } from "react";
import { Button } from "@heroui/react";

import type { AppointmentActionResult } from "@/types/appointments";

type AppointmentActionFormProps = {
  appointmentId: string;
  label: string;
  action: (
    previousState: AppointmentActionResult,
    formData: FormData
  ) => Promise<AppointmentActionResult>;
  tone?: "primary" | "danger" | "neutral";
  notePlaceholder?: string;
};

export function AppointmentActionForm({
  appointmentId,
  label,
  action,
  tone = "neutral",
  notePlaceholder,
}: AppointmentActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  const buttonClass =
    tone === "danger"
      ? "bg-destructive text-white"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "";

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      {notePlaceholder ? (
        <input
          name="note"
          placeholder={notePlaceholder}
          className="h-9 rounded-xl border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
        />
      ) : null}
      <Button
        type="submit"
        size="sm"
        className={buttonClass}
        isDisabled={isPending}
      >
        {isPending ? "Working..." : label}
      </Button>
      {state.error ? (
        <p className="text-xs leading-5 text-destructive">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-xs leading-5 text-emerald-700">{state.success}</p>
      ) : null}
    </form>
  );
}
