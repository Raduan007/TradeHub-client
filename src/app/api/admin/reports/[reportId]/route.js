import { updateAdminReport } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireAdminSession(request);
    if (authResult.error) return authResult.error;

    const { reportId } = await params;
    const body = await request.json();

    if (!body?.status) {
      return jsonError("Status is required", 400);
    }

    const report = await updateAdminReport(reportId, body.status);
    if (!report) return jsonError("Report not found", 404);

    return jsonOk({ report });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[reportId] failed:", error);
    return jsonError(error.message || "Failed to update report", 500);
  }
}
