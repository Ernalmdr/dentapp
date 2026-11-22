"use client";

import Image from "next/image";
import { Calendar, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function WelcomeBanner() {
  const { user, openProfileModal } = useAuth();

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-6 pt-2 overflow-hidden">
      {/* Left: Greeting & Description */}
      <div className="z-10 max-w-xl">
        <h1 className="text-3xl lg:text-[38px] leading-[1.15] text-[#1A1A1A] dark:text-[#F0F5F2] tracking-tight font-serif">
          Hoş geldiniz, <br />
          <span className="font-semibold inline-flex items-center gap-2 group">
            <span>{user.name}</span>
            <button
              type="button"
              onClick={openProfileModal}
              title="Doktor ismini değiştir"
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-[#1E332A] transition-all opacity-60 group-hover:opacity-100 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </span>
        </h1>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#6B7280] dark:text-[#90A199] max-w-md">
          {user.clinicName} klinik süreçlerinize buradan kolayca ulaşabilir, hastalarınızı ve
          tedavilerinizi yönetebilirsiniz.
        </p>
      </div>

      {/* Center/Background Decorative 3D Tooth */}
      <div className="absolute right-44 lg:right-64 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block opacity-90 select-none">
        <Image
          src="/images/dashboard/tooth-3d-clean.png"
          alt="3D Diş Görseli"
          width={320}
          height={170}
          className="object-contain mix-blend-multiply dark:mix-blend-screen dark:opacity-30"
          priority
        />
      </div>

      {/* Right: Date Badge */}
      <div className="z-10 mt-4 md:mt-0 flex items-center gap-3 self-start md:self-auto bg-white/60 dark:bg-[#122019]/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-stone-200/60 dark:border-[#1E332A] shadow-xs">
        <div className="text-right">
          <p className="text-[11px] font-medium text-[#6B7280] dark:text-[#7A8E83]">Perşembe</p>
          <p className="text-sm font-bold text-[#1A1A1A] dark:text-[#F0F5F2] tracking-tight">
            29 Ekim 2026
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/80 dark:border-[#233C30] bg-white dark:bg-[#16261F] text-stone-700 dark:text-[#90A199] shadow-xs">
          <Calendar className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
        </div>
      </div>
    </div>
  );
}
