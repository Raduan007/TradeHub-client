import { auth } from "@/lib/auth";
import { jsonError, jsonOk, requireBuyerSession } from "@/lib/api-auth";
import { getUserRole } from "@/lib/user-roles";

export async function GET(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;

    return jsonOk({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        role: getUserRole(user),
        status: user.status || "active",
      },
    });
  } catch (error) {
    console.error("GET /api/buyer/profile failed:", error);
    return jsonError("Failed to load profile", 500);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await requireBuyerSession(request);

    if (authResult.error) {
      return authResult.error;
    }

    const body = await request.json();
    const updates = {};

    if (typeof body.name === "string") {
      const trimmedName = body.name.trim();

      if (!trimmedName) {
        return jsonError("Name is required", 400);
      }

      updates.name = trimmedName;
    }

    if (body.image !== undefined) {
      if (body.image !== null && typeof body.image !== "string") {
        return jsonError("Image must be a valid URL string", 400);
      }

      updates.image = body.image?.trim() || null;
    }

    if (Object.keys(updates).length === 0) {
      return jsonError("No valid fields to update", 400);
    }

    const result = await auth.api.updateUser({
      body: updates,
      headers: request.headers,
    });

    const user = result?.user || authResult.user;

    return jsonOk({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        role: getUserRole(user),
        status: user.status || "active",
      },
    });
  } catch (error) {
    console.error("PATCH /api/buyer/profile failed:", error);
    return jsonError(error?.message || "Failed to update profile", 500);
  }
}
