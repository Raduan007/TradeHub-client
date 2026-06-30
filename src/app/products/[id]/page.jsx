"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Alert, Button, Card, Chip, Skeleton, Spinner } from "@heroui/react";

import { useSession } from "@/lib/auth-client";
import { normalizeProduct } from "@/lib/product-utils";
import { formatCurrency } from "@/lib/format";
import { buildSignUpUrl } from "@/lib/route-protection";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(normalizeProduct(data));
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleBuyNow = () => {
    const checkoutUrl = `/checkout?productId=${product.id}`;

    if (session?.user) {
      router.push(checkoutUrl);
      return;
    }

    router.push(buildSignUpUrl(checkoutUrl));
  };

  const handleAddToWishlist = async () => {
    setIsSaving(true);
    setActionMessage("");

    try {
      const response = await fetch("/api/buyer/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          productPrice: product.price,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Please sign in as a buyer to save items to your wishlist.");
        }
        throw new Error(data?.message || "Failed to add to wishlist");
      }

      setActionMessage("Added to wishlist successfully.");
    } catch (wishlistError) {
      setActionMessage(wishlistError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product not found</h1>
        <p className="mt-2 text-slate-500">{error}</p>
        <Link href="/products" className="mt-6 inline-block text-blue-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
        <FaArrowLeft size={12} /> Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
          <img src={product.image} alt={product.title} className="h-full max-h-[520px] w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
        </Card>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip size="sm" color="primary" variant="flat">{product.category}</Chip>
              <Chip size="sm" color="secondary" variant="flat">{product.condition}</Chip>
              <Chip size="sm" color="success" variant="flat">{product.status}</Chip>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{product.title}</h1>
            <p className="mt-4 text-3xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
          </div>

          <p className="text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-medium text-slate-900 dark:text-white">{product.location}</p>
            <p className="mt-3 text-sm text-slate-500">Stock available</p>
            <p className="font-medium text-slate-900 dark:text-white">{product.stock}</p>
          </div>

          {actionMessage ? <Alert title={actionMessage} /> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              color="primary"
              className="flex-1 w-full"
              onPress={handleBuyNow}
              isDisabled={isSessionPending}
              isLoading={isSessionPending}
            >
              <FaShoppingCart className="mr-2" />
              Buy Now
            </Button>
            <Button
              color="danger"
              variant="flat"
              className="flex-1"
              onPress={handleAddToWishlist}
              isLoading={isSaving}
              isDisabled={isSaving}
            >
              {isSaving ? <Spinner size="sm" className="mr-2" /> : <FaHeart className="mr-2" />}
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
