import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  LockKeyhole,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Search thoughtfully",
    description:
      "Browse verified professionals by specialty, language, session type, and available appointment times.",
    icon: Search,
  },
  {
    title: "Choose a session",
    description:
      "Review a doctor profile, compare session options, and select a time that works for you.",
    icon: CalendarCheck,
  },
  {
    title: "Book privately",
    description:
      "Sign in, confirm consent, and keep appointment details visible only to authorized users.",
    icon: ShieldCheck,
  },
];

const trustPoints = [
  "Verified doctor profiles before public listing",
  "Private dashboards for patients and providers",
  "RLS-first Supabase architecture for sensitive data",
];

export default function Home() {
  return (
    <>
      <section className="border-b bg-[linear-gradient(135deg,var(--background)_0%,#eef8f7_52%,#edf4ff_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Find trusted mental health support.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Psynova helps patients discover licensed mental health
                professionals, review available times, and request private
                appointments in a secure workflow.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/doctors"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
              >
                Book a Session
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/doctor/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-5"
                )}
              >
                For Doctors
              </Link>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div className="flex items-start gap-2" key={point}>
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-full bg-secondary/10 blur-3xl" />
            <Card className="relative w-full max-w-md border bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  Booking preview
                </Badge>
                <CardTitle className="text-2xl">
                  A calmer path to the right appointment
                </CardTitle>
                <CardDescription>
                  Browse verified professionals, review available times, and
                  request a private appointment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Stethoscope className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">Professional directory</p>
                        <p className="text-sm text-muted-foreground">
                          Public profiles, filters, and availability previews.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <LockKeyhole className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">Privacy-first accounts</p>
                        <p className="text-sm text-muted-foreground">
                          Auth, consent, and role-based dashboards are active.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <ClipboardCheck className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">Verified providers</p>
                        <p className="text-sm text-muted-foreground">
                          Doctors stay private until admin verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeader
            title="Designed for safe, simple booking"
            description="This foundation keeps the MVP focused on discovery, appointment booking, and protected role-specific workspaces."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <Card key={step.title} className="border bg-card">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-normal">
              Not an emergency service.
            </h2>
            <p className="max-w-3xl leading-7 text-muted-foreground">
              If you are in immediate danger, experiencing suicidal thoughts, or
              facing a medical emergency, contact your local emergency number or
              go to the nearest emergency department.
            </p>
          </div>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
          >
            Create an Account
          </Link>
        </div>
      </section>
    </>
  );
}
