"use client";

import React, { useState } from "react";
import { monthlyData } from "@/lib/mock-data";
import { green, neutral, status as statusTokens } from "@/lib/figma-tokens";

type TimeRangeFilter = "Yıllık" | "Aylık" | "Haftalık";

export default function MonthlyClinicChart() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TimeRangeFilter>("Aylık");

  // Maximum value for scaling (highest randevu is 236 in Eki)
  const maxVal = 250;

  return (
    <div
      className="flex flex-col justify-between rounded-[20px] p-6 shadow-xs h-full bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
    >
      {/* 1. Header: Title & Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2
          className="text-xl md:text-[22px] font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
        >
          Aylık Klinik Özeti
        </h2>

        {/* Filter buttons: "Yıllık", "Aylık", "Haftalık" (Figma seçili stili: #1F3327 aktif) */}
        <div
          className="inline-flex items-center p-1 rounded-xl self-start sm:self-auto bg-[#EEEBE4] border border-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F]"
        >
          {(["Yıllık", "Aylık", "Haftalık"] as TimeRangeFilter[]).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1F3327] dark:bg-[#233C2F] text-white shadow-xs"
                    : "bg-transparent text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-[#ECF3EE]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Legend / Metric Summary Row */}
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap pb-4 mb-2 border-b border-[#ECE8E1] dark:border-[#243B2F]">
        {/* Randevu */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 bg-[#1F3327] dark:bg-[#3F8F55]"
          />
          <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Randevu:
          </span>
          <span className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
            236
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EEDD] text-[#2C6A3B] border border-[#C9DDC3] dark:bg-[#1A3324] dark:text-[#4ADE80] dark:border-[#2D5A3C]"
          >
            +%18
          </span>
        </div>

        {/* Tedavi */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 bg-[#B7C4B9] dark:bg-[#5E7363]"
          />
          <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Tedavi:
          </span>
          <span className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
            182
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EEDD] text-[#2C6A3B] border border-[#C9DDC3] dark:bg-[#1A3324] dark:text-[#4ADE80] dark:border-[#2D5A3C]"
          >
            +%12
          </span>
        </div>

        {/* Yeni Hasta */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 bg-[#EDEAE4] border border-[#CFCAC0] dark:bg-[#1A2B21] dark:border-[#243B2F]"
          />
          <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            Yeni Hasta:
          </span>
          <span className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
            46
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EEDD] text-[#2C6A3B] border border-[#C9DDC3] dark:bg-[#1A3324] dark:text-[#4ADE80] dark:border-[#2D5A3C]"
          >
            +%35
          </span>
        </div>
      </div>

      {/* 3. Figma 12-Month Capsule Bar Chart (Node 7:2665) */}
      <div className="relative pt-4 pb-1 overflow-x-auto">
        <div className="min-w-[460px] sm:min-w-0 grid grid-cols-12 gap-1.5 sm:gap-2.5 items-end h-44 sm:h-48">
          {monthlyData.map((item) => {
            const isCurrentMonth = item.month === "Eki";
            // Calculate proportional height
            const fillHeightPct = item.randevu > 0 ? Math.round((item.randevu / maxVal) * 100) : 0;
            const isHovered = hoveredMonth === item.month;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="relative flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Floating Tooltip on Hover */}
                {isHovered && (
                  <div
                    className="absolute -top-16 z-30 flex flex-col items-center px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 bg-[#1F3327] dark:bg-[#182820] text-white border border-[#34483B] dark:border-[#243B2F]"
                  >
                    <span className="text-[11px] font-bold text-[#B7C4B9] dark:text-[#9AB395]">
                      {item.month} 2026
                    </span>
                    <span className="text-[10px] text-white">
                      {item.randevu > 0
                        ? `${item.randevu} Randevu • ${item.tedavi} Tedavi`
                        : "Planlanan Randevu Yok"}
                    </span>
                    {/* Tooltip triangle */}
                    <div
                      className="absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1F3327] dark:border-t-[#182820]"
                    />
                  </div>
                )}

                {/* Capsule / Track Bar */}
                <div
                  className="w-full max-w-[34px] h-full rounded-[10px] overflow-hidden flex flex-col justify-end transition-all duration-200 group-hover:scale-y-[1.02] bg-[#EDEAE4] dark:bg-[#1A2B21]"
                >
                  {/* Filled Inner Bar */}
                  {fillHeightPct > 0 && (
                    <div
                      className={`w-full rounded-[10px] transition-all duration-500 ease-out ${
                        isCurrentMonth ? "bg-[#1F3327] dark:bg-[#3F8F55]" : "bg-[#B7C4B9] dark:bg-[#2E4839]"
                      }`}
                      style={{
                        height: `${fillHeightPct}%`,
                      }}
                    />
                  )}
                </div>

                {/* Month Label */}
                <span
                  className={`text-[11px] sm:text-xs mt-2.5 transition-colors ${
                    isCurrentMonth ? "text-[#1C211E] dark:text-[#ECF3EE] font-bold" : "text-[#5F665F] dark:text-[#A2B5A8] font-medium"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
