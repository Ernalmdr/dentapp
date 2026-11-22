"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Calendar, FileText, Stethoscope, Image, DollarSign, ArrowRight, CornerDownLeft } from "lucide-react";
import { useModal } from "./ModalContext";
import { patients } from "@/lib/mock-data";

export function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, openAppointmentModal } = useModal();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickLinks = [
    { name: "Genel Bakış", href: "/", icon: Calendar, category: "Sayfalar" },
    { name: "Hasta Listesi", href: "/hastalar", icon: User, category: "Sayfalar" },
    { name: "Randevu Takvimi", href: "/randevular", icon: Calendar, category: "Sayfalar" },
    { name: "Klinik Finans & Kasa", href: "/finans", icon: DollarSign, category: "Sayfalar" },
    { name: "Röntgen & Görüntü Arşivi", href: "/goruntuler", icon: Image, category: "Sayfalar" },
    { name: "Klinik Ayarları", href: "/ayarlar", icon: Stethoscope, category: "Sayfalar" },
  ];

  const filteredPatients = query.trim()
    ? patients.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          p.phone.includes(query) ||
          p.hsNo.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredLinks = query.trim()
    ? quickLinks.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
    : quickLinks;

  const navigateTo = (href: string) => {
    closeCommandPalette();
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={closeCommandPalette}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#15221B] shadow-2xl border border-stone-200 dark:border-[#243B2F] overflow-hidden text-stone-900 dark:text-[#ECF3EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-[#243B2F]">
          <Search className="h-5 w-5 text-stone-400 dark:text-[#6C8578]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Hasta adı, TC, telefon veya gitmek istediğiniz sayfa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder-stone-400 dark:placeholder-[#5E7569] dark:text-[#ECF3EE]"
          />
          <kbd className="hidden sm:inline-block rounded border border-stone-200 dark:border-[#243B2F] bg-stone-100 dark:bg-[#1A2C23] px-2 py-0.5 text-[11px] font-medium text-stone-500 dark:text-[#A2B5A8]">
            ESC
          </kbd>
        </div>

        {/* Content list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Patients Section */}
          {filteredPatients.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#6C8578]">
                Hastalar ({filteredPatients.length})
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigateTo(`/hastalar/${p.id}`)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1D3328] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D4A3E]/10 dark:bg-[#1D3328] text-[#2D4A3E] dark:text-[#7CC9A6] text-xs font-bold">
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{p.firstName} {p.lastName}</p>
                        <p className="text-[11px] text-stone-500 dark:text-[#A2B5A8]">{p.hsNo} • {p.phone}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions / Links */}
          <div>
            <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#6C8578]">
              Hızlı Sayfalar
            </p>
            <div className="space-y-0.5 mt-1">
              {filteredLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    onClick={() => navigateTo(item.href)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1D3328] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 dark:bg-[#1A2C23] text-stone-600 dark:text-[#A2B5A8]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                    <CornerDownLeft className="h-3.5 w-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-[#15221B] border-t border-stone-200 dark:border-[#243B2F] flex items-center justify-between text-[11px] text-stone-500 dark:text-[#A2B5A8]">
          <span>Öneri: <strong className="text-stone-700 dark:text-[#ECF3EE]">Ctrl + K</strong> ile istediğiniz zaman açabilirsiniz</span>
          <button
            onClick={() => {
              closeCommandPalette();
              openAppointmentModal();
            }}
            className="font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline"
          >
            + Yeni Randevu Aç
          </button>
        </div>
      </div>
    </div>
  );
}
