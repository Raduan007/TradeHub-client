import { Card } from "@heroui/react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Monitor users, listings, and platform activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            1,284
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active Listings
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            342
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Open Reports
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            7
          </p>
        </Card>
      </div>
    </div>
  );
}
