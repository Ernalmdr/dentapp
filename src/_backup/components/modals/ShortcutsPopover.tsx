"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Calendar, Image, DollarSign, Package, FileText, X } from "lucide-react";
import { useModal } from "./ModalContext";

export function ShortcutsPopover() {
  const { isShortcutsOpen, closeShortcuts, openAppointmentModal } = useModal();
  const router = useRouter();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    {
      title: "Yeni Randevu",
      desc: "Takvime randevu kaydet",
      icon: Calendar,
      action: () => {
        closeShortcuts();
        openAppointmentModal();
      },
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Hasta Listesi",
      desc: "Hasta kaydı aç ve ara",
      icon: UserPlus,
      action: () => {
        closeShortcuts();
        router.push("/hastalar");
      },
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Röntgen Arşivi",
      desc: "Panoramik & CBCT",
      icon: Image,
      action: () => {
        closeShortcuts();
        router.push("/goruntuler");
      },
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Finans & Kasa",
      desc: "Gelir, gider ve bakiye",
      icon: DollarSign,
      action: () => {
        closeShortcuts();
        router.push("/finans");
      },
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Stok Durumu",
      desc: "Dental sarf malzemeler",
      icon: Package,
      action: () => {
        closeShortcuts();
        router.push("/stok");
      },
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Reçete Modülü",
      desc: "Hızlı e-reçete hazırla",
      icon: FileText,
      action: () => {
        closeShortcuts();
        router.push("/hastalar/2/recete");
      },
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={closeShortcuts} />

      {/* Popover */}
      <div className="absolute right-6 top-14 z-50 w-80 rounded-2xl bg-white dark:bg-[#122019] shadow-2xl border border-stone-200 dark:border-[#1E332A] overflow-hidden text-stone-900 dark:text-[#F0F5F2] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-[#1E332A] bg-stone-50/70 dark:bg-[#16261F]">
          <h3 className="text-xs font-bold uppercase tracking-wider">Hızlı Kısayollar</h3>
          <button
            onClick={closeShortcuts}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 grid grid-cols-2 gap-2">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.title}
                onClick={s.action}
                className="flex flex-col items-start p-3 rounded-xl border border-stone-100 dark:border-[#1E332A] hover:bg-stone-50 dark:hover:bg-[#182C22] hover:border-stone-300 dark:hover:border-[#2D4A3E] transition-all text-left group"
              >
                <div className={`p-2 rounded-lg ${s.color} mb-2 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold leading-tight">{s.title}</span>
                <span className="text-[10px] text-stone-400 mt-0.5 leading-tight">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
