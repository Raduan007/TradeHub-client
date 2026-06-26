import { Card } from "@heroui/react";

export default function BuyerStatCard({ label, value, icon: Icon }) {
  return (
    <Card className="border border-slate-200 p-5 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        {Icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
