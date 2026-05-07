import { ShieldCheck } from "lucide-react";

export function SafePublicDataNotice() {
  return (
    <section className="rounded-3xl border bg-accent p-5 text-accent-foreground">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Public profile safety</h2>
          <p className="text-sm leading-6">
            This page shows only approved public profile details. Private
            contact information, license numbers, and patient data are not
            displayed here.
          </p>
        </div>
      </div>
    </section>
  );
}
