"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { Input, Skeleton } from "@heroui/react";

import ProductCard from "@/components/ProductCard";
import { normalizeProducts } from "@/lib/product-utils";

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { key: "newest", label: "Newest First" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

function ProductsPageFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="mt-2 h-5 w-96 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const categoryParam = searchParams.get("category") || "";
    setCategory(categoryParam);
    if (categoryParam) {
      setSearch(categoryParam);
      setSearchInput(categoryParam);
    }
  }, [searchParams]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to load products");

      const data = await response.json();
      setProducts(normalizeProducts(data));
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          All Products
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Browse second-hand items from trusted sellers across Bangladesh.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Search by name or category..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          startContent={<FaSearch className="text-slate-400" />}
          variant="bordered"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && paginatedProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">No products found</p>
          <p className="mt-2 text-slate-500">Try a different search term or check back later.</p>
        </div>
      ) : null}

      {!isLoading && !error && paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50 dark:border-slate-700"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50 dark:border-slate-700"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
