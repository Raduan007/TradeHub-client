import { getBuyerOrders } from "@/lib/buyer/orders";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/buyer";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || String(DEFAULT_PAGE_SIZE);

    const data = await getBuyerOrders(authResult.buyerId, {
      search,
      page,
      limit,
    });

    return jsonOk(data);
  } catch (error) {
    console.error("GET /api/buyer/orders failed:", error);
    return jsonError("Failed to load orders", 500);
  }
}
