import { NextResponse } from "next/server";

import { fetchProductsRaw } from "@/lib/products";
import { serializeDocuments } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchFromExpress(query) {
  const response = await fetch(`${API_URL}/api/products${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return Array.isArray(data) ? data : null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "8";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sellerId = searchParams.get("sellerId") || "";
    const query = searchParams.toString();

    let products = await fetchProductsRaw({
      limit: Number(limit),
      search,
      category,
      sellerId: sellerId || undefined,
    });

    if (products.length === 0 && API_URL && !API_URL.includes("localhost")) {
      const expressProducts = await fetchFromExpress(query);
      if (expressProducts?.length) {
        products = expressProducts;
      }
    }

    return NextResponse.json(serializeDocuments(products));
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
