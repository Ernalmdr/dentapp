"use client";

import { Calendar, Clock, CheckCircle2, HardDrive, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Bugünkü Randevular (Figma Green/800 #1F3327 Koyu Kart) */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 text-white shadow-xs transition-all hover:shadow-md"
        style={{
          backgroundColor: "#1F3327",
          border: "1px solid #1F3327",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#34483B" }}
          >
            <Calendar className="h-5 w-5 text-[#9AB395]" />
          </div>
          <span className="text-[13px] font-medium text-[#CDD5CF]">
            Bugünkü Randevular
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif text-white">
              12
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#9AB395]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              %20
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 18 C 15 22, 28 12, 42 16 C 56 20, 68 8, 78 10"
                stroke="#3F8F55"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Bekleyen Onaylar (Figma Neutral/Surface #FBFAF7) */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md"
        style={{
          backgroundColor: "#FBFAF7",
          border: "1px solid #E6E1D8",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#EEEBE4" }}
          >
            <Clock className="h-5 w-5" style={{ color: "#5F665F" }} />
          </div>
          <span className="text-[13px] font-medium" style={{ color: "#5F665F" }}>
            Bekleyen Onaylar
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif" style={{ color: "#1C211E" }}>
              4
            </span>
            <span className="inline-flex items-center text-xs font-semibold" style={{ color: "#5F665F" }}>
              <ArrowDownRight className="h-3.5 w-3.5" />
              %25
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 10 C 20 18, 40 12, 58 20 C 68 22, 74 18, 78 20"
                stroke="#CFCAC0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Tamamlanan İşlemler (Figma Neutral/Surface #FBFAF7) */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md"
        style={{
          backgroundColor: "#FBFAF7",
          border: "1px solid #E6E1D8",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#EEEBE4" }}
          >
            <CheckCircle2 className="h-5 w-5" style={{ color: "#2F5A3D" }} />
          </div>
          <span className="text-[13px] font-medium" style={{ color: "#5F665F" }}>
            Tamamlanan İşlemler
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif" style={{ color: "#1C211E" }}>
              8
            </span>
            <span className="inline-flex items-center text-xs font-semibold" style={{ color: "#2C6A3B" }}>
              <ArrowUpRight className="h-3.5 w-3.5" />
              + %33
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 16 C 18 14, 34 20, 50 10 C 62 8, 70 12, 78 8"
                stroke="#B7C4B9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Depolama Kullanımı (Figma Neutral/Surface #FBFAF7) */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md"
        style={{
          backgroundColor: "#FBFAF7",
          border: "1px solid #E6E1D8",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#EEEBE4" }}
          >
            <HardDrive className="h-5 w-5" style={{ color: "#5F665F" }} />
          </div>
          <span className="text-[13px] font-medium" style={{ color: "#5F665F" }}>
            Depolama Kullanımı
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-normal tracking-tight font-serif" style={{ color: "#1C211E" }}>
              %68
            </span>
            <span className="text-xs font-medium" style={{ color: "#5F665F" }}>
              10.2 GB / 15 GB
            </span>
          </div>

          {/* Horizontal Progress Bar — Neutral/Track #EDEAE4, Fill #34483B */}
          <div
            className="mt-3.5 h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "#EDEAE4" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: "68%",
                backgroundColor: "#34483B",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
