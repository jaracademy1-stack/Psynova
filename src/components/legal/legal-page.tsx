import { Card } from "@heroui/react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { StatusBadge } from "@/components/shared/status-badge";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

const legalReviewNotice =
  "This page is a product placeholder and should be reviewed by a qualified legal/compliance professional before launch.";

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: LegalPageProps) {
  return (
    <PageShell className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <StatusBadge>{eyebrow}</StatusBadge>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          {title}
        </h1>
        <p className="leading-7 text-muted-foreground">{description}</p>
      </div>

      <Card className="border bg-amber-50 shadow-sm">
        <Card.Content className="flex gap-3 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <p className="text-sm leading-6 text-muted-foreground">
            {legalReviewNotice}
          </p>
        </Card.Content>
      </Card>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="border bg-card shadow-sm">
            <Card.Header>
              <Card.Title>{section.title}</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </Card.Content>
          </Card>
        ))}
      </div>

      <Card className="border bg-accent shadow-sm">
        <Card.Content className="flex gap-3 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
          <p className="text-sm leading-6 text-accent-foreground">
            Psynova is not an emergency service. If you are in immediate danger
            or facing a medical emergency, contact local emergency services or
            go to the nearest emergency department.
          </p>
        </Card.Content>
      </Card>
    </PageShell>
  );
}
