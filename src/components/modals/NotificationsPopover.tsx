"use client";

import React, { useState } from "react";
import { Bell, Check, Clock, AlertTriangle, FileCheck, X, Trash2 } from "lucide-react";
import { useModal } from "./ModalContext";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "appointment" | "lab" | "payment" | "stock";
  isRead: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Randevu Hatırlatması",
    desc: "Zeynep Arslan (Kanal Tedavisi) randevusu 10:30'da başlayacak.",
    time: "10 dk önce",
    type: "appointment",
    isRead: false,
  },
  {
    id: "2",
    title: "Laboratuvar İşi Hazır",
    desc: "Mahir Açıkkalın için 3 üyeli zirkonyum köprü teslim alındı.",
    time: "45 dk önce",
    type: "lab",
    isRead: false,
  },
  {
    id: "3",
    title: "Bekleyen Sigorta Onayı",
    desc: "Tuğçe Üngör özel sağlık sigortası provizyon onayı bekleniyor.",
    time: "2 saat önce",
    type: "payment",
    isRead: true,
  },
  {
    id: "4",
    title: "Kritik Stok Uyarısı",
    desc: "A2 Kompozit Tüp dolgu stoğu kritik eşiğin altına indi (2 adet kaldı).",
    time: "Dün",
    type: "stock",
    isRead: true,
  },
];

export function NotificationsPopover() {
  const { isNotificationsOpen, closeNotifications, showToast } = useModal();
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);

  if (!isNotificationsOpen) return null;

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    showToast("Tüm bildirimler okundu olarak işaretlendi.", "info");
  };

  const clearAll = () => {
    setItems([]);
    showToast("Bildirim kutusu temizlendi.", "info");
  };

  const unreadCount = items.filter((i) => !i.isRead).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={closeNotifications} />

      {/* Popover */}
      <div className="absolute right-14 top-14 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#15221B] shadow-2xl border border-stone-200 dark:border-[#243B2F] overflow-hidden text-stone-900 dark:text-[#ECF3EE] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-[#243B2F] bg-stone-50/70 dark:bg-[#1A2C23]">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium text-stone-500 hover:text-stone-800 dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE] px-1.5 py-0.5 rounded transition-colors"
              >
                Tümünü Oku
              </button>
            )}
            <button
              onClick={closeNotifications}
              className="text-stone-400 hover:text-stone-600 dark:text-[#6C8578] dark:hover:text-[#ECF3EE] p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-[#243B2F]">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 dark:text-[#6C8578]">
              Yeni bildiriminiz bulunmuyor.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 transition-colors hover:bg-stone-50/80 dark:hover:bg-[#1D3328] flex items-start gap-3 cursor-pointer ${
                  !item.isRead ? "bg-emerald-50/40 dark:bg-[#1D3328]/70" : ""
                }`}
                onClick={() => {
                  setItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, isRead: true } : i))
                  );
                }}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    item.type === "appointment"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : item.type === "lab"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : item.type === "stock"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  }`}
                >
                  {item.type === "appointment" && <Clock className="h-4 w-4" />}
                  {item.type === "lab" && <FileCheck className="h-4 w-4" />}
                  {item.type === "stock" && <AlertTriangle className="h-4 w-4" />}
                  {item.type === "payment" && <Check className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate">{item.title}</p>
                    <span className="text-[10px] text-stone-400 dark:text-[#6C8578]">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-[#A2B5A8] line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-2 border-t border-stone-200 dark:border-[#243B2F] bg-stone-50 dark:bg-[#15221B] flex justify-between items-center text-xs">
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-red-500 dark:text-[#6C8578] dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Temizle
            </button>
            <span className="text-[10px] text-stone-400 dark:text-[#6C8578]">DentaSphere Canlı Akış</span>
          </div>
        )}
      </div>
    </>
  );
}
