import {
  getSellerOrderById,
  updateSellerOrderStatus,
} from "@/lib/seller/orders";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { orderId } = await params;
    const order = await getSellerOrderById(authResult.sellerId, orderId);

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk({ order });
  } catch (error) {
    console.error("GET /api/seller/orders/[orderId] failed:", error);
    return jsonError("Failed to load order", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { orderId } = await params;
    const body = await request.json();

    if (!body?.status) {
      return jsonError("Status is required", 400);
    }

    const order = await updateSellerOrderStatus(
      authResult.sellerId,
      orderId,
      body.status
    );

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk({ order });
  } catch (error) {
    console.error("PATCH /api/seller/orders/[orderId] failed:", error);
    return jsonError(error.message || "Failed to update order", 500);
  }
}
