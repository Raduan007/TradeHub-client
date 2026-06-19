
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Replace these with AuthContext later
  const isLoggedIn = false;
  const role = "guest"; // guest | applicant | employer | admin

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-900 border-b border-gray-200 dark:border-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            <NavLinks
              role={role}
              pathname={pathname}
            />
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-5">

            {/* Dark Mode Button */}
            <button
              onClick={toggleTheme}
              className="text-white hover:text-blue-500 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun size={20} />
              ) : (
                <FaMoon size={20} />
              )}
            </button>

            {/* Guest */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-blue-500 font-medium transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Logged In */}
            {isLoggedIn && (
              <>
                <button className="text-white relative">
                  <FaBell
                    size={20}
                    className="hover:text-blue-500 transition"
                  />

                  <span
                    className="
                      absolute
                      -top-2
                      -right-2
                      bg-red-500
                      w-4
                      h-4
                      rounded-full
                      text-[10px]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    2
                  </span>
                </button>

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                >
                  <FaUserCircle
                    size={34}
                    className="text-blue-500"
                  />
                </button>

                {profileOpen && (
                  <ProfileDropdown
                    role={role}
                  />
                )}
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="lg:hidden text-white"
          >
            {mobileOpen ? (
              <FaTimes size={28} />
            ) : (
              <FaBars size={28} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}

      {mobileOpen && (
        <MobileMenu
          role={role}
          isLoggedIn={isLoggedIn}
          closeMenu={() =>
            setMobileOpen(false)
          }
        />
      )}

    </header>
  );
}