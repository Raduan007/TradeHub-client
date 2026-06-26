"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@heroui/react";

import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import StatCardsSkeleton from "@/components/buyer/StatCardsSkeleton";
import { formatCurrency } from "@/lib/format";

export default function SellerAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/seller/analytics");
      if (!response.ok) throw new Error("Failed to load analytics");
      setAnalytics(await response.json());
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Sales Analytics" description="Visual overview of your sales performance and top products." />
      {isLoading ? <StatCardsSkeleton count={3} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadAnalytics} /> : null}

      {!isLoading && !error && analytics ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-slate-200 p-6 dark:border-slate-700">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Order Status Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-slate-600 dark:text-slate-300">{status}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full bg-blue-600" style={{ width: `${Math.min(100, count * 20)}%` }} />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-slate-200 p-6 dark:border-slate-700">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Monthly Sales Trend</h2>
            {analytics.monthlyRevenue.length === 0 ? (
              <p className="text-slate-500">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.monthlyRevenue.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.revenue)} ({item.orders} orders)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="border border-slate-200 p-6 dark:border-slate-700 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Top Selling Products</h2>
            {analytics.topProducts.length === 0 ? (
              <p className="text-slate-500">No product sales yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics.topProducts.map((item) => (
                  <div key={item.productTitle} className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="text-slate-900 dark:text-white">{item.productTitle}</span>
                    <span className="font-semibold">{formatCurrency(item.revenue)} · {item.orders} sold</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
