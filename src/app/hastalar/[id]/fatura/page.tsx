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
    <div className="rounded-xl bg-[#FBFAF7] p-6 shadow-xs border border-[#E6E1D8] space-y-8 dark:bg-[#15221B] dark:border-[#243B2F]">
      {/* Top Header Row: Title + Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6E1D8] dark:border-[#243B2F]">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C211E] tracking-tight dark:text-[#ECF3EE]">
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
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={addItem}
            title="Yeni Kalem Ekle"
            className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer dark:hover:bg-[#285A3B]"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Faturayı Kaydet"
            onClick={() => showToast(`✓ Fatura FTR-${faturaNo} başarıyla kaydedildi.`, "success")}
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Düzenle"
            onClick={() => showToast("Fatura düzenleme modu açık.", "info")}
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Önceki"
            onClick={() => showToast("Önceki fatura kaydına geçildi.", "info")}
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Sonraki"
            onClick={() => showToast("Sonraki fatura kaydına geçildi.", "info")}
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
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
            className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Fatura Ayarları"
            onClick={() => showToast("GİB Entegratör ve E-Arşiv parametreleri aktif.", "info")}
            className="rounded-lg bg-[#2D3A32] p-2 text-white shadow-2xs hover:bg-[#1F3327] transition-colors cursor-pointer dark:bg-[#1F3327] dark:hover:bg-[#285A3B]"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Fatura Bilgileri (2-column form) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Faturayı Kesen - VURGU: #2F5A3D */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-xs font-semibold text-[#2F5A3D] dark:text-[#76D28F]">
                Faturayı Kesen
              </label>
              <span className="rounded-md bg-[#2F5A3D]/10 px-2 py-0.5 text-[10px] font-bold text-[#2F5A3D] dark:bg-[#163321] dark:text-[#76D28F]">
                Yetkili Hekim
              </span>
            </div>
            <input
              type="text"
              value={faturayiKesen}
              onChange={(e) => setFaturayiKesen(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#2F5A3D] focus:ring-1 focus:ring-[#2F5A3D] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
            />
          </div>

          {/* Tarih & Saat side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Tarih
              </label>
              <input
                type="date"
                value={tarih}
                onChange={(e) => setTarih(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Saat
              </label>
              <input
                type="time"
                value={saat}
                onChange={(e) => setSaat(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
              />
            </div>
          </div>

          {/* Alıcı Subheader */}
          <div className="pt-2">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C211E] dark:text-[#ECF3EE]">
              Alıcı
            </span>
          </div>

          {/* Sayın */}
          <div>
            <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
              Sayın
            </label>
            <input
              type="text"
              value={sayin}
              onChange={(e) => setSayin(e.target.value)}
              placeholder="Sayın"
              className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
            />
          </div>

          {/* Adres */}
          <div>
            <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
              Adres
            </label>
            <input
              type="text"
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              placeholder="Adres"
              className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
            />
          </div>

          {/* Şehir & İlçe side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Şehir
              </label>
              <div className="relative">
                <select
                  value={sehir}
                  onChange={(e) => setSehir(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-[#E6E1D8] bg-white px-3 pr-8 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="İZMİR">İZMİR</option>
                  <option value="İSTANBUL">İSTANBUL</option>
                  <option value="ANKARA">ANKARA</option>
                  <option value="BURSA">BURSA</option>
                  <option value="ANTALYA">ANTALYA</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                İlçe
              </label>
              <div className="relative">
                <select
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-[#E6E1D8] bg-white px-3 pr-8 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="KARŞIYAKA">KARŞIYAKA</option>
                  <option value="KONAK">KONAK</option>
                  <option value="BORNOVA">BORNOVA</option>
                  <option value="KADIKÖY">KADIKÖY</option>
                  <option value="BEŞİKTAŞ">BEŞİKTAŞ</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Fatura Türü */}
          <div>
            <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
              Fatura Türü
            </label>
            <div className="relative">
              <select
                value={faturaTuru}
                onChange={(e) => setFaturaTuru(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#E6E1D8] bg-white px-3 pr-8 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
              >
                <option value="Eski Tip / Basılı">Eski Tip / Basılı</option>
                <option value="E-Fatura">E-Fatura</option>
                <option value="E-Arşiv Fatura">E-Arşiv Fatura</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
            </div>
          </div>

          {/* Fatura No */}
          <div>
            <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
              Fatura No
            </label>
            <input
              type="text"
              value={faturaNo}
              onChange={(e) => setFaturaNo(e.target.value)}
              placeholder="Fatura No"
              className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
            />
          </div>

          {/* Vergi Dairesi & Vergi/TC No side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Vergi Dairesi
              </label>
              <input
                type="text"
                value={vergiDairesi}
                onChange={(e) => setVergiDairesi(e.target.value)}
                placeholder="Vergi Dairesi"
                className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Vergi/TC No
              </label>
              <input
                type="text"
                value={vergiNo}
                onChange={(e) => setVergiNo(e.target.value)}
                placeholder="Vergi Numarası"
                className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 font-mono text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
              />
            </div>
          </div>

          {/* Ülke & Empty space */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
                Ülke
              </label>
              <div className="relative">
                <select
                  value={ulke}
                  onChange={(e) => setUlke(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-[#E6E1D8] bg-white px-3 pr-8 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="TÜRKİYE">TÜRKİYE</option>
                  <option value="DİĞER">DİĞER</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
              </div>
            </div>
            <div />
          </div>

          {/* E-posta with mail icon */}
          <div>
            <label className="block text-xs font-medium text-[#5F665F] mb-1.5 dark:text-[#A2B5A8]">
              E-posta
            </label>
            <div className="relative">
              <input
                type="email"
                value={eposta}
                onChange={(e) => setEposta(e.target.value)}
                placeholder="E-posta"
                className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white pl-10 pr-3 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] transition-colors dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F665F] hover:text-[#1C211E] transition-colors dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fatura Kalemleri Section */}
      <div className="pt-6 border-t border-[#E6E1D8] dark:border-[#243B2F]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-serif font-bold text-[#1C211E] tracking-tight dark:text-[#ECF3EE]">
            Fatura Kalemleri
          </h3>

          {/* Kalemler Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={addItem}
              title="Kalem Ekle"
              className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer dark:hover:bg-[#285A3B]"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Düzenle"
              className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={removeItem}
              title="Kaldır"
              className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-2 text-[#3F4540] shadow-2xs hover:bg-[#EADFC8] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table: Checkbox | Tarih | Diş | Tedavi | Dişhekimi | Tutar | İskonto(%) | İskonto | Stopaj(%) | Stopaj | KDV(%) | KDV | Toplam | P.Br. */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E1D8] text-[#5F665F] bg-[#EEEBE4]/60 dark:border-[#243B2F] dark:text-[#A2B5A8] dark:bg-[#1A2C23]">
                <th className="py-3 px-2 w-8">
                  <input
                    type="checkbox"
                    checked={
                      items.length > 0 && selectedItems.length === items.length
                    }
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] dark:border-[#243B2F]"
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
                    className="border-b border-[#E6E1D8] hover:bg-[#F6EEDC]/40 transition-colors text-[#3F4540] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]/60"
                  >
                    <td className="py-2.5 px-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="h-3.5 w-3.5 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] dark:border-[#243B2F]"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{item.date}</td>
                    <td className="py-2.5 px-2 font-medium text-[#1C211E] dark:text-[#ECF3EE]">{item.toothNo}</td>
                    <td className="py-2.5 px-2 text-[#3F4540] dark:text-[#ECF3EE]">{item.treatment}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{item.dentist}</td>
                    <td className="py-2.5 px-2 text-[#3F4540] dark:text-[#ECF3EE]">{formatCurrency(item.amount)}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">%{item.discountPercent}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{formatCurrency(item.discount)}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">%{item.withholdingPercent}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{formatCurrency(item.withholding)}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">%{item.vatPercent}</td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{formatCurrency(item.vat)}</td>
                    <td className="py-2.5 px-2 font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="py-2.5 px-2 text-[#5F665F] dark:text-[#A2B5A8]">{item.currency}</td>
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
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E6E1D8] dark:border-[#243B2F]">
        <div className="text-sm font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
          Toplam: <span className="text-[#1C211E] font-bold dark:text-[#ECF3EE]">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="rounded-xl bg-[#F6EEDC] border border-[#EADFC8] px-6 py-2.5 text-base font-serif font-bold text-[#1C211E] shadow-2xs dark:bg-[#2C2415] dark:border-[#523E1E] dark:text-[#E8BA73]">
          Genel Toplam: {formatCurrency(totalAmount)}
        </div>
      </div>
    </div>
  );
}
