"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { AuthProvider } from "@/lib/auth-context";
import { DoctorProfileModal } from "@/components/modals/DoctorProfileModal";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full flex-1 bg-[#F5F0EB] dark:bg-[#0B130F] text-stone-900 dark:text-[#F0F5F2]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col ml-[220px] min-w-0 app-main-content">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex h-full min-h-screen w-full bg-[#F5F0EB] dark:bg-[#0B130F]">
            {children}
          </div>
        }
      >
        <AppShellInner>{children}</AppShellInner>
      </Suspense>

      {/* Global Doctor Profile Modal */}
      <DoctorProfileModal />
    </AuthProvider>
  );
}
