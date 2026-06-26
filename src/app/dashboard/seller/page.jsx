"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaBox, FaChartLine, FaDollarSign, FaList, FaPlus } from "react-icons/fa";
import { Button, Card } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import BuyerStatCard from "@/components/buyer/BuyerStatCard";
import OrderStatusBadge from "@/components/buyer/OrderStatusBadge";
import StatCardsSkeleton from "@/components/buyer/StatCardsSkeleton";
import { formatCurrency, formatDate } from "@/lib/format";

export default function SellerDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/seller/overview");
      if (!response.ok) throw new Error("Failed to load seller overview");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BuyerPageHeader
          title="Seller Dashboard"
          description="Manage listings, orders, and your seller business."
        />
        <Link href="/dashboard/seller/add-product">
          <Button color="primary" startContent={<FaPlus />}>Add Product</Button>
        </Link>
      </div>

      {isLoading ? <StatCardsSkeleton count={4} /> : null}
      {!isLoading && error ? (
        <BuyerErrorState title="Dashboard unavailable" message={error} onRetry={loadOverview} />
      ) : null}

      {!isLoading && !error && overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BuyerStatCard label="Total Products" value={overview.activeListings} icon={FaList} />
            <BuyerStatCard label="Total Sales" value={overview.totalOrders} icon={FaBox} />
            <BuyerStatCard label="Total Revenue" value={formatCurrency(overview.totalRevenue)} icon={FaDollarSign} />
            <BuyerStatCard label="Pending Orders" value={overview.pendingOrders} icon={FaChartLine} />
          </div>

          <Card className="border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
            </div>
            {overview.recentOrders.length === 0 ? (
              <div className="p-5">
                <BuyerEmptyState icon={FaBox} title="No orders yet" description="Incoming buyer orders will appear here." />
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {overview.recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{order.productTitle}</p>
                      <p className="text-sm text-slate-500">#{order.orderNumber} · {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-semibold">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
