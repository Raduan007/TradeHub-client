"use client";

import { useCallback, useEffect, useState } from "react";
import { FaBox, FaSearch } from "react-icons/fa";
import {
  Button,
  Card,
  Input,
  Pagination,
  Skeleton,
  Spinner,
  useOverlayState,
} from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import OrderDetailsModal from "@/components/buyer/OrderDetailsModal";
import OrderStatusBadge from "@/components/buyer/OrderStatusBadge";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BuyerOrdersPage() {
  const orderModalState = useOverlayState();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        search,
      });

      const response = await fetch(`/api/buyer/orders?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load orders");
      }

      const data = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleViewOrder = async (orderId) => {
    setIsFetchingOrder(true);

    try {
      const response = await fetch(`/api/buyer/orders/${orderId}`);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load order details");
      }

      const data = await response.json();
      setSelectedOrder(data.order);
      orderModalState.open();
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load order details");
    } finally {
      setIsFetchingOrder(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setIsCancelling(true);
    setError("");

    try {
      const response = await fetch(`/api/buyer/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to cancel order");
      }

      setSelectedOrder(data.order);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order))
      );
    } catch (cancelError) {
      setError(cancelError.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        title="My Orders"
        description="Search and review your purchase history."
      />

      <Card className="border border-slate-200 p-4 dark:border-slate-700">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <Input
            aria-label="Search orders"
            placeholder="Search by order number or product..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-8"
          />
        </div>
      </Card>

      {isLoading ? <TableSkeleton rows={6} columns={5} /> : null}

      {!isLoading && error ? (
        <BuyerErrorState
          title="Unable to load orders"
          message={error}
          onRetry={loadOrders}
        />
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <BuyerEmptyState
          icon={FaBox}
          title={search ? "No matching orders" : "No orders yet"}
          description={
            search
              ? "Try a different search term or clear the search field."
              : "Your orders will show up here once you make a purchase."
          }
        />
      ) : null}

      {!isLoading && !error && orders.length > 0 ? (
        <>
          <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 card-anim">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Order
                    </th>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Product
                    </th>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Date
                    </th>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Amount
                    </th>
                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt={order.productTitle}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : null}
                          <span className="text-slate-900 dark:text-white">
                            {order.productTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="action-btn"
                          onPress={() => handleViewOrder(order.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 card-anim"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {order.productTitle}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        #{order.orderNumber}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>

                  <Button
                    className="mt-4 w-full action-btn"
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => handleViewOrder(order.id)}
                  >
                    View details
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {pagination.totalPages > 1 ? (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing page {pagination.page} of {pagination.totalPages} (
                {pagination.total} orders)
              </p>

              <Pagination>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={pagination.page <= 1}
                      onPress={() => setPage((current) => Math.max(1, current - 1))}
                    />
                  </Pagination.Item>

                  {Array.from({ length: pagination.totalPages }).map((_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <Pagination.Item key={pageNumber}>
                        <Pagination.Link
                          isActive={pageNumber === pagination.page}
                          onPress={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Link>
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={pagination.page >= pagination.totalPages}
                      onPress={() =>
                        setPage((current) =>
                          Math.min(pagination.totalPages, current + 1)
                        )
                      }
                    />
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          ) : null}
        </>
      ) : null}

      {isFetchingOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Spinner size="lg" />
        </div>
      ) : null}

      <OrderDetailsModal
        order={selectedOrder}
        state={orderModalState}
        onCancel={handleCancelOrder}
        isCancelling={isCancelling}
      />
    </div>
  );
}
