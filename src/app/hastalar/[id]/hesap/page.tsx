"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Tag,
  Check,
  X,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileOutput,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TreatmentRecord, Payment } from "@/lib/types";
import { treatmentRecords as defaultSampleTreatments } from "@/lib/mock-data";
import { useModal } from "@/components/modals/ModalContext";

export default function PatientHesapPage() {
  const params = useParams();
  const patientId = (params?.id as string) || "2";
  const { showToast, openPrintPreview } = useModal();

  // Initial fallback data
  const initialTreatments: TreatmentRecord[] = [
    { id: "1", date: "12.09.2026", toothNo: 36, treatment: "Kanal Tedavisi", dentist: "Dr. Selin Yılmaz", total: 4500, currency: "TRY" },
    { id: "2", date: "26.08.2026", toothNo: 16, treatment: "Kompozit Dolgu", dentist: "Dr. Selin Yılmaz", total: 1200, currency: "TRY" },
    { id: "3", date: "14.08.2026", toothNo: 25, treatment: "İmplant Cerrahisi", dentist: "Dr. Selin Yılmaz", total: 18000, currency: "TRY" },
  ];

  const initialPayments: Payment[] = [
    { id: "p1", date: "26.08.2026", paymentType: "Kredi Kartı", dentist: "Dr. Selin Yılmaz", amount: 15000, currency: "TRY" },
  ];

  // States
  const [treatments, setTreatments] = useState<TreatmentRecord[]>(initialTreatments);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"Nakit" | "Kredi Kartı" | "Havale/EFT">("Nakit");
  const [payDentist, setPayDentist] = useState("Dr. Selin Yılmaz");

  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [treatmentTooth, setTreatmentTooth] = useState("11");
  const [treatmentName, setTreatmentName] = useState("Zirkonyum Kaplama");
  const [treatmentFee, setTreatmentFee] = useState("8000");
  const [treatmentDoctor, setTreatmentDoctor] = useState("Dr. Selin Yılmaz");

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTreatments = localStorage.getItem(`dentapp_hesap_treatments_${patientId}`);
      if (storedTreatments) {
        setTreatments(JSON.parse(storedTreatments));
      }
      const storedPayments = localStorage.getItem(`dentapp_hesap_payments_${patientId}`);
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      }
      const storedDiscount = localStorage.getItem(`dentapp_hesap_discount_${patientId}`);
      if (storedDiscount) {
        setDiscount(Number(storedDiscount) || 0);
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsLoaded(true);
    }
  }, [patientId]);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`dentapp_hesap_treatments_${patientId}`, JSON.stringify(treatments));
      localStorage.setItem(`dentapp_hesap_payments_${patientId}`, JSON.stringify(payments));
      localStorage.setItem(`dentapp_hesap_discount_${patientId}`, String(discount));
    } catch {
      // Ignore localStorage write errors
    }
  }, [treatments, payments, discount, patientId, isLoaded]);

  // Calculations
  const totalFee = treatments.reduce((sum, t) => sum + (Number(t.total) || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const remainingBalance = Math.max(0, totalFee - totalPaid - discount);

  // Handlers
  const handleOpenPayment = (method: "Nakit" | "Kredi Kartı" | "Havale/EFT") => {
    setPayMethod(method);
    setPayAmount(remainingBalance > 0 ? String(remainingBalance) : "");
    setIsPaymentModalOpen(true);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(payAmount);
    if (!amountVal || amountVal <= 0) return;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const newPayment: Payment = {
      id: String(Date.now()),
      date: formattedDate,
      paymentType: payMethod,
      dentist: payDentist,
      amount: amountVal,
      currency: "TRY",
    };

    setPayments((prev) => [newPayment, ...prev]);
    setIsPaymentModalOpen(false);
    setPayAmount("");
    showToast(`✓ Tahsilat kaydedildi: ${formatCurrency(amountVal)} TL (${payMethod})`, "success");
  };

  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const feeVal = parseFloat(treatmentFee);
    if (!feeVal || feeVal <= 0 || !treatmentName) return;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const newTreatment: TreatmentRecord = {
      id: String(Date.now()),
      date: formattedDate,
      toothNo: Number(treatmentTooth) || 0,
      treatment: treatmentName,
      dentist: treatmentDoctor,
      total: feeVal,
      currency: "TRY",
    };

    setTreatments((prev) => [newTreatment, ...prev]);
    setIsTreatmentModalOpen(false);
    showToast(`✓ Yeni tedavi eklendi: ${treatmentName} (${formatCurrency(feeVal)} TL)`, "success");
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const discVal = parseFloat(discountInput);
    if (isNaN(discVal) || discVal < 0) return;
    setDiscount(discVal);
    setIsDiscountModalOpen(false);
    setDiscountInput("");
    showToast(`✓ İndirim uygulandı: ${formatCurrency(discVal)} TL`, "info");
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

  const removeTreatment = (id: string) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
    setSelectedTreatments((prev) => prev.filter((item) => item !== id));
    showToast("Tedavi kaydı silindi.", "info");
  };

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    showToast("Tahsilat kaydı silindi.", "info");
  };

  const reloadSamples = () => {
    setTreatments(defaultSampleTreatments);
    showToast("✓ Kayıtlı tedaviler yüklendi.", "info");
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* Top Section: Summary Cards & Action Buttons Bar */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Toplam Ücret */}
        <div className="rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-2xs flex flex-col justify-between dark:bg-[#15221B] dark:border-[#243B2F]">
          <div className="flex items-center justify-between text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <span>Toplam Ücret</span>
            <span className="rounded-full bg-[#EEEBE4] px-2.5 py-0.5 text-[11px] font-semibold text-[#3F4540] dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
              {treatments.length} Tedavi
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-serif font-bold text-[#1C211E] tracking-tight dark:text-[#ECF3EE]">
              {formatCurrency(totalFee)} <span className="text-base font-normal font-sans text-[#5F665F] dark:text-[#A2B5A8]">TL</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#A2B5A8]">Kayıtlı toplam tedavi bedeli</p>
          </div>
        </div>

        {/* Ödenen Tutar */}
        <div className="rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-2xs flex flex-col justify-between dark:bg-[#15221B] dark:border-[#243B2F]">
          <div className="flex items-center justify-between text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <span>Ödenen Tutar</span>
            <span className="rounded-full bg-[#E2EEDD] border border-[#C5D6C0] px-2.5 py-0.5 text-[11px] font-semibold text-[#2C6A3B] dark:bg-[#163321] dark:border-[#285A3B] dark:text-[#76D28F]">
              {payments.length} Tahsilat
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-serif font-bold text-[#2C6A3B] tracking-tight dark:text-[#76D28F]">
              {formatCurrency(totalPaid)} <span className="text-base font-normal font-sans text-[#5F665F] dark:text-[#A2B5A8]">TL</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#A2B5A8]">Alınan nakit & kart tahsilatları</p>
          </div>
        </div>

        {/* Kalan Bakiye */}
        <div className="rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-2xs flex flex-col justify-between dark:bg-[#15221B] dark:border-[#243B2F]">
          <div className="flex items-center justify-between text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <span>Kalan Bakiye</span>
            {discount > 0 && (
              <span className="rounded-full bg-[#F6EEDC] border border-[#EADFC8] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A5320] dark:bg-[#2C2415] dark:border-[#523E1E] dark:text-[#E8BA73]">
                {formatCurrency(discount)} TL İndirim
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className={`text-2xl lg:text-3xl font-serif font-bold tracking-tight ${remainingBalance > 0 ? "text-[#B3261E] dark:text-[#FF8B8B]" : "text-[#2C6A3B] dark:text-[#76D28F]"}`}>
              {formatCurrency(remainingBalance)} <span className="text-base font-normal font-sans text-[#5F665F] dark:text-[#A2B5A8]">TL</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
              {remainingBalance > 0 ? "Ödenmesi gereken açık hesap bakiye" : "Hesap tamamen kapatılmıştır"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-4 shadow-2xs dark:bg-[#15221B] dark:border-[#243B2F]">
        <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
          <Receipt className="h-4 w-4 text-[#1F3327] dark:text-[#76D28F]" />
          <span>Hızlı Kasa İşlemleri</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nakit Tahsilat */}
          <button
            type="button"
            onClick={() => handleOpenPayment("Nakit")}
            className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-4 py-2 text-sm font-medium text-[#1C211E] shadow-2xs transition-colors hover:bg-[#F3F0EA] cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <Banknote className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
            <span>Nakit Tahsilat</span>
          </button>

          {/* Kart Tahsilat */}
          <button
            type="button"
            onClick={() => handleOpenPayment("Kredi Kartı")}
            className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-4 py-2 text-sm font-medium text-[#1C211E] shadow-2xs transition-colors hover:bg-[#F3F0EA] cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <CreditCard className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
            <span>Kart Tahsilat</span>
          </button>

          {/* İndirim Yap */}
          <button
            type="button"
            onClick={() => setIsDiscountModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-4 py-2 text-sm font-medium text-[#1C211E] shadow-2xs transition-colors hover:bg-[#F3F0EA] cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <Tag className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
            <span>İndirim Yap</span>
          </button>

          {/* Tedavi Ekle */}
          <button
            type="button"
            onClick={() => setIsTreatmentModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1F3327] px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#2D3A32] cursor-pointer"
          >
            <Plus className="h-4 w-4 text-white" />
            <span>Tedavi Ekle</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TWO TABLES GRID: Tedaviler | Alınan Paralar */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* LEFT PANEL: Tedaviler */}
        <div className="flex flex-col justify-between rounded-[16px] bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] min-h-[460px] dark:bg-[#15221B] dark:border-[#243B2F]">
          <div>
            {/* Header: Title + Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-serif font-bold text-[#1C211E] tracking-tight dark:text-[#ECF3EE]">
                  Tedaviler
                </h2>
                <span className="rounded-full bg-[#EEEBE4] px-2.5 py-0.5 text-xs font-semibold text-[#3F4540] dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
                  {treatments.length}
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Örnek Tedavileri Yükle"
                  onClick={reloadSamples}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Eye className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </button>
                <button
                  type="button"
                  title="Ayarlar & Tarife"
                  onClick={() => showToast("Fiyat tarifesi: TDB 2026 Asgari Ücret Tarifesi geçerlidir.", "info")}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Settings className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </button>
                <button
                  type="button"
                  title="E-Fatura / Muhasebeye Gönder"
                  onClick={() => showToast("✓ Seçili tedaviler fatura modülüne aktarıldı.", "success")}
                  className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
                <button
                  type="button"
                  title="Hastaya Bakiye SMS Hatırlatması"
                  onClick={() => showToast("✓ Hastaya kalan bakiye hatırlatma SMS'i iletildi.", "success")}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Bell className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </button>
                <button
                  type="button"
                  title="Tabloyu Temizle"
                  onClick={() => {
                    setTreatments([]);
                    setSelectedTreatments([]);
                    showToast("Tedavi listesi temizlendi.", "info");
                  }}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#B3261E] shadow-2xs hover:bg-[#FBE9E7] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#FF8B8B] dark:hover:bg-[#2C1919]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Yeni Tedavi Ekle"
                  onClick={() => setIsTreatmentModalOpen(true)}
                  className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E6E1D8] text-[#5F665F] bg-[#EEEBE4]/60 dark:border-[#243B2F] dark:bg-[#1A2C23]/80 dark:text-[#A2B5A8]">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          treatments.length > 0 &&
                          selectedTreatments.length === treatments.length
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] dark:border-[#243B2F]"
                      />
                    </th>
                    <th className="py-2.5 px-3 font-semibold">Tarih</th>
                    <th className="py-2.5 px-2 font-semibold">Diş</th>
                    <th className="py-2.5 px-3 font-semibold">Tedavi</th>
                    <th className="py-2.5 px-3 font-semibold">Dişhekimi</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Toplam</th>
                    <th className="py-2.5 px-2 font-semibold">P.Br.</th>
                    <th className="py-2.5 px-2 text-center">Sil</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.length > 0 ? (
                    treatments.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-[#E6E1D8] hover:bg-[#F6EEDC]/40 transition-colors text-[#3F4540] dark:border-[#243B2F] dark:hover:bg-[#1E3026]/50 dark:text-[#ECF3EE]"
                      >
                        <td className="py-2.5 px-3">
                          <input
                            type="checkbox"
                            checked={selectedTreatments.includes(t.id)}
                            onChange={() => toggleSelectTreatment(t.id)}
                            className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] dark:border-[#243B2F]"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-[#5F665F] whitespace-nowrap dark:text-[#A2B5A8]">{t.date}</td>
                        <td className="py-2.5 px-2 font-semibold text-[#1C211E] dark:text-[#ECF3EE]">{t.toothNo || "-"}</td>
                        <td className="py-2.5 px-3 font-medium text-[#1C211E] dark:text-[#ECF3EE]">{t.treatment}</td>
                        <td className="py-2.5 px-3 text-[#5F665F] dark:text-[#A2B5A8]">{t.dentist}</td>
                        <td className="py-2.5 px-3 font-bold text-[#1C211E] text-right whitespace-nowrap dark:text-[#ECF3EE]">
                          {formatCurrency(t.total)}
                        </td>
                        <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{t.currency}</td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeTreatment(t.id)}
                            className="text-[#8A8F89] hover:text-[#B3261E] transition-colors cursor-pointer dark:hover:text-[#FF8B8B]"
                          >
                            <Trash2 className="h-3.5 w-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {treatments.length === 0 && (
              <div className="py-12">
                <EmptyState
                  icon="clipboard"
                  message="Eşleşen Tedavi Kaydı Bulunmadı"
                />
              </div>
            )}
          </div>

          {/* Table Footer */}
          {treatments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex items-center justify-between text-xs text-[#5F665F] dark:border-[#243B2F] dark:text-[#A2B5A8]">
              <span>
                {selectedTreatments.length > 0
                  ? `${selectedTreatments.length} tedavi seçili`
                  : `Toplam ${treatments.length} tedavi kaydı`}
              </span>
              <span className="font-serif font-bold text-[#1C211E] text-sm dark:text-[#ECF3EE]">
                Ara Toplam: {formatCurrency(totalFee)} TL
              </span>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Alınan Paralar */}
        <div className="flex flex-col justify-between rounded-[16px] bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] min-h-[460px] dark:bg-[#15221B] dark:border-[#243B2F]">
          <div>
            {/* Header: Title + Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-serif font-bold text-[#1C211E] tracking-tight dark:text-[#ECF3EE]">
                  Alınan Paralar
                </h2>
                <span className="rounded-full bg-[#E2EEDD] border border-[#C5D6C0] px-2.5 py-0.5 text-xs font-semibold text-[#2C6A3B] dark:bg-[#163321] dark:border-[#285A3B] dark:text-[#76D28F]">
                  {payments.length}
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Yeni Tahsilat Ekle"
                  onClick={() => handleOpenPayment("Nakit")}
                  className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="POS / Kart Tahsilat"
                  onClick={() => handleOpenPayment("Kredi Kartı")}
                  className="rounded-lg border border-[#C5D6C0] bg-[#E2EEDD] p-2 text-[#2C6A3B] shadow-2xs hover:bg-[#E2EEDD]/80 transition-colors cursor-pointer dark:bg-[#163321] dark:border-[#285A3B] dark:text-[#76D28F] dark:hover:bg-[#1E3026]"
                >
                  <CreditCard className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Nakit Tahsilat"
                  onClick={() => handleOpenPayment("Nakit")}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Banknote className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </button>
                <button
                  type="button"
                  title="Tahsilat Listesini Temizle"
                  onClick={() => {
                    setPayments([]);
                    showToast("Tahsilat listesi temizlendi.", "info");
                  }}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#B3261E] shadow-2xs hover:bg-[#FBE9E7] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#FF8B8B] dark:hover:bg-[#2C1919]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Toplu Makbuz Yazdır"
                  onClick={() => {
                    openPrintPreview({
                      type: "receipt",
                      title: "Tahsilat Dekontu / Makbuz",
                      patientName: "Tuğçe Üngör",
                      date: new Date().toLocaleDateString("tr-TR"),
                      doctorName: "Dr. Selin Yılmaz",
                      total: totalPaid,
                      items: payments.length > 0 ? payments.map((p) => ({
                        name: `${p.paymentType} Tahsilatı`,
                        price: p.amount,
                        detail: `${p.date} - ${p.dentist}`,
                      })) : undefined,
                    });
                  }}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Printer className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E6E1D8] text-[#5F665F] bg-[#EEEBE4]/60 dark:border-[#243B2F] dark:bg-[#1A2C23]/80 dark:text-[#A2B5A8]">
                    <th className="py-2.5 px-3 font-semibold">Tarih</th>
                    <th className="py-2.5 px-3 font-semibold">Ödeme Tipi</th>
                    <th className="py-2.5 px-3 font-semibold">Dişhekimi</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Tutar</th>
                    <th className="py-2.5 px-2 font-semibold">P.Br.</th>
                    <th className="py-2.5 px-2 font-semibold text-center">Yazdır</th>
                    <th className="py-2.5 px-2 text-center">Sil</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-[#E6E1D8] hover:bg-[#F6EEDC]/40 transition-colors text-[#3F4540] dark:border-[#243B2F] dark:hover:bg-[#1E3026]/50 dark:text-[#ECF3EE]"
                      >
                        <td className="py-2.5 px-3 text-[#5F665F] whitespace-nowrap dark:text-[#A2B5A8]">{p.date}</td>
                        <td className="py-2.5 px-3 font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                          <span className="inline-flex items-center gap-1">
                            {p.paymentType === "Nakit" ? (
                              <Banknote className="h-3.5 w-3.5 text-[#2C6A3B] dark:text-[#76D28F]" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5 text-[#1F3327] dark:text-[#76D28F]" />
                            )}
                            {p.paymentType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#5F665F] dark:text-[#A2B5A8]">{p.dentist}</td>
                        <td className="py-2.5 px-3 font-bold text-[#2C6A3B] text-right whitespace-nowrap dark:text-[#76D28F]">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{p.currency}</td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            title="Makbuz Dök"
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
                            className="text-[#5F665F] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
                          >
                            <Printer className="h-4 w-4 inline" />
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => removePayment(p.id)}
                            className="text-[#8A8F89] hover:text-[#B3261E] transition-colors cursor-pointer dark:hover:text-[#FF8B8B]"
                          >
                            <Trash2 className="h-3.5 w-3.5 inline" />
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
              <div className="py-12">
                <EmptyState
                  icon="wallet"
                  message="Henüz Tahsilat Kaydı Bulunmuyor"
                />
              </div>
            )}
          </div>

          {/* Table Footer */}
          {payments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex items-center justify-between text-xs text-[#5F665F] dark:border-[#243B2F] dark:text-[#A2B5A8]">
              <span>Toplam {payments.length} tahsilat kaydı</span>
              <span className="font-serif font-bold text-[#2C6A3B] text-sm dark:text-[#76D28F]">
                Tahsil Edilen: {formatCurrency(totalPaid)} TL
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      {/* 1. Tahsilat Girişi Modalı */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#FBFAF7] p-6 shadow-2xl border border-[#E6E1D8] text-[#1C211E] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <h3 className="text-lg font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                {payMethod} Tahsilat Girişi
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-[#5F665F] hover:text-[#1C211E] cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Tahsil Edilen Tutar (₺)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 font-mono font-bold text-base text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Ödeme Yöntemi</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 text-[#3F4540] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı / POS</option>
                  <option value="Havale/EFT">Havale / EFT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Tahsilatı Alan Hekim</label>
                <select
                  value={payDentist}
                  onChange={(e) => setPayDentist(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 text-[#3F4540] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                  <option value="Dr. Mahir Açıkalın">Dr. Mahir Açıkalın</option>
                  <option value="Dr. Ahmet Kaya">Dr. Ahmet Kaya</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E1D8] bg-white text-[#3F4540] hover:bg-[#F3F0EA] font-medium cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Tahsilatı Onayla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Tedavi Ekleme Modalı */}
      {isTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#FBFAF7] p-6 shadow-2xl border border-[#E6E1D8] text-[#1C211E] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <h3 className="text-lg font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                Yeni Tedavi Kaydı Ekle
              </h3>
              <button
                onClick={() => setIsTreatmentModalOpen(false)}
                className="text-[#5F665F] hover:text-[#1C211E] cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTreatment} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Diş Numarası</label>
                  <input
                    type="number"
                    placeholder="ör. 16, 21, 36"
                    value={treatmentTooth}
                    onChange={(e) => setTreatmentTooth(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 font-mono font-medium text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Tedavi Bedeli (₺)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="any"
                    value={treatmentFee}
                    onChange={(e) => setTreatmentFee(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 font-mono font-bold text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Tedavi Adı</label>
                <input
                  type="text"
                  placeholder="ör. Kompozit Dolgu, Kanal Tedavisi, Zirkonyum..."
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">Uygulayan Dişhekimi</label>
                <select
                  value={treatmentDoctor}
                  onChange={(e) => setTreatmentDoctor(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 text-[#3F4540] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                  <option value="Dr. Mahir Açıkalın">Dr. Mahir Açıkalın</option>
                  <option value="Dr. Ahmet Kaya">Dr. Ahmet Kaya</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTreatmentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E1D8] bg-white text-[#3F4540] hover:bg-[#F3F0EA] font-medium cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Tedaviyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. İndirim Modalı */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#FBFAF7] p-6 shadow-2xl border border-[#E6E1D8] text-[#1C211E] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <h3 className="text-lg font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                Özel İndirim Uygula
              </h3>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="text-[#5F665F] hover:text-[#1C211E] cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplyDiscount} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1.5 text-[#5F665F] dark:text-[#A2B5A8]">İndirim Tutarı (₺)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E6E1D8] bg-white px-3 font-mono font-bold text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  autoFocus
                  required
                />
                <p className="mt-1.5 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                  Mevcut İndirim: {formatCurrency(discount)} TL
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E1D8] bg-white text-[#3F4540] hover:bg-[#F3F0EA] font-medium cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] text-white font-semibold cursor-pointer shadow-xs"
                >
                  İndirimi Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
