"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Users,
  Stethoscope,
  Image,
  DollarSign,
  Package,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  Pencil,
  UserCheck,
  Building2,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { name: "Genel Bakış", href: "/", icon: Home },
  { name: "Randevular", href: "/randevular", icon: Calendar },
  { name: "Hastalar", href: "/hastalar", icon: Users },
  { name: "Tedaviler", href: "/tedaviler", icon: Stethoscope },
  { name: "Görüntüler", href: "/goruntuler", icon: Image },
  { name: "Finans", href: "/finans", icon: DollarSign },
  { name: "Stok", href: "/stok", icon: Package },
  { name: "Raporlar", href: "/raporlar", icon: BarChart3 },
  { name: "Belgeler", href: "/belgeler", icon: FileText },
  { name: "Ayarlar", href: "/ayarlar", icon: Settings },
];

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, registeredUsers, openProfileModal, switchUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col justify-between bg-gradient-to-b from-[#1B3329] to-[#0F1F17]">
      {/* Top Brand & Navigation */}
      <div>
        <div className="px-5 py-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white tracking-tight">
                <span className="text-[#7CC9A6]">❯❯</span> DentaSphere
              </span>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-[#7a9988] truncate" title={user.clinicName}>
            {user.clinicName || "Klinik Yönetim Platformu"}
          </p>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#2D4A3E] text-white shadow-sm"
                    : "text-[#9BB8A8] hover:bg-[#243D33] hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section at Bottom with Popover */}
      <div className="relative border-t border-[#2D4A3E] px-3 py-3" ref={menuRef}>
        {/* Profile Popover Menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 z-50 rounded-2xl bg-[#16261F] border border-[#2D4A3E] p-2 shadow-2xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150 text-white">
            <div className="px-2.5 py-1.5 border-b border-[#233C30]">
              <p className="font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-[#7a9988] truncate">{user.title} • {user.role}</p>
            </div>

            {/* Change Doctor Name / Edit Profile */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openProfileModal();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[#A3B8AF] hover:text-white hover:bg-[#233C30] transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-[#7CC9A6]" />
              <span>Doktor İsmini Değiştir</span>
            </button>

            {/* Switch Doctor (Fast Submenu) */}
            <div className="pt-1 border-t border-[#233C30]/70">
              <span className="block px-2.5 py-1 text-[10px] uppercase font-bold text-[#6B8578]">
                Hızlı Hekim Değiştir
              </span>
              <div className="space-y-0.5">
                {registeredUsers.slice(0, 3).map((doc) => {
                  const isCur = doc.id === user.id || doc.name === user.name;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        switchUser(doc);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left text-[11px] transition-colors cursor-pointer",
                        isCur
                          ? "bg-[#2D4A3E] text-white font-bold"
                          : "text-[#8EA89C] hover:bg-[#233C30] hover:text-white"
                      )}
                    >
                      <span className="truncate">{doc.name}</span>
                      {isCur && <span className="text-[10px] text-[#7CC9A6]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Links to Settings & Auth */}
            <div className="pt-1 border-t border-[#233C30]">
              <Link
                href="/ayarlar"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[#A3B8AF] hover:text-white hover:bg-[#233C30] transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Klinik Ayarları</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[#A3B8AF] hover:text-white hover:bg-[#233C30] transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Giriş Sayfası</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        )}

        {/* User Card Trigger */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#243D33] transition-colors cursor-pointer group"
          title="Doktor profilini değiştirmek veya çıkış yapmak için tıklayın"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A7C68] text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
            {user.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate group-hover:text-[#7CC9A6] transition-colors">
              {user.name}
            </p>
            <p className="text-[11px] text-[#7a9988] truncate">{user.title}</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[#7a9988] shrink-0 transition-transform duration-200",
              menuOpen && "rotate-180 text-white"
            )}
          />
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense
      fallback={
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col justify-between bg-gradient-to-b from-[#1B3329] to-[#0F1F17]" />
      }
    >
      <SidebarContent />
    </Suspense>
  );
}
