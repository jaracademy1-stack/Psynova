"use client";

import { type ReactNode, useActionState } from "react";
import { Button, Card } from "@heroui/react";
import { CalendarOff, Clock } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, formatTimeRange } from "@/lib/dates";
import {
  addAvailabilityRule,
  addDoctorTimeOff,
  deleteAvailabilityRule,
  deleteDoctorTimeOff,
  updateAvailabilityRule,
} from "@/services/availability/actions";
import type {
  DoctorAvailabilityRule,
  DoctorTimeOff,
} from "@/types/appointments";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type AvailabilityManagementProps = {
  rules: DoctorAvailabilityRule[];
  timeOff: DoctorTimeOff[];
};

export function AvailabilityManagement({
  rules,
  timeOff,
}: AvailabilityManagementProps) {
  const [ruleState, ruleAction, rulePending] = useActionState(
    addAvailabilityRule,
    {}
  );
  const [timeOffState, timeOffAction, timeOffPending] = useActionState(
    addDoctorTimeOff,
    {}
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="flex flex-col gap-6">
        <Card className="border bg-card shadow-sm">
          <Card.Header>
            <Card.Title>Weekly availability</Card.Title>
            <Card.Description>
              Add recurring windows where patients can request sessions.
            </Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4">
            {rules.length ? (
              rules.map((rule) => (
                <AvailabilityRuleEditor key={rule.id} rule={rule} />
              ))
            ) : (
              <p className="rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
                No weekly availability yet. Add a rule to start showing public
                booking slots.
              </p>
            )}
          </Card.Content>
        </Card>

        <Card className="border bg-card shadow-sm">
          <Card.Header>
            <Card.Title>Blocked time</Card.Title>
            <Card.Description>
              Block dates or time ranges that should not appear as available.
            </Card.Description>
          </Card.Header>
          <Card.Content className="grid gap-4">
            {timeOff.length ? (
              timeOff.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <CalendarOff className="mt-0.5 size-5 text-secondary" />
                    <div>
                      <p className="font-medium">
                        {formatDateTime(item.starts_at)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatTimeRange(item.starts_at, item.ends_at)}
                        {item.reason ? ` - ${item.reason}` : ""}
                      </p>
                    </div>
                  </div>
                  <form action={deleteDoctorTimeOff}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Delete
                    </Button>
                  </form>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
                No blocked time has been added.
              </p>
            )}
          </Card.Content>
        </Card>
      </section>

      <aside className="flex flex-col gap-6">
        <Card className="border bg-card shadow-sm">
          <Card.Header>
            <Card.Title>Add weekly rule</Card.Title>
          </Card.Header>
          <Card.Content>
            <form action={ruleAction} className="grid gap-4">
              <Field label="Day">
                <select name="dayOfWeek" className={inputClass} required>
                  {days.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start">
                  <input
                    name="startTime"
                    type="time"
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="End">
                  <input
                    name="endTime"
                    type="time"
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Slot minutes">
                  <input
                    name="slotDuration"
                    type="number"
                    min="15"
                    max="180"
                    defaultValue="50"
                    className={inputClass}
                  />
                </Field>
                <Field label="Buffer">
                  <input
                    name="buffer"
                    type="number"
                    min="0"
                    max="60"
                    defaultValue="10"
                    className={inputClass}
                  />
                </Field>
              </div>
              <input type="hidden" name="timezone" value="Africa/Cairo" />
              <ActionMessage
                error={ruleState.error}
                success={ruleState.success}
              />
              <Button type="submit" isDisabled={rulePending}>
                {rulePending ? "Saving..." : "Add availability"}
              </Button>
            </form>
          </Card.Content>
        </Card>

        <Card className="border bg-card shadow-sm">
          <Card.Header>
            <Card.Title>Add blocked time</Card.Title>
          </Card.Header>
          <Card.Content>
            <form action={timeOffAction} className="grid gap-4">
              <Field label="Starts">
                <input
                  name="startsAt"
                  type="datetime-local"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Ends">
                <input
                  name="endsAt"
                  type="datetime-local"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Reason">
                <input
                  name="reason"
                  maxLength={120}
                  placeholder="Optional, private to you"
                  className={inputClass}
                />
              </Field>
              <ActionMessage
                error={timeOffState.error}
                success={timeOffState.success}
              />
              <Button type="submit" isDisabled={timeOffPending}>
                {timeOffPending ? "Saving..." : "Add blocked time"}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </aside>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20";

function AvailabilityRuleEditor({ rule }: { rule: DoctorAvailabilityRule }) {
  const [state, action, pending] = useActionState(updateAvailabilityRule, {});

  return (
    <details className="rounded-2xl border bg-background/60 p-4">
      <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 text-secondary" />
          <span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{days[rule.day_of_week]}</span>
              {rule.is_active ? (
                <StatusBadge tone="success">Active</StatusBadge>
              ) : (
                <StatusBadge>Inactive</StatusBadge>
              )}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {rule.start_time.slice(0, 5)} - {rule.end_time.slice(0, 5)} -{" "}
              {rule.slot_duration_minutes} min slots - {rule.buffer_minutes}{" "}
              min buffer
            </span>
          </span>
        </span>
        <span className="text-sm font-medium text-secondary">Edit rule</span>
      </summary>

      <div className="mt-4 grid gap-4 border-t pt-4">
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={rule.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Day">
              <select
                name="dayOfWeek"
                className={inputClass}
                defaultValue={rule.day_of_week}
                required
              >
                {days.map((day, index) => (
                  <option key={day} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Status</span>
              <label className="flex h-11 items-center gap-2 rounded-xl border bg-background px-3 text-sm">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={rule.is_active}
                  className="size-4 rounded border"
                />
                Active
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input
                name="startTime"
                type="time"
                defaultValue={rule.start_time.slice(0, 5)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="End">
              <input
                name="endTime"
                type="time"
                defaultValue={rule.end_time.slice(0, 5)}
                className={inputClass}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slot minutes">
              <input
                name="slotDuration"
                type="number"
                min="15"
                max="180"
                defaultValue={rule.slot_duration_minutes}
                className={inputClass}
              />
            </Field>
            <Field label="Buffer">
              <input
                name="buffer"
                type="number"
                min="0"
                max="60"
                defaultValue={rule.buffer_minutes}
                className={inputClass}
              />
            </Field>
          </div>
          <input
            type="hidden"
            name="timezone"
            value={rule.timezone || "Africa/Cairo"}
          />
          <ActionMessage error={state.error} success={state.success} />
          <Button type="submit" size="sm" isDisabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
        <form action={deleteAvailabilityRule}>
          <input type="hidden" name="id" value={rule.id} />
          <Button type="submit" size="sm" variant="ghost">
            Delete rule
          </Button>
        </form>
      </div>
    </details>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function ActionMessage({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) {
    return null;
  }

  return (
    <p
      className={
        error
          ? "text-sm leading-6 text-destructive"
          : "text-sm leading-6 text-emerald-700"
      }
    >
      {error || success}
    </p>
  );
}
