"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <ThemeProvider>
      <Navbar />
      <main className={isAuthPage ? "w-full" : "mx-auto max-w-7xl"}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
