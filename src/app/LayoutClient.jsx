"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutClient({ children }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
