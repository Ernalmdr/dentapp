"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { AuthProvider } from "@/lib/auth-context";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { DoctorProfileModal } from "@/components/modals/DoctorProfileModal";
import { cn } from "@/lib/utils";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar();

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full flex-1 bg-[#F3F0EA] dark:bg-[#0F1612] text-[#1C211E] dark:text-[#F0F5F2]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full bg-[#F3F0EA] dark:bg-[#0F1612] overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={toggleMobile}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Collapsible Left Sidebar (72px / 248px) */}
      <Sidebar />

      {/* Main Content Area with Dynamic Margin */}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 app-main-content relative overflow-x-hidden min-h-screen transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "md:ml-[72px]" : "md:ml-[248px]",
          "ml-0"
        )}
      >
        {/* Figma Arka Plan Diş / Klinik İllüstrasyonu */}
        <div className="hidden sm:block absolute right-[20px] sm:right-[120px] md:right-[220px] lg:right-[300px] top-[10px] sm:w-[260px] md:w-[320px] lg:w-[400px] h-[220px] sm:h-[260px] md:h-[300px] pointer-events-none select-none z-0 opacity-90 overflow-hidden">
          <img
            src="/images/figma/banner-illustration.png"
            alt="Diş İllüstrasyonu"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        <TopBar />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-8 max-w-[1600px] w-full mx-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Suspense
          fallback={
            <div className="flex h-full min-h-screen w-full bg-[#F3F0EA] dark:bg-[#0F1612]">
              {children}
            </div>
          }
        >
          <AppShellInner>{children}</AppShellInner>
        </Suspense>

        {/* Global Doctor Profile Modal */}
        <DoctorProfileModal />
      </SidebarProvider>
    </AuthProvider>
  );
}
