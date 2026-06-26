import { Card, Skeleton } from "@heroui/react";

export default function StatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="border border-slate-200 p-5 dark:border-slate-700"
        >
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="mt-4 h-8 w-16 rounded-lg" />
        </Card>
      ))}
    </div>
  );
}
