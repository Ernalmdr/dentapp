"use client";

import React, { useState } from "react";
import { useModal } from "./ModalContext";
import { X, ShoppingCart, Package, Building2, AlertCircle, CheckCircle2 } from "lucide-react";

export function StockOrderModal() {
  const { stockOrderData, closeStockOrderModal, showToast } = useModal();

  const [quantity, setQuantity] = useState<number>(5);
  const [supplier, setSupplier] = useState<string>("Meda Dental Deposu");
  const [urgency, setUrgency] = useState<"Normal" | "Acil" | "Kritik">("Normal");
  const [note, setNote] = useState<string>("");

  if (!stockOrderData.isOpen) return null;

  const suppliers = [
    "Meda Dental Deposu",
    "DentLab Dental Malzeme San.",
    "Güler Medikal Sağlık Ürünleri",
    "OMS Dental Tedarik Ltd.",
    "Dentasya Ecza & Depo",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeStockOrderModal();
    showToast(
      `✓ ${supplier} firmasına ${quantity} ${stockOrderData.unit} "${stockOrderData.itemName}" siparişi başarıyla iletildi (${urgency}).`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-md md:max-w-lg mx-auto rounded-2xl bg-white dark:bg-[#15221B] border border-stone-200 dark:border-[#243B2F] shadow-2xl flex flex-col text-stone-900 dark:text-[#ECF3EE]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-100 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-[#1D3328] text-[#2D4A3E] dark:text-[#7CC9A6]">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#ECF3EE]">
                Depo Siparişi Oluştur
              </h2>
              <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">
                Klinik malzeme ikmali ve tedarik talebi
              </p>
            </div>
          </div>
          <button
            onClick={closeStockOrderModal}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-[#ECF3EE] hover:bg-stone-100 dark:hover:bg-[#1D3328] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Material Info Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1A2C23] border border-stone-200/70 dark:border-[#243B2F]">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-[#2D4A3E] dark:text-[#7CC9A6] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-stone-900 dark:text-[#ECF3EE]">
                  {stockOrderData.itemName}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-[#A2B5A8] mt-0.5">
                  Mevcut Stok:{" "}
                  <span className="font-semibold text-stone-700 dark:text-[#C5D4CB]">
                    {stockOrderData.currentQuantity} {stockOrderData.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Sipariş Edilecek Adet / Miktar
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-2 text-xs text-stone-800 dark:text-[#ECF3EE] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
              <span className="shrink-0 px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#1D3328] text-stone-600 dark:text-[#A2B5A8] text-xs font-medium">
                {stockOrderData.unit || "Adet"}
              </span>
            </div>
          </div>

          {/* Supplier Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Anlaşmalı Tedarikçi Depo
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-2 text-xs text-stone-800 dark:text-[#ECF3EE] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            >
              {suppliers.map((s) => (
                <option key={s} value={s} className="dark:bg-[#1A2C23]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Aciliyet Durumu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Normal", "Acil", "Kritik"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    urgency === level
                      ? level === "Kritik"
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : level === "Acil"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-xs"
                      : "bg-white dark:bg-[#1A2C23] text-stone-700 dark:text-[#C5D4CB] border-stone-200 dark:border-[#243B2F] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Sipariş / Sevkiyat Notu (Opsiyonel)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Saat 15:00'e kadar kliniğe ulaştırılması rica olunur..."
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-2.5 text-xs text-stone-800 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#243B2F]">
            <button
              type="button"
              onClick={closeStockOrderModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-100 dark:hover:bg-[#1D3328] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#3A5F50] transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Siparişi İlet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
