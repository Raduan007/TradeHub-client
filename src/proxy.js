import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  DASHBOARD_BASE,
  getDashboardPathForRole,
  getRequiredRoleFromPath,
  isDashboardPath,
} from "@/lib/dashboard-routes";
import { getUserRole } from "@/lib/user-roles";

const LOGIN_PATH = "/login";
const ACCESS_DENIED_PATH = "/access-denied";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!isDashboardPath(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = getUserRole(session.user);
  const requiredRole = getRequiredRoleFromPath(pathname);

  if (pathname === DASHBOARD_BASE || pathname === `${DASHBOARD_BASE}/`) {
    return NextResponse.redirect(
      new URL(getDashboardPathForRole(userRole), request.url)
    );
  }

  if (!requiredRole || userRole !== requiredRole) {
    return NextResponse.redirect(new URL(ACCESS_DENIED_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
