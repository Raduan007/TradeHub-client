import { getBuyerWishlist } from "@/lib/buyer/wishlist";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const items = await getBuyerWishlist(authResult.buyerId);
    return jsonOk({ items });
  } catch (error) {
    console.error("GET /api/buyer/wishlist failed:", error);
    return jsonError("Failed to load wishlist", 500);
  }
}
