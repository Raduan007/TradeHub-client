"use client";

import { Card, Divider, Avatar, Button } from "@heroui/react";

/**
 * PaymentSummary – a reusable component that renders the checkout details.
 *
 * Props
 * ------
 * session: object returned from Stripe checkout session (see /api/checkout/session).
 *   Expected shape (relevant fields only):
 *   {
 *     customer_details: { name, email, phone },
 *     line_items: { data: [{ id, description, amount_total, price: { product: { images } } }] },
 *     amount_total,
 *     total_details: { amount_tax, amount_shipping },
 *   }
 */
export default function PaymentSummary({ session }) {
  if (!session) return null;

  const {
    customer_details,
    line_items: { data: items },
    amount_total,
    total_details: { amount_tax, amount_shipping },
  } = session;

  const subtotal = items.reduce((sum, i) => sum + (i.amount_total ?? 0), 0);

  const format = (cents) =>
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      {/* Delivery Information */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-2">Delivery Information</h2>
        <p>{customer_details?.name || "Name"}</p>
        <p>{customer_details?.email || "email@example.com"}</p>
        <p>{customer_details?.phone || "+1‑555‑0201"}</p>
        <p>New York, NY</p>
      </Card>

      {/* Payment Details */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
        <p className="text-sm text-gray-600">Secured by SSL</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-mono text-xl">4242 4242 4242 4242</span>
          <span className="text-sm">12/26</span>
          <span className="text-sm">•••</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          This is a demo. No real payment will be processed.
        </p>
      </Card>

      {/* Order Summary */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={item.price?.product?.images?.[0]}
                className="w-12 h-12"
              />
              <span>{item.description}</span>
            </div>
            <span className="font-medium">{format(item.amount_total)}</span>
          </div>
        ))}

        <Divider className="my-4" />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{format(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>{format(amount_tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{format(amount_shipping)}</span>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between text-xl font-semibold">
          <span>Total</span>
          <span>{format(amount_total)}</span>
        </div>
        <Button
          className="mt-6 w-full"
          variant="solid"
          color="primary"
          onPress={() => {
            // Go back to the buyer dashboard – adjust if you have a different route
            window.location.href = "/dashboard/buyer/payments";
          }}
        >
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
}
