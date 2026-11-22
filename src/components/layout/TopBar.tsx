"use client";

import { Search, Bell, LayoutGrid, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useModal } from "@/components/modals/ModalContext";
import { NotificationsPopover } from "@/components/modals/NotificationsPopover";
import { ShortcutsPopover } from "@/components/modals/ShortcutsPopover";
import { useAuth } from "@/lib/auth-context";

export default function TopBar() {
  const { openCommandPalette, toggleNotifications, toggleShortcuts, openAppointmentModal } = useModal();
  const { user, openProfileModal } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 md:px-8 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: "rgba(243, 240, 234, 0.92)",
        borderBottom: "1px solid #E6E1D8",
      }}
    >
      {/* Search Bar - Styled to match Figma Neutral/Surface #FBFAF7 and Border #E6E1D8 */}
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={openCommandPalette}
          className="w-full flex items-center justify-between h-10 rounded-xl px-3.5 text-sm shadow-2xs hover:border-[#1F3327] transition-all cursor-pointer group"
          style={{
            backgroundColor: "#FBFAF7",
            border: "1px solid #E6E1D8",
            color: "#5F665F",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4" style={{ color: "#8A8F89" }} />
            <span className="text-xs sm:text-sm" style={{ color: "#8A8F89" }}>
              Hasta, randevu veya tedavi ara...
            </span>
          </div>
          <kbd
            className="pointer-events-none rounded px-2 py-0.5 text-[10px] font-mono font-medium shadow-2xs"
            style={{
              backgroundColor: "#EEEBE4",
              border: "1px solid #E6E1D8",
              color: "#5F665F",
            }}
          >
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
            className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            style={{
              backgroundColor: "#FBFAF7",
              border: "1px solid #E6E1D8",
              color: "#3F4540",
            }}
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
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            style={{
              backgroundColor: "#FBFAF7",
              border: "1px solid #E6E1D8",
              color: "#3F4540",
            }}
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
          className="flex items-center gap-2 px-2.5 py-1 rounded-xl shadow-2xs transition-colors cursor-pointer"
          style={{
            backgroundColor: "#FBFAF7",
            border: "1px solid #E6E1D8",
          }}
        >
          {/* Green/900 #121815 "MA" badge */}
          <div
            suppressHydrationWarning
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-[#9AB395] shrink-0"
            style={{ backgroundColor: "#121815" }}
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
            className="hidden sm:inline text-xs font-semibold"
            style={{ color: "#1C211E" }}
          >
            {user.name}
          </span>
        </button>

        {/* + Yeni Randevu Button — Green/800 #1F3327 */}
        <button
          type="button"
          onClick={() => openAppointmentModal()}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-xs cursor-pointer hover:opacity-95 active:scale-95"
          style={{
            backgroundColor: "#1F3327",
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Yeni Randevu
        </button>
      </div>
    </header>
  );
}
