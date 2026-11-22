"use client";

import React, { useState, useSyncExternalStore } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts";
import { treatmentDistribution } from "@/lib/mock-data";
import { neutral, treatmentColors } from "@/lib/figma-tokens";

// Exact Figma Treatment Colors matching node 7:2709
const COLORS = [
  treatmentColors.dolgu,   // #2B3A31 - Dolgu (%32)
  treatmentColors.kanal,   // #5E7363 - Kanal Tedavisi (%24)
  treatmentColors.cekimi,  // #8FA393 - Diş Çekimi (%18)
  treatmentColors.protez,  // #BCC8BE - Protez (%14)
  treatmentColors.diger,   // #DCE2DC - Diğer (%12)
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

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Total case count (520 Vaka)
  const totalCases = treatmentDistribution.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div
      className="flex flex-col justify-between rounded-[20px] p-6 shadow-xs h-full"
      style={{
        backgroundColor: neutral.surface, // #FBFAF7
        border: `1px solid ${neutral.border}`, // #E6E1D8
      }}
    >
      {/* Title */}
      <h2
        className="text-xl md:text-[22px] font-normal tracking-tight font-serif mb-4"
        style={{ color: "#1C211E" }}
      >
        Tedavi Dağılımı
      </h2>

      {/* Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* Donut with Center Text: "520 Vaka" */}
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
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {treatmentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="h-full w-full flex items-center justify-center text-xs"
              style={{ color: "#8A8F89" }}
            >
              Yükleniyor...
            </div>
          )}

          {/* Donut Center Text: Figma Node 7:2709 Total Case Count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-normal font-serif leading-none transition-all"
              style={{ color: "#1C211E" }}
            >
              {activeIndex !== null ? treatmentDistribution[activeIndex].value : totalCases}
            </span>
            <span
              className="text-xs font-medium mt-1.5 transition-colors"
              style={{ color: "#5F665F" }}
            >
              {activeIndex !== null ? treatmentDistribution[activeIndex].name : "520 Vaka"}
            </span>
          </div>
        </div>

        {/* Legend List on Right matching Figma node 7:2709 */}
        <div className="flex-1 w-full space-y-2.5">
          {treatmentDistribution.map((item, index) => {
            const isHovered = activeIndex === index;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-xl transition-all cursor-pointer ${
                  isHovered ? "bg-[#EEEBE4]/60 scale-[1.02]" : "hover:bg-[#EEEBE4]/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      border:
                        COLORS[index % COLORS.length] === "#DCE2DC"
                          ? "1px solid #CFCAC0"
                          : "none",
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      color: isHovered ? "#1C211E" : "#3F4540",
                      fontWeight: isHovered ? "600" : "500",
                    }}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-mono text-[#8A8F89]"
                  >
                    {item.value} vaka
                  </span>
                  <span
                    className="font-bold min-w-[32px] text-right"
                    style={{ color: "#1C211E" }}
                  >
                    %{item.percentage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
