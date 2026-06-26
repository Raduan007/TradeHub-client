import { getBuyerOverview } from "@/lib/buyer/overview";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const overview = await getBuyerOverview(authResult.buyerId);
    return jsonOk(overview);
  } catch (error) {
    console.error("GET /api/buyer/overview failed:", error);
    return jsonError("Failed to load dashboard overview", 500);
  }
}
