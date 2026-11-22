"use client";

import { useSyncExternalStore } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { treatmentDistribution } from "@/lib/mock-data";

const COLORS = [
  "#2D4A3E", // Dolgu (32%) - dark green
  "#4A7C68", // Kanal Tedavisi (24%) - medium green
  "#7A9988", // Diş Çekimi (18%) - olive sage
  "#A8C2B3", // Protez (14%) - light sage
  "#D1DCD6", // Diğer (12%) - pale sage gray
];

function subscribe() {
  return () => {};
}

export default function TreatmentDistributionChart() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-stone-200/60 h-full">
      {/* Title */}
      <h2 className="text-base font-bold text-stone-900 tracking-tight mb-4">
        Tedavi Dağılımı
      </h2>

      {/* Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Donut with Center Text */}
        <div className="relative h-44 w-44 flex items-center justify-center flex-shrink-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treatmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={74}
                  paddingAngle={2.5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {treatmentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">
              Yükleniyor...
            </div>
          )}

          {/* Donut Center Text: "182 Tedavi" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-stone-900 leading-none">
              182
            </span>
            <span className="text-[11px] font-medium text-stone-500 mt-1">
              Tedavi
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="flex-1 w-full space-y-2.5">
          {treatmentDistribution.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-stone-700 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-stone-900">
                %{item.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
