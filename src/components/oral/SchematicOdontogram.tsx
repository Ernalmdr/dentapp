"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TreatmentRecord } from "@/lib/types";

// Types
export type ToothType = "incisor" | "canine" | "premolar" | "molar";

export type ClinicalStatus =
  | "saglam"
  | "dolgu"
  | "kanal"
  | "implant"
  | "eksik"
  | "curuk";

export interface ToothClinicalData {
  toothNo: number;
  type: ToothType;
  status: ClinicalStatus;
  ppd: number; // Periodontal Pocket Depth in mm (1-9)
  mobility: 0 | 1 | 2 | 3; // Mobility score
  diagnosisTags: string[];
  vitality: "vital" | "devital";
  furcation?: number; // 0-3 for molars
  notes?: string;
}

export interface SchematicOdontogramProps {
  selectedTooth: number | null;
  onToothSelect?: (toothNo: number) => void;
  onSelectTooth?: (toothNo: number) => void;
  onClick?: (toothNo: number) => void;
  records?: TreatmentRecord[];
  dentitionType?: "daimi" | "sut";
  diffDiagnosis?: boolean;
  onInspectTooth?: (toothNo: number) => void;
  className?: string;
}

// Helper to determine tooth category
export function getToothType(num: number): ToothType {
  const lastDigit = num % 10;
  if (lastDigit === 6 || lastDigit === 7 || lastDigit === 8) return "molar";
  if (lastDigit === 4 || lastDigit === 5) return "premolar";
  if (lastDigit === 3) return "canine";
  return "incisor";
}

// Tooth Type Turkish Label
export function getToothTypeLabel(type: ToothType): string {
  switch (type) {
    case "incisor":
      return "Kesici";
    case "canine":
      return "Kanin";
    case "premolar":
      return "Premolar";
    case "molar":
      return "Molar";
  }
}

// SVG Icons for tooth types
function ToothTypeIcon({ type, className }: { type: ToothType; className?: string }) {
  switch (type) {
    case "incisor":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("w-4 h-4", className)}
        >
          <title>Kesici Diş</title>
          {/* Incisor straight chisel edge */}
          <path d="M7 3h10v6a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5V3z" />
          <path d="M10 14v7" />
          <path d="M14 14v7" />
        </svg>
      );
    case "canine":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("w-4 h-4", className)}
        >
          <title>Kanin (Köpek Dişi)</title>
          {/* Canine pointed cusp */}
          <path d="M12 2l5 7v5a5 5 0 0 1-5 5 5 5 0 0 1-5-5V9l5-7z" />
          <path d="M12 19v3" />
        </svg>
      );
    case "premolar":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("w-4 h-4", className)}
        >
          <title>Küçük Azı (Premolar)</title>
          {/* Premolar dual cusps */}
          <path d="M7 5c1-2 4-2 5 0c1-2 4-2 5 0v7a5 5 0 0 1-5 5 5 5 0 0 1-5-5V5z" />
          <path d="M9.5 17v4" />
          <path d="M14.5 17v4" />
        </svg>
      );
    case "molar":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("w-4 h-4", className)}
        >
          <title>Büyük Azı (Molar)</title>
          {/* Molar multi-cusp crown */}
          <rect x="5" y="4" width="14" height="10" rx="3" />
          <path d="M9 4v3" />
          <path d="M15 4v3" />
          <path d="M8 14v7" />
          <path d="M12 14v7" />
          <path d="M16 14v7" />
        </svg>
      );
  }
}

// Status definitions & badges
const STATUS_CONFIG: Record<
  ClinicalStatus,
  {
    label: string;
    bgLight: string;
    textLight: string;
    borderLight: string;
    bgDark: string;
    textDark: string;
    borderDark: string;
    dotColor: string;
  }
> = {
  saglam: {
    label: "Sağlam",
    bgLight: "bg-[#E2EEDD]",
    textLight: "text-[#2C6A3B]",
    borderLight: "border-[#C5D6C0]",
    bgDark: "dark:bg-[#1A3324]",
    textDark: "dark:text-[#76D28F]",
    borderDark: "dark:border-[#28523A]",
    dotColor: "bg-[#3F8F55]",
  },
  dolgu: {
    label: "Dolgu",
    bgLight: "bg-[#E3ECF7]",
    textLight: "text-[#2C5282]",
    borderLight: "border-[#C3D7EE]",
    bgDark: "dark:bg-[#16273B]",
    textDark: "dark:text-[#93C5FD]",
    borderDark: "dark:border-[#203D5E]",
    dotColor: "bg-[#2C5282]",
  },
  kanal: {
    label: "Kanal",
    bgLight: "bg-[#F3EADB]",
    textLight: "text-[#7A5320]",
    borderLight: "border-[#E5D2BA]",
    bgDark: "dark:bg-[#2F2414]",
    textDark: "dark:text-[#FCD34D]",
    borderDark: "dark:border-[#523E1E]",
    dotColor: "bg-[#B07D47]",
  },
  implant: {
    label: "İmplant",
    bgLight: "bg-[#DDEBD8]",
    textLight: "text-[#1F3327]",
    borderLight: "border-[#B7C4B9]",
    bgDark: "dark:bg-[#163321]",
    textDark: "dark:text-[#A7F3D0]",
    borderDark: "dark:border-[#285A3B]",
    dotColor: "bg-[#2F5A3D]",
  },
  eksik: {
    label: "Eksik",
    bgLight: "bg-[#ECEAE5]",
    textLight: "text-[#5F665F]",
    borderLight: "border-[#D8D4CC]",
    bgDark: "dark:bg-[#1D3328]",
    textDark: "dark:text-[#A2B5A8]",
    borderDark: "dark:border-[#2A4436]",
    dotColor: "bg-[#7C817C]",
  },
  curuk: {
    label: "Çürük",
    bgLight: "bg-[#FBE9E7]",
    textLight: "text-[#B3261E]",
    borderLight: "border-[#F3D0CC]",
    bgDark: "dark:bg-[#3D1D1C]",
    textDark: "dark:text-[#FCA5A5]",
    borderDark: "dark:border-[#5E2B2A]",
    dotColor: "bg-[#B3261E]",
  },
};

// Mock base clinical records for teeth not in active records
const DEFAULT_DIAGNOSES: Record<number, Partial<ToothClinicalData>> = {
  36: {
    status: "kanal",
    ppd: 4,
    mobility: 1,
    diagnosisTags: ["Kanal Tedavisi", "Periapikal Lezyon"],
    vitality: "devital",
  },
  16: {
    status: "dolgu",
    ppd: 3,
    mobility: 0,
    diagnosisTags: ["Kompozit Dolgu (MOD)"],
    vitality: "vital",
  },
  25: {
    status: "implant",
    ppd: 2,
    mobility: 0,
    diagnosisTags: ["Titanium İmplant", "Zirkon Kuron"],
    vitality: "devital",
  },
  14: {
    status: "curuk",
    ppd: 3,
    mobility: 0,
    diagnosisTags: ["Oklüzal Çürük"],
    vitality: "vital",
  },
  18: {
    status: "eksik",
    ppd: 0,
    mobility: 0,
    diagnosisTags: ["Gömülü Çekim"],
    vitality: "devital",
  },
  48: {
    status: "eksik",
    ppd: 0,
    mobility: 0,
    diagnosisTags: ["Eksik Diş"],
    vitality: "devital",
  },
  46: {
    status: "dolgu",
    ppd: 3,
    mobility: 0,
    diagnosisTags: ["Kompozit Dolgu (O)"],
    vitality: "vital",
  },
  11: {
    status: "saglam",
    ppd: 2,
    mobility: 0,
    diagnosisTags: ["Sağlam", "Estetik Lamina Adayı"],
    vitality: "vital",
  },
  21: {
    status: "saglam",
    ppd: 2,
    mobility: 0,
    diagnosisTags: ["Sağlam"],
    vitality: "vital",
  },
};

export default function SchematicOdontogram({
  selectedTooth,
  onToothSelect,
  onSelectTooth,
  onClick,
  records = [],
  dentitionType = "daimi",
  diffDiagnosis = false,
  onInspectTooth,
  className,
}: SchematicOdontogramProps) {
  // Handle flexible selection callback
  const handleSelect = (toothNo: number) => {
    if (onToothSelect) onToothSelect(toothNo);
    else if (onSelectTooth) onSelectTooth(toothNo);
    else if (onClick) onClick(toothNo);
  };

  // Quadrant active filter state (All or specific quadrant)
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<
    "all" | 1 | 2 | 3 | 4
  >("all");

  // Derive clinical data for all teeth merging mock data and active patient treatment records
  const teethDataMap = useMemo(() => {
    const map = new Map<number, ToothClinicalData>();

    // Standard FDI range 11-48
    const permanentNumbers = [
      ...[18, 17, 16, 15, 14, 13, 12, 11],
      ...[21, 22, 23, 24, 25, 26, 27, 28],
      ...[31, 32, 33, 34, 35, 36, 37, 38],
      ...[41, 42, 43, 44, 45, 46, 47, 48],
    ];

    // Primary numbers 51-85
    const primaryNumbers = [
      ...[55, 54, 53, 52, 51],
      ...[61, 62, 63, 64, 65],
      ...[71, 72, 73, 74, 75],
      ...[81, 82, 83, 84, 85],
    ];

    const targetNumbers =
      dentitionType === "daimi" ? permanentNumbers : primaryNumbers;

    targetNumbers.forEach((num) => {
      const type = getToothType(num);
      const defaultInfo = DEFAULT_DIAGNOSES[num] || {};

      // Check matching records in patient's active treatments
      const matchingRecords = records.filter((r) => r.toothNo === num);

      let status: ClinicalStatus = defaultInfo.status || "saglam";
      const tags: string[] = defaultInfo.diagnosisTags
        ? [...defaultInfo.diagnosisTags]
        : [];

      if (matchingRecords.length > 0) {
        matchingRecords.forEach((rec) => {
          const tLower = rec.treatment.toLowerCase();
          if (tLower.includes("kanal")) {
            status = "kanal";
            if (!tags.includes("Kanal Tedavisi")) tags.unshift("Kanal Tedavisi");
          } else if (tLower.includes("dolgu") || tLower.includes("kompozit")) {
            status = "dolgu";
            if (!tags.includes("Dolgu")) tags.unshift("Dolgu");
          } else if (tLower.includes("implant")) {
            status = "implant";
            if (!tags.includes("İmplant")) tags.unshift("İmplant");
          } else if (tLower.includes("çekim") || tLower.includes("eksik")) {
            status = "eksik";
            if (!tags.includes("Eksik")) tags.unshift("Eksik");
          } else if (tLower.includes("çürük") || tLower.includes("karies")) {
            status = "curuk";
            if (!tags.includes("Çürük")) tags.unshift("Çürük");
          } else {
            tags.unshift(rec.treatment);
          }
        });
      }

      // Default PPD calculation if not explicit
      let ppd = defaultInfo.ppd !== undefined ? defaultInfo.ppd : 2;
      if (status === "kanal" && ppd < 4) ppd = 4;
      if (status === "curuk" && ppd < 3) ppd = 3;

      const mobility = defaultInfo.mobility !== undefined ? defaultInfo.mobility : 0;
      const vitality =
        status === "kanal" || status === "implant" || status === "eksik"
          ? "devital"
          : defaultInfo.vitality || "vital";

      map.set(num, {
        toothNo: num,
        type,
        status,
        ppd,
        mobility,
        diagnosisTags: tags.length > 0 ? tags : ["Normal Muayene"],
        vitality,
      });
    });

    return map;
  }, [records, dentitionType]);

  // Quadrant tooth number lists
  // Q1: Üst Sağ (18..11) or (55..51)
  const q1Teeth =
    dentitionType === "daimi"
      ? [18, 17, 16, 15, 14, 13, 12, 11]
      : [55, 54, 53, 52, 51];

  // Q2: Üst Sol (21..28) or (61..65)
  const q2Teeth =
    dentitionType === "daimi"
      ? [21, 22, 23, 24, 25, 26, 27, 28]
      : [61, 62, 63, 64, 65];

  // Q3: Alt Sol (31..38) or (71..75)
  const q3Teeth =
    dentitionType === "daimi"
      ? [31, 32, 33, 34, 35, 36, 37, 38]
      : [71, 72, 73, 74, 75];

  // Q4: Alt Sağ (48..41) or (85..81)
  const q4Teeth =
    dentitionType === "daimi"
      ? [48, 47, 46, 45, 44, 43, 42, 41]
      : [85, 84, 83, 82, 81];

  // Quadrant metadata
  const quadrantMeta = [
    {
      id: 1 as const,
      title: "1. Kadran (Üst Sağ)",
      fdiRange: dentitionType === "daimi" ? "18 - 11" : "55 - 51",
      jaw: "Üst Çene (Maksilla)",
      teeth: q1Teeth,
      borderClass: "border-b border-r border-[#E6E1D8] dark:border-[#243B2F]",
    },
    {
      id: 2 as const,
      title: "2. Kadran (Üst Sol)",
      fdiRange: dentitionType === "daimi" ? "21 - 28" : "61 - 65",
      jaw: "Üst Çene (Maksilla)",
      teeth: q2Teeth,
      borderClass: "border-b border-[#E6E1D8] dark:border-[#243B2F]",
    },
    {
      id: 4 as const,
      title: "4. Kadran (Alt Sağ)",
      fdiRange: dentitionType === "daimi" ? "48 - 41" : "85 - 81",
      jaw: "Alt Çene (Mandibula)",
      teeth: q4Teeth,
      borderClass: "border-r border-[#E6E1D8] dark:border-[#243B2F]",
    },
    {
      id: 3 as const,
      title: "3. Kadran (Alt Sol)",
      fdiRange: dentitionType === "daimi" ? "31 - 38" : "71 - 75",
      jaw: "Alt Çene (Mandibula)",
      teeth: q3Teeth,
      borderClass: "",
    },
  ];

  // Selected tooth clinical data
  const activeToothData = selectedTooth
    ? teethDataMap.get(selectedTooth)
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top Clinical Filter & Quadrant Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-[#E6E1D8] dark:border-[#243B2F]">
        <div className="flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-[#1F3327] dark:text-[#76D28F]" />
          <span className="text-xs font-serif font-bold text-[#1C211E] uppercase tracking-wider dark:text-[#ECF3EE]">
            Şematik Klinik Blok Odontogramı
          </span>
          <span className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
            (4 Kadran & PPD/Mobilite)
          </span>
        </div>

        {/* Quadrant Quick Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-[#EEEBE4] p-1 dark:bg-[#1A2C23]">
          <button
            type="button"
            onClick={() => setActiveQuadrantTab("all")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
              activeQuadrantTab === "all"
                ? "bg-[#1F3327] text-white shadow-2xs dark:bg-[#285A3B]"
                : "text-[#3F4540] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            )}
          >
            Tüm Kadranlar
          </button>
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setActiveQuadrantTab(q as 1 | 2 | 3 | 4)}
              className={cn(
                "px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
                activeQuadrantTab === q
                  ? "bg-[#1F3327] text-white shadow-2xs dark:bg-[#285A3B]"
                  : "text-[#3F4540] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              )}
            >
              {q}. Kadran
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tooth Quick Banner in Schematic Mode */}
      {activeToothData && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#EADFC8] bg-[#F6EEDC] p-3 text-xs dark:border-[#523E1E] dark:bg-[#2C2415]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1F3327] px-2.5 py-1 font-mono font-bold text-white shadow-2xs dark:bg-[#2F5A3D]">
              #{activeToothData.toothNo}
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-[#1C211E] dark:text-[#E8BA73]">
                {getToothTypeLabel(activeToothData.type)} Diş —{" "}
                {STATUS_CONFIG[activeToothData.status]?.label}
              </span>
              <span className="text-[11px] text-[#5F665F] dark:text-[#C5D4CB]">
                {activeToothData.diagnosisTags.join(" • ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5F665F] dark:text-[#A2B5A8]">PPD:</span>
              <span
                className={cn(
                  "font-bold font-mono px-1.5 py-0.5 rounded",
                  activeToothData.ppd <= 3
                    ? "bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#163321] dark:text-[#76D28F]"
                    : activeToothData.ppd <= 5
                    ? "bg-[#F3EADB] text-[#7A5320] dark:bg-[#2F2414] dark:text-[#FCD34D]"
                    : "bg-[#FBE9E7] text-[#B3261E] dark:bg-[#3D1D1C] dark:text-[#FCA5A5]"
                )}
              >
                {activeToothData.ppd} mm
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5F665F] dark:text-[#A2B5A8]">Mobilite:</span>
              <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-[#EEEBE4] text-[#3F4540] dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
                Derece {activeToothData.mobility}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5F665F] dark:text-[#A2B5A8]">Vitalite:</span>
              <span
                className={cn(
                  "font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded",
                  activeToothData.vitality === "vital"
                    ? "bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#163321] dark:text-[#76D28F]"
                    : "bg-[#F3EADB] text-[#7A5320] dark:bg-[#2F2414] dark:text-[#FCD34D]"
                )}
              >
                {activeToothData.vitality}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Quadrants Clinical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrantMeta
          .filter(
            (q) => activeQuadrantTab === "all" || activeQuadrantTab === q.id
          )
          .map((quadrant) => {
            return (
              <div
                key={quadrant.id}
                className="rounded-xl border border-[#E6E1D8] bg-[#FFFFFF] p-3.5 shadow-2xs dark:border-[#243B2F] dark:bg-[#15221B]/80"
              >
                {/* Quadrant Header */}
                <div className="mb-3 flex items-center justify-between border-b border-[#E6E1D8] pb-2 dark:border-[#243B2F]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F3327] text-[10px] font-bold text-white dark:bg-[#2F5A3D]">
                      {quadrant.id}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                        {quadrant.title}
                      </h3>
                      <p className="text-[10px] text-[#5F665F] dark:text-[#A2B5A8]">
                        {quadrant.jaw} • ({quadrant.fdiRange})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#5F665F] dark:text-[#A2B5A8]">
                    {quadrant.teeth.length} Diş
                  </span>
                </div>

                {/* Teeth Cards Grid within Quadrant */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quadrant.teeth.map((toothNo) => {
                    const data = teethDataMap.get(toothNo);
                    if (!data) return null;

                    const isSelected = selectedTooth === toothNo;
                    const statusConf = STATUS_CONFIG[data.status];

                    return (
                      <div
                        key={toothNo}
                        onClick={() => handleSelect(toothNo)}
                        className={cn(
                          "group relative flex flex-col justify-between rounded-lg border p-2.5 transition-all duration-150 cursor-pointer select-none",
                          isSelected
                            ? "border-[#1F3327] bg-[#1F3327]/10 ring-2 ring-[#1F3327] shadow-xs dark:border-[#76D28F] dark:bg-[#163321] dark:ring-[#76D28F]"
                            : "border-[#E6E1D8] bg-[#FBFAF7] hover:border-[#1F3327]/50 hover:bg-[#EEEBE4]/60 dark:border-[#243B2F] dark:bg-[#1A2C23]/60 dark:hover:border-[#3F8F55] dark:hover:bg-[#1E3026]"
                        )}
                      >
                        {/* Selected Indicator Checkmark */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F3327] text-white shadow-2xs dark:bg-[#3F8F55]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Top: Tooth Number & Type Icon */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span
                            className={cn(
                              "font-mono text-sm font-bold transition-colors",
                              isSelected
                                ? "text-[#1F3327] dark:text-[#76D28F]"
                                : "text-[#1C211E] dark:text-[#ECF3EE] group-hover:text-[#1F3327] dark:group-hover:text-[#76D28F]"
                            )}
                          >
                            #{data.toothNo}
                          </span>

                          <div
                            className={cn(
                              "flex items-center gap-1 text-[#5F665F] dark:text-[#A2B5A8]",
                              isSelected && "text-[#1F3327] dark:text-[#76D28F]"
                            )}
                          >
                            <ToothTypeIcon type={data.type} />
                            <span className="text-[10px] hidden sm:inline">
                              {getToothTypeLabel(data.type).substring(0, 3)}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Status Badge */}
                        <div className="my-1">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                              statusConf.bgLight,
                              statusConf.textLight,
                              statusConf.borderLight,
                              statusConf.bgDark,
                              statusConf.textDark,
                              statusConf.borderDark
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                statusConf.dotColor
                              )}
                            />
                            {statusConf.label}
                          </span>
                        </div>

                        {/* Clinical Diagnosis Tags */}
                        <div className="min-h-[28px] my-1">
                          <p
                            className="text-[10px] font-medium text-[#3F4540] dark:text-[#C5D4CB] line-clamp-2 leading-tight"
                            title={data.diagnosisTags.join(", ")}
                          >
                            {data.diagnosisTags[0] || "Normal"}
                          </p>
                        </div>

                        {/* Bottom: PPD & Mobility Bar */}
                        <div className="mt-1.5 pt-1.5 border-t border-[#E6E1D8]/60 dark:border-[#243B2F]/60 flex items-center justify-between text-[9px] font-mono text-[#5F665F] dark:text-[#A2B5A8]">
                          {/* PPD Badge */}
                          <span
                            className={cn(
                              "px-1 py-0.5 rounded font-bold",
                              data.ppd <= 3
                                ? "bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#163321] dark:text-[#76D28F]"
                                : data.ppd <= 5
                                ? "bg-[#F3EADB] text-[#7A5320] dark:bg-[#2F2414] dark:text-[#FCD34D]"
                                : "bg-[#FBE9E7] text-[#B3261E] dark:bg-[#3D1D1C] dark:text-[#FCA5A5]"
                            )}
                            title={`Periodontal Cep Derinliği: ${data.ppd}mm`}
                          >
                            PPD:{data.ppd}m
                          </span>

                          {/* Mobility Badge */}
                          <span
                            className={cn(
                              "px-1 py-0.5 rounded",
                              data.mobility > 0
                                ? "bg-[#FBE9E7] text-[#B3261E] font-bold dark:bg-[#3D1D1C] dark:text-[#FCA5A5]"
                                : "text-[#5F665F] dark:text-[#A2B5A8]"
                            )}
                            title={`Mobilite: Derece ${data.mobility}`}
                          >
                            M:{data.mobility}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E6E1D8] bg-[#FBFAF7] px-3.5 py-2 text-xs text-[#5F665F] dark:border-[#243B2F] dark:bg-[#15221B] dark:text-[#A2B5A8]">
        <div className="flex items-center gap-1 font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
          <span>Klinik Renk Kodları:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3F8F55]" />
            Sağlam
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#2C5282]" />
            Dolgu
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#B07D47]" />
            Kanal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#2F5A3D]" />
            İmplant
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#B3261E]" />
            Çürük
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#7C817C]" />
            Eksik
          </span>
        </div>
        <div className="text-[10px] italic">
          * Diş seçildiğinde sağ panelde ilgili tedaviler görüntülenir.
        </div>
      </div>
    </div>
  );
}
