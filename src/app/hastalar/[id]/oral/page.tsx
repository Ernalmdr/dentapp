"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Users,
  Disc,
  Mic,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";
import { treatmentRecords as initialRecords, treatmentPrices } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { TreatmentRecord } from "@/lib/types";
import { GeometricOdontogram } from "@/components/oral/GeometricOdontogram";
import SchematicOdontogram from "@/components/oral/SchematicOdontogram";
import RealisticOdontogramArch from "@/components/oral/RealisticOdontogramArch";

// Helper to determine tooth category
function getToothType(num: number) {
  const lastDigit = num % 10;
  if (lastDigit === 6 || lastDigit === 7 || lastDigit === 8) return "molar";
  if (lastDigit === 4 || lastDigit === 5) return "premolar";
  if (lastDigit === 3) return "canine";
  return "incisor";
}

// Tooth component with realistic shape, root & crown, and treatment indicators
interface ToothProps {
  num: number;
  isUpper: boolean;
  isSelected: boolean;
  onClick: (num: number) => void;
  hasKanal?: boolean;
  hasDolgu?: boolean;
  hasImplant?: boolean;
}

function ToothItem({
  num,
  isUpper,
  isSelected,
  onClick,
  hasKanal,
  hasDolgu,
  hasImplant,
}: ToothProps) {
  const toothType = getToothType(num);
  const isMolar = toothType === "molar";
  const isPremolar = toothType === "premolar";

  return (
    <div
      onClick={() => onClick(num)}
      className={cn(
        "group flex flex-col items-center justify-between p-1 rounded-lg cursor-pointer transition-all duration-150 select-none",
        isSelected
          ? "bg-[#1F3327]/10 ring-2 ring-[#1F3327] shadow-2xs dark:bg-[#163321] dark:ring-[#285A3B]"
          : "hover:bg-[#EEEBE4]/80 dark:hover:bg-[#1E3026]"
      )}
      style={{ minWidth: "34px", maxWidth: "44px" }}
      title={`Diş #${num}${
        hasKanal
          ? " - Kanal Tedavisi"
          : hasDolgu
          ? " - Dolgu"
          : hasImplant
          ? " - İmplant"
          : ""
      }`}
    >
      {/* For upper jaw: Root points UP, Crown points DOWN */}
      {isUpper ? (
        <>
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 36 68"
              className={cn(
                "h-16 w-8 transition-transform group-hover:scale-105",
                isSelected && "drop-shadow-xs"
              )}
            >
              {/* Root */}
              {hasImplant ? (
                // Titanium Implant screw
                <g>
                  <rect
                    x="12"
                    y="6"
                    width="12"
                    height="32"
                    rx="3"
                    fill="#3F8F55"
                    opacity="0.85"
                  />
                  <line x1="10" y1="12" x2="26" y2="12" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="10" y1="18" x2="26" y2="18" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="10" y1="24" x2="26" y2="24" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="12" y1="30" x2="24" y2="30" stroke="#1F3327" strokeWidth="1.5" />
                </g>
              ) : isMolar ? (
                // Molar double/triple roots
                <path
                  d="M10,40 C8,22 6,8 12,4 C16,8 16,22 18,36 C20,22 20,8 24,4 C30,8 28,22 26,40 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              ) : isPremolar ? (
                <path
                  d="M12,40 C10,24 12,10 18,4 C24,10 26,24 24,40 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              ) : (
                // Anterior single tapered root
                <path
                  d="M13,40 C12,24 15,8 18,4 C21,8 24,24 23,40 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              )}

              {/* Root Canal orange line if kanal */}
              {hasKanal && (
                <path
                  d="M18,10 L18,36"
                  stroke="#7A5320"
                  strokeWidth="2"
                  strokeDasharray="2 1"
                />
              )}

              {/* Crown (at bottom for upper jaw) */}
              <path
                d="M6,38 C6,34 11,35 18,35 C25,35 30,34 30,38 C31,48 29,62 25,64 C21,66 15,66 11,64 C7,62 5,48 6,38 Z"
                fill={
                  hasDolgu
                    ? "#E3ECF7"
                    : hasImplant
                    ? "#E2EEDD"
                    : "#FFFFFF"
                }
                stroke={
                  hasDolgu
                    ? "#2C5282"
                    : hasImplant
                    ? "#2C6A3B"
                    : isSelected
                    ? "#1F3327"
                    : "#CBD5E1"
                }
                strokeWidth="1.5"
              />

              {/* Dolgu filling pattern inside crown */}
              {hasDolgu && (
                <circle cx="18" cy="48" r="4.5" fill="#2C5282" opacity="0.85" />
              )}
            </svg>

            {/* Treatment tiny indicator dot */}
            {(hasKanal || hasDolgu || hasImplant) && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 h-2 w-2 rounded-full",
                  hasKanal && "bg-[#B07D47]",
                  hasDolgu && "bg-[#2C5282]",
                  hasImplant && "bg-[#2C6A3B]"
                )}
              />
            )}
          </div>

          {/* Tooth Number below tooth */}
          <span
            className={cn(
              "mt-1 text-[11px] font-semibold transition-colors",
              isSelected
                ? "text-[#1F3327] dark:text-[#76D28F] font-bold"
                : "text-[#5F665F] dark:text-[#A2B5A8] group-hover:text-[#1C211E] dark:group-hover:text-[#ECF3EE]"
            )}
          >
            {num}
          </span>
        </>
      ) : (
        /* For lower jaw: Crown points UP, Root points DOWN */
        <>
          {/* Tooth Number above tooth for lower jaw */}
          <span
            className={cn(
              "mb-1 text-[11px] font-semibold transition-colors",
              isSelected
                ? "text-[#1F3327] dark:text-[#76D28F] font-bold"
                : "text-[#5F665F] dark:text-[#A2B5A8] group-hover:text-[#1C211E] dark:group-hover:text-[#ECF3EE]"
            )}
          >
            {num}
          </span>

          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 36 68"
              className={cn(
                "h-16 w-8 transition-transform group-hover:scale-105",
                isSelected && "drop-shadow-xs"
              )}
            >
              {/* Crown (at top for lower jaw) */}
              <path
                d="M6,30 C6,20 7,6 11,4 C15,2 21,2 25,4 C29,6 30,20 30,30 C30,34 25,33 18,33 C11,33 6,34 6,30 Z"
                fill={
                  hasDolgu
                    ? "#E3ECF7"
                    : hasImplant
                    ? "#E2EEDD"
                    : "#FFFFFF"
                }
                stroke={
                  hasDolgu
                    ? "#2C5282"
                    : hasImplant
                    ? "#2C6A3B"
                    : isSelected
                    ? "#1F3327"
                    : "#CBD5E1"
                }
                strokeWidth="1.5"
              />

              {/* Dolgu filling pattern inside crown */}
              {hasDolgu && (
                <circle cx="18" cy="20" r="4.5" fill="#2C5282" opacity="0.85" />
              )}

              {/* Root (pointing DOWN for lower jaw) */}
              {hasImplant ? (
                <g>
                  <rect
                    x="12"
                    y="30"
                    width="12"
                    height="32"
                    rx="3"
                    fill="#3F8F55"
                    opacity="0.85"
                  />
                  <line x1="10" y1="36" x2="26" y2="36" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="10" y1="42" x2="26" y2="42" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="10" y1="48" x2="26" y2="48" stroke="#1F3327" strokeWidth="1.5" />
                  <line x1="12" y1="54" x2="24" y2="54" stroke="#1F3327" strokeWidth="1.5" />
                </g>
              ) : isMolar ? (
                <path
                  d="M10,28 C8,46 6,60 12,64 C16,60 16,46 18,32 C20,46 20,60 24,64 C30,60 28,46 26,28 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              ) : isPremolar ? (
                <path
                  d="M12,28 C10,44 12,58 18,64 C24,58 26,44 24,28 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M13,28 C12,44 15,60 18,64 C21,60 24,44 23,28 Z"
                  fill={hasKanal ? "#F3EADB" : "#FBFAF7"}
                  stroke={hasKanal ? "#B07D47" : isSelected ? "#1F3327" : "#E6E1D8"}
                  strokeWidth="1.5"
                />
              )}

              {/* Root Canal orange line if kanal */}
              {hasKanal && (
                <path
                  d="M18,32 L18,58"
                  stroke="#7A5320"
                  strokeWidth="2"
                  strokeDasharray="2 1"
                />
              )}
            </svg>

            {/* Treatment tiny indicator dot */}
            {(hasKanal || hasDolgu || hasImplant) && (
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 h-2 w-2 rounded-full",
                  hasKanal && "bg-[#B07D47]",
                  hasDolgu && "bg-[#2C5282]",
                  hasImplant && "bg-[#2C6A3B]"
                )}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function OralOdontogramPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(36);
  const [dentitionType, setDentitionType] = useState<"daimi" | "sut">("daimi");
  const [diffDiagnosis, setDiffDiagnosis] = useState(false);
  const [chartView, setChartView] = useState("Anatomik");

  // Right Panel Form State
  const [dentist, setDentist] = useState("Dr. Selin Yılmaz");
  const [tariff, setTariff] = useState("TDB 2021");
  const [diagnosisLang, setDiagnosisLang] = useState("Türkçe");
  const [actionDate, setActionDate] = useState("09.09.2026");
  const [activeActionIcon, setActiveActionIcon] = useState<number>(0);
  const [treatmentType, setTreatmentType] = useState("Kanal Tedavisi");
  const [isSurgical, setIsSurgical] = useState("Hayır");
  const [findings, setFindings] = useState("");

  // Table state
  const [records, setRecords] = useState<TreatmentRecord[]>(initialRecords);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchPrice, setSearchPrice] = useState("");

  // Permanent teeth mapping
  const upperRightPermanent = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeftPermanent = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRightPermanent = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeftPermanent = [31, 32, 33, 34, 35, 36, 37, 38];

  // Primary (milk) teeth mapping
  const upperRightPrimary = [55, 54, 53, 52, 51];
  const upperLeftPrimary = [61, 62, 63, 64, 65];
  const lowerRightPrimary = [85, 84, 83, 82, 81];
  const lowerLeftPrimary = [71, 72, 73, 74, 75];

  const upperRight =
    dentitionType === "daimi" ? upperRightPermanent : upperRightPrimary;
  const upperLeft =
    dentitionType === "daimi" ? upperLeftPermanent : upperLeftPrimary;
  const lowerRight =
    dentitionType === "daimi" ? lowerRightPermanent : lowerRightPrimary;
  const lowerLeft =
    dentitionType === "daimi" ? lowerLeftPermanent : lowerLeftPrimary;

  // Toggle selection for treatment table
  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === records.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(records.map((r) => r.id));
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  // Add Treatment handler
  const handleAddProcedure = () => {
    const newRecord: TreatmentRecord = {
      id: String(Date.now()),
      date: actionDate,
      toothNo: selectedTooth || 11,
      treatment: treatmentType,
      dentist: dentist,
      total:
        treatmentPrices.find((p) => p.name === treatmentType)?.price || 1500,
      currency: "TRY",
    };
    setRecords([newRecord, ...records]);
    setFindings("");
  };

  // Treatment existence lookup
  const getToothStatus = (num: number) => {
    const match = records.find((r) => r.toothNo === num);
    if (!match) return {};
    return {
      hasKanal: match.treatment.toLowerCase().includes("kanal"),
      hasDolgu: match.treatment.toLowerCase().includes("dolgu"),
      hasImplant: match.treatment.toLowerCase().includes("implant"),
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Tooth Chart + Treatment History Table (8 cols) */}
        {/* ============================================================ */}
        <div className="space-y-6 lg:col-span-8">
          {/* Tooth Chart Card */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            {/* Top Toolbar: Toggles & Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E1D8] pb-4 dark:border-[#243B2F]">
              {/* Dentition Toggle */}
              <div className="flex items-center rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-1 dark:bg-[#1A2C23] dark:border-[#243B2F]">
                <button
                  type="button"
                  onClick={() => setDentitionType("daimi")}
                  className={cn(
                    "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    dentitionType === "daimi"
                      ? "bg-[#2D3A32] text-white shadow-xs dark:bg-[#1F3327]"
                      : "text-[#3F4540] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
                  )}
                >
                  Daimi Dişler
                </button>
                <button
                  type="button"
                  onClick={() => setDentitionType("sut")}
                  className={cn(
                    "rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    dentitionType === "sut"
                      ? "bg-[#2D3A32] text-white shadow-xs dark:bg-[#1F3327]"
                      : "text-[#3F4540] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
                  )}
                >
                  Süt Dişleri
                </button>
              </div>

              {/* Right filters / controls */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#3F4540] dark:text-[#ECF3EE]">
                  <input
                    type="checkbox"
                    checked={diffDiagnosis}
                    onChange={(e) => setDiffDiagnosis(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] dark:border-[#243B2F]"
                  />
                  <span>Diyagnozu farklı göster</span>
                </label>

                <select
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value)}
                  className="h-8 rounded-lg border border-[#E6E1D8] bg-white px-2.5 text-xs font-medium text-[#3F4540] outline-none transition focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Anatomik">Anatomik (2D)</option>
                  <option value="Geometrik">Geometrik (5 Yüzey)</option>
                  <option value="Şematik">Şematik (Klinik Blok)</option>
                  <option value="3D Gerçekçi">3D Gerçekçi Model (Figma)</option>
                </select>
              </div>
            </div>

            {/* Selected Tooth Info Banner (Fiyat Satırı Vurgusu rengi #F6EEDC / #EADFC8) */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-[#F6EEDC] px-4 py-2 border border-[#EADFC8] text-xs dark:bg-[#2C2415] dark:border-[#523E1E]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1C211E] dark:text-[#E8BA73]">Seçili Diş:</span>
                {selectedTooth ? (
                  <span className="inline-flex items-center rounded-md bg-[#1F3327] px-2 py-0.5 font-bold text-white shadow-2xs">
                    #{selectedTooth}
                  </span>
                ) : (
                  <span className="text-[#5F665F] dark:text-[#A2B5A8]">Diş seçilmedi</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#B07D47]" />
                  Kanal Tedavisi (36)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2C5282]" />
                  Dolgu (16)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2C6A3B]" />
                  İmplant (25)
                </span>
              </div>
            </div>

            {/* Odontogram Interactive Dental Arch Canvas */}
            {chartView === "Geometrik" ? (
              <div className="py-2">
                <GeometricOdontogram
                  selectedTooth={selectedTooth}
                  onSelectTooth={setSelectedTooth}
                />
              </div>
            ) : chartView === "Şematik" ? (
              <div className="py-2">
                <SchematicOdontogram
                  selectedTooth={selectedTooth}
                  onToothSelect={setSelectedTooth}
                  records={records}
                  dentitionType={dentitionType}
                  diffDiagnosis={diffDiagnosis}
                />
              </div>
            ) : chartView === "3D Gerçekçi" ? (
              <div className="py-2">
                <RealisticOdontogramArch
                  selectedTooth={selectedTooth}
                  onToothSelect={setSelectedTooth}
                />
              </div>
            ) : (
              <div className="overflow-x-auto py-2">
                <div className="min-w-[640px] space-y-6">
                  {/* Upper Jaw (Üst Çene) */}
                  <div>
                    <div className="mb-2 text-center text-[11px] font-serif font-bold tracking-wider text-[#5F665F] uppercase dark:text-[#A2B5A8]">
                      Üst Çene (Maksilla)
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      {/* Upper Right Quadrant (18 -> 11) */}
                      <div className="flex items-center justify-end gap-1">
                        {upperRight.map((num) => {
                          const status = getToothStatus(num);
                          return (
                            <ToothItem
                              key={num}
                              num={num}
                              isUpper={true}
                              isSelected={selectedTooth === num}
                              onClick={setSelectedTooth}
                              {...status}
                            />
                          );
                        })}
                      </div>

                      {/* Midline Divider */}
                      <div className="flex flex-col items-center justify-center h-20 px-1">
                        <div className="h-full w-0.5 border-r border-dashed border-[#E6E1D8] dark:border-[#243B2F]" />
                        <span className="text-[10px] text-[#5F665F] font-mono mt-0.5 dark:text-[#A2B5A8]">R|L</span>
                      </div>

                      {/* Upper Left Quadrant (21 -> 28) */}
                      <div className="flex items-center justify-start gap-1">
                        {upperLeft.map((num) => {
                          const status = getToothStatus(num);
                          return (
                            <ToothItem
                              key={num}
                              num={num}
                              isUpper={true}
                              isSelected={selectedTooth === num}
                              onClick={setSelectedTooth}
                              {...status}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Jaw Separator */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-[#E6E1D8] dark:border-[#243B2F]" />
                    <span className="absolute bg-[#FBFAF7] px-3 text-[10px] font-semibold text-[#5F665F] uppercase tracking-wider dark:bg-[#15221B] dark:text-[#A2B5A8]">
                      Oklüzal Düzlem
                    </span>
                  </div>

                  {/* Lower Jaw (Alt Çene) */}
                  <div>
                    <div className="flex items-center justify-center gap-3">
                      {/* Lower Right Quadrant (48 -> 41) */}
                      <div className="flex items-center justify-end gap-1">
                        {lowerRight.map((num) => {
                          const status = getToothStatus(num);
                          return (
                            <ToothItem
                              key={num}
                              num={num}
                              isUpper={false}
                              isSelected={selectedTooth === num}
                              onClick={setSelectedTooth}
                              {...status}
                            />
                          );
                        })}
                      </div>

                      {/* Midline Divider */}
                      <div className="flex flex-col items-center justify-center h-20 px-1">
                        <span className="text-[10px] text-[#5F665F] font-mono mb-0.5 dark:text-[#A2B5A8]">R|L</span>
                        <div className="h-full w-0.5 border-r border-dashed border-[#E6E1D8] dark:border-[#243B2F]" />
                      </div>

                      {/* Lower Left Quadrant (31 -> 38) */}
                      <div className="flex items-center justify-start gap-1">
                        {lowerLeft.map((num) => {
                          const status = getToothStatus(num);
                          return (
                            <ToothItem
                              key={num}
                              num={num}
                              isUpper={false}
                              isSelected={selectedTooth === num}
                              onClick={setSelectedTooth}
                              {...status}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-2 text-center text-[11px] font-serif font-bold tracking-wider text-[#5F665F] uppercase dark:text-[#A2B5A8]">
                      Alt Çene (Mandibula)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Treatment History Table */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] shadow-xs overflow-hidden dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] px-5 py-4 dark:border-[#243B2F]">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-[#1F3327] dark:text-[#76D28F]" />
                <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider dark:text-[#ECF3EE]">
                  Tedavi Geçmişi
                </h2>
                <span className="rounded-full bg-[#EEEBE4] px-2.5 py-0.5 text-xs font-semibold text-[#3F4540] dark:bg-[#1A2C23] dark:text-[#A2B5A8]">
                  {records.length} Kayıt
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-[#E6E1D8] bg-[#EEEBE4]/70 text-[11px] font-semibold uppercase tracking-wider text-[#5F665F] dark:border-[#243B2F] dark:bg-[#1A2C23] dark:text-[#A2B5A8]">
                  <tr>
                    <th className="py-3 pl-4 pr-2 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          records.length > 0 &&
                          selectedRows.length === records.length
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] cursor-pointer dark:border-[#243B2F]"
                      />
                    </th>
                    <th className="px-3 py-3">Tarih</th>
                    <th className="px-3 py-3">Diş</th>
                    <th className="px-3 py-3">Tedavi</th>
                    <th className="px-3 py-3">Dişhekimi</th>
                    <th className="px-3 py-3 text-right">Toplam</th>
                    <th className="px-3 py-3">P.Br.</th>
                    <th className="px-2 py-3 text-center w-12">Düzenle</th>
                    <th className="px-2 py-3 pr-4 text-center w-12">Sil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8] text-[#3F4540] dark:divide-[#243B2F] dark:text-[#ECF3EE]">
                  {records.map((record) => {
                    const isSelected = selectedRows.includes(record.id);
                    return (
                      <tr
                        key={record.id}
                        className={cn(
                          "transition-colors",
                          isSelected
                            ? "bg-[#F6EEDC] border-b border-[#EADFC8] dark:bg-[#2C2415] dark:border-[#523E1E]"
                            : "hover:bg-[#F6EEDC]/40 dark:hover:bg-[#1A2C23]/60"
                        )}
                      >
                        <td className="py-3 pl-4 pr-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(record.id)}
                            className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] cursor-pointer dark:border-[#243B2F]"
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-[#1C211E] whitespace-nowrap dark:text-[#ECF3EE]">
                          {record.date}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center justify-center rounded-md bg-[#EEEBE4] px-2 py-0.5 text-xs font-bold text-[#1C211E] dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
                            #{record.toothNo}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                          {record.treatment}
                        </td>
                        <td className="px-3 py-3 text-[#5F665F] whitespace-nowrap dark:text-[#A2B5A8]">
                          {record.dentist}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-[#1C211E] whitespace-nowrap dark:text-[#ECF3EE]">
                          {formatCurrency(record.total)}
                        </td>
                        <td className="px-3 py-3 font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                          {record.currency}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            title="Düzenle"
                            className="rounded p-1 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </td>
                        <td className="px-2 py-3 pr-4 text-center">
                          <button
                            type="button"
                            title="Sil"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="rounded p-1 text-[#5F665F] hover:bg-[#FBE9E7] hover:text-[#B3261E] transition cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#3D1A1A] dark:hover:text-[#FF8A80]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#5F665F] dark:text-[#A2B5A8]">
                        Kayıtlı tedavi bulunmamaktadır.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Oral Bilgiler + Tedavi Listesi / Fiyatlar (4 cols) */}
        {/* ============================================================ */}
        <div className="space-y-6 w-full lg:col-span-4">
          {/* Oral Bilgiler Panel */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="mb-4 flex items-center justify-between border-b border-[#E6E1D8] pb-3 dark:border-[#243B2F]">
              <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider dark:text-[#ECF3EE]">
                Oral Bilgiler
              </h2>
              {selectedTooth ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#1F3327] px-2 py-0.5 text-xs font-bold text-white shadow-2xs dark:bg-[#285A3B]">
                  Diş #{selectedTooth}
                </span>
              ) : (
                <span className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
                  Diş seçilmedi
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {/* Diş Hekimi */}
              <div className="space-y-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Diş Hekimi</label>
                <select
                  value={dentist}
                  onChange={(e) => setDentist(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                  <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                </select>
              </div>

              {/* Tarife */}
              <div className="space-y-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Tarife</label>
                <select
                  value={tariff}
                  onChange={(e) => setTariff(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="TDB 2021">TDB 2021</option>
                  <option value="TDB 2024">TDB 2024</option>
                </select>
              </div>

              {/* Diyagnoz */}
              <div className="space-y-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Diyagnoz</label>
                <select
                  value={diagnosisLang}
                  onChange={(e) => setDiagnosisLang(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Türkçe">Türkçe</option>
                  <option value="İngilizce">İngilizce</option>
                  <option value="Latince">Latince</option>
                </select>
              </div>

              {/* Tarih */}
              <div className="space-y-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Tarih</label>
                <div className="relative">
                  <input
                    type="text"
                    value={actionDate}
                    onChange={(e) => setActionDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F] dark:text-[#A2B5A8]" />
                </div>
              </div>

              {/* İşlemler: 4 icon buttons row (tooth, group, implant, mic) */}
              <div className="space-y-1 pt-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">İşlemler</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { title: "Tek Diş", icon: Stethoscope },
                    { title: "Grup", icon: Users },
                    { title: "İmplant", icon: Disc },
                    { title: "Sesli Komut", icon: Mic },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeActionIcon === idx;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setActiveActionIcon(idx)}
                        title={item.title}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-lg border transition-all cursor-pointer",
                          isActive
                            ? "bg-[#2D3A32] text-white border-[#2D3A32] shadow-2xs dark:bg-[#1F3327] dark:border-[#243B2F]"
                            : "bg-[#EEEBE4] border-[#E6E1D8] text-[#3F4540] hover:bg-[#EADFC8] hover:text-[#1C211E] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tedavi & Cerrahi (Grid 2 cols) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Tedavi</label>
                  <select
                    value={treatmentType}
                    onChange={(e) => setTreatmentType(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-2.5 text-xs text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Kanal Tedavisi">Kanal Tedavisi</option>
                    <option value="Dolgu">Dolgu</option>
                    <option value="Diş Çekimi">Diş Çekimi</option>
                    <option value="İmplant">İmplant</option>
                    <option value="Komplikasyonlu Diş Çekimi">
                      Komplikasyonlu Diş Çekimi
                    </option>
                    <option value="Gömülü Diş Operasyonu">
                      Gömülü Diş Operasyonu
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Cerrahi</label>
                  <select
                    value={isSurgical}
                    onChange={(e) => setIsSurgical(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-2.5 text-xs text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Hayır">Hayır</option>
                    <option value="Evet">Evet</option>
                  </select>
                </div>
              </div>

              {/* Bulgu */}
              <div className="space-y-1 pt-1">
                <label className="font-medium text-[#5F665F] dark:text-[#A2B5A8]">Bulgu</label>
                <input
                  type="text"
                  placeholder="Bulgu veya not giriniz..."
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] dark:placeholder-[#5F665F] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                />
              </div>

              {/* + İşlem Ekle Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddProcedure}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1F3327] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D3A32] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ İşlem Ekle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel Bottom: Tedavi Listesi / Fiyatlar */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="mb-3 flex items-center justify-between border-b border-[#E6E1D8] pb-3 dark:border-[#243B2F]">
              <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider dark:text-[#ECF3EE]">
                Tedavi Listesi / Fiyatlar
              </h2>
              <span className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">TDB 2021</span>
            </div>

            {/* Quick search */}
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5F665F] dark:text-[#A2B5A8]" />
              <input
                type="text"
                placeholder="Tedavi ara..."
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#E6E1D8] bg-white pl-8 pr-3 text-xs text-[#3F4540] placeholder-[#5F665F] dark:placeholder-[#5F665F] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
              />
            </div>

            {/* Price list */}
            <div className="divide-y divide-[#E6E1D8] max-h-60 overflow-y-auto pr-1 dark:divide-[#243B2F]">
              {treatmentPrices
                .filter((tp) =>
                  tp.name.toLowerCase().includes(searchPrice.toLowerCase())
                )
                .map((priceItem) => (
                  <div
                    key={priceItem.name}
                    onClick={() => setTreatmentType(priceItem.name)}
                    className="flex cursor-pointer items-center justify-between py-2.5 px-2 rounded-lg hover:bg-[#F6EEDC] transition-colors group dark:hover:bg-[#1A2C23]"
                  >
                    <span className="text-xs font-medium text-[#3F4540] group-hover:text-[#1C211E] group-hover:font-semibold dark:text-[#ECF3EE] dark:group-hover:text-[#76D28F]">
                      {priceItem.name}
                    </span>
                    <span className="text-xs font-bold text-[#1F3327] whitespace-nowrap pl-2 dark:text-[#76D28F]">
                      {formatCurrency(priceItem.price)} {priceItem.currency}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
