"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  FileImage,
  UploadCloud,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import { ArchiveImageItem } from "@/components/modals/ImageUploadModal";

export default function YeniGoruntuYuklePage() {
  const router = useRouter();
  const { showToast } = useModal();

  const [patientName, setPatientName] = useState("Tuğçe Üngör");
  const [type, setType] = useState("Panoramik");
  const [date, setDate] = useState("2026-11-21");
  const [doctor, setDoctor] = useState("Dr. Selin Yılmaz");
  const [region, setRegion] = useState("Tüm Çene");
  const [notes, setNotes] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState("/images/dashboard/xray-1.png");
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

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
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError("Seçilen dosya boyutu çok büyük (maksimum 15 MB).");
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError("Lütfen hasta adını belirtiniz.");
      return;
    }

    const finalImageSrc = customImageSrc || selectedPresetImage;

    const newRecord: ArchiveImageItem = {
      id: String(Date.now()),
      patientName: patientName.trim(),
      type,
      date: date.includes("-") ? date.split("-").reverse().join(".") : date,
      src: finalImageSrc,
      notes: notes.trim() || `${type} klinik kontrol görüntüsü`,
      doctor,
      region,
    };

    try {
      const stored = localStorage.getItem("dentapp_images_catalog");
      const currentList: ArchiveImageItem[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("dentapp_images_catalog", JSON.stringify([newRecord, ...currentList]));
    } catch {
      // ignore
    }

    showToast(`✓ "${patientName}" hastasına ait ${type} görüntüsü arşive kaydedildi.`, "success");
    router.push("/goruntuler");
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <BannerHeader
        title="Yeni Radyoloji Görüntüsü Yükle"
        description="Röntgen cihazından veya bilgisayarınızdan DICOM, JPEG ya da PNG formatında çekim aktarın."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Görüntüler", href: "/goruntuler" },
          { label: "Yeni Görüntü Yükle" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/goruntuler")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#5F665F]" />
            Görüntü Arşivine Dön
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 8 cols */}
        <div className="lg:col-span-8 rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#FBE9E7] border border-[#B3261E]/30 text-[#B3261E] text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Patient & Modality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  Hasta Adı Soyadı <span className="text-[#B3261E]">*</span>
                </label>
                <select
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  {patientList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  Çekim Türü (Modalite)
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Doctor & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  Çekim Tarihi
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  İşlemi Yapan Hekim
                </label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327]"
                >
                  <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                  <option value="Dt. Mahir Açıkalın">Dt. Mahir Açıkalın</option>
                  <option value="Dt. Kemal Aydın">Dt. Kemal Aydın</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  İlgili Çene / Diş No
                </label>
                <input
                  type="text"
                  value={region}
                  placeholder="Örn: 16 Molar"
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] placeholder-[#5F665F]/60 outline-none focus:border-[#1F3327]"
                />
              </div>
            </div>

            {/* File Drag and Drop */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                Röntgen Görüntü Dosyası
              </label>
              <div className="relative border-2 border-dashed border-[#E6E1D8] rounded-2xl p-6 text-center hover:bg-[#EEEBE4]/40 transition-colors">
                <input
                  type="file"
                  accept="image/*,.dcm"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-[#1F3327] mb-2" />
                  <span className="text-xs font-bold text-[#1C211E]">
                    {customImageSrc ? "Yeni Dosya Yüklendi" : "Röntgen veya Tomografi Dosyasını Buraya Sürükleyin"}
                  </span>
                  <p className="text-[11px] text-[#5F665F] mt-1">
                    DICOM (.dcm), TIFF, JPEG veya PNG (Maks. 15 MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-2">
                veya Klinik Örnek Şablonlarından Seçin:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetImages.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPresetImage(preset.src);
                      setCustomImageSrc(null);
                      setType(preset.defaultType);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      !customImageSrc && selectedPresetImage === preset.src
                        ? "border-[#1F3327] bg-[#E2EEDD] shadow-2xs"
                        : "border-[#E6E1D8] bg-[#FBFAF7] hover:bg-[#EEEBE4]/60"
                    }`}
                  >
                    <div className="relative h-12 w-16 rounded-lg bg-black overflow-hidden shrink-0">
                      <Image src={preset.src} alt={preset.label} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#1C211E]">
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-[#5F665F]">Yüksek Çözünürlüklü Radyoloji</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                Radyoloji Raporu & Klinik Endikasyon
              </label>
              <textarea
                rows={3}
                placeholder="Radyolojik bulgular, lezyon lokalizasyonu, mandibular sinir kanalı mesafesi..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-3 text-xs text-[#1C211E] placeholder-[#5F665F]/60 outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E1D8]">
              <button
                type="button"
                onClick={() => router.push("/goruntuler")}
                className="px-5 py-2.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] text-xs font-semibold text-[#1C211E] transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Görüntüyü Arşive Kaydet
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[#FBFAF7] p-5 border border-[#E6E1D8] shadow-xs">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#5F665F] mb-3">
              Canlı Görüntü Önizleme
            </h3>

            <div className="relative aspect-[16/11] w-full rounded-xl bg-black overflow-hidden border border-stone-800">
              <Image
                src={customImageSrc || selectedPresetImage}
                alt="Seçili Röntgen"
                fill
                className="object-contain"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg">
                <Sparkles className="h-3 w-3 text-[#2C6A3B]" />
                {type}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#5F665F]">
                <span>Hasta:</span>
                <span className="font-bold text-[#1C211E]">{patientName}</span>
              </div>
              <div className="flex justify-between text-[#5F665F]">
                <span>Hekim:</span>
                <span className="text-[#1C211E]">{doctor}</span>
              </div>
              <div className="flex justify-between text-[#5F665F]">
                <span>Bölge:</span>
                <span className="text-[#1C211E]">{region}</span>
              </div>
              <div className="flex justify-between text-[#5F665F]">
                <span>Format:</span>
                <span className="font-mono text-[#2C6A3B] font-bold">DICOM 3.0 Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
