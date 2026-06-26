import { getAdminOverview } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";
export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const overview = await getAdminOverview();
    return jsonOk(overview);
  } catch (error) {
    console.error("GET /api/admin/overview failed:", error);
    return jsonError("Failed to load admin overview", 500);
  }
}
