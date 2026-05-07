"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Input } from "@heroui/react";

import { FieldError } from "@/components/auth/field-error";
import { FormMessage } from "@/components/auth/form-message";
import { signInWithPassword } from "@/services/auth/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithPassword, {});

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <Card className="border bg-background/60">
        <Card.Header>
          <Card.Title>Welcome back</Card.Title>
          <Card.Description>
            Sign in to continue to your private dashboard.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <FormMessage message={state.error} />
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
              placeholder="you@example.com"
              fullWidth
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              fullWidth
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>
        </Card.Content>
      </Card>
      <Button type="submit" fullWidth size="lg" isDisabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Psynova?{" "}
        <Link href="/register" className="font-medium text-primary">
          Create a patient account
        </Link>
      </p>
    </form>
  );
}
