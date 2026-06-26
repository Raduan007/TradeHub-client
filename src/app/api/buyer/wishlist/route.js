import { addWishlistItem, getBuyerWishlist } from "@/lib/buyer/wishlist";
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

export async function POST(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();

    if (!body?.productId || !body?.productTitle) {
      return jsonError("Product ID and title are required", 400);
    }

    const item = await addWishlistItem(authResult.buyerId, body);
    return jsonOk({ item }, 201);
  } catch (error) {
    console.error("POST /api/buyer/wishlist failed:", error);
    return jsonError("Failed to add wishlist item", 500);
  }
}
