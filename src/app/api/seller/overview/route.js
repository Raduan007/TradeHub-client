import { getSellerOverview } from "@/lib/seller/overview";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const overview = await getSellerOverview(authResult.sellerId);
    return jsonOk(overview);
  } catch (error) {
    console.error("GET /api/seller/overview failed:", error);
    return jsonError("Failed to load seller overview", 500);
  }
}
