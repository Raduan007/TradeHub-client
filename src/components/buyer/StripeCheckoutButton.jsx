"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export default function StripeCheckoutButton({ priceId = "product009", label = "Proceed to Checkout", className = "" }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe session creation failed", data);
        alert("Unable to start payment. Please try again later.");
      }
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
