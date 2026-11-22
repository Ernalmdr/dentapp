"use client";

import { useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { monthlyData } from "@/lib/mock-data";

function subscribe() {
  return () => {};
}

export default function MonthlyClinicChart() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-stone-200/60 h-full">
      {/* Header and Legend/Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight">
            Aylık Klinik Özeti
          </h2>
        </div>

        {/* Legend Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Randevu */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2D4A3E]" />
            <span className="text-xs text-stone-500">Randevu</span>
            <span className="text-xs font-bold text-stone-900">236</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              %18
            </span>
          </div>

          {/* Tedavi */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4A7C68]" />
            <span className="text-xs text-stone-500">Tedavi</span>
            <span className="text-xs font-bold text-stone-900">182</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              %12
            </span>
          </div>

          {/* Yeni Hasta */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#A3B8AD]" />
            <span className="text-xs text-stone-500">Yeni Hasta</span>
            <span className="text-xs font-bold text-stone-900">46</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              %35
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-48 w-full mt-2">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              barGap={3}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2E26",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#A0B8AD" }}
                formatter={(value, name) => {
                  const labelMap: Record<string, string> = {
                    randevu: "Randevu",
                    tedavi: "Tedavi",
                    yeniHasta: "Yeni Hasta",
                  };
                  return [String(value ?? 0), labelMap[String(name ?? "")] || String(name ?? "")];
                }}
              />
              <Bar
                dataKey="randevu"
                fill="#2D4A3E"
                radius={[3, 3, 0, 0]}
                barSize={9}
              />
              <Bar
                dataKey="tedavi"
                fill="#4A7C68"
                radius={[3, 3, 0, 0]}
                barSize={9}
              />
              <Bar
                dataKey="yeniHasta"
                fill="#A3B8AD"
                radius={[3, 3, 0, 0]}
                barSize={9}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">
            Yükleniyor...
          </div>
        )}
      </div>
    </div>
  );
}
