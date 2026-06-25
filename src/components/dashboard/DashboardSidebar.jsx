"use client";

import Link from "next/link";

import { DASHBOARD_PORTAL_LABELS } from "@/lib/dashboard-nav";
import { getDashboardPathForRole } from "@/lib/dashboard-routes";
import { getUserRole } from "@/lib/user-roles";

import DashboardNavLinks from "./DashboardNavLinks";
import DashboardUserCard from "./DashboardUserCard";

export default function DashboardSidebar({ user, onNavigate }) {
  const role = getUserRole(user);
  const homePath = getDashboardPathForRole(role);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700">
        <Link
          href={homePath}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
            <img
              src="/images/company.png"
              alt="TradeHub"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              TradeHub
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {DASHBOARD_PORTAL_LABELS[role]}
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <DashboardNavLinks role={role} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <DashboardUserCard user={user} />
      </div>
    </div>
  );
}
