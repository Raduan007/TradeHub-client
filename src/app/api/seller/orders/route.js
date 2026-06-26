import { getSellerOrders, updateSellerOrderStatus } from "@/lib/seller/orders";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const data = await getSellerOrders(authResult.sellerId, {
      page,
      search,
      status,
    });

    return jsonOk(data);
  } catch (error) {
    console.error("GET /api/seller/orders failed:", error);
    return jsonError("Failed to load orders", 500);
  }
}
