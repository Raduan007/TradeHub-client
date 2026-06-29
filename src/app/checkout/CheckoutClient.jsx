"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>
      <Card className="border border-slate-200 p-6 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">
          Stripe payment integration can be connected here. Product ID: {productId || "N/A"}
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env` to enable live payments.
        </p>
        <div className="mt-6 flex gap-3">
          <Button color="primary">Proceed to Payment</Button>
          <Button as={Link} href="/products" color="danger" variant="flat">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
