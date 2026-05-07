"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button, Card, Checkbox, Input } from "@heroui/react";

import { FieldError } from "@/components/auth/field-error";
import { FormMessage } from "@/components/auth/form-message";
import { signUpPatient } from "@/services/auth/actions";

export function PatientRegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpPatient, {});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const consentErrors = consentAccepted
    ? undefined
    : state.fieldErrors?.consentAccepted;

  if (state.success) {
    return (
      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>Confirm your email</Card.Title>
          <Card.Description>{state.success}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Link href="/login" className="font-medium text-primary">
            Go to login
          </Link>
        </Card.Content>
      </Card>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
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
            <Input id="fullName" name="fullName" autoComplete="name" fullWidth />
            <FieldError errors={state.fieldErrors?.fullName} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              fullWidth
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
            />
            <FieldError errors={state.fieldErrors?.confirmPassword} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Checkbox
              id="consentAccepted"
              name="consentAccepted"
              value="on"
              isSelected={consentAccepted}
              onChange={setConsentAccepted}
              isInvalid={Boolean(consentErrors?.length)}
            >
              <Checkbox.Control />
              <Checkbox.Content>
                I understand Psynova is a booking platform, not an emergency
                service, and I consent to creating a patient profile.
              </Checkbox.Content>
            </Checkbox>
            <p className="text-xs leading-5 text-muted-foreground">
              Review the{" "}
              <Link href="/privacy" className="font-medium text-primary">
                privacy notice
              </Link>{" "}
              and{" "}
              <Link href="/consent" className="font-medium text-primary">
                consent overview
              </Link>{" "}
              before creating your account.
            </p>
            <FieldError errors={consentErrors} />
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
