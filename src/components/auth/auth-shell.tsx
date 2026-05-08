import Link from "next/link";
import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
      <aside className="flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm lg:min-h-[620px]">
        <div className="flex flex-col gap-8">
          <Link href="/" aria-label="Psynova home" className="flex items-center">
            <BrandLogo className="h-16 max-w-[220px]" />
          </Link>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-xl leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-10 rounded-2xl bg-accent p-4 text-sm leading-6 text-accent-foreground">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <LockKeyhole className="size-4" />
            Private by design
          </div>
          Account and booking details are only visible to authorized users.
          This platform is for booking support, not emergency care.
        </div>
      </aside>
      <section className="rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
        {children}
        <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
      </section>
    </div>
  );
}
