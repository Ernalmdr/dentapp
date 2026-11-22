"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Stethoscope,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Hash,
  DollarSign,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import { TreatmentItem } from "@/components/modals/TreatmentModal";

export default function YeniTedaviEklePage() {
  const router = useRouter();
  const { showToast } = useModal();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TreatmentItem["category"]>("Restoratif");
  const [tdbCode, setTdbCode] = useState("TDB-7001");
  const [price, setPrice] = useState<string>("1500");
  const [currency, setCurrency] = useState("TRY");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [vatPercent, setVatPercent] = useState<number>(10);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setTdbCode(`TDB-${Math.floor(1000 + Math.random() * 8999)}`);
  }, []);

  const categories: TreatmentItem["category"][] = [
    "Cerrahi",
    "Endodonti",
    "Restoratif",
    "Protez",
    "Periodontoloji",
    "Estetik",
  ];

  // Quick preset templates to speed up clinical workflow
  const presetTemplates = [
    { name: "Kompozit Dolgu (Tek Yüzlü)", category: "Restoratif" as const, price: 1100, code: "TDB-3001", duration: 30 },
    { name: "Kanal Tedavisi (İki Kanallı)", category: "Endodonti" as const, price: 3400, code: "TDB-2002", duration: 50 },
    { name: "Zirkonyum Kron Kaplama (Üye Başı)", category: "Protez" as const, price: 6500, code: "TDB-4001", duration: 45 },
    { name: "Diş Taşı Temizliği (Detertraj)", category: "Periodontoloji" as const, price: 1200, code: "TDB-5001", duration: 30 },
    { name: "Komplikasyonlu Diş Çekimi", category: "Cerrahi" as const, price: 1200, code: "TDB-1002", duration: 35 },
    { name: "Ofis Tipi Diş Beyazlatma", category: "Estetik" as const, price: 5500, code: "TDB-6001", duration: 60 },
  ];

  const handleApplyPreset = (p: typeof presetTemplates[0]) => {
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setTdbCode(p.code);
    setDurationMinutes(p.duration);
    showToast(`✓ "${p.name}" şablonu forma uygulandı.`, "info");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Lütfen tedavi adını doldurunuz.");
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Lütfen geçerli bir fiyat giriniz (0'dan büyük olmalı).");
      return;
    }

    const newTreatment: TreatmentItem = {
      id: String(Date.now()),
      name: name.trim(),
      category,
      tdbCode: tdbCode.trim() || `TDB-${Math.floor(1000 + Math.random() * 8999)}`,
      price: numPrice,
      currency,
      durationMinutes,
      vatPercent,
      description: description.trim(),
    };

    // Store in localStorage
    try {
      const stored = localStorage.getItem("dentapp_treatments_catalog");
      const currentList: TreatmentItem[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("dentapp_treatments_catalog", JSON.stringify([newTreatment, ...currentList]));
    } catch {
      // ignore
    }

    showToast(`✓ "${name}" tedavisi başarıyla eklendi (${numPrice.toLocaleString("tr-TR")} ${currency}).`, "success");
    router.push("/tedaviler");
  };

  const calculatedVat = (Number(price) || 0) * (vatPercent / 100);
  const calculatedTotalWithVat = (Number(price) || 0) + calculatedVat;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <BannerHeader
        title="Yeni Tedavi & Fiyat Tanımlama"
        description="Klinik fiyat listesine yeni tıbbi prosedür ekleyin veya TDB asgari tarifesinden içe aktarın."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Tedaviler", href: "/tedaviler" },
          { label: "Yeni Tedavi Ekle" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push("/tedaviler")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#5F665F]" />
            Tedaviler Listesine Dön
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

            {/* Treatment Name */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                Tedavi & Prosedür Adı <span className="text-[#B3261E]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Kompozit Dolgu (Tek Yüzlü)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] text-xs text-[#1C211E] placeholder-[#5F665F]/60 px-3 outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              />
            </div>

            {/* Category & TDB Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  Uzmanlık / Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TreatmentItem["category"])}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  TDB 2026 Asgari Ücret Kodu
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F]" />
                  <input
                    type="text"
                    value={tdbCode}
                    onChange={(e) => setTdbCode(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] pl-9 pr-3 text-xs text-[#1C211E] font-mono outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>
              </div>
            </div>

            {/* Price, Currency & VAT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  Klinik Liste Fiyatı (KDV Hariç) <span className="text-[#B3261E]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F]" />
                    <input
                      type="number"
                      min="1"
                      step="50"
                      required
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] pl-9 pr-3 text-sm font-mono font-bold text-[#1C211E] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-10 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] px-3 text-xs font-bold text-[#1C211E] outline-none focus:border-[#1F3327]"
                  >
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                  KDV Oranı
                </label>
                <select
                  value={vatPercent}
                  onChange={(e) => setVatPercent(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-3 text-xs text-[#1C211E] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value={10}>%10 (Sağlık Hizmeti)</option>
                  <option value={20}>%20 (Standart)</option>
                  <option value={0}>%0 (İstisna)</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-2">
                Tahmini Randevu Süresi
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? "bg-[#1F3327] text-white border-[#1F3327] shadow-2xs"
                        : "bg-[#EEEBE4] hover:bg-[#E6E1D8] text-[#1C211E] border-[#E6E1D8]"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 inline mr-1 text-[#5F665F]" />
                    {mins} dk
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#1C211E] mb-1.5">
                Klinik Notlar & Prosedür Detayı
              </label>
              <textarea
                rows={3}
                placeholder="Tedavinin aşamaları, kullanılacak materyal veya hastaya verilecek talimatlar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-3 text-xs text-[#1C211E] placeholder-[#5F665F]/60 outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E1D8]">
              <button
                type="button"
                onClick={() => router.push("/tedaviler")}
                className="px-5 py-2.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] text-xs font-semibold text-[#1C211E] transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Tedaviyi Kaydet & Listeye Dön
              </button>
            </div>
          </form>
        </div>

        {/* Right Info & Presets: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          {/* Price Calculation Summary Card */}
          <div className="rounded-2xl bg-[#FBFAF7] p-5 border border-[#E6E1D8] shadow-xs">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#5F665F] mb-3">
              Mali Özet & KDV Hesaplama
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#5F665F]">
                <span>Net Matrah:</span>
                <span className="font-mono font-semibold text-[#1C211E]">
                  {(Number(price) || 0).toLocaleString("tr-TR")} {currency}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#5F665F]">
                <span>KDV Tutarı (%{vatPercent}):</span>
                <span className="font-mono font-semibold text-[#1C211E]">
                  {calculatedVat.toLocaleString("tr-TR")} {currency}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E6E1D8] flex items-center justify-between font-bold text-sm text-[#1F3327]">
                <span>Toplam Fiyat:</span>
                <span className="font-mono">
                  {calculatedTotalWithVat.toLocaleString("tr-TR")} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="rounded-2xl bg-[#FBFAF7] p-5 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#1F3327]" />
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C211E]">
                Sık Kullanılan Şablonlar
              </h3>
            </div>
            <p className="text-[11px] text-[#5F665F] mb-3">
              Formu tek tıkla standart TDB prosedürleriyle doldurun:
            </p>
            <div className="space-y-1.5">
              {presetTemplates.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="w-full text-left p-2.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4]/60 hover:bg-[#E2EEDD] hover:border-[#C9DDC3] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="block text-xs font-semibold text-[#1C211E] group-hover:text-[#2C6A3B]">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#5F665F] font-mono">{p.code} • {p.duration} dk</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1C211E]">
                    {p.price.toLocaleString("tr-TR")} ₺
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
