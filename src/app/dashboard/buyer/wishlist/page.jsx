"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaTrash } from "react-icons/fa";
import { Button, Card, Skeleton, Spinner } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import { formatCurrency } from "@/lib/format";

export default function BuyerWishlistPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/buyer/wishlist");

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to load wishlist");
      }

      const data = await response.json();
      setItems(data.items);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);

    try {
      const response = await fetch(`/api/buyer/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to remove item");
      }

      setItems((current) =>
        current.filter((item) => item.productId !== productId)
      );
    } catch (fetchError) {
      setError(fetchError.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        title="Wishlist"
        description="Save products you want to buy later."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <BuyerErrorState
          title="Unable to load wishlist"
          message={error}
          onRetry={loadWishlist}
        />
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <BuyerEmptyState
          icon={FaHeart}
          title="Your wishlist is empty"
          description="Browse products and save the ones you like to your wishlist."
          actionLabel="Browse products"
          onAction={() => {
            window.location.href = "/products";
          }}
        />
      ) : null}

      {!isLoading && !error && items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
            >
              <Link href={`/products/${item.productId}`}>
                <img
                  src={item.productImage || "/images/products/product1.jpg"}
                  alt={item.productTitle}
                  className="h-44 w-full object-cover transition hover:scale-[1.02]"
                />
              </Link>

              <div className="space-y-4 p-4">
                <div>
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.productPrice)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button as={Link} href={`/products/${item.productId}`} className="flex-1 w-full" color="primary">
                    View product
                  </Button>

                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    aria-label="Remove from wishlist"
                    isDisabled={removingId === item.productId}
                    onPress={() => handleRemove(item.productId)}
                  >
                    {removingId === item.productId ? (
                      <Spinner size="sm" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
