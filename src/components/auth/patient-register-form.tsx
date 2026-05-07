"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Checkbox, Input } from "@heroui/react";

import { FieldError } from "@/components/auth/field-error";
import { FormMessage } from "@/components/auth/form-message";
import { signUpPatient } from "@/services/auth/actions";

export function PatientRegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpPatient, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>Create your patient account</Card.Title>
          <Card.Description>
            Start with basic account details. Health history and booking
            questions are not collected at registration.
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <FormMessage message={state.error} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="fullName">
              Full name
            </label>
            <Input id="fullName" name="fullName" fullWidth required />
            <FieldError errors={state.fieldErrors?.fullName} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              fullWidth
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" fullWidth />
            <FieldError errors={state.fieldErrors?.phone} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              fullWidth
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              fullWidth
              required
            />
            <FieldError errors={state.fieldErrors?.confirmPassword} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Checkbox name="consentAccepted" value="on">
              <Checkbox.Control />
              <Checkbox.Content>
                I understand Psynova is a booking platform, not an emergency
                service, and I consent to creating a patient profile.
              </Checkbox.Content>
            </Checkbox>
            <FieldError errors={state.fieldErrors?.consentAccepted} />
          </div>
        </Card.Content>
      </Card>
      <Button type="submit" fullWidth size="lg" isDisabled={isPending}>
        {isPending ? "Creating account..." : "Create patient account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Applying as a doctor?{" "}
        <Link href="/doctor/register" className="font-medium text-primary">
          Start a doctor application
        </Link>
      </p>
    </form>
  );
}
