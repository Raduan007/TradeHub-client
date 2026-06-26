import { getBuyerPayments } from "@/lib/buyer/payments";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const payments = await getBuyerPayments(authResult.buyerId);
    return jsonOk({ payments });
  } catch (error) {
    console.error("GET /api/buyer/payments failed:", error);
    return jsonError("Failed to load payment history", 500);
  }
}
