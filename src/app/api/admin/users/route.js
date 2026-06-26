import { getAdminUsers } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function GET(request) {
  try {
    const authResult = await requireAdminSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const data = await getAdminUsers({ page, search, role });

    return jsonOk(data);
  } catch (error) {
    console.error("GET /api/admin/users failed:", error);
    return jsonError("Failed to load users", 500);
  }
}
