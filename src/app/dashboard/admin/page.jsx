"use client";

import { useCallback, useEffect, useState } from "react";
import { FaBox, FaFlag, FaStore, FaUsers } from "react-icons/fa";
import { Card } from "@heroui/react";

import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import BuyerStatCard from "@/components/buyer/BuyerStatCard";
import StatCardsSkeleton from "@/components/buyer/StatCardsSkeleton";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/overview");
      if (!response.ok) throw new Error("Failed to load admin overview");
      setOverview(await response.json());
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Admin Dashboard" description="Monitor users, listings, orders, and platform activity." />
      {isLoading ? <StatCardsSkeleton count={4} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadOverview} /> : null}

      {!isLoading && !error && overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BuyerStatCard label="Total Users" value={overview.totalUsers} icon={FaUsers} />
            <BuyerStatCard label="Total Products" value={overview.activeListings} icon={FaStore} />
            <BuyerStatCard label="Total Orders" value={overview.totalOrders} icon={FaBox} />
            <BuyerStatCard label="Open Reports" value={overview.openReports} icon={FaFlag} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500">Buyers</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{overview.buyers}</p>
            </Card>
            <Card className="border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500">Sellers</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{overview.sellers}</p>
            </Card>
            <Card className="border border-slate-200 p-5 dark:border-slate-700">
              <p className="text-sm text-slate-500">Admins</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{overview.admins}</p>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
