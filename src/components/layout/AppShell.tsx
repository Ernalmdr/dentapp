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
      <div className="min-h-screen w-full flex-1 bg-[#F3F0EA] dark:bg-[#0F1612] text-[#1C211E] dark:text-[#F0F5F2]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen w-full bg-[#F3F0EA] dark:bg-[#0F1612]">
      {/* Fixed Left Sidebar (248px Figma Width) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col ml-[248px] min-w-0 app-main-content relative overflow-x-hidden min-h-screen">
        {/* Figma Arka Plan Diş / Klinik İllüstrasyonu (Her sayfada aynı Figma koordinatında) */}
        <div className="absolute right-[220px] lg:right-[300px] top-[10px] w-[400px] h-[300px] pointer-events-none select-none z-0 opacity-90 overflow-hidden">
          <img
            src="/images/figma/banner-illustration.png"
            alt="Diş İllüstrasyonu"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1600px] w-full mx-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
