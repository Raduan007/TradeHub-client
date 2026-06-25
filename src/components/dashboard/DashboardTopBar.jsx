"use client";

import { FaBars, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { Button, Tooltip } from "@heroui/react";

import { useTheme } from "@/context/ThemeContext";

import DashboardProfileMenu from "./DashboardProfileMenu";

export default function DashboardTopBar({ user, onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          className="lg:hidden"
          aria-label="Open navigation menu"
          onPress={onOpenSidebar}
        >
          <FaBars />
        </Button>

        <div className="lg:hidden">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            TradeHub
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Notifications"
              className="relative"
            >
              <FaBell />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Notifications</Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Toggle theme"
              onPress={toggleTheme}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Tooltip.Content>
        </Tooltip>

        <DashboardProfileMenu user={user} />
      </div>
    </header>
  );
}
