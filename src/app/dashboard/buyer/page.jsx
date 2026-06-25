import { Card } from "@heroui/react";

export default function BuyerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Buyer Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Browse products, track orders, and manage your purchases.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            3
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Wishlist Items
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            12
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unread Messages
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            2
          </p>
        </Card>
      </div>
    </div>
  );
}
