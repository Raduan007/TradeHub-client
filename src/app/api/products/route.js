import { NextResponse } from "next/server";

import { fetchProductsRaw } from "@/lib/products";
import { serializeDocuments } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "8";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sellerId = searchParams.get("sellerId") || "";

    const products = await fetchProductsRaw({
      limit: Number(limit),
      search,
      category,
      sellerId: sellerId || undefined,
    });

    return NextResponse.json(serializeDocuments(products));
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
