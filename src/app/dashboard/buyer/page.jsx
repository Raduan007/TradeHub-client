"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBox,
  FaCreditCard,
  FaHeart,
  FaShoppingBag,
} from "react-icons/fa";
import { Button, Card, Skeleton } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import BuyerStatCard from "@/components/buyer/BuyerStatCard";
import OrderStatusBadge from "@/components/buyer/OrderStatusBadge";
import StatCardsSkeleton from "@/components/buyer/StatCardsSkeleton";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BuyerDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/buyer/overview");

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load dashboard overview");
      }

      const data = await response.json();
      setOverview(data);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load dashboard overview");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        title="Buyer Dashboard"
        description="Track orders, wishlist items, and payments in one place."
      />

      {isLoading ? <StatCardsSkeleton count={4} /> : null}

      {!isLoading && error ? (
        <BuyerErrorState
          title="Dashboard unavailable"
          message={error}
          onRetry={loadOverview}
        />
      ) : null}

      {!isLoading && !error && overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BuyerStatCard
              label="Total Orders"
              value={overview.totalOrders}
              icon={FaBox}
            />
            <BuyerStatCard
              label="Wishlist Items"
              value={overview.wishlistItems}
              icon={FaHeart}
            />
            <BuyerStatCard
              label="Total Payments"
              value={formatCurrency(overview.totalPayments)}
              icon={FaCreditCard}
            />
            <BuyerStatCard
              label="Recent Orders"
              value={overview.recentOrders.length}
              icon={FaShoppingBag}
            />
          </div>

          <Card className="border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Orders
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your latest purchase activity
                </p>
              </div>

              <Link href="/dashboard/buyer/orders">
                <Button variant="secondary">View all orders</Button>
              </Link>
            </div>

            {overview.recentOrders.length === 0 ? (
              <div className="p-5">
                <BuyerEmptyState
                  icon={FaBox}
                  title="No orders yet"
                  description="When you place an order, it will appear here with status updates."
                  actionLabel="Browse products"
                  onAction={() => {
                    window.location.href = "/products";
                  }}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {overview.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          className="h-14 w-14 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                        />
                      ) : (
                        <Skeleton className="h-14 w-14 rounded-xl" />
                      )}

                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {order.productTitle}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          #{order.orderNumber} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <OrderStatusBadge status={order.status} />
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </p>
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
