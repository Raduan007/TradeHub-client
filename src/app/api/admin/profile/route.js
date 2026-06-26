import { buildProfileResponse, updateProfile } from "@/lib/profile";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;
    return jsonOk({ profile: buildProfileResponse(authResult.user) });
  } catch (error) {
    return jsonError("Failed to load profile", 500);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const profile = await updateProfile(request, authResult.user, body);
    return jsonOk({ profile });
  } catch (error) {
    return jsonError(error.message || "Failed to update profile", 500);
  }
}
