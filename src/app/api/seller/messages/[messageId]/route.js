import { markSellerMessageRead } from "@/lib/seller/messages";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { messageId } = await params;
    const message = await markSellerMessageRead(
      authResult.sellerId,
      messageId
    );

    if (!message) {
      return jsonError("Message not found", 404);
    }

    return jsonOk({ message });
  } catch (error) {
    console.error("PATCH /api/seller/messages/[messageId] failed:", error);
    return jsonError("Failed to update message", 500);
  }
}
