"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Layers,
  Activity,
  FileText,
  ChevronRight,
  Zap,
  Info,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Eye,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RealisticTooth3D,
  getToothGroup,
  parseToothStatus,
  ToothStatusData,
} from "./RealisticTooth3D";

export interface ToothInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  isUpper?: boolean;
  status?: any;
  onApplyTreatment?: (toothNumber: number, treatmentType: string) => void;
  onPrintPatientForm?: (toothNumber: number) => void;
}

// Turkish anatomical name resolution for FDI teeth
export function getDetailedToothInfo(num: number) {
  const quadrant = Math.floor(num / 10);
  const position = num % 10;

  const quadrantNames: Record<number, { title: string; jaw: "Üst" | "Alt"; side: "Sağ" | "Sol" }> = {
    1: { title: "Üst Çene Sağ (1. Kadran)", jaw: "Üst", side: "Sağ" },
    2: { title: "Üst Çene Sol (2. Kadran)", jaw: "Üst", side: "Sol" },
    3: { title: "Alt Çene Sol (3. Kadran)", jaw: "Alt", side: "Sol" },
    4: { title: "Alt Çene Sağ (4. Kadran)", jaw: "Alt", side: "Sağ" },
    5: { title: "Süt Dişi Üst Sağ (5. Kadran)", jaw: "Üst", side: "Sağ" },
    6: { title: "Süt Dişi Üst Sol (6. Kadran)", jaw: "Üst", side: "Sol" },
    7: { title: "Süt Dişi Alt Sol (7. Kadran)", jaw: "Alt", side: "Sol" },
    8: { title: "Süt Dişi Alt Sağ (8. Kadran)", jaw: "Alt", side: "Sağ" },
  };

  const toothNames: Record<number, string> = {
    1: "Santral (Orta) Kesici",
    2: "Lateral (Yan) Kesici",
    3: "Kanin (Köpek Dişi)",
    4: "1. Küçük Azı (Premolar)",
    5: "2. Küçük Azı (Premolar)",
    6: "1. Büyük Azı (Molar)",
    7: "2. Büyük Azı (Molar)",
    8: "3. Büyük Azı (20 Yaş Dişi)",
  };

  const quad = quadrantNames[quadrant] || { title: "Belirtilmemiş Kadran", jaw: "Üst" as const, side: "Sağ" as const };
  const toothName = toothNames[position] || "Bilinmeyen Diş";
  const group = getToothGroup(num);

  const groupTR = {
    incisor: "Kesici Diş Grubu",
    canine: "Köpek Dişi Grubu",
    premolar: "Küçük Azı Grubu",
    molar: "Büyük Azı Grubu",
  }[group];

  return {
    fullName: `${quad.title} - ${toothName}`,
    shortName: toothName,
    quadrant: quad.title,
    jaw: quad.jaw,
    side: quad.side,
    groupTR,
    group,
    isUpper: quad.jaw === "Üst",
  };
}

export function ToothInspectorModal({
  isOpen,
  onClose,
  toothNumber,
  isUpper: propIsUpper,
  status,
  onApplyTreatment,
  onPrintPatientForm,
}: ToothInspectorModalProps) {
  const [mode, setMode] = useState<"before" | "after">("before");
  const [activeTab, setActiveTab] = useState<"diagnosis" | "treatment" | "prognosis">("diagnosis");
  const [rotX, setRotX] = useState<number>(0);
  const [rotY, setRotY] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset state on open/tooth change
  useEffect(() => {
    if (isOpen) {
      setMode("before");
      setRotX(0);
      setRotY(0);
      setIsConfirmed(false);
    }
  }, [isOpen, toothNumber]);

  if (!isOpen || toothNumber === null) return null;

  const toothInfo = getDetailedToothInfo(toothNumber);
  const isUpper = propIsUpper !== undefined ? propIsUpper : toothInfo.isUpper;
  const parsedStatus: ToothStatusData = parseToothStatus(status);

  // Generate dynamic diagnosis data based on tooth and status
  const hasCaries = parsedStatus.hasCaries || parsedStatus.condition === "caries";
  const hasEndo = parsedStatus.hasEndo || parsedStatus.hasKanal || parsedStatus.condition === "endodontic";
  const hasImplant = parsedStatus.hasImplant || parsedStatus.condition === "implant";
  const hasCrown = parsedStatus.hasCrown || parsedStatus.condition === "crown";
  const isMissing = parsedStatus.isMissing || parsedStatus.condition === "missing";
  const hasFilling = parsedStatus.hasFilling || parsedStatus.condition === "filling";

  // Preset camera angle buttons
  const setViewAngle = (x: number, y: number) => {
    setRotX(x);
    setRotY(y);
  };

  const handleApply = () => {
    setIsConfirmed(true);
    if (onApplyTreatment) {
      const treatmentPlan = hasEndo
        ? "Kanal Tedavisi + Zirkon Kron"
        : hasImplant || isMissing
        ? "İmplant Cerrahisi + Zirkon Kron"
        : hasCrown
        ? "Monolitik Zirkon Kaplama"
        : "Estetik Kompozit Dolgu";
      onApplyTreatment(toothNumber, treatmentPlan);
    }
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden",
          "bg-[#FAF8F5] border border-[#E6E1D8] text-[#1C211E]",
          "dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]"
        )}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E1D8] dark:border-[#243B2F] bg-white/70 dark:bg-[#121E17]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1F3327]/10 text-[#1F3327] dark:bg-[#2F5A3D]/25 dark:text-[#76D28F] font-bold text-lg">
              #{toothNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1C211E] dark:text-[#ECF3EE]">
                  {toothInfo.shortName}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#E7EEE6] text-[#2F5A3D] dark:bg-[#1E3026] dark:text-[#A2B5A8] border border-[#DDEBD8] dark:border-[#285A3B]/40">
                  {toothInfo.groupTR}
                </span>
              </div>
              <p className="text-xs text-[#5F665F] dark:text-[#9EB1A4]">
                {toothInfo.quadrant} • FDI Kodu: <span className="font-semibold">{toothNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5F665F] hover:text-[#1C211E] hover:bg-[#EEEBE4] dark:text-[#9EB1A4] dark:hover:text-[#ECF3EE] dark:hover:bg-[#1F3327] transition-colors"
              title="Kapat (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E6E1D8] dark:divide-[#243B2F]">
          {/* ================= LEFT COLUMN: 3D REALISTIC VIEW & BEFORE/AFTER ================= */}
          <div className="md:col-span-5 p-5 flex flex-col items-center justify-between bg-[#F5F2EA]/60 dark:bg-[#101A14]/50">
            {/* Top Switcher: Before vs After */}
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5F665F] dark:text-[#9EB1A4] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Görsel Simülasyon
              </span>

              {/* Mode Toggle Pill */}
              <div className="inline-flex p-0.5 rounded-lg bg-[#E6E1D8] dark:bg-[#1E3026] border border-[#D9D3C7] dark:border-[#285A3B]/40">
                <button
                  type="button"
                  onClick={() => setMode("before")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                    mode === "before"
                      ? "bg-white dark:bg-[#2D4536] text-[#1C211E] dark:text-white shadow-xs"
                      : "text-[#5F665F] dark:text-[#9EB1A4] hover:text-[#1C211E]"
                  )}
                >
                  Mevcut (Öncesi)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("after")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1",
                    mode === "after"
                      ? "bg-[#2F5A3D] text-white dark:bg-[#3F8F55] shadow-xs"
                      : "text-[#5F665F] dark:text-[#9EB1A4] hover:text-[#1C211E]"
                  )}
                >
                  <Sparkles className="w-3 h-3 text-[#A7F3D0]" />
                  Hedef (Sonrası)
                </button>
              </div>
            </div>

            {/* 3D Visualizer Canvas Box */}
            <div className="relative w-full aspect-[4/5] max-w-[280px] my-2 flex items-center justify-center rounded-2xl bg-gradient-to-b from-white/90 to-[#EDE8DE]/90 dark:from-[#16251D] dark:to-[#0D1510] border border-[#E6E1D8] dark:border-[#243B2F] shadow-inner p-4 overflow-hidden">
              {/* Subtle radial ambient glow behind tooth */}
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none opacity-40 transition-all duration-500",
                  mode === "after"
                    ? "bg-[radial-gradient(circle_at_center,#3F8F55_0%,transparent_70%)]"
                    : "bg-[radial-gradient(circle_at_center,#C2B294_0%,transparent_70%)]"
                )}
              />

              {/* Realistic Tooth Render Component */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <RealisticTooth3D
                  num={toothNumber}
                  isUpper={isUpper}
                  status={status}
                  size="xl"
                  mode={mode}
                  isSelected={false}
                  showNumber={false}
                  interactive={false}
                  rotationX={rotX}
                  rotationY={rotY}
                />
              </div>

              {/* Status Badge in 3D Canvas */}
              <div className="absolute top-3 left-3 z-20">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-xs border",
                    mode === "before"
                      ? hasCaries || hasEndo
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300"
                        : isMissing
                        ? "bg-slate-500/15 border-slate-500/30 text-slate-700 dark:text-slate-300"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-[#2F5A3D]/20 border-[#3F8F55]/40 text-[#2F5A3D] dark:text-[#76D28F]"
                  )}
                >
                  {mode === "before" ? (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      {hasCaries
                        ? "Aktif Kavitasyon"
                        : hasEndo
                        ? "Pulpa İltihabı"
                        : isMissing
                        ? "Eksik Diş Yuvası"
                        : hasImplant
                        ? "İmplant Planlandı"
                        : "Mevcut Durum"}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-[#3F8F55]" />
                      {hasEndo
                        ? "Hermetik Kanal & Zirkon"
                        : hasImplant || isMissing
                        ? "Osseointegrasyon Tamam"
                        : hasCrown
                        ? "Zirkon Monolitik Kron"
                        : "Estetik Nano-Kompozit"}
                    </>
                  )}
                </span>
              </div>

              {/* Interactive Rotation Reset Pill */}
              {(rotX !== 0 || rotY !== 0) && (
                <button
                  onClick={() => setViewAngle(0, 0)}
                  className="absolute bottom-3 right-3 z-20 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white text-[10px] flex items-center gap-1 backdrop-blur-sm transition-all"
                  title="Açıyı Sıfırla"
                >
                  <RotateCw className="w-3 h-3" />
                  Sıfırla
                </button>
              )}
            </div>

            {/* Quick 3D View Angle Controls */}
            <div className="w-full flex items-center justify-center gap-1.5 pt-2">
              <span className="text-[11px] text-[#5F665F] dark:text-[#9EB1A4] mr-1">3D Açı:</span>
              <button
                type="button"
                onClick={() => setViewAngle(0, 0)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all",
                  rotX === 0 && rotY === 0
                    ? "bg-[#1F3327] text-white border-[#1F3327] dark:bg-[#285A3B] dark:border-[#3F8F55]"
                    : "bg-white dark:bg-[#1E3026] border-[#E6E1D8] dark:border-[#243B2F] text-[#5F665F] dark:text-[#9EB1A4]"
                )}
              >
                Ön Yüz
              </button>
              <button
                type="button"
                onClick={() => setViewAngle(12, -20)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all",
                  rotY === -20
                    ? "bg-[#1F3327] text-white border-[#1F3327] dark:bg-[#285A3B] dark:border-[#3F8F55]"
                    : "bg-white dark:bg-[#1E3026] border-[#E6E1D8] dark:border-[#243B2F] text-[#5F665F] dark:text-[#9EB1A4]"
                )}
              >
                Çapraz (3D)
              </button>
              <button
                type="button"
                onClick={() => setViewAngle(isUpper ? -25 : 25, 0)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all",
                  rotX !== 0 && rotY === 0
                    ? "bg-[#1F3327] text-white border-[#1F3327] dark:bg-[#285A3B] dark:border-[#3F8F55]"
                    : "bg-white dark:bg-[#1E3026] border-[#E6E1D8] dark:border-[#243B2F] text-[#5F665F] dark:text-[#9EB1A4]"
                )}
              >
                Çiğneme / Oklüzal
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CLINICAL DETAILS & TABS ================= */}
          <div className="md:col-span-7 flex flex-col justify-between bg-white dark:bg-[#15221B]">
            {/* Tab navigation header */}
            <div className="flex border-b border-[#E6E1D8] dark:border-[#243B2F] px-5 pt-3 gap-2 bg-[#FAF8F5]/80 dark:bg-[#121E17]/60">
              <button
                type="button"
                onClick={() => setActiveTab("diagnosis")}
                className={cn(
                  "pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5",
                  activeTab === "diagnosis"
                    ? "border-[#2F5A3D] text-[#2F5A3D] dark:border-[#76D28F] dark:text-[#76D28F]"
                    : "border-transparent text-[#5F665F] dark:text-[#9EB1A4] hover:text-[#1C211E]"
                )}
              >
                <Activity className="w-3.5 h-3.5" />
                Teşhis & Lezyon
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("treatment")}
                className={cn(
                  "pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5",
                  activeTab === "treatment"
                    ? "border-[#2F5A3D] text-[#2F5A3D] dark:border-[#76D28F] dark:text-[#76D28F]"
                    : "border-transparent text-[#5F665F] dark:text-[#9EB1A4] hover:text-[#1C211E]"
                )}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Tedavi Protokolü
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("prognosis")}
                className={cn(
                  "pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5",
                  activeTab === "prognosis"
                    ? "border-[#2F5A3D] text-[#2F5A3D] dark:border-[#76D28F] dark:text-[#76D28F]"
                    : "border-transparent text-[#5F665F] dark:text-[#9EB1A4] hover:text-[#1C211E]"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Hedef & Prognoz
              </button>
            </div>

            {/* Tab content area */}
            <div className="p-5 flex-1 space-y-4">
              {/* TAB 1: DIAGNOSIS & LESION ANALYSIS */}
              {activeTab === "diagnosis" && (
                <div className="space-y-4">
                  {/* Depth Progress Card */}
                  <div className="p-4 rounded-xl bg-[#F7F5EE] dark:bg-[#1B2B21] border border-[#E6E1D8] dark:border-[#285A3B]/40">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                        Patolojik Derinlik Derecesi
                      </span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {hasEndo ? "%85 (Pulpa İntikamı)" : hasCaries ? "%60 (Dentin Kavitasyonu)" : "%0 (Sağlıklı)"}
                      </span>
                    </div>

                    {/* Multi-stage anatomical depth bar */}
                    <div className="w-full h-3 rounded-full bg-[#E0DDD5] dark:bg-[#121E17] overflow-hidden flex">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          hasEndo ? "w-full bg-rose-500" : hasCaries ? "w-3/5 bg-amber-500" : "w-1/10 bg-emerald-500"
                        )}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#5F665F] dark:text-[#9EB1A4] mt-1.5">
                      <span>Mine Tabakası</span>
                      <span>Dentin Kanalları</span>
                      <span>Pulpa & Kök</span>
                    </div>
                  </div>

                  {/* Diagnostic details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A2920] border border-[#E6E1D8] dark:border-[#243B2F]">
                      <div className="text-[11px] text-[#5F665F] dark:text-[#9EB1A4]">Vitalite & Termal Test</div>
                      <div className="text-sm font-semibold mt-0.5 text-[#1C211E] dark:text-[#ECF3EE] flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        {hasEndo ? "Hipersensitif / Nekroz" : hasCaries ? "Hafif Hassasiyet (+)" : "Normoreaktif (+)"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A2920] border border-[#E6E1D8] dark:border-[#243B2F]">
                      <div className="text-[11px] text-[#5F665F] dark:text-[#9EB1A4]">Periapikal Kemik Durumu</div>
                      <div className="text-sm font-semibold mt-0.5 text-[#1C211E] dark:text-[#ECF3EE] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#3F8F55]" />
                        {hasEndo ? "Hafif PDL Genişlemesi" : "Normal Lamina Dura"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A2920] border border-[#E6E1D8] dark:border-[#243B2F]">
                      <div className="text-[11px] text-[#5F665F] dark:text-[#9EB1A4]">Çiğneme / Perküsyon</div>
                      <div className="text-sm font-semibold mt-0.5 text-[#1C211E] dark:text-[#ECF3EE]">
                        {hasEndo ? "Aksiyal Hassasiyet Var" : "Asemptomatik (Ağrısız)"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A2920] border border-[#E6E1D8] dark:border-[#243B2F]">
                      <div className="text-[11px] text-[#5F665F] dark:text-[#9EB1A4]">Klinik Teşhis Kodu</div>
                      <div className="text-sm font-semibold mt-0.5 text-[#2F5A3D] dark:text-[#76D28F]">
                        {hasEndo ? "K04.0 (Akut Pulpitis)" : hasCaries ? "K02.1 (Dentin Çürüğü)" : "K00.0 (Sağlıklı)"}
                      </div>
                    </div>
                  </div>

                  {/* Doctor's clinical observation note */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold">Klinik Hekim Görüşü:</p>
                      <p className="mt-0.5 leading-relaxed text-[11px] opacity-90">
                        {hasEndo
                          ? "Derin fissür kavitasyonu pulpa tavanına yaklaşmış olup spontan gece ağrısı bildirilmiştir. Kök kanal anatomisi 3 boyutlu şekillendirilerek biyouyumlu termoplastik gütaperka ile tıkanmalıdır."
                          : hasCaries
                          ? "Oklüzal tüberkül aralığında mikromekanik tutuculuğu olan çürük kavitesi saptanmıştır. Sağlıklı doku korunarak minimal invaziv kompozit estetik dolgu önerilir."
                          : isMissing || hasImplant
                          ? "Alveoler kret genişliği ve dikey kemik yüksekliği implant cerrahisi için uygundur. Kemik yoğunluğu D2 sınıfındadır."
                          : "Diş ve çevre periodonsiyum dokuları sağlıklı olup yılda iki kez rutin profilaksi tavsiye edilir."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECOMMENDED TREATMENT PROTOCOL */}
              {activeTab === "treatment" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#2F5A3D]/10 dark:bg-[#285A3B]/25 border border-[#2F5A3D]/30 dark:border-[#3F8F55]/40 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">Önerilen Ana Tedavi</div>
                      <div className="text-sm font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                        {hasEndo
                          ? "Mikroskobik Kök Kanal Tedavisi + Zirkonyum Kron"
                          : hasImplant || isMissing
                          ? "Straumann Titanyum İmplant + Vidalı Zirkon Kron"
                          : hasCrown
                          ? "Monolitik Zirkon Kaplama (CAD/CAM)"
                          : "Mikrohibrit Kompozit Dolgu (Estelite)"}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-[#2F5A3D] text-white dark:bg-[#3F8F55]">
                      1 Seans • ~45 Dk
                    </span>
                  </div>

                  {/* Step by step treatment procedure */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                      Adım Adım Tedavi Akışı:
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {[
                        { step: 1, title: "Dijital Konforlu Anestezi", desc: "Bilgisayar kontrollü milimetrik ağrısız uyuşturma" },
                        { step: 2, title: "İzolasyon & Çürük Ekskavasyonu", desc: "Rubber-dam izolasyonu altında çürük dokunun mikro-freze ile arındırılması" },
                        { step: 3, title: hasEndo ? "NiTi Kanal Şekillendirme" : "Asit & Üniversal Bond Uygulaması", desc: hasEndo ? "Döner aletlerle kök kanallarının apexe kadar genişletilmesi" : "Mine ve dentin yüzeyine mikro-tutucu nano-tabaka oluşumu" },
                        { step: 4, title: hasEndo ? "Biyoseramik 3D Gütaperka Dolum" : "Tabakalama Tekniğiyle Kompozit", desc: hasEndo ? "Sıcak termoplastik gütaperka ile sızdırmaz apikal tıkama" : "Doğal mine tüberküllerinin anatomik modellenmesi" },
                        { step: 5, title: "Polisaj & Oklüzal Uyumlandırma", desc: "Elmas disk ve keçelerle doğal ayna parlaklığı verilmesi" },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#1A2920] border border-[#E6E1D8]/60 dark:border-[#243B2F]/60"
                        >
                          <div className="h-5 w-5 rounded-full bg-[#1F3327] dark:bg-[#3F8F55] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-[#1C211E] dark:text-[#ECF3EE]">{item.title}: </span>
                            <span className="text-[#5F665F] dark:text-[#9EB1A4] text-[11px]">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POST-TREATMENT PROGNOSIS & TARGET */}
              {activeTab === "prognosis" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300">%98.4</div>
                      <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mt-0.5">
                        Klinik Başarı Oranı
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                        10 Yıllık literatür takibi
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <div className="text-2xl font-black text-blue-800 dark:text-blue-300">9.8 / 10</div>
                      <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mt-0.5">
                        Estetik Memnuniyet
                      </div>
                      <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-1">
                        VITA A2 doğal ışık uyumu
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2920] border border-[#E6E1D8] dark:border-[#243B2F] space-y-2">
                    <div className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#3F8F55]" />
                      Hastaya Sağlanan Avantajlar:
                    </div>
                    <ul className="text-xs space-y-1.5 text-[#5F665F] dark:text-[#9EB1A4]">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3F8F55] shrink-0" />
                        Doğal çiğneme kuvvetine %100 dayanıklı biyomekanik direnç.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3F8F55] shrink-0" />
                        Sıcak/soğuk hassasiyetini tamamen ortadan kaldıran sızdırmaz mühürleme.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3F8F55] shrink-0" />
                        Renk değiştirmez nano-dolgulu estetik yüzey cilası.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ================= MODAL FOOTER ACTIONS ================= */}
            <div className="p-4 border-t border-[#E6E1D8] dark:border-[#243B2F] bg-[#FAF8F5] dark:bg-[#121E17]/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {onPrintPatientForm && (
                  <button
                    type="button"
                    onClick={() => onPrintPatientForm(toothNumber)}
                    className="px-3 py-2 text-xs font-medium rounded-xl border border-[#D9D3C7] dark:border-[#285A3B] text-[#5F665F] dark:text-[#A2B5A8] hover:bg-white dark:hover:bg-[#1E3026] transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hasta Bilgilendirme</span> Formu
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9D3C7] dark:border-[#243B2F] text-[#5F665F] dark:text-[#9EB1A4] hover:bg-white dark:hover:bg-[#1E3026] transition-colors"
                >
                  Kapat
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isConfirmed}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-sm flex items-center gap-1.5",
                    isConfirmed
                      ? "bg-emerald-600 text-white"
                      : "bg-[#1F3327] hover:bg-[#2D4536] dark:bg-[#2F5A3D] dark:hover:bg-[#3F8F55]"
                  )}
                >
                  {isConfirmed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tedavi Planlandı!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#A7F3D0]" />
                      Tedaviyi Planla & Onayla
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToothInspectorModal;
