"use client";

import { Drawer, useOverlayState } from "@heroui/react";

import { useSession } from "@/lib/auth-client";

import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";

export default function DashboardLayout({ children }) {
  const sidebarState = useOverlayState();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const closeSidebar = () => sidebarState.close();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:flex">
        <DashboardSidebar user={user} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          user={user}
          onOpenSidebar={sidebarState.open}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <Drawer state={sidebarState}>
        <Drawer.Backdrop isDismissable>
          <Drawer.Content placement="left" className="max-w-[85vw] sm:max-w-xs">
            <Drawer.Dialog>
              <Drawer.Header className="flex items-center justify-between px-4 py-3">
                <Drawer.Heading className="text-base font-semibold">
                  Menu
                </Drawer.Heading>
                <Drawer.CloseTrigger />
              </Drawer.Header>

              <Drawer.Body className="p-0">
                <DashboardSidebar user={user} onNavigate={closeSidebar} />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  );
}
