import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data || { message: "Product not found" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/products/[id] failed:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}
