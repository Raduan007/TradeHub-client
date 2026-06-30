"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Spinner } from "@heroui/react";
import { toast } from "@heroui/react";

// Load Stripe publishable key from env (client side)
// Load Stripe publishable key from env (client side)
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  toast.danger('Stripe publishable key not set. Please configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckoutButton({ priceId = "product006", label = "Checkout" }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        // Redirect to Stripe Checkout
        await stripe.redirectToCheckout({ sessionId: url.split("session_id=")[1] ?? undefined, url });
      } else {
        window.location.href = url; // fallback
      }
    } catch (err) {
      console.error(err);
      toast.danger(err.message || "Checkout error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleCheckout}
      disabled={loading}
      className="mb-4 w-full md:w-auto"
      variant="solid"
    >
      {loading ? <Spinner size="sm" /> : label}
    </Button>
  );
}
