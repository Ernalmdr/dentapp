"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Pencil,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";

interface NavItem {
  name: string;
  href: string;
  iconSrc?: string;
  lucideIcon?: any;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", iconSrc: "/images/figma/nav-dashboard.svg" },
  { name: "Hastalar", href: "/hastalar", iconSrc: "/images/figma/nav-hastalar.svg" },
  { name: "Randevu", href: "/randevular", iconSrc: "/images/figma/nav-randevu.svg" },
  { name: "Gider", href: "/finans", iconSrc: "/images/figma/nav-gider.svg" },
  { name: "Stok", href: "/stok", iconSrc: "/images/figma/nav-stok.svg" },
  { name: "Rapor", href: "/raporlar", iconSrc: "/images/figma/nav-rapor.svg" },
  { name: "Belgeler", href: "/belgeler", iconSrc: "/images/figma/nav-belgeler.svg" },
  { name: "Ayarlar", href: "/ayarlar", iconSrc: "/images/figma/nav-ayarlar.svg" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, registeredUsers, openProfileModal, switchUser, logout } = useAuth();
  const { isCollapsed, toggleCollapse, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[248px]",
        isMobileOpen
          ? "translate-x-0 shadow-2xl"
          : "max-md:-translate-x-full md:translate-x-0"
      )}
      style={{ backgroundColor: "#121815" }}
    >
      {/* ── Figma Aside Dalga Görseli (Exact Vector Wave from Figma #11:7783) ── */}
      <div className="absolute bottom-[60px] left-0 w-[300px] h-[460px] pointer-events-none overflow-hidden select-none z-0 opacity-90">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full object-contain object-bottom pointer-events-none"
          src="/images/figma/sidebar-wave.svg"
        />
      </div>

      {/* Top Brand Logo & Menu Items */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        {/* Figma Logo (#11:7789) & Collapse Button */}
        <div
          className={cn(
            "flex items-center pt-6 pb-4 transition-all duration-200",
            isCollapsed
              ? "flex-col gap-3 px-2 justify-center"
              : "justify-between px-4"
          )}
        >
          {/* Brand Logo & Title */}
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3.5 group min-w-0",
              isCollapsed && "justify-center"
            )}
            title="Doctrack Ana Sayfa"
          >
            <div className="h-[26px] w-[34px] shrink-0 flex items-center justify-center">
              <img
                src="/images/figma/nav-logo.svg"
                alt="Doctrack Logo"
                className="h-full w-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <span className="text-[24px] font-medium tracking-[-0.3px] text-white leading-[33.6px] truncate">
                Doctrack
              </span>
            )}
          </Link>

          {/* Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              "hidden md:flex size-8 items-center justify-center rounded-lg text-[#CDD5CF] hover:text-white hover:bg-[#2D3A32] transition-colors cursor-pointer",
              isCollapsed ? "mt-1" : ""
            )}
            title={isCollapsed ? "Menüyü Genişlet (Ctrl+B)" : "Menüyü Daralt (Ctrl+B)"}
            aria-label="Menü Daralt / Genişlet"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4 text-[#9AB395]" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        {/* Navigation Items (#11:7794) */}
        <nav className={cn("space-y-1 py-2", isCollapsed ? "px-2" : "px-4")}>
          {navItems.map((item) => {
            const isBelgelerChild = [
              "/belgeler",
              "/onam-formlari",
              "/hasta-egitimi",
              "/dr-dentes",
              "/isaret-dili",
              "/sozlesme",
            ].some((p) => pathname.startsWith(p));

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/belgeler"
                ? isBelgelerChild
                : pathname.startsWith(item.href);

            const LucideIcon = item.lucideIcon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "relative flex items-center h-[46px] rounded-[10px] transition-all duration-150 group text-[15px] font-medium leading-[21px]",
                  isCollapsed
                    ? "justify-center w-[46px] mx-auto px-0"
                    : "px-4",
                  isActive
                    ? "bg-[#2d3a32] text-white font-medium"
                    : "text-[#cdd5cf] hover:text-white hover:bg-[#2d3a32]/40"
                )}
              >
                {/* SVG Icon or Lucide Icon */}
                <div
                  className={cn(
                    "size-[20px] shrink-0 flex items-center justify-center",
                    !isCollapsed && "mr-3.5"
                  )}
                >
                  {item.iconSrc ? (
                    <img
                      src={item.iconSrc}
                      alt={item.name}
                      className={cn(
                        "size-[20px] transition-opacity",
                        isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                      )}
                    />
                  ) : LucideIcon ? (
                    <LucideIcon
                      className={cn(
                        "size-[18px] transition-colors",
                        isActive ? "text-[#9ab395]" : "text-[#cdd5cf] group-hover:text-white"
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                  ) : null}
                </div>

                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {/* Figma Yeşil Aktif Noktası (#3f8f55) */}
                {isActive && (
                  <span
                    className={cn(
                      "rounded-full shrink-0 shadow-2xs",
                      isCollapsed
                        ? "absolute right-2 top-2 size-2"
                        : "ml-auto size-2"
                    )}
                    style={{ backgroundColor: "#3f8f55" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Figma Bottom Card (#11:7836 "Button - Klinik seç") ── */}
      <div
        className={cn(
          "relative z-10 pb-5 pt-2 transition-all duration-200",
          isCollapsed ? "px-2" : "px-4"
        )}
        ref={menuRef}
      >
        {/* Profile / Switcher Popover Menu */}
        {menuOpen && (
          <div
            className={cn(
              "absolute bottom-full mb-2 z-50 rounded-2xl p-2.5 shadow-2xl text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150 text-white",
              isCollapsed ? "left-2 w-[240px]" : "left-4 right-4"
            )}
            style={{
              backgroundColor: "#16261f",
              border: "1px solid #2e3832",
            }}
          >
            <div className="px-2.5 py-1.5" style={{ borderBottom: "1px solid #2e3832" }}>
              <p suppressHydrationWarning className="font-bold text-white truncate text-sm">
                {user.name}
              </p>
              <p suppressHydrationWarning className="text-[11px] truncate" style={{ color: "#c3ccc5" }}>
                {user.title} • {user.role}
              </p>
            </div>

            {/* Profile Edit */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openProfileModal();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-[#2d3a32] text-[#cdd5cf] hover:text-white transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-[#9ab395]" />
              Doktor & Klinik Bilgilerini Düzenle
            </button>

            {/* Switch User List */}
            {registeredUsers.length > 1 && (
              <div className="pt-1" style={{ borderTop: "1px solid #2e3832" }}>
                <span className="block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ color: "#c3ccc5" }}>
                  Kayıtlı Hekimler
                </span>
                {registeredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer",
                      u.id === user.id
                        ? "bg-[#2d3a32] text-white font-semibold"
                        : "text-[#cdd5cf] hover:bg-[#1f3327]"
                    )}
                  >
                    <span className="truncate">{u.name}</span>
                    {u.id === user.id && <span className="text-[10px] text-[#9ab395] font-bold">Aktif</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Login / Logout */}
            <div className="pt-1" style={{ borderTop: "1px solid #2e3832" }}>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#cdd5cf] hover:bg-[#2d3a32] hover:text-white transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Farklı Hesapla Giriş Yap
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Çıkış Yap
              </button>
            </div>
          </div>
        )}

        {/* The Exact Figma Klinik Seç Button (Collapsible) */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "rounded-[14px] flex items-center transition-all cursor-pointer text-left group",
            isCollapsed
              ? "w-[48px] h-[48px] mx-auto justify-center p-1"
              : "w-full h-[66px] px-3 gap-3"
          )}
          style={{
            backgroundColor: "rgba(28, 36, 31, 0.85)",
            border: "1px solid #2e3832",
            backdropFilter: "blur(8px)",
          }}
          title={isCollapsed ? `${user.clinicName || "Açıkkalın Diş Kliniği"} • Profil` : "Klinik ve Doktor Profilini Değiştir"}
        >
          {/* Clinic Logo Image */}
          <div
            className={cn(
              "rounded-[8px] overflow-hidden shrink-0 bg-[#0f110b]",
              isCollapsed ? "size-[36px]" : "size-[40px]"
            )}
          >
            <img
              src="/images/figma/clinic-logo.png"
              alt="Açıkkalın Diş Kliniği"
              className="size-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p
                  suppressHydrationWarning
                  className="text-[13px] font-semibold text-white truncate leading-normal"
                >
                  {user.clinicName || "Açıkkalın Diş Kliniği"}
                </p>
                <p className="text-[12px] font-normal text-[#c3ccc5] truncate leading-normal">
                  Klinik Yönetimi
                </p>
              </div>

              {/* Figma Chevron Dropdown Icon */}
              <div className="size-[18px] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <img
                  src="/images/figma/nav-chevron.svg"
                  alt="Chevron"
                  className={cn("size-full transition-transform duration-200", menuOpen ? "rotate-180" : "")}
                />
              </div>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
