"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Pencil,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
      className="fixed left-0 top-0 z-40 flex h-screen w-[248px] flex-col justify-between overflow-hidden"
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
        {/* Figma Logo (#11:7789) */}
        <Link href="/" className="flex items-center gap-3.5 px-4 pt-7 pb-4 group">
          <div className="h-[26px] w-[34px] shrink-0 flex items-center justify-center">
            <img
              src="/images/figma/nav-logo.svg"
              alt="Doctrack Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-[24px] font-medium tracking-[-0.3px] text-white leading-[33.6px]">
            Doctrack
          </span>
        </Link>

        {/* Navigation Items (#11:7794) */}
        <nav className="space-y-1 px-4 py-2">
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
                className={cn(
                  "flex items-center h-[46px] rounded-[10px] px-4 transition-all duration-150 group text-[15px] font-medium leading-[21px]",
                  isActive
                    ? "bg-[#2d3a32] text-white font-medium"
                    : "text-[#cdd5cf] hover:text-white hover:bg-[#2d3a32]/40"
                )}
              >
                {/* SVG Icon or Lucide Icon */}
                <div className="size-[20px] shrink-0 mr-3.5 flex items-center justify-center">
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

                <span className="truncate">{item.name}</span>

                {/* Figma Yeşil Aktif Noktası (#3f8f55) */}
                {isActive && (
                  <span
                    className="ml-auto h-2 w-2 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: "#3f8f55" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Figma Bottom Card (#11:7836 "Button - Klinik seç") ── */}
      <div className="relative z-10 px-4 pb-5 pt-2" ref={menuRef}>
        {/* Profile / Switcher Popover Menu */}
        {menuOpen && (
          <div
            className="absolute bottom-full left-4 right-4 mb-2 z-50 rounded-2xl p-2.5 shadow-2xl text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150 text-white"
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

        {/* The Exact Figma Klinik Seç Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full h-[66px] rounded-[14px] flex items-center px-3 gap-3 transition-colors cursor-pointer text-left group"
          style={{
            backgroundColor: "rgba(28, 36, 31, 0.85)",
            border: "1px solid #2e3832",
            backdropFilter: "blur(8px)",
          }}
          title="Klinik ve Doktor Profilini Değiştir"
        >
          {/* Clinic Logo Image from Figma (#11:7837) */}
          <div className="size-[40px] rounded-[8px] overflow-hidden shrink-0 bg-[#0f110b]">
            <img
              src="/images/figma/clinic-logo.png"
              alt="Açıkkalın Diş Kliniği"
              className="size-full object-cover"
            />
          </div>

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

          {/* Figma Chevron Dropdown Icon (#11:7841) */}
          <div className="size-[18px] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <img
              src="/images/figma/nav-chevron.svg"
              alt="Chevron"
              className={cn("size-full transition-transform duration-200", menuOpen ? "rotate-180" : "")}
            />
          </div>
        </button>
      </div>
    </aside>
  );
}
