import { Button, Card } from "@heroui/react";

export default function BuyerEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
}) {
  return (
    <Card className="border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
      {Icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={24} />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>

      {actionLabel && onAction ? (
        <Button className="mt-6" color="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
