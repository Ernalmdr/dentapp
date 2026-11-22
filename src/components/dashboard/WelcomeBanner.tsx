"use client";

import Image from "next/image";
import { Calendar, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function WelcomeBanner() {
  const { user, openProfileModal } = useAuth();

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-4 pt-2 overflow-hidden">
      {/* Left: Greeting & Description */}
      <div className="z-10 max-w-xl">
        <h1
          className="text-3xl lg:text-[42px] leading-[1.12] tracking-tight font-serif"
          style={{ color: "#1C211E" }}
        >
          Hoş Geldiniz, <br />
          <span className="font-semibold inline-flex items-center gap-2 group">
            <span suppressHydrationWarning>{user.name}</span>
            <button
              type="button"
              onClick={openProfileModal}
              title="Doktor ismini değiştir"
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg transition-all opacity-60 group-hover:opacity-100 cursor-pointer"
              style={{
                backgroundColor: "#EEEBE4",
                color: "#1C211E",
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </span>
        </h1>
        <p
          suppressHydrationWarning
          className="mt-2.5 text-[14px] leading-relaxed max-w-md font-medium"
          style={{ color: "#5F665F" }}
        >
          Bugün 12 randevunuz ve bekleyen 4 onayınız var. {user.clinicName} klinik süreçlerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Right/Center: Date Badge */}
      <div className="relative z-10 mt-4 md:mt-0 flex items-center gap-4 self-start md:self-auto">
        {/* Date Badge — Figma Neutral/Surface #FBFAF7 */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xs"
          style={{
            backgroundColor: "#FBFAF7",
            border: "1px solid #E6E1D8",
          }}
        >
          <div className="text-right">
            <p className="text-[11px] font-medium" style={{ color: "#5F665F" }}>
              Perşembe
            </p>
            <p className="text-sm font-bold tracking-tight font-serif" style={{ color: "#1C211E" }}>
              27 Ekim 2026
            </p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs"
            style={{
              backgroundColor: "#E7EEE6",
              border: "1px solid #C9DDC3",
              color: "#1F3327",
            }}
          >
            <Calendar className="h-4 w-4 text-[#1F3327]" />
          </div>
        </div>
      </div>
    </div>
  );
}
