import {
  FaBox,
  FaChartLine,
  FaCog,
  FaCreditCard,
  FaEnvelope,
  FaFlag,
  FaHeart,
  FaHome,
  FaList,
  FaShoppingBag,
  FaStore,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { ROLE_DASHBOARD_PATHS, DASHBOARD_BASE } from "./dashboard-routes";
import { USER_ROLES } from "./user-roles";

export const DASHBOARD_PORTAL_LABELS = {
  [USER_ROLES.BUYER]: "Buyer Portal",
  [USER_ROLES.SELLER]: "Seller Portal",
  [USER_ROLES.ADMIN]: "Admin Portal",
};

const buyerNav = [
  {
    href: ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER],
    label: "Overview",
    icon: FaHome,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER]}/orders`,
    label: "My Orders",
    icon: FaBox,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER]}/wishlist`,
    label: "Wishlist",
    icon: FaHeart,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER]}/payments`,
    label: "Payments",
    icon: FaCreditCard,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.BUYER]}/profile`,
    label: "Profile",
    icon: FaUser,
  },
];

const sellerNav = [
  {
    href: ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER],
    label: "Overview",
    icon: FaHome,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER]}/listings`,
    label: "My Listings",
    icon: FaList,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER]}/orders`,
    label: "Orders",
    icon: FaBox,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER]}/analytics`,
    label: "Analytics",
    icon: FaChartLine,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER]}/messages`,
    label: "Messages",
    icon: FaEnvelope,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.SELLER]}/profile`,
    label: "Profile",
    icon: FaUser,
  },
];

const adminNav = [
  {
    href: ROLE_DASHBOARD_PATHS[USER_ROLES.ADMIN],
    label: "Overview",
    icon: FaHome,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.ADMIN]}/users`,
    label: "Users",
    icon: FaUsers,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.ADMIN]}/listings`,
    label: "Listings",
    icon: FaStore,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.ADMIN]}/reports`,
    label: "Reports",
    icon: FaFlag,
  },
  {
    href: `${ROLE_DASHBOARD_PATHS[USER_ROLES.ADMIN]}/settings`,
    label: "Settings",
    icon: FaCog,
  },
];

const NAV_BY_ROLE = {
  [USER_ROLES.BUYER]: buyerNav,
  [USER_ROLES.SELLER]: sellerNav,
  [USER_ROLES.ADMIN]: adminNav,
};

export function getDashboardNavItems(role) {
  return NAV_BY_ROLE[role] ?? buyerNav;
}

export function isDashboardNavActive(pathname, href) {
  if (href === DASHBOARD_BASE) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getUserInitials(user) {
  const name = user?.name?.trim();

  if (!name) {
    return "U";
  }

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
