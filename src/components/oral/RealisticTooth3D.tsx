"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export type ToothGroup = "incisor" | "canine" | "premolar" | "molar";
export type ToothCondition =
  | "healthy"
  | "caries"
  | "filling"
  | "endodontic"
  | "implant"
  | "crown"
  | "missing";

export interface ToothStatusData {
  condition?: ToothCondition;
  hasCaries?: boolean;
  cariesSeverity?: "mild" | "moderate" | "deep";
  hasFilling?: boolean;
  fillingType?: "composite" | "amalgam";
  hasEndo?: boolean;
  hasKanal?: boolean;
  hasImplant?: boolean;
  hasCrown?: boolean;
  hasDolgu?: boolean;
  isMissing?: boolean;
  treatment?: string;
  notes?: string;
  depth?: number;
  stage?: string;
  [key: string]: any;
}

export interface RealisticTooth3DProps {
  num: number;
  isUpper: boolean;
  status?: any;
  isSelected?: boolean;
  mode?: "before" | "after";
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showNumber?: boolean;
  interactive?: boolean;
  rotationX?: number;
  rotationY?: number;
}

export function getToothGroup(num: number): ToothGroup {
  const digit = num % 10;
  if (digit === 1 || digit === 2) return "incisor";
  if (digit === 3) return "canine";
  if (digit === 4 || digit === 5) return "premolar";
  return "molar";
}

export function parseToothStatus(status: any): ToothStatusData {
  if (!status) return { condition: "healthy" };
  if (typeof status === "string") {
    const s = status.toLowerCase();
    if (s.includes("kanal") || s.includes("endo"))
      return { condition: "endodontic", hasEndo: true, hasKanal: true, treatment: status };
    if (s.includes("implant"))
      return { condition: "implant", hasImplant: true, treatment: status };
    if (s.includes("dolgu") || s.includes("filling") || s.includes("kompozit"))
      return { condition: "filling", hasFilling: true, hasDolgu: true, treatment: status };
    if (s.includes("çürük") || s.includes("curuk") || s.includes("caries"))
      return { condition: "caries", hasCaries: true, treatment: status };
    if (s.includes("kaplama") || s.includes("kron") || s.includes("crown") || s.includes("zirkon"))
      return { condition: "crown", hasCrown: true, treatment: status };
    if (s.includes("eksik") || s.includes("çekim") || s.includes("missing"))
      return { condition: "missing", isMissing: true, treatment: status };
    return { condition: "healthy", treatment: status };
  }
  if (typeof status === "object") {
    const s = status;
    const hasEndo = Boolean(
      s.hasEndo || s.hasKanal || s.condition === "endodontic" || (s.treatment && /kanal|endo/i.test(s.treatment))
    );
    const hasImplant = Boolean(
      s.hasImplant || s.condition === "implant" || (s.treatment && /implant/i.test(s.treatment))
    );
    const hasFilling = Boolean(
      s.hasFilling || s.hasDolgu || s.condition === "filling" || (s.treatment && /dolgu|filling|kompozit/i.test(s.treatment))
    );
    const hasCaries = Boolean(
      s.hasCaries || s.condition === "caries" || (s.treatment && /çürük|curuk|caries/i.test(s.treatment))
    );
    const hasCrown = Boolean(
      s.hasCrown || s.condition === "crown" || (s.treatment && /kaplama|kron|crown|zirkon/i.test(s.treatment))
    );
    const isMissing = Boolean(
      s.isMissing || s.condition === "missing" || (s.treatment && /eksik|çekim|missing/i.test(s.treatment))
    );

    let condition: ToothCondition = "healthy";
    if (isMissing) condition = "missing";
    else if (hasImplant) condition = "implant";
    else if (hasCrown) condition = "crown";
    else if (hasEndo) condition = "endodontic";
    else if (hasCaries) condition = "caries";
    else if (hasFilling) condition = "filling";

    return {
      condition,
      hasCaries,
      cariesSeverity: s.cariesSeverity || "moderate",
      hasFilling,
      fillingType: s.fillingType || "composite",
      hasEndo,
      hasKanal: hasEndo,
      hasImplant,
      hasCrown,
      hasDolgu: hasFilling,
      isMissing,
      treatment: s.treatment || s.treatmentType,
      notes: s.notes,
      depth: s.depth ?? (hasCaries ? 60 : hasEndo ? 90 : 0),
      stage: s.stage,
      ...s,
    };
  }
  return { condition: "healthy" };
}

export function RealisticTooth3D({
  num,
  isUpper,
  status,
  isSelected = false,
  mode = "before",
  onClick,
  onDoubleClick,
  className,
  size = "md",
  showNumber = true,
  interactive = true,
  rotationX = 0,
  rotationY = 0,
}: RealisticTooth3DProps) {
  const toothGroup = getToothGroup(num);
  const parsedStatus = parseToothStatus(status);
  const rawId = useId();
  const idPrefix = `tooth_${num}_${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Dimensions based on size
  const sizeClasses = {
    sm: "w-8 h-20 text-[10px]",
    md: "w-11 h-26 text-[11px]",
    lg: "w-16 h-36 text-xs",
    xl: "w-36 h-72 text-sm",
  }[size];

  // Visual status resolution depending on mode
  const isHealthy = parsedStatus.condition === "healthy" && !parsedStatus.hasCaries && !parsedStatus.hasFilling;
  
  // In BEFORE mode, show pathology:
  // In AFTER mode, show restored aesthetic result:
  const showMissing = parsedStatus.isMissing && mode === "before";
  const showCaries = parsedStatus.hasCaries && mode === "before";
  const showOldFilling = parsedStatus.hasFilling && mode === "before" && !parsedStatus.hasCrown;
  const showEndoInMode = parsedStatus.hasEndo; // Shown with visible canal obturation
  const showImplantInMode = parsedStatus.hasImplant || (parsedStatus.isMissing && mode === "after");
  const showCrownInMode = parsedStatus.hasCrown || (parsedStatus.hasCaries && mode === "after" && parsedStatus.treatment?.includes("Kron")) || (parsedStatus.isMissing && mode === "after" && !parsedStatus.hasImplant);
  const showRestoredFilling = (parsedStatus.hasCaries || parsedStatus.hasFilling) && mode === "after" && !showCrownInMode;

  // Root & Crown geometries by group
  // Coordinate frame:
  // isUpper: Root top (y=8 to y=70), Crown bottom (y=70 to y=142)
  // isLower: Crown top (y=18 to y=90), Root bottom (y=90 to y=152)
  const isMolar = toothGroup === "molar";
  const isPremolar = toothGroup === "premolar";
  const isCanine = toothGroup === "canine";
  const isIncisor = toothGroup === "incisor";

  // Dynamic status tag text
  const statusLabel = showMissing
    ? "Eksik Diş"
    : showImplantInMode
    ? "Dental İmplant"
    : showCrownInMode
    ? "Zirkonyum Kron"
    : showCaries
    ? "Çürük Lezyonu"
    : showRestoredFilling
    ? "Kompozit Dolgu"
    : showEndoInMode
    ? "Kanal Tedavisi"
    : "Sağlıklı Mine";

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        "group relative flex flex-col items-center justify-between select-none transition-all duration-200 cursor-pointer rounded-xl p-1",
        sizeClasses,
        interactive && "hover:-translate-y-0.5 active:translate-y-0",
        isSelected
          ? "ring-2 ring-[#2F5A3D] dark:ring-[#44A066] bg-[#1F3327]/10 dark:bg-[#1E3026] shadow-md shadow-[#2F5A3D]/20"
          : "hover:bg-[#EFECE6]/70 dark:hover:bg-[#1A2920]/60",
        className
      )}
      style={{
        perspective: "800px",
      }}
      title={`Diş #${num} (${statusLabel}) - Çift tıklayarak inceleyin`}
    >
      {/* Upper tooth layout: Root on top, Crown on bottom. Number below */}
      {isUpper ? (
        <>
          <div
            className="relative w-full flex-1 flex items-center justify-center"
            style={{
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.15s ease-out",
            }}
          >
            <svg
              viewBox="0 0 100 160"
              className={cn(
                "w-full h-full drop-shadow-sm transition-all duration-300",
                isSelected && "drop-shadow-[0_4px_10px_rgba(47,90,61,0.35)]",
                showMissing && "opacity-45"
              )}
            >
              <defs>
                {/* Natural Healthy Enamel Gradient */}
                <linearGradient id={`${idPrefix}_enamel`} x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#F9F6EE" />
                  <stop offset="70%" stopColor="#EDE5D4" />
                  <stop offset="100%" stopColor="#DFD4BE" />
                </linearGradient>

                {/* Zirconia Crown Luxury Pearlescent Gradient */}
                <linearGradient id={`${idPrefix}_zirconia`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#F0F9FF" />
                  <stop offset="70%" stopColor="#E0F2FE" />
                  <stop offset="100%" stopColor="#BAE6FD" />
                </linearGradient>

                {/* Root Dentin Gradient */}
                <linearGradient id={`${idPrefix}_root`} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#E2D4B7" />
                  <stop offset="30%" stopColor="#EDE3CE" />
                  <stop offset="75%" stopColor="#DFD0B0" />
                  <stop offset="100%" stopColor="#CBB993" />
                </linearGradient>

                {/* Titanium Implant Body Gradient */}
                <linearGradient id={`${idPrefix}_implant`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#37474F" />
                  <stop offset="30%" stopColor="#78909C" />
                  <stop offset="65%" stopColor="#B0BEC5" />
                  <stop offset="85%" stopColor="#546E7A" />
                  <stop offset="100%" stopColor="#263238" />
                </linearGradient>

                {/* Titanium Abutment Collar */}
                <linearGradient id={`${idPrefix}_abutment`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#607D8B" />
                  <stop offset="50%" stopColor="#CFD8DC" />
                  <stop offset="100%" stopColor="#455A64" />
                </linearGradient>

                {/* Endodontic Gutta-Percha Canal Gradient */}
                <linearGradient id={`${idPrefix}_gutta`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF7043" />
                  <stop offset="50%" stopColor="#FF8A65" />
                  <stop offset="100%" stopColor="#E64A19" />
                </linearGradient>

                {/* Composite Filling Gradient */}
                <linearGradient id={`${idPrefix}_composite`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="50%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* Caries Necrotic Radial Gradient */}
                <radialGradient id={`${idPrefix}_caries`} cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#1B0C06" />
                  <stop offset="50%" stopColor="#3E1A0A" />
                  <stop offset="80%" stopColor="#7B3A18" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0.8" />
                </radialGradient>

                {/* Gloss / Specular Highlight Gradient */}
                <linearGradient id={`${idPrefix}_specular`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>

                {/* Gingival Crevice Shadow */}
                <linearGradient id={`${idPrefix}_crevice`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#473A2A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#473A2A" stopOpacity="0" />
                </linearGradient>

                {/* Filter for subtle 3D Ambient Occlusion */}
                <filter id={`${idPrefix}_shadow`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.18" floodColor="#241B12" />
                </filter>
              </defs>

              {/* GHOST / MISSING TOOTH SOCKET OUTLINE */}
              {showMissing ? (
                <g opacity="0.6">
                  <path
                    d="M32,68 C30,40 38,15 50,12 C62,15 70,40 68,68 C74,75 80,95 78,125 C76,145 66,150 50,150 C34,150 24,145 22,125 C20,95 26,75 32,68 Z"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                  <ellipse cx="50" cy="110" rx="16" ry="10" fill="#94A3B8" opacity="0.15" />
                  <text
                    x="50"
                    y="114"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#64748B"
                  >
                    Eksik
                  </text>
                </g>
              ) : (
                <>
                  {/* ================= UPPER ROOT LAYER ================= */}
                  {showImplantInMode ? (
                    // TITANIUM IMPLANT FIXTURE (pointing UP into bone)
                    <g id={`${idPrefix}_implant_group`}>
                      {/* Bone Trabeculae Hue */}
                      <path
                        d="M36,66 L64,66 L58,16 C57,12 43,12 42,16 Z"
                        fill={`url(#${idPrefix}_implant)`}
                        filter={`url(#${idPrefix}_shadow)`}
                      />
                      {/* Machined Screw Threads */}
                      {[22, 28, 34, 40, 46, 52, 58].map((y) => (
                        <g key={y}>
                          <path
                            d={`M${38 + (66 - y) * 0.12},${y} L${62 - (66 - y) * 0.12},${y}`}
                            stroke="#1E293B"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <path
                            d={`M${39 + (66 - y) * 0.12},${y - 1} L${61 - (66 - y) * 0.12},${y - 1}`}
                            stroke="#E2E8F0"
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.75"
                          />
                        </g>
                      ))}
                      {/* Implant Collar / Abutment at gingival level */}
                      <path
                        d="M34,64 L66,64 L63,74 L37,74 Z"
                        fill={`url(#${idPrefix}_abutment)`}
                        stroke="#475569"
                        strokeWidth="1"
                      />
                      {/* Polished Collar Specular */}
                      <rect x="42" y="65" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.6" />
                    </g>
                  ) : (
                    // NATURAL ANATOMICAL ROOTS (UPPER)
                    <g id={`${idPrefix}_natural_root`}>
                      {isMolar ? (
                        // Upper Molar: 3 roots (Mesiobuccal, Distobuccal, Palatal)
                        <g>
                          {/* Palatal Root (central, longest) */}
                          <path
                            d="M44,68 C44,38 46,18 50,12 C54,18 56,38 56,68 Z"
                            fill={`url(#${idPrefix}_root)`}
                            opacity="0.85"
                          />
                          {/* Mesiobuccal Root (curving left) */}
                          <path
                            d="M32,70 C30,46 22,26 30,16 C36,26 40,46 44,70 Z"
                            fill={`url(#${idPrefix}_root)`}
                            filter={`url(#${idPrefix}_shadow)`}
                          />
                          {/* Distobuccal Root (curving right) */}
                          <path
                            d="M56,70 C60,46 64,26 70,16 C78,26 70,46 68,70 Z"
                            fill={`url(#${idPrefix}_root)`}
                            filter={`url(#${idPrefix}_shadow)`}
                          />
                          {/* Root Bifurcation Shadow */}
                          <path
                            d="M42,50 Q50,42 58,50 Q50,56 42,50 Z"
                            fill="#8C795A"
                            opacity="0.4"
                          />
                        </g>
                      ) : isPremolar ? (
                        // Upper Premolar: Dual-tapered root
                        <g>
                          <path
                            d="M34,70 C30,44 32,24 40,14 C46,24 48,46 50,70 C52,46 54,24 60,14 C68,24 70,44 66,70 Z"
                            fill={`url(#${idPrefix}_root)`}
                            filter={`url(#${idPrefix}_shadow)`}
                          />
                          <path
                            d="M48,30 L52,30 L51,60 L49,60 Z"
                            fill="#8C795A"
                            opacity="0.35"
                          />
                        </g>
                      ) : isCanine ? (
                        // Upper Canine: Stout single prominent root
                        <path
                          d="M34,70 C30,40 38,15 50,8 C62,15 70,40 66,70 Z"
                          fill={`url(#${idPrefix}_root)`}
                          filter={`url(#${idPrefix}_shadow)`}
                        />
                      ) : (
                        // Upper Incisor: Gracefully tapered conical root
                        <path
                          d="M36,70 C33,45 42,20 50,12 C58,20 67,45 64,70 Z"
                          fill={`url(#${idPrefix}_root)`}
                          filter={`url(#${idPrefix}_shadow)`}
                        />
                      )}

                      {/* Root Central Dentin Highlights */}
                      <path
                        d="M48,18 Q50,45 49,68"
                        stroke="#FFFDF8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.45"
                      />

                      {/* ENDODONTIC GUTTA-PERCHA ROOT CANAL LINES */}
                      {showEndoInMode && (
                        <g id={`${idPrefix}_endo_canals`}>
                          {isMolar ? (
                            <>
                              <path
                                d="M33,20 C36,36 39,52 42,70"
                                stroke={`url(#${idPrefix}_gutta)`}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M50,16 L50,70"
                                stroke={`url(#${idPrefix}_gutta)`}
                                strokeWidth="3.2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M67,20 C64,36 61,52 58,70"
                                stroke={`url(#${idPrefix}_gutta)`}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </>
                          ) : isPremolar ? (
                            <>
                              <path
                                d="M42,18 C44,35 46,52 47,70"
                                stroke={`url(#${idPrefix}_gutta)`}
                                strokeWidth="2.8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M58,18 C56,35 54,52 53,70"
                                stroke={`url(#${idPrefix}_gutta)`}
                                strokeWidth="2.8"
                                strokeLinecap="round"
                              />
                            </>
                          ) : (
                            <path
                              d="M50,14 L50,70"
                              stroke={`url(#${idPrefix}_gutta)`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          )}
                          {/* Pulp Chamber Seal Core */}
                          <ellipse
                            cx="50"
                            cy="68"
                            rx="10"
                            ry="5"
                            fill="#F97316"
                            opacity="0.8"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* ================= CERVICAL LINE (CEJ) ================= */}
                  <path
                    d="M26,72 C36,76 64,76 74,72 C71,67 29,67 26,72 Z"
                    fill={`url(#${idPrefix}_crevice)`}
                  />

                  {/* ================= UPPER CROWN LAYER (points down) ================= */}
                  <g id={`${idPrefix}_crown_group`}>
                    {/* Crown Base Enamel / Zirconia Path */}
                    {isMolar ? (
                      // Molar 4 cusps wide occlusal table
                      <path
                        d="M26,70 C24,90 22,122 30,140 C38,146 44,142 50,145 C56,142 62,146 70,140 C78,122 76,90 74,70 C60,73 40,73 26,70 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia)` : `url(#${idPrefix}_enamel)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow)`}
                      />
                    ) : isPremolar ? (
                      // Premolar bicuspid crown
                      <path
                        d="M30,70 C28,92 26,125 36,142 C44,146 56,146 64,142 C74,125 72,92 70,70 C58,74 42,74 30,70 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia)` : `url(#${idPrefix}_enamel)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow)`}
                      />
                    ) : isCanine ? (
                      // Canine pointed diamond crown
                      <path
                        d="M31,70 C28,94 30,126 42,144 C47,150 53,150 58,144 C70,126 72,94 69,70 C57,74 43,74 31,70 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia)` : `url(#${idPrefix}_enamel)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow)`}
                      />
                    ) : (
                      // Incisor shovel-shaped incisal edge
                      <path
                        d="M32,70 C29,95 28,128 32,145 C42,147 58,147 68,145 C72,128 71,95 68,70 C56,73 44,73 32,70 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia)` : `url(#${idPrefix}_enamel)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow)`}
                      />
                    )}

                    {/* Anatomical Grooves & Developmental Depressions */}
                    {isMolar && (
                      <g opacity="0.35">
                        <path d="M50,75 L50,132" stroke="#7A664D" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M35,105 Q50,115 65,105" stroke="#7A664D" strokeWidth="1" strokeLinecap="round" />
                      </g>
                    )}
                    {isPremolar && (
                      <path d="M50,80 L50,128" stroke="#7A664D" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                    )}
                    {isCanine && (
                      <path d="M50,75 L50,140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    )}

                    {/* Specular Highlight Gloss Streaks */}
                    <path
                      d="M34,80 C32,95 33,120 38,132 C40,125 38,98 40,82 Z"
                      fill={`url(#${idPrefix}_specular)`}
                    />
                    <ellipse cx="62" cy="95" rx="4" ry="12" fill="#FFFFFF" opacity="0.25" />

                    {/* Zirconia Ceramic Glaze Glow */}
                    {showCrownInMode && (
                      <g>
                        <path
                          d="M30,85 C40,80 60,80 70,85"
                          stroke="#E0F2FE"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <circle cx="58" cy="98" r="2.5" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    )}

                    {/* CARIES / CAVITY (Before Mode) */}
                    {showCaries && (
                      <g id={`${idPrefix}_caries_group`}>
                        {/* Demineralized necrotic zone */}
                        <ellipse cx="50" cy="115" rx="11" ry="8" fill={`url(#${idPrefix}_caries)`} />
                        {/* Deep cavitation center */}
                        <path
                          d="M44,113 C45,110 54,109 56,113 C57,117 53,120 48,119 C44,118 43,115 44,113 Z"
                          fill="#120703"
                        />
                        {/* Fissural micro-cracks */}
                        <path d="M42,112 L36,110" stroke="#451A03" strokeWidth="1" />
                        <path d="M57,116 L63,119" stroke="#451A03" strokeWidth="1" />
                      </g>
                    )}

                    {/* OLD FILLING (Before Mode) */}
                    {showOldFilling && (
                      <g>
                        <ellipse cx="50" cy="112" rx="9" ry="6" fill="#94A3B8" opacity="0.8" />
                        <ellipse cx="50" cy="112" rx="7" ry="4.5" fill="#64748B" />
                      </g>
                    )}

                    {/* COMPOSITE AESTHETIC RESTORATION (After Mode) */}
                    {showRestoredFilling && (
                      <g id={`${idPrefix}_filling_group`}>
                        <ellipse
                          cx="50"
                          cy="114"
                          rx="10"
                          ry="7"
                          fill={`url(#${idPrefix}_composite)`}
                          stroke="#E2E8F0"
                          strokeWidth="0.8"
                        />
                        {/* Polished High-Gloss Highlight */}
                        <ellipse cx="48" cy="112" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    )}
                  </g>
                </>
              )}
            </svg>

            {/* Treatment dot indicator */}
            {(parsedStatus.hasEndo || parsedStatus.hasImplant || parsedStatus.hasCrown || parsedStatus.hasCaries || parsedStatus.hasFilling) && (
              <span
                className={cn(
                  "absolute top-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#15221B] shadow-xs",
                  showImplantInMode
                    ? "bg-[#2563EB]"
                    : showCrownInMode
                    ? "bg-[#06B6D4]"
                    : showCaries
                    ? "bg-[#DC2626]"
                    : showRestoredFilling
                    ? "bg-[#10B981]"
                    : showEndoInMode
                    ? "bg-[#F97316]"
                    : "bg-[#64748B]"
                )}
              />
            )}
          </div>

          {/* Tooth Number below tooth for Upper Jaw */}
          {showNumber && (
            <span
              className={cn(
                "mt-0.5 font-bold tracking-tight transition-colors",
                isSelected
                  ? "text-[#1F3327] dark:text-[#76D28F]"
                  : "text-[#5F665F] dark:text-[#9EB1A4] group-hover:text-[#1C211E] dark:group-hover:text-[#ECF3EE]"
              )}
            >
              {num}
            </span>
          )}
        </>
      ) : (
        /* ================= LOWER JAW: CROWN TOP, ROOT BOTTOM ================= */
        <>
          {/* Tooth Number above tooth for Lower Jaw */}
          {showNumber && (
            <span
              className={cn(
                "mb-0.5 font-bold tracking-tight transition-colors",
                isSelected
                  ? "text-[#1F3327] dark:text-[#76D28F]"
                  : "text-[#5F665F] dark:text-[#9EB1A4] group-hover:text-[#1C211E] dark:group-hover:text-[#ECF3EE]"
              )}
            >
              {num}
            </span>
          )}

          <div
            className="relative w-full flex-1 flex items-center justify-center"
            style={{
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.15s ease-out",
            }}
          >
            <svg
              viewBox="0 0 100 160"
              className={cn(
                "w-full h-full drop-shadow-sm transition-all duration-300",
                isSelected && "drop-shadow-[0_4px_10px_rgba(47,90,61,0.35)]",
                showMissing && "opacity-45"
              )}
            >
              <defs>
                {/* Natural Healthy Enamel Gradient (Lower) */}
                <linearGradient id={`${idPrefix}_enamel_low`} x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#FAF7F0" />
                  <stop offset="75%" stopColor="#EDE5D4" />
                  <stop offset="100%" stopColor="#E2D6C0" />
                </linearGradient>

                {/* Zirconia Crown Luxury Gradient (Lower) */}
                <linearGradient id={`${idPrefix}_zirconia_low`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#F0F9FF" />
                  <stop offset="75%" stopColor="#E0F2FE" />
                  <stop offset="100%" stopColor="#BAE6FD" />
                </linearGradient>

                {/* Root Dentin Gradient (Lower) */}
                <linearGradient id={`${idPrefix}_root_low`} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#DFD0B0" />
                  <stop offset="40%" stopColor="#EDE3CE" />
                  <stop offset="80%" stopColor="#E2D4B7" />
                  <stop offset="100%" stopColor="#CBB993" />
                </linearGradient>

                {/* Titanium Implant Body Gradient (Lower) */}
                <linearGradient id={`${idPrefix}_implant_low`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#37474F" />
                  <stop offset="30%" stopColor="#78909C" />
                  <stop offset="65%" stopColor="#B0BEC5" />
                  <stop offset="85%" stopColor="#546E7A" />
                  <stop offset="100%" stopColor="#263238" />
                </linearGradient>

                {/* Titanium Abutment Collar */}
                <linearGradient id={`${idPrefix}_abutment_low`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#607D8B" />
                  <stop offset="50%" stopColor="#CFD8DC" />
                  <stop offset="100%" stopColor="#455A64" />
                </linearGradient>

                {/* Endodontic Gutta-Percha Canal Gradient */}
                <linearGradient id={`${idPrefix}_gutta_low`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF7043" />
                  <stop offset="50%" stopColor="#FF8A65" />
                  <stop offset="100%" stopColor="#E64A19" />
                </linearGradient>

                {/* Composite Filling Gradient */}
                <linearGradient id={`${idPrefix}_composite_low`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="50%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* Caries Radial Gradient */}
                <radialGradient id={`${idPrefix}_caries_low`} cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#1B0C06" />
                  <stop offset="50%" stopColor="#3E1A0A" />
                  <stop offset="80%" stopColor="#7B3A18" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0.8" />
                </radialGradient>

                {/* Gloss / Specular Highlight */}
                <linearGradient id={`${idPrefix}_specular_low`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>

                {/* Crevice Shadow */}
                <linearGradient id={`${idPrefix}_crevice_low`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#473A2A" stopOpacity="0" />
                  <stop offset="100%" stopColor="#473A2A" stopOpacity="0.25" />
                </linearGradient>

                {/* Ambient Occlusion Filter */}
                <filter id={`${idPrefix}_shadow_low`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.18" floodColor="#241B12" />
                </filter>
              </defs>

              {/* GHOST / MISSING TOOTH SOCKET (LOWER) */}
              {showMissing ? (
                <g opacity="0.6">
                  <path
                    d="M32,92 C30,120 38,145 50,148 C62,145 70,120 68,92 C74,85 80,65 78,35 C76,15 66,10 50,10 C34,10 24,15 22,35 C20,65 26,85 32,92 Z"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                  <ellipse cx="50" cy="50" rx="16" ry="10" fill="#94A3B8" opacity="0.15" />
                  <text
                    x="50"
                    y="54"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#64748B"
                  >
                    Eksik
                  </text>
                </g>
              ) : (
                <>
                  {/* ================= LOWER CROWN LAYER (points UP) ================= */}
                  <g id={`${idPrefix}_crown_group_low`}>
                    {isMolar ? (
                      // Lower Molar: Wide occlusal table with 5 cusps
                      <path
                        d="M26,90 C24,70 22,38 30,20 C38,14 44,18 50,15 C56,18 62,14 70,20 C78,38 76,70 74,90 C60,87 40,87 26,90 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia_low)` : `url(#${idPrefix}_enamel_low)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow_low)`}
                      />
                    ) : isPremolar ? (
                      // Lower Premolar
                      <path
                        d="M30,90 C28,68 26,35 36,18 C44,14 56,14 64,18 C74,35 72,68 70,90 C58,86 42,86 30,90 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia_low)` : `url(#${idPrefix}_enamel_low)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow_low)`}
                      />
                    ) : isCanine ? (
                      // Lower Canine
                      <path
                        d="M31,90 C28,66 30,34 42,16 C47,10 53,10 58,16 C70,34 72,66 69,90 C57,86 43,86 31,90 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia_low)` : `url(#${idPrefix}_enamel_low)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow_low)`}
                      />
                    ) : (
                      // Lower Incisor (slender)
                      <path
                        d="M33,90 C30,68 30,35 34,18 C44,15 56,15 66,18 C70,35 70,68 67,90 C57,87 43,87 33,90 Z"
                        fill={showCrownInMode ? `url(#${idPrefix}_zirconia_low)` : `url(#${idPrefix}_enamel_low)`}
                        stroke={showCrownInMode ? "#38BDF8" : isSelected ? "#2F5A3D" : "#D4C7B0"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter={`url(#${idPrefix}_shadow_low)`}
                      />
                    )}

                    {/* Developmental Grooves */}
                    {isMolar && (
                      <g opacity="0.35">
                        <path d="M50,85 L50,28" stroke="#7A664D" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M35,55 Q50,45 65,55" stroke="#7A664D" strokeWidth="1" strokeLinecap="round" />
                      </g>
                    )}
                    {isPremolar && (
                      <path d="M50,80 L50,32" stroke="#7A664D" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                    )}
                    {isCanine && (
                      <path d="M50,85 L50,20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    )}

                    {/* Specular Highlight Glare */}
                    <path
                      d="M34,80 C32,65 33,40 38,28 C40,35 38,62 40,78 Z"
                      fill={`url(#${idPrefix}_specular_low)`}
                    />
                    <ellipse cx="62" cy="65" rx="4" ry="12" fill="#FFFFFF" opacity="0.25" />

                    {/* Zirconia Glow */}
                    {showCrownInMode && (
                      <g>
                        <path
                          d="M30,75 C40,80 60,80 70,75"
                          stroke="#E0F2FE"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <circle cx="58" cy="62" r="2.5" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    )}

                    {/* CARIES / CAVITY (Before Mode) */}
                    {showCaries && (
                      <g id={`${idPrefix}_caries_group_low`}>
                        <ellipse cx="50" cy="45" rx="11" ry="8" fill={`url(#${idPrefix}_caries_low)`} />
                        <path
                          d="M44,47 C45,44 54,43 56,47 C57,51 53,54 48,53 C44,52 43,49 44,47 Z"
                          fill="#120703"
                        />
                        <path d="M42,48 L36,50" stroke="#451A03" strokeWidth="1" />
                        <path d="M57,44 L63,41" stroke="#451A03" strokeWidth="1" />
                      </g>
                    )}

                    {/* OLD FILLING */}
                    {showOldFilling && (
                      <g>
                        <ellipse cx="50" cy="48" rx="9" ry="6" fill="#94A3B8" opacity="0.8" />
                        <ellipse cx="50" cy="48" rx="7" ry="4.5" fill="#64748B" />
                      </g>
                    )}

                    {/* COMPOSITE RESTORATION */}
                    {showRestoredFilling && (
                      <g id={`${idPrefix}_filling_group_low`}>
                        <ellipse
                          cx="50"
                          cy="46"
                          rx="10"
                          ry="7"
                          fill={`url(#${idPrefix}_composite_low)`}
                          stroke="#E2E8F0"
                          strokeWidth="0.8"
                        />
                        <ellipse cx="48" cy="44" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    )}
                  </g>

                  {/* ================= CEJ LINE ================= */}
                  <path
                    d="M26,88 C36,84 64,84 74,88 C71,93 29,93 26,88 Z"
                    fill={`url(#${idPrefix}_crevice_low)`}
                  />

                  {/* ================= LOWER ROOT LAYER (points DOWN) ================= */}
                  {showImplantInMode ? (
                    // TITANIUM IMPLANT FIXTURE (pointing DOWN into mandible)
                    <g id={`${idPrefix}_implant_group_low`}>
                      {/* Abutment collar at gumline */}
                      <path
                        d="M34,96 L66,96 L63,86 L37,86 Z"
                        fill={`url(#${idPrefix}_abutment_low)`}
                        stroke="#475569"
                        strokeWidth="1"
                      />
                      <rect x="42" y="87" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.6" />

                      {/* Implant screw body */}
                      <path
                        d="M36,94 L64,94 L58,144 C57,148 43,148 42,144 Z"
                        fill={`url(#${idPrefix}_implant_low)`}
                        filter={`url(#${idPrefix}_shadow_low)`}
                      />
                      {/* Machined Screw Threads */}
                      {[102, 108, 114, 120, 126, 132, 138].map((y) => (
                        <g key={y}>
                          <path
                            d={`M${38 + (y - 94) * 0.12},${y} L${62 - (y - 94) * 0.12},${y}`}
                            stroke="#1E293B"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <path
                            d={`M${39 + (y - 94) * 0.12},${y + 1} L${61 - (y - 94) * 0.12},${y + 1}`}
                            stroke="#E2E8F0"
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.75"
                          />
                        </g>
                      ))}
                    </g>
                  ) : (
                    // NATURAL ROOTS (LOWER)
                    <g id={`${idPrefix}_natural_root_low`}>
                      {isMolar ? (
                        // Lower Molar: 2 broad divergent roots (Mesial and Distal)
                        <g>
                          {/* Mesial Root (curving left) */}
                          <path
                            d="M32,90 C30,114 24,134 32,144 C38,134 42,114 44,90 Z"
                            fill={`url(#${idPrefix}_root_low)`}
                            filter={`url(#${idPrefix}_shadow_low)`}
                          />
                          {/* Distal Root (curving right) */}
                          <path
                            d="M56,90 C58,114 62,134 68,144 C76,134 70,114 68,90 Z"
                            fill={`url(#${idPrefix}_root_low)`}
                            filter={`url(#${idPrefix}_shadow_low)`}
                          />
                          {/* Root Bifurcation V-Notch */}
                          <path
                            d="M42,110 Q50,118 58,110 Q50,104 42,110 Z"
                            fill="#8C795A"
                            opacity="0.4"
                          />
                        </g>
                      ) : isPremolar ? (
                        // Lower Premolar
                        <path
                          d="M34,90 C31,116 38,138 50,146 C62,138 69,116 66,90 Z"
                          fill={`url(#${idPrefix}_root_low)`}
                          filter={`url(#${idPrefix}_shadow_low)`}
                        />
                      ) : isCanine ? (
                        // Lower Canine: long conical root
                        <path
                          d="M34,90 C30,120 38,145 50,152 C62,145 70,120 66,90 Z"
                          fill={`url(#${idPrefix}_root_low)`}
                          filter={`url(#${idPrefix}_shadow_low)`}
                        />
                      ) : (
                        // Lower Incisor: slim root
                        <path
                          d="M36,90 C34,115 42,140 50,148 C58,140 66,115 64,90 Z"
                          fill={`url(#${idPrefix}_root_low)`}
                          filter={`url(#${idPrefix}_shadow_low)`}
                        />
                      )}

                      {/* Root Highlight line */}
                      <path
                        d="M48,142 Q50,115 49,92"
                        stroke="#FFFDF8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.45"
                      />

                      {/* ENDODONTIC CANAL FILLING (LOWER) */}
                      {showEndoInMode && (
                        <g id={`${idPrefix}_endo_canals_low`}>
                          {isMolar ? (
                            <>
                              <path
                                d="M33,140 C36,124 39,108 42,90"
                                stroke={`url(#${idPrefix}_gutta_low)`}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M67,140 C64,124 61,108 58,90"
                                stroke={`url(#${idPrefix}_gutta_low)`}
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </>
                          ) : (
                            <path
                              d="M50,144 L50,90"
                              stroke={`url(#${idPrefix}_gutta_low)`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          )}
                          <ellipse
                            cx="50"
                            cy="92"
                            rx="10"
                            ry="5"
                            fill="#F97316"
                            opacity="0.8"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </>
              )}
            </svg>

            {/* Treatment dot indicator */}
            {(parsedStatus.hasEndo || parsedStatus.hasImplant || parsedStatus.hasCrown || parsedStatus.hasCaries || parsedStatus.hasFilling) && (
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#15221B] shadow-xs",
                  showImplantInMode
                    ? "bg-[#2563EB]"
                    : showCrownInMode
                    ? "bg-[#06B6D4]"
                    : showCaries
                    ? "bg-[#DC2626]"
                    : showRestoredFilling
                    ? "bg-[#10B981]"
                    : showEndoInMode
                    ? "bg-[#F97316]"
                    : "bg-[#64748B]"
                )}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RealisticTooth3D;
