"use client";

import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { getDashboardPathForRole } from "@/lib/dashboard-routes";
import { USER_ROLES } from "@/lib/user-roles";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu({
  role,
  isLoggedIn,
  closeMenu,
  onSignOut,
}) {
  const dashboardPath = getDashboardPathForRole(role);
  const hasDashboard = [USER_ROLES.BUYER, USER_ROLES.SELLER, USER_ROLES.ADMIN].includes(role);

  const links = hasDashboard
    ? [
        { href: dashboardPath, label: "Dashboard" },
        ...PUBLIC_LINKS.filter((link) => link.href !== "/"),
      ]
    : PUBLIC_LINKS;

  const handleSignOut = async () => {
    closeMenu();
    await onSignOut();
  };

  return (
    <nav className="flex flex-col gap-4 border-t border-gray-800 bg-gray-900 px-6 py-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-400 transition hover:text-white"
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      ))}

      {!isLoggedIn && (
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-800 pt-4">
          <Link
            href="/auth/signin"
            className="text-center font-medium text-white transition hover:text-blue-500"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-blue-600 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
            onClick={closeMenu}
          >
            Get Started
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 flex items-center justify-center gap-2 border-t border-gray-800 pt-4 text-red-400 transition hover:text-red-300"
        >
          <FaSignOutAlt size={16} />
          Sign Out
        </button>
      )}
    </nav>
  );
}
