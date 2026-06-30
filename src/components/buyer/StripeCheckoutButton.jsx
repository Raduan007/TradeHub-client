"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export default function StripeCheckoutButton({ priceId = "product009", label = "Proceed to Checkout", className = "" }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: priceId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Order creation failed", err);
        alert(err.message || "Unable to place order. Please try again later.");
        return;
      }
      const data = await res.json();
      // Show success message or navigate to order details
      alert(`Order placed successfully! Order ID: ${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`mb-4 w-full md:w-auto font-semibold ${className}`}
      color="primary"
      variant="solid"
    >
      {loading ? "Processing…" : label}
    </Button>
  );
}
