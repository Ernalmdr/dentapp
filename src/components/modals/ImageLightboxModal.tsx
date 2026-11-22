"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Sun,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileText,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { useModal } from "./ModalContext";

export function ImageLightboxModal() {
  const { lightboxData, closeLightbox, showToast } = useModal();
  const [zoom, setZoom] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);
  const [activeTab, setActiveTab] = useState<"findings" | "teeth" | "bone">("findings");

  if (!lightboxData.isOpen) return null;

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiDetected(true);
      showToast("✓ Dental Vision AI: 3 patolojik bulgu ve kemik seviyesi analiz edildi.", "success");
    }, 1200);
  };

  const resetFilters = () => {
    setZoom(1);
    setContrast(100);
    setBrightness(100);
    setIsInverted(false);
    setAiDetected(false);
  };

  const handleAddToPatientCard = () => {
    showToast(`✓ AI radyoloji raporu ${lightboxData.patientName} hasta kartına ve klinik notlara eklendi.`, "success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl bg-stone-950 border border-stone-800 text-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-900/70">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                {lightboxData.patientName} — {lightboxData.type}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  DICOM 3.0
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Çekim Tarihi: {lightboxData.date || "Bugün"} • Radyoloji Teşhis Ekranı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Diagnose Button */}
            <button
              onClick={handleAiAnalysis}
              disabled={isAiAnalyzing}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                aiDetected
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              }`}
            >
              <Sparkles className={`h-4 w-4 ${isAiAnalyzing ? "animate-spin" : ""}`} />
              <span>
                {isAiAnalyzing
                  ? "Dental Vision AI Taranıyor..."
                  : aiDetected
                  ? "AI Teşhis Katmanı Aktif"
                  : "Yapay Zeka ile Analiz Et"}
              </span>
            </button>

            <button
              onClick={closeLightbox}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport & AI Findings Layout */}
        <div className="relative flex-1 bg-black flex overflow-hidden select-none">
          {/* Main X-Ray Image Viewport */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <div
              className="relative w-full h-full max-w-3xl max-h-[62vh] transition-transform duration-100"
              style={{
                transform: `scale(${zoom})`,
                filter: `contrast(${contrast}%) brightness(${brightness}%) ${isInverted ? "invert(1)" : ""}`,
              }}
            >
              <Image
                src={lightboxData.imageSrc}
                alt={lightboxData.title}
                fill
                className="object-contain"
              />

              {/* AI Diagnostic Highlights Simulation Overlay */}
              {aiDetected && (
                <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                  {/* Box 1: Caries detection on Tooth 36 */}
                  <div className="absolute left-[33%] top-[41%] w-16 h-16 border-2 border-red-500 bg-red-500/20 rounded-md animate-pulse">
                    <span className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      %94 Çürük (36)
                    </span>
                  </div>

                  {/* Box 2: Periapical Lesion on Tooth 24 */}
                  <div className="absolute left-[63%] top-[54%] w-16 h-16 border-2 border-amber-400 bg-amber-400/20 rounded-md animate-pulse">
                    <span className="absolute -top-6 left-0 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      %89 Apikal Lezyon (24)
                    </span>
                  </div>

                  {/* Box 3: Marginal Bone Loss indicator */}
                  <div className="absolute left-[24%] top-[48%] w-24 h-1 border-t-2 border-dashed border-sky-400 bg-transparent">
                    <span className="absolute -top-5 left-0 bg-sky-600 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                      Kemik Kaybı: 3.2mm
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Findings Sidebar (Visible when AI is active) */}
          {aiDetected && (
            <div className="w-80 border-l border-stone-800 bg-stone-900/90 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="p-4 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    AI Tespit Raporu
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                    YOLOv8-Dental
                  </span>
                </div>

                {/* Finding 1 */}
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-300">36 Nolu Diş — Derin Dentin Çürüğü</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white font-mono">%94 Güven</span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Oklüzal-distal yüzeyde pulpaya yakın radyolüsensi. Endodontik değerlendirme önerilir.
                  </p>
                </div>

                {/* Finding 2 */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">24 Nolu Diş — Apikal Radyolüsensi</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-600 text-white font-mono">%89 Güven</span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Kök ucunda periapikal periodontit şüphesi. Kanal dolgusunun yenilenmesi (Retreatment) önerilir.
                  </p>
                </div>

                {/* Finding 3 */}
                <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">Horizontal Marjinal Kemik Kaybı</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono">%92 Güven</span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Sol alt molar bölgede 3.2 mm seviyesinde alveol kret rezorpsiyonu. Subgingival küretaj planlanabilir.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 border-t border-stone-800 bg-stone-900">
                <button
                  type="button"
                  onClick={handleAddToPatientCard}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2D4A3E] hover:bg-[#3A5F50] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Bulguları Hasta Kartına İşle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Detection Summary Bar if active */}
        {aiDetected && (
          <div className="px-6 py-2 bg-emerald-950/50 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Yapay Zeka Klinik Teşhis Özeti:</strong> 36 nolu molar ve 24 nolu premolarda tedavi gereksinimi tespit edildi.
              </span>
            </div>
            <button
              onClick={() => setAiDetected(false)}
              className="text-stone-400 hover:text-white underline text-[11px] cursor-pointer"
            >
              Vurgulamaları Kapat
            </button>
          </div>
        )}

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 border-t border-stone-800 bg-stone-900/90 text-xs">
          <div className="flex items-center gap-4">
            {/* Zoom */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                title="Uzaklaştır"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="font-mono text-stone-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                title="Yakınlaştır"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Invert */}
            <button
              onClick={() => setIsInverted((v) => !v)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isInverted
                  ? "bg-stone-100 text-stone-900 border-white"
                  : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
              }`}
            >
              Negatif / Pozitif
            </button>

            {/* Contrast */}
            <div className="flex items-center gap-1.5 text-stone-400">
              <span>Kontrast:</span>
              <input
                type="range"
                min="50"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div className="flex items-center gap-1.5 text-stone-400">
              <span>Parlaklık:</span>
              <input
                type="range"
                min="50"
                max="180"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="text-stone-400 hover:text-white text-xs underline cursor-pointer"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}
