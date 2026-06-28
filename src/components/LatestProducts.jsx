"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaMapMarkerAlt, FaTag } from "react-icons/fa";

function getProductValue(product, keys, fallback = "") {
  for (const key of keys) {
    if (product?.[key] !== undefined && product?.[key] !== null && product?.[key] !== "") {
      return product[key];
    }
  }

  return fallback;
}

function formatPrice(value) {
  if (value === "" || value === undefined || value === null) {
    return "Price negotiable";
  }

  const numericPrice = Number(value);

  if (!Number.isNaN(numericPrice)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  return value;
}

function getProductImage(product) {
  const image = getProductValue(
    product,
    ["image", "imageUrl", "image_url", "photo", "photoURL", "thumbnail", "picture"]
  );

  if (image) {
    return image;
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }

  return "/images/products/product1.jpg";
}

function normalizeProduct(product) {
  return {
    id: getProductValue(product, ["_id", "id", "productId"]),
    title: getProductValue(product, ["title", "name", "productName"], "Untitled product"),
    price: formatPrice(getProductValue(product, ["price", "resalePrice", "amount"])),
    image: getProductImage(product),
    category: getProductValue(product, ["category", "type"], "Listed item"),
    location: getProductValue(product, ["location", "city", "address"], "Location not added"),
    condition: getProductValue(product, ["condition", "status"], "Available"),
  };
}

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

async function fetchProducts() {
      try {
        const response = await fetch("/api/products?limit=8", {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Products request failed");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
        setError("");
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Could not load products right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white dark:bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
              Fresh from MongoDB
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white">
              Latest Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
              Browse the newest items added by sellers in TradeHub.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-blue-600/20"
          >
            View All
            <FaArrowRight size={16} />
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-white/10"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                  <div className="h-8 bg-gray-200 dark:bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Products are not loading</h3>
            <p>{error}</p>
            <p className="text-sm mt-3 text-red-600 dark:text-red-200/80">
              Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-xl p-10 text-center">
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add documents to your MongoDB collection and they will show here.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/70 transition duration-300"
              >
                <div className="relative h-52 bg-gray-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 text-gray-800 dark:text-gray-100 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.condition}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3">
                    <FaTag size={13} />
                    <span>{product.category}</span>
                  </div>

                  <h3 className="text-lg font-bold text-black dark:text-white line-clamp-2 min-h-14">
                    {product.title}
                  </h3>

                  <p className="text-2xl font-bold text-black dark:text-white mt-4">
                    {product.price}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                    <FaMapMarkerAlt size={14} />
                    <span className="truncate">{product.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
