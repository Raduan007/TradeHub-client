import {
  getSellerSettings,
  updateSellerSettings,
} from "@/lib/seller/messages";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const settings = await getSellerSettings(authResult.sellerId);
    return jsonOk({ settings });
  } catch (error) {
    console.error("GET /api/seller/settings failed:", error);
    return jsonError("Failed to load settings", 500);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();
    const settings = await updateSellerSettings(authResult.sellerId, body);
    return jsonOk({ settings });
  } catch (error) {
    console.error("PATCH /api/seller/settings failed:", error);
    return jsonError(error.message || "Failed to update settings", 500);
  }
}
