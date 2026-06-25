"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getDashboardNavItems,
  isDashboardNavActive,
} from "@/lib/dashboard-nav";

export default function DashboardNavLinks({ role, onNavigate }) {
  const pathname = usePathname();
  const items = getDashboardNavItems(role);

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isDashboardNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <Icon className="shrink-0 text-base" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
