import { getPlatformSettings, updatePlatformSettings } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const settings = await getPlatformSettings();
    return jsonOk({ settings });
  } catch (error) {
    console.error("GET /api/admin/settings failed:", error);
    return jsonError("Failed to load settings", 500);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const body = await request.json();
    const settings = await updatePlatformSettings(body);
    return jsonOk({ settings });
  } catch (error) {
    console.error("PATCH /api/admin/settings failed:", error);
    return jsonError(error.message || "Failed to update settings", 500);
  }
}
