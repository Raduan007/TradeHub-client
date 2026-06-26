import { BUYER_COLLECTIONS } from "@/lib/constants/buyer";
import { getDb } from "@/lib/mongodb";
import { serializeDocuments } from "@/lib/serialize";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const db = await getDb();
    const orders = await db
      .collection(BUYER_COLLECTIONS.ORDERS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return jsonOk({ orders: serializeDocuments(orders) });
  } catch (error) {
    console.error("GET /api/admin/orders failed:", error);
    return jsonError("Failed to load orders", 500);
  }
}
