"use client";

import { Calendar, Clock, CheckCircle2, HardDrive, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Bugünkü Randevular (Figma Green/800 #1F3327 Koyu Kart) */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 text-white shadow-xs transition-all hover:shadow-md bg-[#1F3327] border border-[#1F3327] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]"
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34483B] dark:bg-[#1A2B21]"
          >
            <Calendar className="h-5 w-5 text-[#9AB395]" />
          </div>
          <span className="text-[13px] font-medium text-[#CDD5CF] dark:text-[#A2B5A8]">
            Bugünkü Randevular
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif text-white dark:text-[#ECF3EE]">
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
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]"
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEBE4] dark:bg-[#1A2B21]"
          >
            <Clock className="h-5 w-5 text-[#5F665F] dark:text-[#A2B5A8]" />
          </div>
          <span className="text-[13px] font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Bekleyen Onaylar
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]">
              4
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
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
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]"
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEBE4] dark:bg-[#1A2B21]"
          >
            <CheckCircle2 className="h-5 w-5 text-[#2F5A3D] dark:text-[#4ADE80]" />
          </div>
          <span className="text-[13px] font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Tamamlanan İşlemler
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]">
              8
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#2C6A3B] dark:text-[#4ADE80]">
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
        className="relative overflow-hidden rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]"
      >
        <div className="flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEBE4] dark:bg-[#1A2B21]"
          >
            <HardDrive className="h-5 w-5 text-[#5F665F] dark:text-[#A2B5A8]" />
          </div>
          <span className="text-[13px] font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Depolama Kullanımı
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]">
              %68
            </span>
            <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
              10.2 GB / 15 GB
            </span>
          </div>

          {/* Horizontal Progress Bar — Neutral/Track #EDEAE4, Fill #34483B */}
          <div
            className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#EDEAE4] dark:bg-[#1A2B21]"
          >
            <div
              className="h-full rounded-full transition-all duration-500 bg-[#34483B] dark:bg-[#3F8F55]"
              style={{
                width: "68%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
