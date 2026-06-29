"use client";

import { useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaHome,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  Avatar,
  Dropdown,
  Separator,
} from "@heroui/react";

import { signOut } from "@/lib/auth-client";
import { getUserInitials } from "@/lib/dashboard-nav";
import { getUserRole } from "@/lib/user-roles";

export default function DashboardProfileMenu({ user }) {
  const router = useRouter();
  const role = getUserRole(user);
  const settingsPath = `/dashboard/${role}/settings`;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Dropdown>
      {/*
        Dropdown.Trigger already renders a <button> element internally
        (it extends react-aria-components/Button). Placing another <Button>
        inside it caused a nested <button><button> hydration error.
        We pass the Button styling props directly onto Dropdown.Trigger.
      */}
      <Dropdown.Trigger
        variant="ghost"
        className="h-auto min-h-0 gap-2 px-2 py-1.5 data-[hover=true]:bg-slate-100 dark:data-[hover=true]:bg-slate-800"
      >
        <Avatar size="sm" color="accent">
          <Avatar.Fallback>{getUserInitials(user)}</Avatar.Fallback>
        </Avatar>

        <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-900 dark:text-white md:inline">
          {user?.name || "Account"}
        </span>

        <FaChevronDown className="hidden text-xs text-slate-400 sm:inline" />
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end" className="w-56">
        <div className="px-3 py-3">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>

        <Separator />

        <Dropdown.Menu
          onAction={(key) => {
            if (key === "profile") {
              router.push(`/dashboard/${role}/profile`);
              return;
            }

            if (key === "dashboard") {
              router.push(`/dashboard/${role}`);
              return;
            }

            if (key === "sign-out") {
              handleSignOut();
            }
          }}
        >
          <Dropdown.Item id="profile">
            <FaUser className="text-sm" />
            My Profile
          </Dropdown.Item>

          <Dropdown.Item id="dashboard">
            <FaHome className="text-sm" />
            Dashboard
          </Dropdown.Item>

          <Dropdown.Item id="sign-out" className="text-danger">
            <FaSignOutAlt className="text-sm" />
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
