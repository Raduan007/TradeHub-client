"use client";

import Link from "next/link";
import { getDashboardPathForRole } from "@/lib/dashboard-routes";
import { USER_ROLES } from "@/lib/user-roles";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavLinks({ role, pathname }) {
  const dashboardPath = getDashboardPathForRole(role);
  const isLoggedIn = [USER_ROLES.BUYER, USER_ROLES.SELLER, USER_ROLES.ADMIN].includes(role);

  const links = isLoggedIn
    ? [
        ...PUBLIC_LINKS.slice(0, 2),
        { href: dashboardPath, label: "Dashboard" },
        ...PUBLIC_LINKS.slice(2),
      ]
    : PUBLIC_LINKS;

  return (
    <nav className="flex gap-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition ${
            pathname === link.href || pathname.startsWith(`${link.href}/`)
              ? "font-semibold text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
