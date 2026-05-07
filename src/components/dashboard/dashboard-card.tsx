import type { ReactNode } from "react";
import { Card } from "@heroui/react";

type DashboardCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function DashboardCard({
  title,
  description,
  children,
}: DashboardCardProps) {
  return (
    <Card className="border bg-card">
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>
      {children ? <Card.Content>{children}</Card.Content> : null}
    </Card>
  );
}
