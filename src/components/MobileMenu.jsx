"use client";

import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";

export default function MobileMenu({
  role,
  isLoggedIn,
  closeMenu,
  onSignOut,
}) {
  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About" },
  ];

  const applicantLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/browse", label: "Browse" },
    { href: "/applications", label: "My Applications" },
  ];

  const employerLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/post-job", label: "Post Job" },
    { href: "/manage", label: "Manage" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin" },
    { href: "/users", label: "Users" },
    { href: "/reports", label: "Reports" },
  ];

  let links = guestLinks;
  if (role === "applicant") links = applicantLinks;
  else if (role === "employer") links = employerLinks;
  else if (role === "admin") links = adminLinks;

  const handleSignOut = async () => {
    closeMenu();
    await onSignOut();
  };

  return (
    <nav className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-400 hover:text-white transition"
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      ))}

      {!isLoggedIn && (
        <div className="flex flex-col gap-2 mt-4 border-t border-gray-800 pt-4">
          <Link
            href="/auth/signin"
            className="text-white hover:text-blue-500 font-medium transition text-center"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-center transition"
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
          className="mt-4 flex items-center justify-center gap-2 border-t border-gray-800 pt-4 text-red-400 hover:text-red-300 transition"
        >
          <FaSignOutAlt size={16} />
          Sign Out
        </button>
      )}
    </nav>
  );
}
