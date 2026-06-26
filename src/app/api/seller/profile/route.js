import { buildProfileResponse, updateProfile } from "@/lib/profile";
import { jsonError, jsonOk, requireSellerSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    return jsonOk({ profile: buildProfileResponse(authResult.user) });
  } catch (error) {
    console.error("GET /api/seller/profile failed:", error);
    return jsonError("Failed to load profile", 500);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await requireSellerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();
    const profile = await updateProfile(request, authResult.user, body);
    return jsonOk({ profile });
  } catch (error) {
    console.error("PATCH /api/seller/profile failed:", error);
    return jsonError(error.message || "Failed to update profile", 500);
  }
}
