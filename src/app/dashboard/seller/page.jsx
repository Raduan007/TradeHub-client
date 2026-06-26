import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Seller Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage listings, orders, and your seller profile.
          </p>
        </div>

        <Link href="/dashboard/seller/add-product">
          <Button color="primary" className="font-semibold shadow-sm" startContent={<FaPlus />}>
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active Listings
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            18
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pending Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            5
          </p>
        </Card>

        <Card className="border border-slate-200 p-5 dark:border-slate-700 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly Revenue
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            $2,430
          </p>
        </Card>
      </div>
    </div>
  );
}
