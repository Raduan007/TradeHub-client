import { Card, Skeleton } from "@heroui/react";

export default function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="space-y-3 p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, colIndex) => (
              <Skeleton key={colIndex} className="h-8 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
