"use client";

import React, { useState } from "react";
import EmptyState from "@/components/ui/EmptyState";
import {
  Eye,
  Settings,
  Send,
  Bell,
  Trash2,
  Plus,
  Pencil,
  CreditCard,
  Banknote,
  Printer,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TreatmentRecord, Payment } from "@/lib/types";
import { treatmentRecords as sampleTreatments } from "@/lib/mock-data";
import { useModal } from "@/components/modals/ModalContext";

export default function PatientHesapPage() {
  const { showToast, openPrintPreview } = useModal();
  // Treatments and Payments state - starts with option to load samples
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  // Add Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Kredi Kartı");
  const [payDentist, setPayDentist] = useState("Dr. Selin Yılmaz");

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount) return;
    const newPayment: Payment = {
      id: String(Date.now()),
      date: "21.11.2026",
      paymentType: payMethod,
      dentist: payDentist,
      amount: parseFloat(payAmount),
      currency: "TRY",
    };
    setPayments([newPayment, ...payments]);
    setIsPaymentModalOpen(false);
    setPayAmount("");
    showToast(`✓ Tahsilat kaydedildi: ${formatCurrency(newPayment.amount)} TL (${payMethod})`, "success");
  };

  const loadSampleTreatments = () => {
    setTreatments(sampleTreatments);
    showToast("✓ Kayıtlı tedaviler yüklendi.", "info");
  };

  const toggleSelectTreatment = (id: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTreatments.length === treatments.length && treatments.length > 0) {
      setSelectedTreatments([]);
    } else {
      setSelectedTreatments(treatments.map((t) => t.id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* ========================================================= */}
      {/* LEFT PANEL: Tedaviler */}
      {/* ========================================================= */}
      <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200/80 min-h-[560px]">
        <div>
          {/* Header: Title + 5 Icon Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif sm:font-sans">
              Tedaviler
            </h2>

            {/* Toolbar row: 5 icon buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="Tedavileri Yükle / Görüntüle"
                onClick={loadSampleTreatments}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Ayarlar"
                onClick={() => showToast("Fiyat tarifesi: TDB 2026 Asgari Ücret Tarifesi geçerlidir.", "info")}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="E-Fatura / Muhasebeye Gönder"
                onClick={() => showToast("✓ Seçili tedaviler faturalandırma modülüne aktarıldı.", "success")}
                className="rounded-lg bg-[#2D4A3E] p-2 text-white shadow-2xs hover:bg-[#3A5F50] transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Hastaya Bakiye Bildirimi SMS'i"
                onClick={() => showToast("✓ Hastaya kalan bakiye hatırlatma SMS'i iletildi.", "success")}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Listeyi Temizle"
                onClick={() => {
                  setTreatments([]);
                  showToast("Tedavi tablosu temizlendi.", "info");
                }}
                className="rounded-lg border border-red-200 bg-red-50/70 p-2 text-red-500 shadow-2xs hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table Headers: Checkbox | Tarih | Diş | Tedavi | Dişhekimi | Toplam | P.Br. */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200/70 text-gray-600 bg-[#FAF7F2]/60">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        treatments.length > 0 &&
                        selectedTreatments.length === treatments.length
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#2D4A3E] focus:ring-[#4A7C68]"
                    />
                  </th>
                  <th className="py-3 px-3 font-semibold">Tarih</th>
                  <th className="py-3 px-3 font-semibold">Diş</th>
                  <th className="py-3 px-3 font-semibold">Tedavi</th>
                  <th className="py-3 px-3 font-semibold">Dişhekimi</th>
                  <th className="py-3 px-3 font-semibold">Toplam</th>
                  <th className="py-3 px-3 font-semibold">P.Br.</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length > 0 ? (
                  treatments.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={selectedTreatments.includes(t.id)}
                          onChange={() => toggleSelectTreatment(t.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#2D4A3E] focus:ring-[#4A7C68]"
                        />
                      </td>
                      <td className="py-3 px-3 text-gray-600">{t.date}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{t.toothNo}</td>
                      <td className="py-3 px-3 text-gray-800">{t.treatment}</td>
                      <td className="py-3 px-3 text-gray-600">{t.dentist}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {formatCurrency(t.total)}
                      </td>
                      <td className="py-3 px-3 text-gray-500">{t.currency}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {treatments.length === 0 && (
            <div className="py-16">
              <EmptyState
                icon="clipboard"
                message="Eşleşen Kayıt Bulunmadı"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: Alınan Paralar */}
      {/* ========================================================= */}
      <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200/80 min-h-[560px]">
        <div>
          {/* Header: Title + 6 Icon Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif sm:font-sans">
              Alınan Paralar
            </h2>

            {/* Toolbar row: 6 icon buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="Tahsilat Ekle"
                onClick={() => setIsPaymentModalOpen(true)}
                className="rounded-lg bg-[#2D4A3E] p-2 text-white shadow-2xs hover:bg-[#3A5F50] transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Temizle"
                onClick={() => {
                  setPayments([]);
                  showToast("Tahsilat listesi temizlendi.", "info");
                }}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Düzenle"
                onClick={() => showToast("Tahsilat düzenleme modu aktif.", "info")}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Kredi Kartı / POS Tahsilatı"
                onClick={() => {
                  setPayMethod("Kredi Kartı");
                  setIsPaymentModalOpen(true);
                }}
                className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-2 text-emerald-800 shadow-2xs hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Nakit Tahsilat"
                onClick={() => {
                  setPayMethod("Nakit");
                  setIsPaymentModalOpen(true);
                }}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Banknote className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Makbuz Yazdır"
                onClick={() => {
                  openPrintPreview({
                    type: "receipt",
                    title: "Tahsilat Dekontu / Makbuz",
                    patientName: "Tuğçe Üngör",
                    date: new Date().toLocaleDateString("tr-TR"),
                    doctorName: "Dr. Selin Yılmaz",
                    total: payments.reduce((sum, p) => sum + p.amount, 0) || 3500,
                    items: payments.length > 0 ? payments.map((p) => ({
                      name: `${p.paymentType} Tahsilatı`,
                      price: p.amount,
                      detail: `${p.date} - ${p.dentist}`,
                    })) : [
                      { name: "Kredi Kartı Tahsilatı", price: 3500, detail: "Dr. Selin Yılmaz" },
                    ],
                  });
                }}
                className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table Headers: Tarih | Ödeme Tipi | Dişhekimi | Tutar | P.Br. | Yazdır */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200/70 text-gray-600 bg-[#FAF7F2]/60">
                  <th className="py-3 px-3 font-semibold">Tarih</th>
                  <th className="py-3 px-3 font-semibold">Ödeme Tipi</th>
                  <th className="py-3 px-3 font-semibold">Dişhekimi</th>
                  <th className="py-3 px-3 font-semibold">Tutar</th>
                  <th className="py-3 px-3 font-semibold">P.Br.</th>
                  <th className="py-3 px-3 font-semibold text-center">Yazdır</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-3 px-3 text-gray-600">{p.date}</td>
                      <td className="py-3 px-3 font-medium text-gray-800">{p.paymentType}</td>
                      <td className="py-3 px-3 text-gray-600">{p.dentist}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3 px-3 text-gray-500">{p.currency}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            openPrintPreview({
                              type: "receipt",
                              title: "Tahsilat Makbuzu",
                              patientName: "Tuğçe Üngör",
                              date: p.date,
                              doctorName: p.dentist,
                              total: p.amount,
                              items: [
                                {
                                  name: `${p.paymentType} Tahsilat Dekontu`,
                                  price: p.amount,
                                  detail: `Hekim: ${p.dentist}`,
                                },
                              ],
                            });
                          }}
                          className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          <Printer className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {payments.length === 0 && (
            <div className="py-16">
              <EmptyState
                icon="wallet"
                message="Eşleşen Kayıt Bulunmadı"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tahsilat Ekleme Modalı */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-2xl border border-stone-200 dark:border-[#1E332A] text-stone-900 dark:text-[#F0F5F2]">
            <h3 className="text-base font-bold mb-3">Yeni Tahsilat Girişi</h3>
            <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tahsil Edilen Tutar (₺)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 font-mono font-bold text-sm outline-none"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Ödeme Yöntemi</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                >
                  <option value="Kredi Kartı">Kredi Kartı / POS</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Havale/EFT">Havale / EFT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tedavi Yapan Hekim</label>
                <select
                  value={payDentist}
                  onChange={(e) => setPayDentist(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                >
                  <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                  <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-[#233C30]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2D4A3E] text-white font-bold"
                >
                  Tahsilatı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
