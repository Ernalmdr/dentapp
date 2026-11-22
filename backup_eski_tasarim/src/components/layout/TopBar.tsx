"use client";

import { Search, Bell, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useModal } from "@/components/modals/ModalContext";
import { NotificationsPopover } from "@/components/modals/NotificationsPopover";
import { ShortcutsPopover } from "@/components/modals/ShortcutsPopover";

export default function TopBar() {
  const { openCommandPalette, toggleNotifications, toggleShortcuts, openAppointmentModal } = useModal();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-[#F5F0EB]/90 px-6 backdrop-blur-md transition-colors dark:border-[#1E332A] dark:bg-[#0B130F]/90">
      {/* Search Bar - Triggers Command Palette */}
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={openCommandPalette}
          className="w-full flex items-center justify-between h-10 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-500 shadow-2xs hover:border-[#4A7C68] transition-colors dark:border-[#233C30] dark:bg-[#16261F] dark:text-[#90A199] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-gray-400 dark:text-[#7A8E85]" />
            <span className="text-xs sm:text-sm text-gray-400 dark:text-[#64756D]">Hasta, randevu, tedavi ara...</span>
          </div>
          <kbd className="pointer-events-none rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-[#2A4638] dark:bg-[#1B2F26] dark:text-[#8E9F97]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="relative flex items-center gap-3">
        {/* Theme Toggle (Aydınlık / Karanlık) */}
        <ThemeToggle />

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label="Bildirimler"
            className="relative rounded-lg p-2 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors dark:text-[#90A199] dark:hover:bg-[#16261F] dark:hover:text-white cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <NotificationsPopover />
        </div>

        {/* Apps Grid Shortcuts */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleShortcuts}
            aria-label="Kısayollar"
            className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors dark:text-[#90A199] dark:hover:bg-[#16261F] dark:hover:text-white cursor-pointer"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <ShortcutsPopover />
        </div>

        {/* + Yeni Randevu Button */}
        <button
          type="button"
          onClick={() => openAppointmentModal()}
          className="flex items-center gap-2 rounded-lg bg-[#2D4A3E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3A5F50] transition-colors shadow-sm dark:bg-[#2A5241] dark:hover:bg-[#346651] cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          Yeni Randevu
        </button>
      </div>
    </header>
  );
}
