"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function StripeCheckoutButton({ priceId = "product010", label = "Proceed to Checkout", className = "" }) {
  return (
    <Button
      as={Link}
      href={`/checkout?productId=${priceId}`}
      className={`mb-4 w-full md:w-auto font-semibold ${className}`}
      color="primary"
      variant="solid"
    >
      {label}
    </Button>
  );
}
