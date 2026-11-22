"use client";

import { Search, Bell, LayoutGrid, Plus, PanelLeft, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useModal } from "@/components/modals/ModalContext";
import { NotificationsPopover } from "@/components/modals/NotificationsPopover";
import { ShortcutsPopover } from "@/components/modals/ShortcutsPopover";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";

export default function TopBar() {
  const { openCommandPalette, toggleNotifications, toggleShortcuts, openAppointmentModal } = useModal();
  const { user, openProfileModal } = useAuth();
  const { isCollapsed, toggleCollapse, toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-3.5 sm:px-6 md:px-8 backdrop-blur-md transition-colors bg-[#F3F0EA]/92 dark:bg-[#0E1511]/92 border-b border-[#E6E1D8] dark:border-[#243B2F] gap-2">
      {/* Left Area: Toggle + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-md min-w-0">
        {/* Desktop Sidebar Toggle Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] text-[#3F4540] dark:text-[#ECF3EE] hover:bg-[#EEEBE4] dark:hover:bg-[#1D3328] transition-colors cursor-pointer shadow-2xs"
          title={isCollapsed ? "Menüyü Genişlet (Ctrl+B)" : "Menüyü Daralt (Ctrl+B)"}
          aria-label="Menü Boyutu"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] text-[#3F4540] dark:text-[#ECF3EE] hover:bg-[#EEEBE4] dark:hover:bg-[#1D3328] transition-colors cursor-pointer shadow-2xs"
          title="Menüyü Aç"
          aria-label="Mobil Menü"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Search Bar - Styled to match Figma Neutral/Surface #FBFAF7 and Border #E6E1D8 */}
        <div className="relative w-full min-w-0">
          <button
            type="button"
            onClick={openCommandPalette}
            className="w-full flex items-center justify-between h-9 sm:h-10 rounded-xl px-2.5 sm:px-3.5 text-sm shadow-2xs hover:border-[#1F3327] dark:hover:border-[#3F8F55] transition-all cursor-pointer group bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] text-[#5F665F] dark:text-[#ECF3EE]"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Search className="h-4 w-4 shrink-0 text-[#8A8F89] dark:text-[#6C8578]" />
              <span className="text-xs sm:text-sm text-[#8A8F89] dark:text-[#5E7569] truncate">
                Hasta, randevu veya tedavi ara...
              </span>
            </div>
            <kbd
              className="hidden sm:inline-block pointer-events-none rounded px-2 py-0.5 text-[10px] font-mono font-medium shadow-2xs bg-[#EEEBE4] dark:bg-[#1A2C23] border border-[#E6E1D8] dark:border-[#243B2F] text-[#5F665F] dark:text-[#A2B5A8] shrink-0"
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="relative flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Theme Toggle (Aydınlık / Karanlık) */}
        <ThemeToggle />

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label="Bildirimler"
            className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] text-[#3F4540] dark:text-[#ECF3EE]"
          >
            <Bell className="h-4 w-4" />
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: "#3F8F55" }}
            />
          </button>
          <NotificationsPopover />
        </div>

        {/* Apps Grid Shortcuts */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleShortcuts}
            aria-label="Kısayollar"
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] text-[#3F4540] dark:text-[#ECF3EE]"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <ShortcutsPopover />
        </div>

        {/* Doctor Avatar Pill / Profile Trigger */}
        <button
          type="button"
          onClick={openProfileModal}
          title="Doktor Profilini Düzenle"
          className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-xl shadow-2xs transition-colors cursor-pointer bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F]"
        >
          {/* Green/900 #121815 "MA" badge */}
          <div
            suppressHydrationWarning
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-[#9AB395] shrink-0 bg-[#121815] dark:bg-[#1A2C23]"
          >
            {user.name
              .split(" ")
              .filter((p) => !p.startsWith("Dr."))
              .map((n) => n[0])
              .slice(0, 2)
              .join("") || "MA"}
          </div>
          <span
            suppressHydrationWarning
            className="hidden lg:inline text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]"
          >
            {user.name}
          </span>
        </button>

        {/* + Yeni Randevu Button — Green/800 #1F3327 */}
        <button
          type="button"
          onClick={() => openAppointmentModal()}
          className="flex items-center gap-1.5 rounded-xl px-2.5 sm:px-4 py-2 text-xs font-bold text-white transition-all shadow-xs cursor-pointer hover:opacity-95 active:scale-95 shrink-0"
          style={{
            backgroundColor: "#1F3327",
          }}
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Yeni Randevu</span>
        </button>
      </div>
    </header>
  );
}
