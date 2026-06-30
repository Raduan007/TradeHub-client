"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Spinner, Input } from "@heroui/react";
import { toast } from "react-hot-toast";
import {
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCreditCard,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaShoppingBag,
} from "react-icons/fa";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId") || "product010";

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [product, setProduct] = useState({
    id: "product010",
    title: "Nike Air Jordan 4 Retro",
    price: 285.00,
    image: "/images/products/product1.jpg",
  });

  // Prefilled checkout information
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "Chris Wang",
    phone: "+1-555-0201",
    email: "buyer1@resellhub.com",
    address: "New York, NY",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/26",
    cvc: "•••",
  });

  // Success details state
  const [successData, setSuccessData] = useState(null);

  // Fetch product info on load
  useEffect(() => {
    async function loadProduct() {
      if (productId === "product010") {
        setFetchingProduct(false);
        return;
      }
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct({
            id: data.id || productId,
            title: data.name || data.title || "Nike Air Jordan 4 Retro",
            price: Number(data.price) || 285.00,
            image: data.image || "/images/products/product1.jpg",
          });
        }
      } catch (err) {
        console.error("Failed to load product details for checkout:", err);
      } finally {
        setFetchingProduct(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleInputChange = (field, value) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompletePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          deliveryInfo,
          paymentDetails,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Checkout failed");
      }

      const data = await response.json();
      setSuccessData(data);
      toast.success("Payment Successful! 🎉");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to complete purchase");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-500 font-medium animate-pulse">Loading checkout details...</p>
      </div>
    );
  }

  const subtotal = Number(product.price);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = 0; // Free
  const total = Number((subtotal + tax).toFixed(2));

  // Render Success Screen if purchase completed
  if (successData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30">
            <FaCheckCircle className="h-12 w-12" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Payment Successful! 🎉
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            Your order has been placed and the seller has been notified.
          </p>
        </div>

        <Card className="mt-8 border border-slate-200 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FaRegCheckCircle className="text-emerald-500" /> Order Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Transaction ID</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{successData.transactionId}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Order ID</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{successData.orderId}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Product</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{successData.productTitle}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Amount</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(successData.amount)}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{successData.date}</span>
            </div>

            <div className="flex justify-between pb-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                {successData.status}
              </span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
            A confirmation email will be sent to your registered address.
          </p>
        </Card>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center w-full sm:w-auto">
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              color="primary"
              variant="solid"
              size="lg"
              className="w-full font-semibold"
            >
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard/buyer/orders" className="w-full sm:w-auto">
            <Button
              color="primary"
              variant="flat"
              size="lg"
              className="w-full font-semibold"
            >
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Back Button */}
      <div className="mb-6">
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
          <FaArrowLeft className="h-3 w-3" /> Back to product details
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
        Checkout
      </h1>

      <form onSubmit={handleCompletePurchase} className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Forms */}
        <div className="space-y-8 lg:col-span-7">
          {/* Delivery Information */}
          <Card className="border border-slate-200 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Delivery Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                variant="bordered"
                value={deliveryInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                variant="bordered"
                value={deliveryInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  variant="bordered"
                  value={deliveryInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Shipping Address"
                  placeholder="Street address, City, State, ZIP"
                  variant="bordered"
                  value={deliveryInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card className="border border-slate-200 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Payment Details
              </h2>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <FaLock className="h-3 w-3 text-emerald-500" /> Secured by SSL
              </span>
            </div>

            <div className="space-y-4">
              <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                variant="bordered"
                value={paymentDetails.cardNumber}
                onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                maxLength={19}
                required
              />

              <div className="grid gap-4 grid-cols-2">
                <Input
                  label="Expiration Date"
                  placeholder="MM/YY"
                  variant="bordered"
                  value={paymentDetails.expiry}
                  onChange={(e) => handlePaymentChange("expiry", e.target.value)}
                  maxLength={5}
                  required
                />
                <Input
                  label="CVC"
                  placeholder="000"
                  variant="bordered"
                  value={paymentDetails.cvc}
                  onChange={(e) => handlePaymentChange("cvc", e.target.value)}
                  maxLength={4}
                  required
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  This is a demo. No real payment will be processed.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5">
          <Card className="border border-slate-200 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FaShoppingBag className="text-blue-600 dark:text-blue-400" /> Order Summary
            </h2>

            {/* Product Item info */}
            <div className="flex gap-4 mb-6">
              <div className="h-16 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Quantity: 1</p>
              </div>
            </div>

            <hr className="my-4 border-slate-200 dark:border-slate-800" />

            {/* Cost Breakdown */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Shipping</span>
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">Free</span>
              </div>

              <hr className="my-4 border-slate-200 dark:border-slate-800" />

              <div className="flex justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-8">
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-bold shadow-lg"
                isLoading={loading}
              >
                Complete Purchase
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
              By completing purchase you agree to our{" "}
              <Link href="#" className="font-semibold underline hover:text-slate-600 dark:hover:text-slate-300">
                Terms of Service
              </Link>
            </p>
          </Card>
        </div>
      </form>
    </div>
  );
}
