"use client";

import { Avatar, Chip } from "@heroui/react";

import { DASHBOARD_PORTAL_LABELS, getUserInitials } from "@/lib/dashboard-nav";
import { getUserRole } from "@/lib/user-roles";

export default function DashboardUserCard({ user }) {
  const role = getUserRole(user);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center gap-3">
        <Avatar size="md" color="accent">
          <Avatar.Fallback>{getUserInitials(user)}</Avatar.Fallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Chip size="sm" color="accent" variant="soft">
          {DASHBOARD_PORTAL_LABELS[role]}
        </Chip>
        <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
          {role}
        </span>
      </div>
    </div>
  );
}
