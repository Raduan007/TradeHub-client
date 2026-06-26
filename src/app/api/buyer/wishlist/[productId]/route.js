import { removeWishlistItem } from "@/lib/buyer/wishlist";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { productId } = await params;
    const removed = await removeWishlistItem(authResult.buyerId, productId);

    if (!removed) {
      return jsonError("Wishlist item not found", 404);
    }

    return jsonOk({ success: true });
  } catch (error) {
    console.error("DELETE /api/buyer/wishlist/[productId] failed:", error);
    return jsonError("Failed to remove wishlist item", 500);
  }
}
