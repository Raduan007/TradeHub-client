import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { USER_ROLES, getUserRole } from "@/lib/user-roles";

async function getSessionUser(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    session,
    user: session.user,
    userId: session.user.id,
    role: getUserRole(session.user),
  };
}

export async function requireRoleSession(request, allowedRoles) {
  const result = await getSessionUser(request);

  if (result.error) {
    return result;
  }

  if (!allowedRoles.includes(result.role)) {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

export async function requireBuyerSession(request) {
  const result = await requireRoleSession(request, [USER_ROLES.BUYER]);

  if (result.error) {
    return result;
  }

  return {
    session: result.session,
    buyerId: result.userId,
    user: result.user,
  };
}

export async function requireSellerSession(request) {
  const result = await requireRoleSession(request, [USER_ROLES.SELLER]);

  if (result.error) {
    return result;
  }

  return {
    session: result.session,
    sellerId: result.userId,
    user: result.user,
  };
}

export async function requireAdminSession(request) {
  const result = await requireRoleSession(request, [USER_ROLES.ADMIN]);

  if (result.error) {
    return result;
  }

  return {
    session: result.session,
    adminId: result.userId,
    user: result.user,
  };
}

export function jsonOk(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message, status = 500) {
  return NextResponse.json({ message }, { status });
}
