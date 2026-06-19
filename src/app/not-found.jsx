"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        
        {/* ERROR TITLE */}
        <h1 className="text-6xl font-bold text-red-500">404</h1>

        {/* MESSAGE */}
        <p className="mt-4 text-gray-700 text-lg">
          Something went wrong
        </p>

        <p className="text-sm text-gray-400 mt-1">
          The page you are looking for does not exist.
        </p>

        {/* BACK BUTTON */}
        <button
          onClick={() => window.history.back()}
className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          ⬅ Go Back
        </button>

        {/* HOME BUTTON (optional but useful) */}
        <Link
          href="/"
          className="block mt-3 text-blue-600 text-sm hover:underline"
        >
          Or go to Home
        </Link>
      </div>
    </div>
  );
}