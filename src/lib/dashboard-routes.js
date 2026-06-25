import { USER_ROLES } from "./user-roles";

export const DASHBOARD_BASE = "/dashboard";

export const ROLE_DASHBOARD_PATHS = {
  [USER_ROLES.BUYER]: `${DASHBOARD_BASE}/buyer`,
  [USER_ROLES.SELLER]: `${DASHBOARD_BASE}/seller`,
  [USER_ROLES.ADMIN]: `${DASHBOARD_BASE}/admin`,
};

export const PROTECTED_DASHBOARD_ROLES = [
  USER_ROLES.BUYER,
  USER_ROLES.SELLER,
  USER_ROLES.ADMIN,
];

export function getDashboardPathForRole(role) {
  return ROLE_DASHBOARD_PATHS[role] ?? ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER];
}

export function getRequiredRoleFromPath(pathname) {
  for (const role of PROTECTED_DASHBOARD_ROLES) {
    const prefix = `${DASHBOARD_BASE}/${role}`;

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return role;
    }
  }

  return null;
}

export function isDashboardPath(pathname) {
  return pathname === DASHBOARD_BASE || pathname.startsWith(`${DASHBOARD_BASE}/`);
}
