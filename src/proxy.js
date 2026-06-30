import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  DASHBOARD_BASE,
  getDashboardPathForRole,
  getRequiredRoleFromPath,
} from "@/lib/dashboard-routes";
import { buildSignInUrl, isProtectedPath } from "@/lib/route-protection";
import { getUserRole } from "@/lib/user-roles";

const ACCESS_DENIED_PATH = "/access-denied";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.redirect(buildSignInUrl(request.url, pathname));
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
