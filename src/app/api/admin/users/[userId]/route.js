import { updateAdminUser } from "@/lib/admin";
import { jsonError, jsonOk, requireAdminSession } from "@/lib/api-auth";

export async function PATCH(request, { params }) {
  try {
    const authResult = await requireAdminSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { userId } = await params;
    const body = await request.json();
    const user = await updateAdminUser(userId, body);

    if (!user) {
      return jsonError("User not found", 404);
    }

    return jsonOk({ user });
  } catch (error) {
    console.error("PATCH /api/admin/users/[userId] failed:", error);
    return jsonError(error.message || "Failed to update user", 500);
  }
}
