"use client";

import React, { useRef } from "react";
import { useModal } from "./ModalContext";
import { X, Printer, Download, FileText, CheckCircle2, Building, ShieldCheck } from "lucide-react";

export function PrintPreviewModal() {
  const { printData, closePrintPreview, showToast } = useModal();
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!printData.isOpen) return null;

  const handlePrint = () => {
    window.print();
    showToast("✓ Yazdırma penceresi açıldı.", "info");
  };

  const clinicName = "DENTASPHERE AĞIZ VE DİŞ SAĞLIĞI POLİKLİNİĞİ";
  const clinicAddress = "Bağdat Caddesi No: 244/4 Kadıköy / İSTANBUL • Tel: +90 (216) 450 00 24 • info@dentasphere.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-3xl my-6 rounded-2xl bg-stone-100 dark:bg-[#0E1712] border border-stone-200 dark:border-[#1E332A] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200 dark:border-[#1E332A] bg-white dark:bg-[#122019] print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D4A3E]/10 dark:bg-[#7CC9A6]/10 text-[#2D4A3E] dark:text-[#7CC9A6]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                Resmi Belge Yazdırma Önizleme
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {printData.title || "Resmi Klinik Dökümü"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#3A5F50] transition-colors shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Yazdır (Print)</span>
            </button>
            <button
              type="button"
              onClick={closePrintPreview}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A2D23] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[82vh] flex justify-center">
          <div
            ref={printContentRef}
            className="w-full max-w-2xl bg-white text-stone-900 p-8 sm:p-10 rounded-xl shadow-md border border-stone-200 font-sans print:shadow-none print:border-none print:p-0 print:m-0"
          >
            {/* Clinic Letterhead Header */}
            <div className="border-b-2 border-[#2D4A3E] pb-4 mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-wider text-[#2D4A3E] uppercase font-serif">
                  {clinicName}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1 max-w-md">
                  {clinicAddress}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                  {printData.type === "prescription"
                    ? "E-Reçete Dökümü"
                    : printData.type === "invoice"
                    ? "Mali E-Makbuz"
                    : printData.type === "receipt"
                    ? "Tahsilat Dekontu"
                    : printData.type === "patient_card"
                    ? "Hasta Dosyası"
                    : "Hukuki Onam Belgesi"}
                </span>
                <p className="text-[11px] font-mono text-stone-500 mt-1">
                  Tarih: {printData.date || new Date().toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-4">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 uppercase tracking-wide">
                {printData.title}
              </h2>
            </div>

            {/* Patient Header Block */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs mb-6">
              <div>
                <span className="text-stone-500 block text-[10px] font-semibold uppercase">Hasta Adı Soyadı</span>
                <span className="font-bold text-stone-900">{printData.patientName}</span>
              </div>
              {printData.doctorName && (
                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase">Tedavi Eden Hekim</span>
                  <span className="font-semibold text-stone-800">{printData.doctorName}</span>
                </div>
              )}
            </div>

            {/* Extra Info Grid (if provided) */}
            {printData.extraInfo && Object.keys(printData.extraInfo).length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-xs mb-6 p-3 bg-stone-50/70 rounded-lg border border-stone-100">
                {Object.entries(printData.extraInfo).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-[10px] font-medium text-stone-400 uppercase">{k}:</span>
                    <span className="font-medium text-stone-800">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Specific Layout By Type: PRESCRIPTION */}
            {printData.type === "prescription" && (
              <div className="space-y-4 mb-6">
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">İlaç Adı</th>
                        <th className="py-2 px-3">Dozaj</th>
                        <th className="py-2 px-3">Kullanım Şekli</th>
                        <th className="py-2 px-3">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {printData.items && printData.items.length > 0 ? (
                        printData.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="py-2.5 px-3 font-semibold text-stone-800">{item.name}</td>
                            <td className="py-2.5 px-3 text-stone-600">{item.detail || "1 Kutu"}</td>
                            <td className="py-2.5 px-3 font-medium text-stone-700">2x1 Tok Karnına</td>
                            <td className="py-2.5 px-3 text-stone-500 text-[11px]">—</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-stone-800">Augmentin-BID 1000 mg Film Tablet</td>
                            <td className="py-2 px-3 text-stone-600">1 Kutu (14 Tablet)</td>
                            <td className="py-2 px-3 font-medium text-stone-700">2x1 Tok Karnına</td>
                            <td className="py-2 px-3 text-stone-500 text-[11px]">12 saat arayla düzenli</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-stone-800">Majezik 100 mg Film Tablet</td>
                            <td className="py-2 px-3 text-stone-600">1 Kutu (15 Tablet)</td>
                            <td className="py-2 px-3 font-medium text-stone-700">Gerektiğinde Tok</td>
                            <td className="py-2 px-3 text-stone-500 text-[11px]">Ağrı durumunda günde max 2</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-stone-800">Kloroben Ağız Çalkalama Gargarası</td>
                            <td className="py-2 px-3 text-stone-600">1 Şişe (200 ml)</td>
                            <td className="py-2 px-3 font-medium text-stone-700">Günde 3 Defa</td>
                            <td className="py-2 px-3 text-stone-500 text-[11px]">Yemeklerden sonra 1 dk gargara</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* E-Reçete Barcode Mockup */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-stone-400">E-REÇETE NO</span>
                    <span className="text-sm font-bold font-mono tracking-widest text-stone-800">
                      REC-2026-99418
                    </span>
                  </div>
                  <div className="h-8 w-36 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_5px,#fff_5px,#fff_7px,#000_7px,#000_10px)] opacity-70" />
                </div>
              </div>
            )}

            {/* Specific Layout By Type: INVOICE & RECEIPT */}
            {(printData.type === "invoice" || printData.type === "receipt") && (
              <div className="space-y-4 mb-6">
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Hizmet / İşlem Açıklaması</th>
                        <th className="py-2 px-3 text-center">Birim</th>
                        <th className="py-2 px-3 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {printData.items && printData.items.length > 0 ? (
                        printData.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 font-medium text-stone-800">{item.name}</td>
                            <td className="py-2.5 px-3 text-center text-stone-500">1</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-stone-900">
                              {typeof item.price === "number" ? `${item.price.toLocaleString("tr-TR")} ₺` : item.price}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-stone-800">Kompozit Dolgu (Tek Yüzlü - No: 16)</td>
                            <td className="py-2.5 px-3 text-center text-stone-500">1</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-stone-900">1.650 ₺</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-stone-800">Detertraj (Diş Taşı Temizliği)</td>
                            <td className="py-2.5 px-3 text-center text-stone-500">1</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-stone-900">2.200 ₺</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                    <tfoot className="bg-stone-50 border-t border-stone-200 font-bold">
                      <tr>
                        <td colSpan={2} className="py-2 px-3 text-right text-stone-600 uppercase text-[10px]">KDV (%10):</td>
                        <td className="py-2 px-3 text-right text-stone-700 font-mono">350 ₺</td>
                      </tr>
                      <tr className="border-t border-stone-200 text-sm">
                        <td colSpan={2} className="py-2.5 px-3 text-right text-stone-900 uppercase">Toplam Tutar:</td>
                        <td className="py-2.5 px-3 text-right text-[#2D4A3E] font-bold font-mono">
                          {printData.total ? `${printData.total} ₺` : "3.850 ₺"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                  <span className="block text-[10px] font-bold text-stone-400 uppercase">Ödeme Bilgisi</span>
                  <p className="text-stone-700">Ödeme Şekli: <span className="font-semibold">Kredi Kartı / POS Tek Çekim</span></p>
                  <p className="text-stone-700">Klinik IBAN: <span className="font-mono text-xs">TR33 0006 1005 1928 3746 5000 01</span> (Garanti BBVA)</p>
                </div>
              </div>
            )}

            {/* Specific Layout By Type: CONSENT / LEGAL FORM */}
            {printData.type === "consent" && (
              <div className="space-y-4 mb-6 text-xs text-stone-700 leading-relaxed">
                <p>
                  Yukarıda kimlik ve tanı bilgileri yer alan hastamıza hekimi tarafından yapılması planlanan tıbbi ve cerrahi işlemler,
                  oluşabilecek olası komplikasyonlar, alternatif tedavi yöntemleri ve sonrasında dikkat edilmesi gereken hususlar
                  ayrıntılı olarak sözlü ve yazılı olarak açıklanmıştır.
                </p>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-600">
                  <p className="font-semibold text-stone-800 mb-1">Hasta Taahhüdü ve Rıza Beyanı:</p>
                  İşbu form kapsamında yapılacak tedavinin detaylarını, mali yükümlülüklerini ve hekimimin önerdiği istirahat ve
                  ilaç kullanım kurallarına uymayı kabul ettiğimi beyan ederim.
                </div>
              </div>
            )}

            {/* Signature & Seal Area */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-stone-200">
              <div className="text-center">
                <span className="block text-[11px] font-bold text-stone-600 uppercase">
                  Hasta / Kanuni Temsilci
                </span>
                <p className="text-xs text-stone-800 font-semibold mt-1">{printData.patientName}</p>
                <div className="h-14 mt-2 flex items-center justify-center text-xs text-stone-400 border border-dashed border-stone-200 rounded">
                  İmza
                </div>
              </div>

              <div className="text-center">
                <span className="block text-[11px] font-bold text-stone-600 uppercase">
                  Mesul Müdür / Diş Hekimi
                </span>
                <p className="text-xs text-stone-800 font-semibold mt-1">
                  {printData.doctorName || "Dr. Selin Yılmaz"}
                </p>
                <div className="h-14 mt-2 flex flex-col items-center justify-center border border-dashed border-stone-200 rounded">
                  <span className="text-[10px] font-bold text-[#2D4A3E] uppercase tracking-wider">
                    DENTASPHERE KAŞE / E-İMZA
                  </span>
                  <span className="text-[9px] font-mono text-stone-400">Diploma No: 34-4821</span>
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>Bu belge elektronik ortamda doğrulanabilir: dentasphere.com/e-dogrula</span>
              <span>Sayfa 1 / 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
