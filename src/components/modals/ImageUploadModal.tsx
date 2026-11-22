"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  UploadCloud,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export interface ArchiveImageItem {
  id: string;
  patientName: string;
  type: string;
  date: string;
  src: string;
  notes: string;
  doctor?: string;
  region?: string;
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ArchiveImageItem) => void;
  initialData?: ArchiveImageItem | null;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ImageUploadModalProps) {
  const isEditing = !!initialData;

  const [patientName, setPatientName] = useState("");
  const [type, setType] = useState("Panoramik");
  const [date, setDate] = useState("2026-11-21");
  const [doctor, setDoctor] = useState("Dr. Selin Yılmaz");
  const [region, setRegion] = useState("Tüm Çene");
  const [notes, setNotes] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState("/images/dashboard/xray-1.png");
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presetImages = [
    { label: "Panoramik Röntgen (Geniş Çene)", src: "/images/dashboard/xray-1.png", defaultType: "Panoramik" },
    { label: "Periapikal Röntgen (Kök Ucu)", src: "/images/dashboard/xray-2.png", defaultType: "Periapikal" },
    { label: "CBCT (3D Tomografi Kesiti)", src: "/images/dashboard/xray-3.png", defaultType: "CBCT (3D)" },
    { label: "Bitewing (Arayüz Çürük Kontrol)", src: "/images/dashboard/xray-4.png", defaultType: "Bitewing" },
  ];

  const types = ["Panoramik", "Periapikal", "CBCT (3D)", "Bitewing", "Sefalometrik", "Ağız İçi Fotoğraf"];

  const patientList = [
    "Tuğçe Üngör",
    "Ayşe Demir",
    "Mehmet Kaya",
    "Zeynep Arslan",
    "Emre Çelik",
    "Mahir Açıkalın",
    "Kemal Aydın",
    "Diğer (Özel Giriniz)",
  ];

  useEffect(() => {
    if (initialData) {
      setPatientName(initialData.patientName);
      setType(initialData.type);
      setDate(initialData.date || "2026-11-21");
      setDoctor(initialData.doctor || "Dr. Selin Yılmaz");
      setRegion(initialData.region || "Tüm Çene");
      setNotes(initialData.notes || "");
      if (initialData.src?.startsWith("data:") || initialData.src?.startsWith("blob:")) {
        setCustomImageSrc(initialData.src);
      } else {
        setSelectedPresetImage(initialData.src || "/images/dashboard/xray-1.png");
        setCustomImageSrc(null);
      }
    } else {
      setPatientName("Tuğçe Üngör");
      setType("Panoramik");
      setDate(new Date().toISOString().split("T")[0]);
      setDoctor("Dr. Selin Yılmaz");
      setRegion("Tüm Çene");
      setNotes("");
      setSelectedPresetImage("/images/dashboard/xray-1.png");
      setCustomImageSrc(null);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError("Dosya boyutu çok büyük (maksimum 15 MB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError("Lütfen hasta adını belirtiniz.");
      return;
    }

    const finalImageSrc = customImageSrc || selectedPresetImage;

    const item: ArchiveImageItem = {
      id: initialData?.id || String(Date.now()),
      patientName: patientName === "Diğer (Özel Giriniz)" ? "Hasta" : patientName.trim(),
      type,
      date: date.includes("-") ? date.split("-").reverse().join(".") : date,
      src: finalImageSrc,
      notes: notes.trim() || `${type} klinik kontrol görüntüsü`,
      doctor,
      region,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-xl mx-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] shadow-2xl flex flex-col text-[#1C211E] dark:text-[#ECF3EE]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E6E1D8] dark:border-[#243B2F] bg-[#EEEBE4]/60 dark:bg-[#1A2C23]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2EEDD] dark:bg-[#1D3328] text-[#1F3327] dark:text-[#7CC9A6]">
              <FileImage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                {isEditing ? "Röntgen Kaydını Düzenle" : "Yeni Röntgen & Görüntü Yükle"}
              </h2>
              <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                DICOM / JPEG / PNG formatında klinik radyoloji arşivi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-[#ECF3EE] hover:bg-[#EEEBE4] dark:hover:bg-[#1D3328] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FBE9E7] border border-[#B3261E]/30 text-[#B3261E] text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Selection & Modality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Hasta Adı Soyadı <span className="text-[#B3261E]">*</span>
              </label>
              <select
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] px-3 py-2 text-xs outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              >
                {patientList.map((p) => (
                  <option key={p} value={p} className="dark:bg-[#1A2C23]">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Radyoloji Modalitesi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] px-3 py-2 text-xs outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="dark:bg-[#1A2C23]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Doctor & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Çekim Tarihi
              </label>
              <input
                type="date"
                value={date.includes(".") ? date.split(".").reverse().join("-") : date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] px-2.5 py-2 text-xs outline-none focus:border-[#1F3327]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Sorumlu Hekim
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] px-2.5 py-2 text-xs outline-none focus:border-[#1F3327]"
              >
                <option value="Dr. Selin Yılmaz" className="dark:bg-[#1A2C23]">Dr. Selin Yılmaz</option>
                <option value="Dt. Mahir Açıkalın" className="dark:bg-[#1A2C23]">Dt. Mahir Açıkalın</option>
                <option value="Dt. Kemal Aydın" className="dark:bg-[#1A2C23]">Dt. Kemal Aydın</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Bölge / Diş No
              </label>
              <input
                type="text"
                value={region}
                placeholder="Örn: 16 Molar"
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] placeholder-[#5F665F]/60 dark:placeholder-[#5E7569] px-3 py-2 text-xs outline-none focus:border-[#1F3327]"
              />
            </div>
          </div>

          {/* Image Upload or Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
              Röntgen / Görüntü Kaynağı
            </label>

            {/* Custom file drop */}
            <div className="relative border-2 border-dashed border-[#E6E1D8] dark:border-[#243B2F] rounded-xl p-4 text-center hover:bg-[#EEEBE4]/40 dark:hover:bg-[#1D3328] transition-colors mb-3">
              <input
                type="file"
                accept="image/*,.dcm"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="h-6 w-6 text-[#1F3327] dark:text-[#7CC9A6] mb-1" />
                <span className="text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                  {customImageSrc ? "Yeni Dosya Seçildi (Önizleme Aşağıda)" : "Cihazdan Röntgen Dosyası Yükleyin"}
                </span>
                <span className="text-[10px] text-[#5F665F] dark:text-[#A2B5A8]">DICOM, JPEG, PNG veya TIFF (Maks. 15MB)</span>
              </div>
            </div>

            {/* Or choose from clinical presets */}
            <span className="block text-[11px] font-medium text-[#5F665F] dark:text-[#A2B5A8] mb-2">
              veya Hazır Klinik Röntgen Şablonlarından Seçin:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presetImages.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPresetImage(preset.src);
                    setCustomImageSrc(null);
                    setType(preset.defaultType);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    !customImageSrc && selectedPresetImage === preset.src
                      ? "border-[#1F3327] dark:border-[#3F8F55] bg-[#E2EEDD] dark:bg-[#1D3328]"
                      : "border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] hover:bg-[#EEEBE4]/60 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  <div className="relative h-10 w-12 rounded bg-black overflow-hidden shrink-0">
                    <Image src={preset.src} alt={preset.label} fill className="object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-[#1C211E] dark:text-[#ECF3EE] line-clamp-2">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
              Radyoloji Ön Tanı & Klinik Not
            </label>
            <textarea
              rows={2}
              placeholder="Sol alt 38 nolu gömülü diş kontrolü, arayüz çürük taraması, implant planlama..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] p-2.5 text-xs text-[#1C211E] dark:text-[#ECF3EE] placeholder-[#5F665F]/60 dark:placeholder-[#5E7569] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#EEEBE4] dark:bg-[#1A2C23] hover:bg-[#E6E1D8] dark:hover:bg-[#1D3328] text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE] transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isEditing ? "Değişiklikleri Kaydet" : "Arşive Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
