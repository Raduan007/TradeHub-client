"use client";

import Link from "next/link";
import { FaEye, FaHeart, FaMapMarkerAlt, FaTag } from "react-icons/fa";

export default function ProductCard({ product, onWishlist, wishlistLoading }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/70 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-slate-900">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-slate-950/90 dark:text-gray-100">
            {product.condition}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <FaTag size={13} />
          <span>{product.category}</span>
        </div>

        <h3 className="line-clamp-2 min-h-14 text-lg font-bold text-black dark:text-white">
          {product.title}
        </h3>

        <p className="mt-4 text-2xl font-bold text-black dark:text-white">
          {product.priceLabel}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaMapMarkerAlt size={14} />
          <span className="truncate">{product.location}</span>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-transparent px-4 py-2 text-sm font-semibold text-blue-500 transition hover:bg-blue-500/10"
          >
            <FaEye size={14} />
            View
          </Link>

          <button
            type="button"
            disabled={wishlistLoading}
            onClick={(e) => { e.preventDefault(); onWishlist && onWishlist(product); }}
            className="flex items-center justify-center gap-2 rounded-lg border border-rose-500 bg-transparent px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
          >
            <FaHeart size={14} />
            {wishlistLoading ? "Saving…" : "Wishlist"}
          </button>
        </div>
      </div>
    </article>
  );
}
