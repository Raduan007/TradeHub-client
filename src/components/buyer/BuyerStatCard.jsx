import { Card } from "@heroui/react";

export default function BuyerStatCard({ label, value, icon: Icon, iconColorClass = "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" }) {
  return (
    <Card className="border border-slate-200 p-5 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColorClass}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
