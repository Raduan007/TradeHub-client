import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { USER_ROLES, getUserRole } from "@/lib/user-roles";

export async function requireBuyerSession(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (getUserRole(session.user) !== USER_ROLES.BUYER) {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session,
    buyerId: session.user.id,
    user: session.user,
  };
}

export function jsonOk(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message, status = 500) {
  return NextResponse.json({ message }, { status });
}
