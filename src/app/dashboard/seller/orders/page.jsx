"use client";

import { useCallback, useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaSearch, FaShippingFast } from "react-icons/fa";
import { Button, Card, Input } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import OrderStatusBadge from "@/components/buyer/OrderStatusBadge";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { ORDER_STATUS_LABELS } from "@/lib/constants/buyer";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS);

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ search });
      if (statusFilter) params.set("status", statusFilter);
      const response = await fetch(`/api/seller/orders?${params}`);
      if (!response.ok) throw new Error("Failed to load orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      const data = await response.json();
      setOrders((current) => current.map((order) => (order.id === orderId ? data.order : order)));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Manage Orders" description="Accept, process, and update delivery status for customer orders." />

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <Input
            placeholder="Search orders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            variant="bordered"
            className="pl-8"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <TableSkeleton rows={5} /> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadOrders} /> : null}
      {!isLoading && !error && orders.length === 0 ? (
        <BuyerEmptyState icon={FaBox} title="No orders yet" description="Orders from buyers will appear here." />
      ) : null}

      {!isLoading && !error && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border border-slate-200 p-5 dark:border-slate-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{order.productTitle}</p>
                  <p className="text-sm text-slate-500">#{order.orderNumber} · {order.buyerName || "Buyer"} · {formatDate(order.createdAt)}</p>
                  <p className="mt-1 font-medium">{formatCurrency(order.amount)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  {order.status === "pending" ? (
                    <>
                      <Button size="sm" color="primary" isLoading={updatingId === order.id} onPress={() => updateStatus(order.id, "processing")}>Accept</Button>
                      <Button size="sm" color="danger" variant="flat" isLoading={updatingId === order.id} onPress={() => updateStatus(order.id, "cancelled")}>Reject</Button>
                    </>
                  ) : null}
                  {order.status === "processing" ? (
                    <Button size="sm" color="primary" variant="flat" isLoading={updatingId === order.id} onPress={() => updateStatus(order.id, "shipped")}><FaShippingFast className="mr-2 text-slate-400" />Mark Shipped</Button>
                  ) : null}
                  {order.status === "shipped" ? (
                    <Button size="sm" color="success" variant="flat" startContent={<FaCheckCircle />} isLoading={updatingId === order.id} onPress={() => updateStatus(order.id, "delivered")}>Mark Delivered</Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
