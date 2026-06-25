"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/access-denied";
  const isDashboardPage = pathname?.startsWith("/dashboard");

  return (
    <ThemeProvider>
      {!isDashboardPage && <Navbar />}
      <main
        className={
          isAuthPage || isDashboardPage ? "w-full" : "mx-auto max-w-7xl"
        }
      >
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </ThemeProvider>
  );
}
