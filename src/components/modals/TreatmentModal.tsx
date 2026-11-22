"use client";

import React, { useState, useEffect } from "react";
import { X, Stethoscope, CheckCircle2, AlertCircle, DollarSign, Clock, Hash, FileText } from "lucide-react";

export interface TreatmentItem {
  id: string;
  name: string;
  category: "Cerrahi" | "Endodonti" | "Restoratif" | "Protez" | "Periodontoloji" | "Estetik";
  tdbCode: string;
  price: number;
  currency: string;
  durationMinutes?: number;
  vatPercent?: number;
  description?: string;
}

interface TreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (treatment: TreatmentItem) => void;
  initialData?: TreatmentItem | null;
}

export function TreatmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TreatmentModalProps) {
  const isEditing = !!initialData;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TreatmentItem["category"]>("Restoratif");
  const [tdbCode, setTdbCode] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [currency, setCurrency] = useState("TRY");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [vatPercent, setVatPercent] = useState<number>(10);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setTdbCode(initialData.tdbCode);
      setPrice(initialData.price);
      setCurrency(initialData.currency || "TRY");
      setDurationMinutes(initialData.durationMinutes || 30);
      setVatPercent(initialData.vatPercent ?? 10);
      setDescription(initialData.description || "");
    } else {
      setName("");
      setCategory("Restoratif");
      setTdbCode(`TDB-${Math.floor(1000 + Math.random() * 8999)}`);
      setPrice("");
      setCurrency("TRY");
      setDurationMinutes(30);
      setVatPercent(10);
      setDescription("");
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Lütfen tedavi adını giriniz.");
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Lütfen geçerli bir fiyat giriniz (0'dan büyük olmalı).");
      return;
    }

    const item: TreatmentItem = {
      id: initialData?.id || String(Date.now()),
      name: name.trim(),
      category,
      tdbCode: tdbCode.trim() || `TDB-${Math.floor(1000 + Math.random() * 8999)}`,
      price: numPrice,
      currency,
      durationMinutes: Number(durationMinutes) || 30,
      vatPercent: Number(vatPercent) ?? 10,
      description: description.trim(),
    };

    onSave(item);
    onClose();
  };

  const categories: TreatmentItem["category"][] = [
    "Cerrahi",
    "Endodonti",
    "Restoratif",
    "Protez",
    "Periodontoloji",
    "Estetik",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-xl mx-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#15221B] border border-[#E6E1D8] dark:border-[#243B2F] shadow-2xl flex flex-col text-[#1C211E] dark:text-[#ECF3EE]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E6E1D8] dark:border-[#243B2F] bg-[#EEEBE4]/60 dark:bg-[#1A2C23]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2EEDD] dark:bg-[#1D3328] text-[#1F3327] dark:text-[#7CC9A6]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                {isEditing ? "Tedavi Protokolünü Düzenle" : "Yeni Tedavi & Fiyat Tanımla"}
              </h2>
              <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                {isEditing
                  ? "Klinik liste fiyatı ve tedavi parametrelerini güncelleyin"
                  : "TDB kataloğuna veya klinik listenize yeni işlem ekleyin"}
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

          {/* Treatment Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
              Tedavi / İşlem Adı <span className="text-[#B3261E]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Kompozit Dolgu (Tek Yüzlü)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] px-3 py-2 text-xs text-[#1C211E] dark:text-[#ECF3EE] placeholder-[#5F665F]/60 dark:placeholder-[#5E7569] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
            />
          </div>

          {/* Category & TDB Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TreatmentItem["category"])}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] px-3 py-2 text-xs text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="dark:bg-[#1A2C23]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                TDB Asgari Kodu
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                <input
                  type="text"
                  placeholder="TDB-1001"
                  value={tdbCode}
                  onChange={(e) => setTdbCode(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] pl-8 pr-3 py-2 text-xs text-[#1C211E] dark:text-[#ECF3EE] font-mono outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>
            </div>
          </div>

          {/* Price, Currency & VAT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                Klinik Liste Fiyatı <span className="text-[#B3261E]">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] pl-8 pr-3 py-2 text-xs font-mono font-bold text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#EEEBE4] dark:bg-[#1A2C23] px-2.5 py-2 text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327]"
                >
                  <option value="TRY" className="dark:bg-[#1A2C23]">TRY (₺)</option>
                  <option value="USD" className="dark:bg-[#1A2C23]">USD ($)</option>
                  <option value="EUR" className="dark:bg-[#1A2C23]">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
                KDV Oranı
              </label>
              <select
                value={vatPercent}
                onChange={(e) => setVatPercent(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] px-3 py-2 text-xs text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              >
                <option value={10} className="dark:bg-[#1A2C23]">%10 (Sağlık)</option>
                <option value={20} className="dark:bg-[#1A2C23]">%20 (Standart)</option>
                <option value={0} className="dark:bg-[#1A2C23]">%0 (Muaf)</option>
              </select>
            </div>
          </div>

          {/* Duration in Minutes */}
          <div>
            <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
              Tahmini Randevu Süresi
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    durationMinutes === mins
                      ? "bg-[#1F3327] text-white border-[#1F3327] shadow-2xs"
                      : "bg-[#EEEBE4] dark:bg-[#1A2C23] hover:bg-[#E6E1D8] dark:hover:bg-[#1D3328] text-[#1C211E] dark:text-[#ECF3EE] border-[#E6E1D8] dark:border-[#243B2F]"
                  }`}
                >
                  <Clock className="h-3 w-3 inline mr-1 text-[#5F665F] dark:text-[#A2B5A8]" />
                  {mins} dk
                </button>
              ))}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1C211E] dark:text-[#C5D4CB] mb-1.5">
              Tedavi Açıklaması & Klinik Not
            </label>
            <textarea
              rows={2}
              placeholder="Tedavi endikasyonu, kullanılan malzeme veya hasta bilgilendirme notu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] p-3 text-xs text-[#1C211E] dark:text-[#ECF3EE] placeholder-[#5F665F]/60 dark:placeholder-[#5E7569] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
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
              {isEditing ? "Değişiklikleri Kaydet" : "Tedaviyi Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
