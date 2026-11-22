"use client";

import React, { useState } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Award,
  Printer,
  ChevronRight,
} from "lucide-react";
import MonthlyClinicChart from "@/components/dashboard/MonthlyClinicChart";
import TreatmentDistributionChart from "@/components/dashboard/TreatmentDistributionChart";
import { useModal } from "@/components/modals/ModalContext";

export default function RaporlarPage() {
  const { openPrintPreview, showToast } = useModal();
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  const doctorPerformances = [
    { name: "Dr. Selin Yılmaz", role: "Mesul Müdür / Protetik Diş Tedavisi", patients: 142, treatments: 218, revenue: 485000, satisfaction: "%98" },
    { name: "Dt. Mahir Açıkalın", role: "Ağız Diş ve Çene Cerrahisi", patients: 118, treatments: 164, revenue: 392000, satisfaction: "%96" },
    { name: "Dt. Kemal Aydın", role: "Endodonti & Restoratif", patients: 88, treatments: 130, revenue: 214000, satisfaction: "%95" },
  ];

  const handleExport = () => {
    openPrintPreview({
      type: "consent",
      title: "Resmi Klinik Performans & Analitik Raporu",
      patientName: "DentaSphere Yönetim Kurulu",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "Dr. Selin Yılmaz (Mesul Müdür)",
      extraInfo: {
        "Rapor Dönemi": period === "month" ? "Ekim - Kasım 2026 (Bu Ay)" : period === "quarter" ? "Son Çeyrek (Q3-Q4)" : "2026 Yıllık Konsolide",
        "Toplam Aktif Hasta": "348 Hasta",
        "Klinik Koltuk Doluluk": "%82.4",
        "Kanal & Dolgu Başarı": "%96.8",
        "Toplam Klinik Tahsilat": "1.091.000 ₺",
      },
    });
    showToast("✓ Resmi analitik performans dökümü yazdırma penceresine aktarıldı.", "success");
  };

  return (
    <div className="flex flex-col gap-6">
      <BannerHeader
        title="Klinik Raporları & Analitik"
        description="Aylık hasta büyümesi, tedavi dağılımları, hekim bazlı performans ve finansal KPI göstergeleri."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Raporlar" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Resmi Raporu Yazdır / PDF
            </button>
          </div>
        }
      />

      {/* Period Filter Tabs */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FBFAF7] border border-[#E6E1D8] shadow-xs">
        <div className="flex items-center gap-1.5">
          {(["month", "quarter", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                period === p
                  ? "bg-[#1F3327] text-white shadow-2xs"
                  : "bg-[#EEEBE4] hover:bg-[#E6E1D8] text-[#1C211E]"
              }`}
            >
              {p === "month" ? "Bu Ay" : p === "quarter" ? "Son 3 Ay (Çeyrek)" : "Bu Yıl (2026)"}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#5F665F] font-mono pr-2">
          Veri Güncelleme: 21.11.2026 14:30
        </span>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F665F]">Aktif Hasta Portföyü</span>
            <div className="h-8 w-8 rounded-xl bg-[#E2EEDD] text-[#2C6A3B] flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#1C211E]">
              {period === "month" ? "348" : period === "quarter" ? "892" : "2.410"}
            </span>
            <span className="text-xs font-semibold text-[#2C6A3B] bg-[#E2EEDD] px-2 py-0.5 rounded-full">
              +%12.4
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#5F665F]">Tekil kayıtlı hasta</p>
        </div>

        <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F665F]">Tedavi Başarı Oranı</span>
            <div className="h-8 w-8 rounded-xl bg-[#E3ECF7] text-[#2C5282] flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#2C5282]">
              %96.8
            </span>
            <span className="text-xs font-semibold text-[#2C5282] bg-[#E3ECF7] px-2 py-0.5 rounded-full">
              Yüksek
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#5F665F]">Komplikasyonsuz iyileşme</p>
        </div>

        <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F665F]">Koltuk Doluluk Oranı</span>
            <div className="h-8 w-8 rounded-xl bg-[#F3EADB] text-[#7A5320] flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#7A5320]">
              %82.4
            </span>
            <span className="text-xs font-semibold text-[#7A5320] bg-[#F3EADB] px-2 py-0.5 rounded-full">
              Optimum
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#5F665F]">3 Ünite randevu kapasitesi</p>
        </div>

        <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F665F]">Ortalama Hasta Ciro</span>
            <div className="h-8 w-8 rounded-xl bg-[#ECEAE5] text-[#4F544F] flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#1C211E]">
              4.850 ₺
            </span>
            <span className="text-xs font-semibold text-[#4F544F] bg-[#ECEAE5] px-2 py-0.5 rounded-full">
              TRY
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#5F665F]">Protokol başına ortalama</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7">
          <MonthlyClinicChart />
        </div>
        <div className="lg:col-span-5">
          <TreatmentDistributionChart />
        </div>
      </div>

      {/* Dentist Performance Table */}
      <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-[#1F3327]" />
            <h3 className="text-sm font-serif font-bold text-[#1C211E]">
              Hekim Bazlı Tedavi & Verimlilik Analizi
            </h3>
          </div>
          <span className="text-xs text-[#5F665F]">Dönem Toplamı: 3 Hekim</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEEBE4]/70 text-[#5F665F] uppercase text-[11px] font-bold border-b border-[#E6E1D8]">
              <tr>
                <th className="py-3 px-4">Hekim Adı & Uzmanlık</th>
                <th className="py-3 px-4 text-center">Baktığı Hasta</th>
                <th className="py-3 px-4 text-center">Tamamlanan Tedavi</th>
                <th className="py-3 px-4 text-center">Hasta Memnuniyeti</th>
                <th className="py-3 px-4 text-right">Üretilen Ciro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D8] text-[#1C211E]">
              {doctorPerformances.map((doc, idx) => (
                <tr key={idx} className="hover:bg-[#EEEBE4]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold">
                    <span className="block text-[#1C211E]">{doc.name}</span>
                    <span className="text-[11px] font-normal text-[#5F665F]">{doc.role}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">{doc.patients}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">{doc.treatments}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E2EEDD] text-[#2C6A3B] font-bold text-[11px]">
                      {doc.satisfaction}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#1F3327]">
                    {doc.revenue.toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
