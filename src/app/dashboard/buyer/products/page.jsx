"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart, FaSearch, FaShoppingBag } from "react-icons/fa";
import { Button, Input, Spinner } from "@heroui/react";

import BuyerEmptyState from "@/components/buyer/BuyerEmptyState";
import BuyerErrorState from "@/components/buyer/BuyerErrorState";
import BuyerPageHeader from "@/components/buyer/BuyerPageHeader";
import ProductCard from "@/components/ProductCard";

export default function BuyerProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistId, setWishlistId] = useState(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const response = await fetch(`/api/buyer/products?${params}`);
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data.products);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleWishlist = async (product) => {
    setWishlistId(product.id);
    try {
      await fetch("/api/buyer/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          productPrice: product.price,
        }),
      });
    } finally {
      setWishlistId(null);
    }
  };

  return (
    <div className="space-y-6">
      <BuyerPageHeader title="Browse Products" description="Discover second-hand items and save your favorites." />
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          variant="bordered"
          className="pl-8"
        />
      </div>

      {isLoading ? <p className="text-slate-500">Loading products...</p> : null}
      {!isLoading && error ? <BuyerErrorState message={error} onRetry={loadProducts} /> : null}
      {!isLoading && !error && products.length === 0 ? (
        <BuyerEmptyState icon={FaShoppingBag} title="No products available" description="Check back soon for new listings." />
      ) : null}

      {!isLoading && !error && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="space-y-3">
              <ProductCard product={product} />
              <div className="flex gap-2">
                <Button as={Link} href={`/products/${product.id}`} className="flex-1 w-full" color="primary" variant="flat">View Details</Button>
                <Button color="danger" variant="flat" startContent={wishlistId === product.id ? <Spinner size="sm" /> : <FaHeart />} onPress={() => handleWishlist(product)}>
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
