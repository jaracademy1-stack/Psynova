"use client";

import { useActionState } from "react";
import { Button, Card, Checkbox, Input, TextArea } from "@heroui/react";

import { FieldError } from "@/components/auth/field-error";
import { FormMessage } from "@/components/auth/form-message";
import { signUpDoctor } from "@/services/auth/actions";

export function DoctorRegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpDoctor, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormMessage message={state.error} />

      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>Account details</Card.Title>
          <Card.Description>
            These details identify your private account and application.
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2">
          <FormField label="Full name" name="fullName" error={state.fieldErrors?.fullName} required />
          <FormField label="Email" name="email" type="email" error={state.fieldErrors?.email} required />
          <FormField label="Phone" name="phone" type="tel" error={state.fieldErrors?.phone} required />
          <FormField label="Password" name="password" type="password" error={state.fieldErrors?.password} required />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            error={state.fieldErrors?.confirmPassword}
            required
          />
        </Card.Content>
      </Card>

      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>Professional profile</Card.Title>
          <Card.Description>
            Your profile will remain private until manual verification.
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Professional title"
            name="professionalTitle"
            placeholder="Clinical psychologist"
            error={state.fieldErrors?.professionalTitle}
            required
          />
          <FormField
            label="Years of experience"
            name="yearsOfExperience"
            type="number"
            min="0"
            error={state.fieldErrors?.yearsOfExperience}
            required
          />
          <FormField
            label="Specialties"
            name="specialties"
            placeholder="Anxiety, stress management"
            help="Separate specialties with commas."
            error={state.fieldErrors?.specialties}
            required
          />
          <FormField
            label="Languages"
            name="languages"
            placeholder="Arabic, English"
            help="Separate languages with commas."
            error={state.fieldErrors?.languages}
            required
          />
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="bio">
              Bio
            </label>
            <TextArea
              id="bio"
              name="bio"
              placeholder="Describe your approach, populations served, and professional focus."
              fullWidth
              required
              rows={5}
            />
            <FieldError errors={state.fieldErrors?.bio} />
          </div>
        </Card.Content>
      </Card>

      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>License and session settings</Card.Title>
          <Card.Description>
            Verification is manual. License documents can be added in a later
            storage phase.
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 md:grid-cols-2">
          <FormField
            label="License number"
            name="licenseNumber"
            error={state.fieldErrors?.licenseNumber}
            required
          />
          <FormField
            label="License country"
            name="licenseCountry"
            placeholder="Egypt"
            error={state.fieldErrors?.licenseCountry}
            required
          />
          <FormField
            label="Session price"
            name="sessionPrice"
            type="number"
            min="0"
            step="0.01"
            error={state.fieldErrors?.sessionPrice}
            required
          />
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
            <p className="text-sm font-medium">Session options</p>
            <Checkbox name="offersOnline" value="on" defaultSelected>
              <Checkbox.Control />
              <Checkbox.Content>Online sessions</Checkbox.Content>
            </Checkbox>
            <Checkbox name="offersInPerson" value="on">
              <Checkbox.Control />
              <Checkbox.Content>In-person sessions</Checkbox.Content>
            </Checkbox>
            <FieldError errors={state.fieldErrors?.offersOnline} />
          </div>
        </Card.Content>
      </Card>

      <Button type="submit" fullWidth size="lg" isDisabled={isPending}>
        {isPending ? "Submitting application..." : "Submit doctor application"}
      </Button>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  help?: string;
  error?: string[];
  required?: boolean;
  min?: string;
  step?: string;
};

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  help,
  error,
  required,
  min,
  step,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        fullWidth
        required={required}
        min={min}
        step={step}
      />
      {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
      <FieldError errors={error} />
    </div>
  );
}
