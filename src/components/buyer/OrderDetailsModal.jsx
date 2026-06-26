"use client";

import { Modal } from "@heroui/react";

import { formatCurrency, formatDateTime } from "@/lib/format";
import OrderStatusBadge from "@/components/buyer/OrderStatusBadge";

export default function OrderDetailsModal({ order, state }) {
  if (!order) {
    return null;
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header className="flex items-center justify-between">
              <Modal.Heading>Order Details</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {order.productImage ? (
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="h-28 w-28 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                  />
                ) : null}

                <div className="flex-1 space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Order #{order.orderNumber}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {order.productTitle}
                  </h3>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Amount
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(order.amount)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Quantity
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {order.quantity || 1}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Placed On
                  </dt>
                  <dd className="mt-1 text-slate-900 dark:text-white">
                    {formatDateTime(order.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Shipping Address
                  </dt>
                  <dd className="mt-1 text-slate-900 dark:text-white">
                    {order.shippingAddress || "Not provided"}
                  </dd>
                </div>
              </dl>

              {order.notes ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {order.notes}
                  </p>
                </div>
              ) : null}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
