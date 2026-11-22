"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import {
  RotateCcw,
  Plus,
  Save,
  Pencil,
  ArrowLeft,
  ArrowRight,
  Printer,
  Settings,
  SlidersHorizontal,
  Minus,
  ChevronDown,
  Mail,
} from "lucide-react";
import { patients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { InvoiceItem } from "@/lib/types";
import { useModal } from "@/components/modals/ModalContext";

export default function PatientFaturaPage() {
  const { showToast, openPrintPreview } = useModal();
  const params = useParams();
  const patientId = (params?.id as string) || "2";

  const patient =
    patients.find((p) => p.id === patientId) ||
    patients.find((p) => p.id === "2") ||
    patients[0];

  const fullName = `${patient.firstName} ${patient.lastName}`;

  // Form states
  const [faturayiKesen, setFaturayiKesen] = useState("-- / 0000000000");
  const [tarih, setTarih] = useState("2026-11-21");
  const [saat, setSaat] = useState("14:30");
  const [sayin, setSayin] = useState(fullName);
  const [adres, setAdres] = useState(patient.address || "Kadıköy, İstanbul");
  const [sehir, setSehir] = useState("İZMİR");
  const [ilce, setIlce] = useState("KARŞIYAKA");

  const [faturaTuru, setFaturaTuru] = useState("Eski Tip / Basılı");
  const [faturaNo, setFaturaNo] = useState("FTR-2026-0042");
  const [vergiDairesi, setVergiDairesi] = useState("Karşıyaka VD");
  const [vergiNo, setVergiNo] = useState(patient.tcNo || "23456789012");
  const [ulke, setUlke] = useState("TÜRKİYE");
  const [eposta, setEposta] = useState(patient.email || "hasta@email.com");

  // Invoice items state - starts empty as requested and shown in screenshot
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length && items.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((i) => i.id));
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString("tr-TR"),
      toothNo: 16,
      treatment: "Kompozit Dolgu",
      dentist: patient.dentist || "Dr. Selin Yılmaz",
      amount: 1500,
      discountPercent: 0,
      discount: 0,
      withholdingPercent: 0,
      withholding: 0,
      vatPercent: 10,
      vat: 150,
      total: 1650,
      currency: "TRY",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = () => {
    if (selectedItems.length > 0) {
      setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
    } else if (items.length > 0) {
      setItems((prev) => prev.slice(0, -1));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200/80 space-y-8">
      {/* Top Header Row: Title + Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif sm:font-sans">
          Fatura
        </h2>

        {/* Top Toolbar: Row of Icon Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            title="Geri Al"
            onClick={() => {
              setItems([]);
              showToast("Fatura kalemleri sıfırlandı.", "info");
            }}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addItem}
            title="Yeni Kalem Ekle"
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Faturayı Kaydet"
            onClick={() => showToast(`✓ Fatura FTR-${faturaNo} başarıyla kaydedildi.`, "success")}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Düzenle"
            onClick={() => showToast("Fatura düzenleme modu açık.", "info")}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Önceki"
            onClick={() => showToast("Önceki fatura kaydına geçildi.", "info")}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Sonraki"
            onClick={() => showToast("Sonraki fatura kaydına geçildi.", "info")}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Faturayı Yazdır / PDF"
            onClick={() => {
              openPrintPreview({
                type: "invoice",
                title: "E-Serbest Meslek Makbuzu / Fatura",
                patientName: `${patient.firstName} ${patient.lastName}`,
                date: tarih,
                doctorName: faturayiKesen,
                total: totalAmount > 0 ? totalAmount : 1650,
                items: items.length > 0 ? items.map((it) => ({
                  name: `${it.treatment} (Diş No: ${it.toothNo})`,
                  detail: `${it.amount} ₺ + %${it.vatPercent} KDV`,
                  price: it.total,
                })) : [
                  { name: "Kompozit Dolgu (Diş No: 16)", detail: "1.500 ₺ + %10 KDV", price: 1650 },
                ],
                extraInfo: {
                  "Fatura No": faturaNo,
                  "Fatura Türü": faturaTuru,
                  "T.C. / Vergi No": vergiNo,
                  "İlçe / Şehir": `${ilce} / ${sehir}`,
                },
              });
            }}
            className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Fatura Ayarları"
            onClick={() => showToast("GİB Entegratör ve E-Arşiv parametreleri aktif.", "info")}
            className="rounded-lg bg-[#6366F1] p-2 text-white shadow-2xs hover:bg-[#5254D8] transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Fatura Bilgileri (2-column form) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Faturayı Kesen */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Faturayı Kesen
            </label>
            <input
              type="text"
              value={faturayiKesen}
              onChange={(e) => setFaturayiKesen(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Tarih & Saat side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Tarih
              </label>
              <input
                type="date"
                value={tarih}
                onChange={(e) => setTarih(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Saat
              </label>
              <input
                type="time"
                value={saat}
                onChange={(e) => setSaat(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              />
            </div>
          </div>

          {/* Alıcı Subheader */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Alıcı
            </span>
          </div>

          {/* Sayın */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Sayın
            </label>
            <input
              type="text"
              value={sayin}
              onChange={(e) => setSayin(e.target.value)}
              placeholder="Sayın"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Adres */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Adres
            </label>
            <input
              type="text"
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              placeholder="Adres"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Şehir & İlçe side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Şehir
              </label>
              <div className="relative">
                <select
                  value={sehir}
                  onChange={(e) => setSehir(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
                >
                  <option value="İZMİR">İZMİR</option>
                  <option value="İSTANBUL">İSTANBUL</option>
                  <option value="ANKARA">ANKARA</option>
                  <option value="BURSA">BURSA</option>
                  <option value="ANTALYA">ANTALYA</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                İlçe
              </label>
              <div className="relative">
                <select
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
                >
                  <option value="KARŞIYAKA">KARŞIYAKA</option>
                  <option value="KONAK">KONAK</option>
                  <option value="BORNOVA">BORNOVA</option>
                  <option value="KADIKÖY">KADIKÖY</option>
                  <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Fatura Türü */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Fatura Türü
            </label>
            <div className="relative">
              <select
                value={faturaTuru}
                onChange={(e) => setFaturaTuru(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              >
                <option value="Eski Tip / Basılı">Eski Tip / Basılı</option>
                <option value="E-Fatura">E-Fatura</option>
                <option value="E-Arşiv Fatura">E-Arşiv Fatura</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Fatura No */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Fatura No
            </label>
            <input
              type="text"
              value={faturaNo}
              onChange={(e) => setFaturaNo(e.target.value)}
              placeholder="Fatura No"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Vergi Dairesi & Vergi/TC No side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Vergi Dairesi
              </label>
              <input
                type="text"
                value={vergiDairesi}
                onChange={(e) => setVergiDairesi(e.target.value)}
                placeholder="Vergi Dairesi"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Vergi/TC No
              </label>
              <input
                type="text"
                value={vergiNo}
                onChange={(e) => setVergiNo(e.target.value)}
                placeholder="Vergi Numarası"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              />
            </div>
          </div>

          {/* Ülke & Empty space */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Ülke
              </label>
              <div className="relative">
                <select
                  value={ulke}
                  onChange={(e) => setUlke(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
                >
                  <option value="TÜRKİYE">TÜRKİYE</option>
                  <option value="DİĞER">DİĞER</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div />
          </div>

          {/* E-posta with mail icon */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              E-posta
            </label>
            <div className="relative">
              <input
                type="email"
                value={eposta}
                onChange={(e) => setEposta(e.target.value)}
                placeholder="E-posta"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fatura Kalemleri Section */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Fatura Kalemleri
          </h3>

          {/* Kalemler Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={addItem}
              title="Kalem Ekle"
              className="rounded-lg bg-[#2D4A3E] p-2 text-white shadow-2xs hover:bg-[#3A5F50] transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Düzenle"
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={removeItem}
              title="Kaldır"
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table: Checkbox | Tarih | Diş | Tedavi | Dişhekimi | Tutar | İskonto(%) | İskonto | Stopaj(%) | Stopaj | KDV(%) | KDV | Toplam | P.Br. */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200/70 text-gray-600 bg-[#FAF7F2]/60">
                <th className="py-3 px-2 w-8">
                  <input
                    type="checkbox"
                    checked={
                      items.length > 0 && selectedItems.length === items.length
                    }
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#2D4A3E] focus:ring-[#4A7C68]"
                  />
                </th>
                <th className="py-3 px-2 font-semibold">Tarih</th>
                <th className="py-3 px-2 font-semibold">Diş</th>
                <th className="py-3 px-2 font-semibold">Tedavi</th>
                <th className="py-3 px-2 font-semibold">Dişhekimi</th>
                <th className="py-3 px-2 font-semibold">Tutar</th>
                <th className="py-3 px-2 font-semibold">İskonto(%)</th>
                <th className="py-3 px-2 font-semibold">İskonto</th>
                <th className="py-3 px-2 font-semibold">Stopaj(%)</th>
                <th className="py-3 px-2 font-semibold">Stopaj</th>
                <th className="py-3 px-2 font-semibold">KDV(%)</th>
                <th className="py-3 px-2 font-semibold">KDV</th>
                <th className="py-3 px-2 font-semibold">Toplam</th>
                <th className="py-3 px-2 font-semibold">P.Br.</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-2.5 px-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-[#2D4A3E] focus:ring-[#4A7C68]"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-gray-600">{item.date}</td>
                    <td className="py-2.5 px-2 font-medium text-gray-900">{item.toothNo}</td>
                    <td className="py-2.5 px-2 text-gray-800">{item.treatment}</td>
                    <td className="py-2.5 px-2 text-gray-600">{item.dentist}</td>
                    <td className="py-2.5 px-2 text-gray-800">{formatCurrency(item.amount)}</td>
                    <td className="py-2.5 px-2 text-gray-600">%{item.discountPercent}</td>
                    <td className="py-2.5 px-2 text-gray-600">{formatCurrency(item.discount)}</td>
                    <td className="py-2.5 px-2 text-gray-600">%{item.withholdingPercent}</td>
                    <td className="py-2.5 px-2 text-gray-600">{formatCurrency(item.withholding)}</td>
                    <td className="py-2.5 px-2 text-gray-600">%{item.vatPercent}</td>
                    <td className="py-2.5 px-2 text-gray-600">{formatCurrency(item.vat)}</td>
                    <td className="py-2.5 px-2 font-semibold text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="py-2.5 px-2 text-gray-500">{item.currency}</td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="py-16">
            <EmptyState
              icon="receipt"
              message="Eşleşen Kayıt Bulunmadı"
            />
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <div className="text-sm font-semibold text-gray-700">
          Toplam: {formatCurrency(totalAmount)}
        </div>
        <div className="rounded-xl bg-[#F5F0EB] px-6 py-2.5 text-base font-bold text-gray-900 shadow-inner">
          Genel Toplam: {formatCurrency(totalAmount)}
        </div>
      </div>
    </div>
  );
}
