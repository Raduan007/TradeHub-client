import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const response = await fetch(
      `${API_URL}/api/products${query ? `?${query}` : ""}`,
      { cache: "no-store" }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data || { message: "Failed to fetch products" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}
