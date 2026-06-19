"use client";

import Link from "next/link";

export default function NavLinks({ role, pathname }) {
  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const applicantLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  const employerLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/post-job", label: "Post Job" },
    { href: "/manage", label: "Manage" },
    { href: "/about", label: "About" },
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

  return (
    <nav className="flex gap-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition ${
            pathname === link.href
              ? "text-blue-500 font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
