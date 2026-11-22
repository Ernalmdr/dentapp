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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-[#1E332A] bg-stone-50/50 dark:bg-[#16261F]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-[#1A3125] text-[#2D4A3E] dark:text-[#7CC9A6]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {isEditing ? "Tedavi Protokolünü Düzenle" : "Yeni Tedavi & Fiyat Tanımla"}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isEditing
                  ? "Klinik liste fiyatı ve tedavi parametrelerini güncelleyin"
                  : "TDB kataloğuna veya klinik listenize yeni işlem ekleyin"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A2D23] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Treatment Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tedavi / İşlem Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Kompozit Dolgu (Tek Yüzlü)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] px-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          {/* Category & TDB Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TreatmentItem["category"])}
                className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] px-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                TDB Asgari Kodu
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="TDB-1001"
                  value={tdbCode}
                  onChange={(e) => setTdbCode(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] pl-8 pr-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>
            </div>
          </div>

          {/* Price, Currency & VAT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Klinik Liste Fiyatı <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] pl-8 pr-3 py-2 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                  />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2.5 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 outline-none"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                KDV Oranı
              </label>
              <select
                value={vatPercent}
                onChange={(e) => setVatPercent(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] px-3 py-2 text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              >
                <option value={10}>%10 (Sağlık)</option>
                <option value={20}>%20 (Standart)</option>
                <option value={0}>%0 (Muaf)</option>
              </select>
            </div>
          </div>

          {/* Duration in Minutes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tahmini Randevu Süresi
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    durationMinutes === mins
                      ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-2xs"
                      : "bg-white dark:bg-[#16261F] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#1E332A] hover:bg-stone-50 dark:hover:bg-[#1D3227]"
                  }`}
                >
                  <Clock className="h-3 w-3 inline mr-1" />
                  {mins} dk
                </button>
              ))}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tedavi Açıklaması & Klinik Not
            </label>
            <textarea
              rows={2}
              placeholder="Tedavi endikasyonu, kullanılan malzeme veya hasta bilgilendirme notu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#16261F] p-3 text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1A2D23] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#3A5F50] transition-colors shadow-sm"
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
