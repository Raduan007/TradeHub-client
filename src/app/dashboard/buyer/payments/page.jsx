"use client";

import { useCallback, useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { Card } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import PaymentStatusBadge from "@/components/buyer/PaymentStatusBadge";
import TableSkeleton from "@/components/buyer/TableSkeleton";
import { formatCurrency, formatDateTime } from "@/lib/format";

import StripeCheckoutButton from '@/components/buyer/StripeCheckoutButton';

export default function BuyerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/buyer/payments");

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load payments");
      }

      const data = await response.json();
      setPayments(data.payments);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        title="Payments"
        description="Review your payment history and transaction status."
      />

      <StripeCheckoutButton className="mb-4" />
{isLoading ? <TableSkeleton rows={6} columns={5} /> : null}

      {!isLoading && error ? (
        <BuyerErrorState
          title="Unable to load payments"
          message={error}
          onRetry={loadPayments}
        />
      ) : null}

      {!isLoading && !error && payments.length === 0 ? (
        <BuyerEmptyState
          icon={FaCreditCard}
          title="No payments yet"
          description="Completed transactions will appear here with status and payment details."
        />
      ) : null}

      {!isLoading && !error && payments.length > 0 ? (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    Transaction ID
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    Order
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    Amount
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-4 font-mono text-xs text-slate-900 dark:text-white sm:text-sm">
                      {payment.transactionId}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {payment.orderNumber ? `#${payment.orderNumber}` : "—"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDateTime(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 p-4 lg:hidden">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-slate-900 dark:text-white">
                      {payment.transactionId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {payment.orderNumber
                        ? `Order #${payment.orderNumber}`
                        : "No linked order"}
                    </p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(payment.amount)}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDateTime(payment.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
