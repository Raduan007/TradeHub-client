import { fetchProducts, updateProduct } from "@/lib/products";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const listings = await fetchProducts({ search, limit: 100 });

    return jsonOk({ listings });
  } catch (error) {
    console.error("GET /api/admin/listings failed:", error);
    return jsonError("Failed to load listings", 500);
  }
}
