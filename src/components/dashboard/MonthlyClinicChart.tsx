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
      className="flex flex-col justify-between rounded-[20px] p-6 shadow-xs h-full"
      style={{
        backgroundColor: neutral.surface, // #FBFAF7
        border: `1px solid ${neutral.border}`, // #E6E1D8
      }}
    >
      {/* 1. Header: Title & Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2
          className="text-xl md:text-[22px] font-normal tracking-tight font-serif"
          style={{ color: "#1C211E" }}
        >
          Aylık Klinik Özeti
        </h2>

        {/* Filter buttons: "Yıllık", "Aylık", "Haftalık" (Figma seçili stili: #1F3327 aktif) */}
        <div
          className="inline-flex items-center p-1 rounded-xl self-start sm:self-auto"
          style={{
            backgroundColor: neutral.soft, // #EEEBE4
            border: `1px solid ${neutral.border}`, // #E6E1D8
          }}
        >
          {(["Yıllık", "Aylık", "Haftalık"] as TimeRangeFilter[]).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive ? green[800] : "transparent", // #1F3327
                  color: isActive ? "#FFFFFF" : "#5F665F",
                  boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Legend / Metric Summary Row */}
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap pb-4 mb-2 border-b border-[#ECE8E1]">
        {/* Randevu */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: green[800] }} // #1F3327
          />
          <span className="text-xs font-medium" style={{ color: "#5F665F" }}>
            Randevu:
          </span>
          <span className="text-xs font-bold" style={{ color: "#1C211E" }}>
            236
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{
              backgroundColor: statusTokens.success.bg, // #E2EEDD
              color: statusTokens.success.text, // #2C6A3B
              border: `1px solid ${green[200]}`, // #C9DDC3
            }}
          >
            +%18
          </span>
        </div>

        {/* Tedavi */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: green[300] }} // #B7C4B9
          />
          <span className="text-xs font-medium" style={{ color: "#5F665F" }}>
            Tedavi:
          </span>
          <span className="text-xs font-bold" style={{ color: "#1C211E" }}>
            182
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{
              backgroundColor: statusTokens.success.bg, // #E2EEDD
              color: statusTokens.success.text, // #2C6A3B
              border: `1px solid ${green[200]}`, // #C9DDC3
            }}
          >
            +%12
          </span>
        </div>

        {/* Yeni Hasta */}
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{
              backgroundColor: neutral.track, // #EDEAE4
              border: `1px solid ${neutral.borderStrong}`, // #CFCAC0
            }}
          />
          <span className="text-xs font-medium" style={{ color: "#5F665F" }}>
            Yeni Hasta:
          </span>
          <span className="text-xs font-bold" style={{ color: "#1C211E" }}>
            46
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{
              backgroundColor: statusTokens.success.bg, // #E2EEDD
              color: statusTokens.success.text, // #2C6A3B
              border: `1px solid ${green[200]}`, // #C9DDC3
            }}
          >
            +%35
          </span>
        </div>
      </div>

      {/* 3. Figma 12-Month Capsule Bar Chart (Node 7:2665) */}
      <div className="relative pt-4 pb-1">
        <div className="grid grid-cols-12 gap-1.5 sm:gap-2.5 items-end h-44 sm:h-48">
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
                    className="absolute -top-16 z-30 flex flex-col items-center px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: green[800], // #1F3327
                      color: "#FFFFFF",
                      border: `1px solid ${green[600]}`, // #34483B
                    }}
                  >
                    <span className="text-[11px] font-bold text-[#B7C4B9]">
                      {item.month} 2026
                    </span>
                    <span className="text-[10px] text-white">
                      {item.randevu > 0
                        ? `${item.randevu} Randevu • ${item.tedavi} Tedavi`
                        : "Planlanan Randevu Yok"}
                    </span>
                    {/* Tooltip triangle */}
                    <div
                      className="absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-4"
                      style={{ borderTopColor: green[800] }}
                    />
                  </div>
                )}

                {/* Capsule / Track Bar */}
                <div
                  className="w-full max-w-[34px] h-full rounded-[10px] overflow-hidden flex flex-col justify-end transition-all duration-200 group-hover:scale-y-[1.02]"
                  style={{
                    backgroundColor: neutral.track, // #EDEAE4
                  }}
                >
                  {/* Filled Inner Bar */}
                  {fillHeightPct > 0 && (
                    <div
                      className="w-full rounded-[10px] transition-all duration-500 ease-out"
                      style={{
                        height: `${fillHeightPct}%`,
                        backgroundColor: isCurrentMonth ? green[800] : green[300], // Eki: #1F3327, Others: #B7C4B9
                      }}
                    />
                  )}
                </div>

                {/* Month Label */}
                <span
                  className="text-[11px] sm:text-xs mt-2.5 transition-colors"
                  style={{
                    color: isCurrentMonth ? "#1C211E" : "#5F665F",
                    fontWeight: isCurrentMonth ? "700" : "500",
                  }}
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
