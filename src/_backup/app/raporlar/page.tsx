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
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Resmi Raporu Yazdır / PDF
            </button>
          </div>
        }
      />

      {/* Period Filter Tabs */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        <div className="flex items-center gap-1.5">
          {(["month", "quarter", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                period === p
                  ? "bg-[#2D4A3E] text-white shadow-2xs"
                  : "text-stone-600 dark:text-[#90A199] hover:bg-stone-100 dark:hover:bg-[#1A2D23]"
              }`}
            >
              {p === "month" ? "Bu Ay" : p === "quarter" ? "Son 3 Ay (Çeyrek)" : "Bu Yıl (2026)"}
            </button>
          ))}
        </div>
        <span className="text-xs text-stone-400 font-mono pr-2">
          Veri Güncelleme: 21.11.2026 14:30
        </span>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Aktif Hasta Portföyü</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-[#1A3125] text-[#2D4A3E] dark:text-[#7CC9A6] flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-stone-100">
              {period === "month" ? "348" : period === "quarter" ? "892" : "2.410"}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +%12.4
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Tekil kayıtlı hasta</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Tedavi Başarı Oranı</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-blue-700 dark:text-blue-400">
              %96.8
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Yüksek
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Komplikasyonsuz iyileşme</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Koltuk Doluluk Oranı</span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
              %82.4
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Optimum
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-400">3 Ünite randevu kapasitesi</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Ortalama Hasta Ciro</span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-purple-700 dark:text-purple-400">
              4.850 ₺
            </span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              TRY
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-400">Protokol başına ortalama</p>
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
      <div className="rounded-2xl bg-white dark:bg-[#122019] p-6 border border-stone-200/80 dark:border-[#1E332A] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2]">
              Hekim Bazlı Tedavi & Verimlilik Analizi
            </h3>
          </div>
          <span className="text-xs text-stone-400">Dönem Toplamı: 3 Hekim</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-[#16261F] text-stone-500 uppercase text-[11px] font-bold border-b border-stone-200 dark:border-[#1E332A]">
              <tr>
                <th className="py-3 px-4">Hekim Adı & Uzmanlık</th>
                <th className="py-3 px-4 text-center">Baktığı Hasta</th>
                <th className="py-3 px-4 text-center">Tamamlanan Tedavi</th>
                <th className="py-3 px-4 text-center">Hasta Memnuniyeti</th>
                <th className="py-3 px-4 text-right">Üretilen Ciro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#1A2D23] text-stone-800 dark:text-stone-200">
              {doctorPerformances.map((doc, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60 dark:hover:bg-[#172B20] transition-colors">
                  <td className="py-3.5 px-4 font-bold">
                    <span className="block text-stone-900 dark:text-stone-100">{doc.name}</span>
                    <span className="text-[11px] font-normal text-stone-400">{doc.role}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">{doc.patients}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">{doc.treatments}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      {doc.satisfaction}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#2D4A3E] dark:text-[#7CC9A6]">
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
