"use client";

import React, { useState } from "react";

interface AlertItem {
  id: string;
  emoji: string;
  label: string;
  type: "financial" | "neutral" | "warning";
  detail: string;
}

const ALERTS: AlertItem[] = [
  {
    id: "installment",
    emoji: "💰",
    label: "2 Hastanın Taksiti Geldi (₺3.500)",
    type: "financial",
    detail: "Taksit ödemesi bekleyen hastaları görüntüleyin.",
  },
  {
    id: "rent",
    emoji: "📅",
    label: "Kira Günü (3 Gün Kaldı)",
    type: "neutral",
    detail: "Kira ödeme tarihi yaklaşıyor.",
  },
  {
    id: "consent",
    emoji: "📝",
    label: "1 Onam Formu Eksik",
    type: "warning",
    detail: "Eksik onam formunu tamamlayın.",
  },
  {
    id: "lab",
    emoji: "🦷",
    label: "Lab İşi Teslim (Bugün)",
    type: "neutral",
    detail: "Bugün teslim edilecek laboratuvar işi var.",
  },
];

const pillStyles: Record<AlertItem["type"], string> = {
  financial:
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[#92400E]/20 dark:text-[#FCD34D] hover:bg-[#FDE68A] dark:hover:bg-[#92400E]/30",
  neutral:
    "bg-[#F3F0EA] text-[#5F665F] dark:bg-[#243B2F] dark:text-[#A2B5A8] hover:bg-[#E6E1D8] dark:hover:bg-[#2F4D3D]",
  warning:
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[#92400E]/20 dark:text-[#FCD34D] hover:bg-[#FDE68A] dark:hover:bg-[#92400E]/30",
};

export default function ClinicAlertTicker() {
  const [toast, setToast] = useState<string | null>(null);

  const handleClick = (alert: AlertItem) => {
    setToast(alert.detail);
    setTimeout(() => setToast(null), 2500);
  };

  if (ALERTS.length === 0) return null;

  return (
    <div className="relative">
      {/* Ticker Strip */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide h-10 px-1 -mx-1">
        <span className="shrink-0 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] select-none">
          ⚡ Hatırlatmalar
        </span>
        <div className="w-px h-4 bg-[#E6E1D8] dark:bg-[#243B2F] shrink-0" />
        {ALERTS.map((alert) => (
          <button
            key={alert.id}
            onClick={() => handleClick(alert)}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${pillStyles[alert.type]}`}
            title={alert.detail}
          >
            <span className="text-sm leading-none">{alert.emoji}</span>
            {alert.label}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-[#1F3327] dark:bg-[#FBFAF7] text-white dark:text-[#1C211E] text-xs font-medium px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
