import { cancelBuyerOrder, getBuyerOrderById } from "@/lib/buyer/orders";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function GET(request, { params }) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { orderId } = await params;
    const order = await getBuyerOrderById(authResult.buyerId, orderId);

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk({ order });
  } catch (error) {
    console.error("GET /api/buyer/orders/[orderId] failed:", error);
    return jsonError("Failed to load order details", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { orderId } = await params;
    const body = await request.json();

    if (body.action !== "cancel") {
      return jsonError("Unsupported action", 400);
    }

    const order = await cancelBuyerOrder(authResult.buyerId, orderId);

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk({ order });
  } catch (error) {
    console.error("PATCH /api/buyer/orders/[orderId] failed:", error);
    return jsonError(error.message || "Failed to update order", 500);
  }
}
