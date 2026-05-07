import { Card, Skeleton } from "@heroui/react";

export function DoctorCardSkeleton() {
  return (
    <Card className="border bg-card">
      <Card.Header>
        <div className="flex w-full items-start gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card.Content>
    </Card>
  );
}
