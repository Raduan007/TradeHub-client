import { NextResponse } from "next/server";

import { fetchProductRaw } from "@/lib/products";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await fetchProductRaw(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] failed:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
