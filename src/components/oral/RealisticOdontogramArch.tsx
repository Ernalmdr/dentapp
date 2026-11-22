"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Split,
  Clock,
  CheckCircle2,
  Smile,
  Layers,
  ChevronRight,
  Columns,
  Sliders,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RealisticTooth3D } from "./RealisticTooth3D";
import { ToothInspectorModal } from "./ToothInspectorModal";

export type ViewMode = "before" | "after" | "split" | "side-by-side";
export type DentitionType = "daimi" | "sut";
export type JawFilter = "both" | "upper" | "lower";
export type WhiteningShade = "A4" | "A3" | "A2" | "A1" | "B1" | "BL1";

export interface ToothConditionRecord {
  [toothNumber: number]: {
    condition?: string;
    hasCaries?: boolean;
    hasDolgu?: boolean;
    hasFilling?: boolean;
    hasKanal?: boolean;
    hasEndo?: boolean;
    hasImplant?: boolean;
    hasCrown?: boolean;
    isMissing?: boolean;
    treatment?: string;
    notes?: string;
    shade?: string;
  };
}

export interface RealisticOdontogramArchProps {
  initialData?: ToothConditionRecord;
  selectedTooth?: number | null;
  onToothSelect?: (toothNumber: number) => void;
  onToothDoubleClick?: (toothNumber: number) => void;
  className?: string;
}

// Initial clinical dataset reflecting a realistic patient before/after simulation case
const DEFAULT_CLINICAL_DATA: ToothConditionRecord = {
  // Upper Jaw
  16: { condition: "filling", hasDolgu: true, hasFilling: true, treatment: "Oklüzal Kompozit Dolgu" },
  14: { condition: "caries", hasCaries: true, treatment: "Arayüz Çürük Tedavisi Planlandı" },
  12: { condition: "caries", hasCaries: true, treatment: "Kolesel Çürük" },
  11: { condition: "healthy", treatment: "Estetik Gülüş Tasarımı" },
  21: { condition: "healthy", treatment: "Estetik Gülüş Tasarımı" },
  25: { condition: "crown", hasCrown: true, treatment: "Zirkonyum Kron" },
  26: { condition: "endodontic", hasKanal: true, hasEndo: true, hasCrown: true, treatment: "Kanal Tedavisi + Zirkon Kron" },
  // Lower Jaw
  36: { condition: "endodontic", hasKanal: true, hasEndo: true, hasDolgu: true, treatment: "Kanal Tedavisi & Dolgu" },
  35: { condition: "caries", hasCaries: true, treatment: "Distal Çürük" },
  46: { condition: "missing", isMissing: true, treatment: "Çekilmiş Diş - İmplant Planlandı" },
  47: { condition: "filling", hasDolgu: true, hasFilling: true, treatment: "Kompozit Dolgu" },
};

export function RealisticOdontogramArch({
  initialData = DEFAULT_CLINICAL_DATA,
  selectedTooth: externalSelectedTooth,
  onToothSelect,
  onToothDoubleClick,
  className,
}: RealisticOdontogramArchProps) {
  // Tooth conditions dictionary
  const [teethData, setTeethData] = useState<ToothConditionRecord>(initialData);

  // Selected tooth
  const [internalSelectedTooth, setInternalSelectedTooth] = useState<number | null>(36);
  const activeSelectedTooth = externalSelectedTooth !== undefined ? externalSelectedTooth : internalSelectedTooth;

  // View & Simulation controls
  const [viewMode, setViewMode] = useState<ViewMode>("after"); // "before" | "after" | "split" | "side-by-side"
  const [splitPercent, setSplitPercent] = useState<number>(50); // 0 to 100 for Split Slider
  const [whiteningShade, setWhiteningShade] = useState<WhiteningShade>("B1"); // Default B1 (Estetik Beyaz)
  const [dentition, setDentition] = useState<DentitionType>("daimi");
  const [jawFilter, setJawFilter] = useState<JawFilter>("both");
  const [isCurved, setIsCurved] = useState<boolean>(true);

  // Modal Inspector State
  const [inspectorTooth, setInspectorTooth] = useState<number | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Numbering arrays (FDI Two-digit system)
  // Permanent teeth (32)
  const upperRightPerm = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeftPerm = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRightPerm = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeftPerm = [31, 32, 33, 34, 35, 36, 37, 38];

  // Primary teeth (20)
  const upperRightPrim = [55, 54, 53, 52, 51];
  const upperLeftPrim = [61, 62, 63, 64, 65];
  const lowerRightPrim = [85, 84, 83, 82, 81];
  const lowerLeftPrim = [71, 72, 73, 74, 75];

  const upperRight = dentition === "daimi" ? upperRightPerm : upperRightPrim;
  const upperLeft = dentition === "daimi" ? upperLeftPerm : upperLeftPrim;
  const lowerRight = dentition === "daimi" ? lowerRightPerm : lowerRightPrim;
  const lowerLeft = dentition === "daimi" ? lowerLeftPerm : lowerLeftPrim;

  // Progress stats calculation
  const progressStats = useMemo(() => {
    let completed = 0;
    let planned = 0;

    Object.values(teethData).forEach((item) => {
      if (item.hasDolgu || item.hasKanal || item.hasImplant || item.hasCrown || item.hasFilling) {
        completed++;
      }
      if (item.hasCaries || item.isMissing) {
        planned++;
      }
    });

    return { completed, planned };
  }, [teethData]);

  // Click & Double click handlers
  const handleToothClick = (num: number) => {
    setInternalSelectedTooth(num);
    onToothSelect?.(num);
  };

  const handleToothDoubleClick = (num: number) => {
    setInternalSelectedTooth(num);
    setInspectorTooth(num);
    setIsInspectorOpen(true);
    onToothDoubleClick?.(num);
  };

  // Treatment update handler from inspector modal
  const handleApplyTreatment = (num: number, treatmentType: string) => {
    setTeethData((prev) => {
      const current = prev[num] || {};
      const tLower = treatmentType.toLowerCase();

      let updated = { ...current, treatment: treatmentType };

      if (tLower.includes("dolgu") || tLower.includes("kompozit")) {
        updated = { ...updated, hasDolgu: true, hasFilling: true, hasCaries: false, condition: "filling" };
      } else if (tLower.includes("kanal") || tLower.includes("endo")) {
        updated = { ...updated, hasKanal: true, hasEndo: true, condition: "endodontic" };
      } else if (tLower.includes("implant")) {
        updated = { ...updated, hasImplant: true, isMissing: false, condition: "implant" };
      } else if (tLower.includes("kron") || tLower.includes("zirkon") || tLower.includes("lamina") || tLower.includes("kaplama")) {
        updated = { ...updated, hasCrown: true, hasCaries: false, condition: "crown" };
      }

      return {
        ...prev,
        [num]: updated,
      };
    });
  };

  // Tooth mode calculation for split slider
  const getToothSimulationMode = (
    toothIndexInRow: number,
    totalInRow: number,
    forcedMode?: "before" | "after"
  ): "before" | "after" => {
    if (forcedMode) return forcedMode;
    if (viewMode === "before") return "before";
    if (viewMode === "after") return "after";
    if (viewMode === "split") {
      const toothPercent = ((toothIndexInRow + 0.5) / totalInRow) * 100;
      return toothPercent <= splitPercent ? "before" : "after";
    }
    return "after";
  };

  // Anatomical parabolic gingival curvature calculations
  const getCurveOffset = (index: number, total: number, isUpperJaw: boolean) => {
    if (!isCurved) return { y: 0, rot: 0 };
    // Center teeth (closest to midline) dip slightly, posterior molars elevate
    const distFromCenter = Math.abs(index - (total - 1) / 2) / (total / 2);
    const parabola = Math.pow(distFromCenter, 2);

    const y = isUpperJaw ? parabola * 16 : parabola * -16;
    const rot = (index - total / 2) * (isUpperJaw ? 1.4 : -1.4);

    return { y, rot };
  };

  // Render a single dental arch quadrant
  const renderArchRow = (
    teethList: number[],
    isUpper: boolean,
    offsetStartX: number,
    totalRowTeeth: number,
    forcedMode?: "before" | "after"
  ) => {
    return teethList.map((toothNum, idx) => {
      const globalIdx = offsetStartX + idx;
      const toothMode = getToothSimulationMode(globalIdx, totalRowTeeth, forcedMode);
      const cond = teethData[toothNum];
      const curve = getCurveOffset(idx, teethList.length, isUpper);

      // Determine whitening effect
      const isWhitened = toothMode === "after" && (whiteningShade === "B1" || whiteningShade === "BL1");

      return (
        <div
          key={toothNum}
          style={{
            transform: isCurved ? `translateY(${curve.y}px) rotate(${curve.rot}deg)` : undefined,
            transition: "transform 0.3s ease, filter 0.3s ease",
            filter: isWhitened ? "brightness(1.05) contrast(1.02)" : undefined,
          }}
          className="relative"
        >
          <RealisticTooth3D
            num={toothNum}
            isUpper={isUpper}
            status={{
              ...cond,
              shade: whiteningShade,
            }}
            isSelected={activeSelectedTooth === toothNum}
            mode={toothMode}
            onClick={() => handleToothClick(toothNum)}
            onDoubleClick={() => handleToothDoubleClick(toothNum)}
          />
        </div>
      );
    });
  };

  // Render full dental arch (Maksilla + Mandibula)
  const renderDentalArch = (forcedMode?: "before" | "after", isCompact = false) => {
    const totalUpper = upperRight.length + upperLeft.length;
    const totalLower = lowerRight.length + lowerLeft.length;

    return (
      <div className={cn("flex flex-col items-center gap-6 w-full", isCompact && "scale-95 origin-top")}>
        {/* ======================================================== */}
        {/* UPPER JAW / MAKSİLLA                                     */}
        {/* ======================================================== */}
        {(jawFilter === "both" || jawFilter === "upper") && (
          <div className="relative w-full flex flex-col items-center">
            {/* Header label */}
            <div className="mb-2 flex items-center justify-between w-full max-w-4xl px-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Üst Sağ (1. Bölge)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1F3327]/10 dark:bg-[#76D28F]/15 text-[#1F3327] dark:text-[#76D28F] font-extrabold text-[11px] shadow-2xs">
                ÜST ÇENE (MAKSİLLA)
              </span>
              <span className="flex items-center gap-1.5">
                Üst Sol (2. Bölge)
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>

            {/* Natural Gingival Arch (Pembe Zarif Diş Eti Kavis Hattı) */}
            <div className="relative w-full flex items-end justify-center pt-5 pb-2">
              {/* Gingival Arch SVG Background ribbon */}
              <div className="absolute inset-x-6 top-1 h-14 pointer-events-none opacity-45 dark:opacity-25 transition-opacity">
                <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="upperGingivalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10,8 C 220,44 580,44 790,8 L 790,3 C 580,32 220,32 10,3 Z"
                    fill="url(#upperGingivalGrad)"
                  />
                </svg>
              </div>

              {/* Upper Teeth Quadrants */}
              <div className="relative z-10 flex items-end justify-center gap-1 sm:gap-2">
                {/* 1. Quadrant (Upper Right: 18 -> 11) */}
                <div className="flex items-end gap-0.5 sm:gap-1.5">
                  {renderArchRow(upperRight, true, 0, totalUpper, forcedMode)}
                </div>

                {/* Midline Divider */}
                <div className="mx-1 sm:mx-2 h-20 w-0.5 border-r border-dashed border-[#1F3327]/30 dark:border-[#76D28F]/40 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-zinc-400 bg-white/90 dark:bg-zinc-800 px-1 rounded shadow-2xs">
                    Mid
                  </span>
                </div>

                {/* 2. Quadrant (Upper Left: 21 -> 28) */}
                <div className="flex items-end gap-0.5 sm:gap-1.5">
                  {renderArchRow(upperLeft, true, upperRight.length, totalUpper, forcedMode)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Occlusal Plane separator line */}
        <div className="relative w-full max-w-3xl flex items-center justify-center my-0.5">
          <div className="w-full border-b border-dashed border-zinc-300 dark:border-zinc-700/80" />
          <div className="absolute px-3 py-0.5 bg-white/90 dark:bg-[#1B2B22]/90 rounded-full border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold tracking-widest uppercase text-zinc-500 shadow-2xs">
            Oklüzal Düzlem
          </div>
        </div>

        {/* ======================================================== */}
        {/* LOWER JAW / MANDİBULA                                    */}
        {/* ======================================================== */}
        {(jawFilter === "both" || jawFilter === "lower") && (
          <div className="relative w-full flex flex-col items-center">
            {/* Natural Gingival Arch - Lower Gum */}
            <div className="relative w-full flex items-start justify-center pt-2 pb-5">
              {/* Gingival Arch SVG Lower Background ribbon */}
              <div className="absolute inset-x-6 bottom-1 h-14 pointer-events-none opacity-45 dark:opacity-25 transition-opacity">
                <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="lowerGingivalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#F43F5E" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10,52 C 220,16 580,16 790,52 L 790,57 C 580,28 220,28 10,57 Z"
                    fill="url(#lowerGingivalGrad)"
                  />
                </svg>
              </div>

              {/* Lower Teeth Quadrants */}
              <div className="relative z-10 flex items-start justify-center gap-1 sm:gap-2">
                {/* 4. Quadrant (Lower Right: 48 -> 41) */}
                <div className="flex items-start gap-0.5 sm:gap-1.5">
                  {renderArchRow(lowerRight, false, 0, totalLower, forcedMode)}
                </div>

                {/* Midline Divider */}
                <div className="mx-1 sm:mx-2 h-20 w-0.5 border-r border-dashed border-[#1F3327]/30 dark:border-[#76D28F]/40 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-zinc-400 bg-white/90 dark:bg-zinc-800 px-1 rounded shadow-2xs">
                    Mid
                  </span>
                </div>

                {/* 3. Quadrant (Lower Left: 31 -> 38) */}
                <div className="flex items-start gap-0.5 sm:gap-1.5">
                  {renderArchRow(lowerLeft, false, lowerRight.length, totalLower, forcedMode)}
                </div>
              </div>
            </div>

            {/* Footer label */}
            <div className="mt-2 flex items-center justify-between w-full max-w-4xl px-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Alt Sağ (4. Bölge)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1F3327]/10 dark:bg-[#76D28F]/15 text-[#1F3327] dark:text-[#76D28F] font-extrabold text-[11px] shadow-2xs">
                ALT ÇENE (MANDİBULA)
              </span>
              <span className="flex items-center gap-1.5">
                Alt Sol (3. Bölge)
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isUpperJaw = activeSelectedTooth ? (activeSelectedTooth < 30 || (activeSelectedTooth >= 50 && activeSelectedTooth <= 69)) : true;

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-[#E6E1D8] bg-[#FBFAF7] shadow-sm dark:border-[#243B2F] dark:bg-[#15221B] overflow-hidden transition-all",
        className
      )}
    >
      {/* ============================================================ */}
      {/* 1. ÜST KONTROL ÇUBUĞU (TOP TOOLBAR)                          */}
      {/* ============================================================ */}
      <div className="border-b border-[#E6E1D8] bg-white/80 p-4 dark:border-[#243B2F] dark:bg-[#1B2B22]/80 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Sol Kısım: Öncesi / Sonrası / Karşılaştırma + Beyazlatma Skalası */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Öncesi / Sonrası / Split Switcher */}
            <div className="flex items-center rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] p-1 dark:border-[#243B2F] dark:bg-[#1A2C23]">
              <button
                type="button"
                onClick={() => setViewMode("before")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "before"
                    ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#285A3B]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Mevcut Durum (Öncesi)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("after")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "after"
                    ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#285A3B]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>İşlem Sonrası (Simülasyon)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "split"
                    ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#285A3B]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                <Split className="h-3.5 w-3.5" />
                <span>Split Slider</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("side-by-side")}
                className={cn(
                  "hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  viewMode === "side-by-side"
                    ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#285A3B]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                )}
                title="Yan Yana Karşılaştırma"
              >
                <Columns className="h-3.5 w-3.5" />
                <span>Yan Yana</span>
              </button>
            </div>

            {/* Gülüş Beyazlatma Skalası Simülatörü */}
            <div className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-3 py-1.5 dark:border-[#243B2F] dark:bg-[#16231C]">
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Smile className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Beyazlatma:</span>
              </span>

              {/* Doğal Ton (A3) ↔ Estetik Beyaz (B1 / Bleach) Geçiş Butonu */}
              <button
                type="button"
                onClick={() =>
                  setWhiteningShade((prev) =>
                    prev === "B1" || prev === "BL1" ? "A3" : "B1"
                  )
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer",
                  whiteningShade === "B1" || whiteningShade === "BL1"
                    ? "border-sky-500 bg-sky-50 text-sky-800 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-300 shadow-2xs"
                    : "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-300"
                )}
                title="Doğal Ton (A3) ile Estetik Beyaz (B1 / Bleach) arasında hızlı geçiş"
              >
                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                <span>
                  {whiteningShade === "B1" || whiteningShade === "BL1"
                    ? "Estetik Beyaz (B1 / Bleach)"
                    : "Doğal Ton (A3)"}
                </span>
              </button>

              {/* Shade scale chips */}
              <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-zinc-200 dark:border-zinc-700">
                {(["A3", "A2", "A1", "B1", "BL1"] as WhiteningShade[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setWhiteningShade(s)}
                    className={cn(
                      "h-6 px-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border",
                      whiteningShade === s
                        ? "border-[#1F3327] bg-[#1F3327] text-white dark:border-[#76D28F] dark:bg-[#285A3B]"
                        : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kısım: Tedavi İlerleme Rozeti + Daimi/Süt + Kavis Kontrolü */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tedavi İlerleme Rozeti */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50/90 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Tamamlanan: {progressStats.completed} Diş</span>
              <span className="text-emerald-400 dark:text-emerald-600">•</span>
              <span className="text-amber-800 dark:text-amber-300">Planlanan: {progressStats.planned} Diş</span>
              {viewMode !== "before" && (
                <>
                  <span className="text-emerald-400 dark:text-emerald-600">•</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Simülasyon Aktif
                  </span>
                </>
              )}
            </div>

            {/* Daimi / Süt Dişleri Switcher */}
            <div className="flex items-center rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] p-1 dark:border-[#243B2F] dark:bg-[#1A2C23]">
              <button
                type="button"
                onClick={() => setDentition("daimi")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer",
                  dentition === "daimi"
                    ? "bg-[#1F3327] text-white shadow-2xs dark:bg-[#285A3B]"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                Daimi (32)
              </button>
              <button
                type="button"
                onClick={() => setDentition("sut")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer",
                  dentition === "sut"
                    ? "bg-[#1F3327] text-white shadow-2xs dark:bg-[#285A3B]"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                Süt (20)
              </button>
            </div>

            {/* Gingival Arch Kavis Aç/Kapat */}
            <button
              type="button"
              onClick={() => setIsCurved((prev) => !prev)}
              className={cn(
                "hidden sm:flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer dark:border-[#243B2F]",
                isCurved
                  ? "bg-[#1F3327]/10 text-[#1F3327] dark:bg-[#76D28F]/20 dark:text-[#76D28F]"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-[#1B2B22] dark:text-zinc-400"
              )}
              title="Doğal Anatomik Kavisli Ark Görünümünü Aç/Kapat"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isCurved ? "Anatomik Kavis" : "Düz Tablo"}</span>
            </button>
          </div>
        </div>

        {/* Split Slider Interactive Control Handle */}
        {viewMode === "split" && (
          <div className="mt-3.5 pt-3 border-t border-dashed border-[#E6E1D8] dark:border-[#243B2F] flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-xl animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" /> Öncesi (%{100 - splitPercent})
              </span>
              <span className="text-zinc-400">↔</span>
              <span className="flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" /> Sonrası (%{splitPercent})
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-1/2">
              <span className="text-[11px] font-bold text-zinc-500">Mevcut</span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitPercent}
                onChange={(e) => setSplitPercent(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#1F3327] dark:bg-zinc-700 dark:accent-[#76D28F]"
              />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Simülasyon</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. STÜDYO AYDINLATMALI TAM ÇENE ARKI ALANI                   */}
      {/* ============================================================ */}
      <div className="relative w-full overflow-x-auto p-4 sm:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#FAF7F2] to-[#EFECE6] dark:from-[#1E3026]/90 dark:via-[#15221B] dark:to-[#0E1712]">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Central Studio Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Normal Arch or Side-by-Side Dual View */}
        {viewMode === "side-by-side" ? (
          <div className="relative min-w-[900px] grid grid-cols-2 gap-8 py-2">
            {/* Left: Before */}
            <div className="rounded-xl border border-amber-300/60 bg-amber-50/20 p-4 dark:border-amber-700/40 dark:bg-amber-950/10">
              <div className="mb-4 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5" /> İşlem Öncesi (Mevcut Durum)
                </span>
              </div>
              {renderDentalArch("before", true)}
            </div>

            {/* Right: After */}
            <div className="rounded-xl border border-emerald-400/60 bg-emerald-50/20 p-4 dark:border-emerald-700/40 dark:bg-emerald-950/10">
              <div className="mb-4 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> İşlem Sonrası (Simülasyon & {whiteningShade})
                </span>
              </div>
              {renderDentalArch("after", true)}
            </div>
          </div>
        ) : (
          <div className="relative min-w-[760px] max-w-5xl mx-auto py-2">
            {renderDentalArch()}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. ALT LEJANT & HIZLI İŞLEM PANELİ                           */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E6E1D8] bg-white px-5 py-3 text-xs dark:border-[#243B2F] dark:bg-[#1B2B22]">
        {/* Klinik Renk Lejantı */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-zinc-400">Lejant:</span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Dolgu
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Kanal Tedavisi
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" /> İmplant
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Zirkonyum Kron
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Çürük / Lezyon
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" /> Eksik Diş
          </span>
        </div>

        {/* Seçili Diş Bilgisi ve Çift Tıklama İpucu */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden md:inline">
            (Dişe çift tıklayarak 3D Detay Modalı açabilirsiniz)
          </span>
          {activeSelectedTooth && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 dark:text-zinc-300">
                Seçili: <strong className="text-[#1F3327] dark:text-[#76D28F]">#{activeSelectedTooth}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setInspectorTooth(activeSelectedTooth);
                  setIsInspectorOpen(true);
                }}
                className="flex items-center gap-1 rounded-lg bg-[#1F3327] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#285A3B] transition-all cursor-pointer dark:bg-[#285A3B] dark:hover:bg-[#34784E]"
              >
                <span>İncele</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TOOTH INSPECTOR MODAL ENTEGRASYONU                         */}
      {/* ============================================================ */}
      <ToothInspectorModal
        isOpen={isInspectorOpen}
        toothNumber={inspectorTooth}
        isUpper={isUpperJaw}
        status={inspectorTooth ? teethData[inspectorTooth] : undefined}
        onClose={() => setIsInspectorOpen(false)}
        onApplyTreatment={handleApplyTreatment}
      />
    </div>
  );
}

export default RealisticOdontogramArch;
