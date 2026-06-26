import {
  createSellerMessage,
  getSellerMessages,
} from "@/lib/seller/messages";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const messages = await getSellerMessages(authResult.sellerId);
    return jsonOk({ messages });
  } catch (error) {
    console.error("GET /api/seller/messages failed:", error);
    return jsonError("Failed to load messages", 500);
  }
}

export async function POST(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();
    const message = await createSellerMessage(authResult.sellerId, body);
    return jsonOk({ message }, 201);
  } catch (error) {
    console.error("POST /api/seller/messages failed:", error);
    return jsonError(error.message || "Failed to send message", 500);
  }
}
