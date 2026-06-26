import { fetchProducts } from "@/lib/products";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = Number(searchParams.get("limit")) || 24;
    const products = await fetchProducts({ search, limit });

    return jsonOk({ products });
  } catch (error) {
    console.error("GET /api/buyer/products failed:", error);
    return jsonError("Failed to load products", 500);
  }
}
