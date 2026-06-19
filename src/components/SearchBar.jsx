"use client";

import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-4 py-2">
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent text-white placeholder-gray-500 outline-none w-40"
      />
      <FaSearch className="text-gray-500 ml-2" />
    </div>
  );
}
