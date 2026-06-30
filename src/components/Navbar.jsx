
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { signOut, useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-roles";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const role = isLoggedIn ? getUserRole(session.user) : "guest";

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-900 border-b border-gray-200 dark:border-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          <Logo />

          <div className="hidden lg:flex">
            <NavLinks
              role={role}
              pathname={pathname}
            />
          </div>

          <div className="hidden lg:flex items-center gap-5">

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

            {isPending ? null : !isLoggedIn ? (
              <>
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-blue-500 font-medium transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
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
            ) : (
              <div className="relative flex items-center gap-5">
                <button className="text-white relative" type="button">
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
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <FaUserCircle
                    size={34}
                    className="text-blue-500"
                  />
                </button>

                {profileOpen && (
                  <ProfileDropdown onSignOut={handleSignOut} role={role} />
                )}
              </div>
            )}

          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white"
            type="button"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <FaTimes size={28} />
            ) : (
              <FaBars size={28} />
            )}
          </button>

        </div>
      </div>

      {mobileOpen && (
        <MobileMenu
          role={role}
          isLoggedIn={!isPending && isLoggedIn}
          closeMenu={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />
      )}

    </header>
  );
}
