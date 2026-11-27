"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChangelogItem {
  emoji: string;
  text: string;
}

const CHANGELOG: ChangelogItem[] = [
  { emoji: "🦷", text: "Perio sekmesi eklendi" },
  { emoji: "🤖", text: "AI Görüşme Aktarımı" },
  { emoji: "🎨", text: "Ana bilim dalı renkleri" },
  { emoji: "🧾", text: "Makbuz-Fatura bağlantısı" },
];

const WHATSAPP_LINK = "https://wa.me/905551234567";

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full bg-[#1F3327] dark:bg-[#3F8F55] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="Yardım ve Değişiklikler"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="fixed bottom-16 right-4 z-50 w-72 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] rounded-[20px] shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                  DentaSphere
                </h3>
                <p className="text-[10px] text-[#5F665F] dark:text-[#A2B5A8] mt-0.5">
                  v2.5 — Son Güncellemeler
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-[#ECF3EE] transition-colors"
                aria-label="Kapat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E6E1D8] dark:bg-[#243B2F] mb-3" />

            {/* Changelog */}
            <ul className="space-y-2 mb-4">
              {CHANGELOG.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-[#1C211E] dark:text-[#ECF3EE]"
                >
                  <span className="text-sm leading-none mt-px">{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* WhatsApp Link */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#3F8F55] hover:bg-[#357A49] text-white text-xs font-medium py-2 px-3 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Destek
            </a>
          </div>
        </div>
      )}
    </>
  );
}
