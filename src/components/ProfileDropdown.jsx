"use client";

import Link from "next/link";
import { FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";

export default function ProfileDropdown({ role }) {
  return (
    <div className="absolute top-16 right-0 bg-gray-900 border border-gray-800 rounded-lg w-48 shadow-lg py-2">
      <div className="px-4 py-2 border-b border-gray-800">
        <p className="text-gray-400 text-sm">Account</p>
      </div>

      <Link
        href="/profile"
        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition"
      >
        <FaUser size={16} />
        <span>My Profile</span>
      </Link>

      <Link
        href="/settings"
        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition"
      >
        <FaCog size={16} />
        <span>Settings</span>
      </Link>

      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-500 transition border-t border-gray-800 mt-2 pt-2">
        <FaSignOutAlt size={16} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
