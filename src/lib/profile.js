import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/user-roles";

export function buildProfileResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || "",
    role: getUserRole(user),
    status: user.status || "active",
  };
}

export async function updateProfile(request, user, body) {
  const updates = {};

  if (typeof body.name === "string") {
    const trimmedName = body.name.trim();

    if (!trimmedName) {
      throw new Error("Name is required");
    }

    updates.name = trimmedName;
  }

  if (body.image !== undefined) {
    if (body.image !== null && typeof body.image !== "string") {
      throw new Error("Image must be a valid URL string");
    }

    updates.image = body.image?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields to update");
  }

  const result = await auth.api.updateUser({
    body: updates,
    headers: request.headers,
  });

  return buildProfileResponse(result?.user || user);
}
