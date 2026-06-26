import { getSellerAnalytics } from "@/lib/seller/analytics";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const analytics = await getSellerAnalytics(authResult.sellerId);
    return jsonOk(analytics);
  } catch (error) {
    console.error("GET /api/seller/analytics failed:", error);
    return jsonError("Failed to load analytics", 500);
  }
}
