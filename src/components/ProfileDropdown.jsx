"use client";

import Link from "next/link";
import { FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";

export default function ProfileDropdown({ onSignOut, role }) {
  return (
    <div className="absolute top-16 right-0 z-50 bg-gray-900 border border-gray-800 rounded-lg w-48 shadow-lg py-2">
      <div className="px-4 py-2 border-b border-gray-800">
        <p className="text-gray-400 text-sm">Account</p>
      </div>

      <Link
        href={
          role === "buyer"
            ? "/dashboard/buyer/profile"
            : role === "seller"
            ? "/dashboard/seller/profile"
            : role === "admin"
            ? "/dashboard/admin/profile"
            : "/profile"
        }
        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition"
      >
        <FaUser size={16} />
        <span>My Profile</span>
      </Link>

      <Link
        href={
          role === "buyer"
            ? "/dashboard/buyer"
            : role === "seller"
            ? "/dashboard/seller"
            : role === "admin"
            ? "/dashboard/admin"
            : "/"
        }
        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition"
      >
        <FaCog size={16} />
        <span>Dashboard</span>
      </Link>

      <button
        type="button"
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition border-t border-gray-800 mt-2 pt-2"
      >
        <FaSignOutAlt size={16} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
