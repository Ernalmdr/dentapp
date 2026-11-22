"use client";

import { Calendar, Clock, CheckCircle2, Cloud, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Bugünkü Randevular (Highlighted Dark Green Card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C3127] via-[#213A2F] to-[#182C22] p-5 text-white shadow-sm border border-emerald-950/20">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
            <Calendar className="h-5 w-5 text-emerald-300" />
          </div>
          <span className="text-[12px] font-medium text-[#A0B8AD]">
            Bugünkü Randevular
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight font-serif text-white">
              12
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#7CC9A6]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              %20
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 18 C 15 22, 28 12, 42 16 C 56 20, 68 8, 78 10"
                stroke="#7CC9A6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Bekleyen Onaylar */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-xs border border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-medium text-stone-500">
            Bekleyen Onaylar
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight font-serif text-stone-900">
              4
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-stone-400">
              <ArrowDownRight className="h-3.5 w-3.5 text-stone-400" />
              %25
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 10 C 20 18, 40 12, 58 20 C 68 22, 74 18, 78 20"
                stroke="#D1D5DB"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Tamamlanan İşlemler */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-xs border border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
            <CheckCircle2 className="h-5 w-5 text-[#2D4A3E]" />
          </div>
          <span className="text-[12px] font-medium text-stone-500">
            Tamamlanan İşlemler
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight font-serif text-stone-900">
              8
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-[#4A7C68]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              %33
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="w-20 h-6">
            <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
              <path
                d="M2 18 C 18 10, 36 20, 52 14 C 64 8, 72 12, 78 8"
                stroke="#9CA3AF"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Depolama Kullanımı */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-xs border border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
            <Cloud className="h-5 w-5 text-stone-600" />
          </div>
          <span className="text-[12px] font-medium text-stone-500">
            Depolama Kullanımı
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight font-serif text-stone-900">
              68%
            </span>
            <span className="text-xs font-medium text-stone-500">
              10.2 GB / 15 GB
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-[#2D4A3E] transition-all duration-500"
              style={{ width: "68%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
