"use client";

import React, { useState } from "react";
import { useModal } from "./ModalContext";
import { X, ClipboardList, Calendar, CheckCircle2, Printer, User, FileText } from "lucide-react";

export function MedicalReportModal() {
  const { reportData, closeReportModal, showToast, openPrintPreview } = useModal();

  const [days, setDays] = useState<number>(3);
  const [diagnosis, setDiagnosis] = useState<string>("K04.0 - Pulpitis Akut (Cerrahi Girişim Sonrası)");
  const [customDiagnosis, setCustomDiagnosis] = useState<string>("");
  const [note, setNote] = useState<string>(
    "Hastanın cerrahi müdahale sonrası fiziksel dinlenmesi ve medikal tedavisine devamı uygundur."
  );

  if (!reportData.isOpen) return null;

  const today = new Date();
  const startDateStr = today.toLocaleDateString("tr-TR");
  const returnDate = new Date(today);
  returnDate.setDate(today.getDate() + days);
  const returnDateStr = returnDate.toLocaleDateString("tr-TR");

  const diagnosisOptions = [
    "K04.0 - Pulpitis Akut (Cerrahi Girişim Sonrası)",
    "K05.2 - Akut Periapikal Periodontit & Drenaj",
    "K08.1 - Komplike 20 Yaş Diş Çekimi Operasyonu",
    "K01.1 - Gömülü Diş Osteotomisi",
    "K02.1 - Derin Dentin Çürüğü Tedavisi & Ağrı",
    "Diğer (Özel Belirtin)",
  ];

  const handlePrint = () => {
    const activeDiagnosis = diagnosis === "Diğer (Özel Belirtin)" && customDiagnosis ? customDiagnosis : diagnosis;
    closeReportModal();
    openPrintPreview({
      type: "consent",
      title: "Resmi İstirahat & İş Göremezlik Raporu",
      patientName: reportData.patientName,
      date: startDateStr,
      doctorName: reportData.doctorName,
      extraInfo: {
        "Rapor / Protokol No": reportData.protocolNo || "RAP-8841",
        "T.C. Kimlik No": reportData.tcNo || "23456789012",
        "Klinik Teşhis": activeDiagnosis,
        "İstirahat Süresi": `${days} Gün`,
        "Rapor Başlangıç": startDateStr,
        "İşe / Okula Başlama": returnDateStr,
        "Hekim Görüşü": note,
      },
    });
    showToast(`✓ ${reportData.patientName} adına ${days} günlük istirahat raporu oluşturuldu ve yazdırma moduna aktarıldı.`, "success");
  };

  const handleSave = () => {
    closeReportModal();
    showToast(`✓ ${reportData.patientName} adına ${days} günlük istirahat raporu sisteme kaydedildi.`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#15221B] border border-stone-200 dark:border-[#243B2F] shadow-2xl overflow-hidden flex flex-col text-stone-900 dark:text-[#ECF3EE]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-[#1D3328] text-[#2D4A3E] dark:text-[#7CC9A6]">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-[#ECF3EE]">
                Medikal İstirahat Raporu Düzenle
              </h2>
              <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">
                Resmi kurum ve işyeri geçerli istirahat belgesi
              </p>
            </div>
          </div>
          <button
            onClick={closeReportModal}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-[#ECF3EE] hover:bg-stone-100 dark:hover:bg-[#1D3328] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Patient info badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-[#1A2C23] border border-stone-200/70 dark:border-[#243B2F]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
              <span className="text-xs font-semibold text-stone-800 dark:text-[#ECF3EE]">
                {reportData.patientName}
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 dark:text-[#A2B5A8]">
              Protokol: {reportData.protocolNo || "RAP-8841"}
            </span>
          </div>

          {/* Days buttons */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-2">
              İstirahat Süresi (Gün)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    days === d
                      ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-sm"
                      : "bg-white dark:bg-[#1A2C23] text-stone-700 dark:text-[#C5D4CB] border-stone-200 dark:border-[#243B2F] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  {d} Gün
                </button>
              ))}
            </div>
          </div>

          {/* Dates preview */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-[#1D3328]/50 border border-emerald-100 dark:border-[#243B2F]">
            <div>
              <span className="block text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                Başlangıç Tarihi
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-[#ECF3EE]">
                {startDateStr}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                İşe / Okula Başlama Tarihi
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {returnDateStr}
              </span>
            </div>
          </div>

          {/* Diagnosis Select */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Tanı & Teşhis (ICD-10)
            </label>
            <select
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-2 text-xs text-stone-800 dark:text-[#ECF3EE] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            >
              {diagnosisOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-[#1A2C23]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {diagnosis === "Diğer (Özel Belirtin)" && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
                Özel Teşhis Açıklaması
              </label>
              <input
                type="text"
                placeholder="Örn: Akut temporomandibular eklem disfonksiyonu..."
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-2 text-xs text-stone-800 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
            </div>
          )}

          {/* Hekim Notu */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Klinik Not & Tavsiyeler
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-3 text-xs text-stone-800 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          {/* Doctor */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A2B5A8] pt-1 border-t border-stone-100 dark:border-[#243B2F]">
            <span>Düzenleyen Hekim:</span>
            <span className="font-semibold text-stone-700 dark:text-[#C5D4CB]">
              {reportData.doctorName} (Kaşe / E-İmza)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-stone-100 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23]">
          <button
            type="button"
            onClick={closeReportModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-100 dark:hover:bg-[#1D3328] transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#243B2F] text-stone-800 dark:text-[#ECF3EE] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#325040] transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Kaydet
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#3A5F50] transition-colors shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Yazdır & Önizle
          </button>
        </div>
      </div>
    </div>
  );
}
