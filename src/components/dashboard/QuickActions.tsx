"use client";

import Image from "next/image";
import Link from "next/link";
import { UserPlus, CalendarPlus, UploadCloud, FileEdit } from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";

export default function QuickActions() {
  const { openAppointmentModal } = useModal();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17251E] via-[#1C2C24] to-[#1E3027] p-5 text-white shadow-sm border border-stone-800/40">
      {/* Background X-ray Graphic on right */}
      <div className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none select-none overflow-hidden">
        <Image
          src="/images/dashboard/jaw-xray-fade.png"
          alt="Dental Panoramic X-Ray"
          fill
          className="object-cover object-right opacity-30 mix-blend-screen"
        />
      </div>

      {/* Header */}
      <h2 className="relative z-10 text-sm font-semibold tracking-wide text-white mb-3.5">
        Hızlı İşlemler
      </h2>

      {/* 4 Action Buttons */}
      <div className="relative z-10 grid grid-cols-4 gap-2.5">
        {/* Yeni Hasta */}
        <Link
          href="/hastalar"
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer group text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white mb-2 group-hover:scale-105 group-hover:bg-white/15 transition-transform">
            <UserPlus className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight leading-snug">
            Yeni Hasta
          </span>
        </Link>

        {/* Randevu Oluştur */}
        <button
          type="button"
          onClick={() => openAppointmentModal()}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer group text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white mb-2 group-hover:scale-105 group-hover:bg-white/15 transition-transform">
            <CalendarPlus className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight leading-snug">
            Randevu Oluştur
          </span>
        </button>

        {/* Dosya Yükle */}
        <Link
          href="/goruntuler"
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer group text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white mb-2 group-hover:scale-105 group-hover:bg-white/15 transition-transform">
            <UploadCloud className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight leading-snug">
            Dosya Yükle
          </span>
        </Link>

        {/* Reçete Yaz */}
        <Link
          href="/hastalar/2/recete"
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer group text-center"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white mb-2 group-hover:scale-105 group-hover:bg-white/15 transition-transform">
            <FileEdit className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight leading-snug">
            Reçete Yaz
          </span>
        </Link>
      </div>
    </div>
  );
}
