import { getAdminReports, updateAdminReport } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(request.url);
    const data = await getAdminReports({
      status: searchParams.get("status") || "",
      page: Number(searchParams.get("page")) || 1,
    });

    return jsonOk(data);
  } catch (error) {
    console.error("GET /api/admin/reports failed:", error);
    return jsonError("Failed to load reports", 500);
  }
}
