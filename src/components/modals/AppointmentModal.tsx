"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Stethoscope, FileText, CheckCircle2 } from "lucide-react";
import { useModal } from "./ModalContext";
import { patients } from "@/lib/mock-data";

export function AppointmentModal() {
  const { isAppointmentModalOpen, closeAppointmentModal, appointmentPatientName, showToast } = useModal();

  const [patientQuery, setPatientQuery] = useState("");
  const [selectedDentist, setSelectedDentist] = useState("Dr. Selin Yılmaz");
  const [treatment, setTreatment] = useState("Kontrol");
  const [date, setDate] = useState("2026-11-22");
  const [time, setTime] = useState("10:30");
  const [note, setNote] = useState("");
  const [sendSms, setSendSms] = useState(true);

  useEffect(() => {
    if (appointmentPatientName) {
      setPatientQuery(appointmentPatientName);
    } else {
      setPatientQuery("");
    }
  }, [appointmentPatientName, isAppointmentModalOpen]);

  if (!isAppointmentModalOpen) return null;

  const timeSlots = [
    "09:00", "09:45", "10:30", "11:15", "12:00",
    "13:30", "14:15", "15:00", "15:45", "16:30", "17:15"
  ];

  const treatments = [
    "Kontrol & Muayene",
    "Kompozit Dolgu",
    "Kanal Tedavisi (Endodonti)",
    "Diş Çekimi",
    "İmplant Uygulaması",
    "Ortodonti Seansı",
    "Zirkonyum Kaplama",
    "Detertraj (Diş Taşı Temizliği)",
    "Diş Beyazlatma (Bleaching)"
  ];

  const filteredPatients = patientQuery.trim()
    ? patients.filter((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(patientQuery.toLowerCase()) ||
        p.phone.includes(patientQuery)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientQuery.trim()) {
      showToast("Lütfen hasta adını belirtin.", "error");
      return;
    }

    showToast(
      `✓ Randevu oluşturuldu: ${patientQuery} — ${date} ${time} (${treatment})${sendSms ? " • SMS iletildi" : ""}`,
      "success"
    );
    closeAppointmentModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-xl mx-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-stone-200 dark:border-[#243B2F] dark:bg-[#15221B] text-stone-900 dark:text-[#ECF3EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#243B2F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D4A3E]/10 dark:bg-[#1D3328] text-[#2D4A3E] dark:text-[#7CC9A6]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Yeni Randevu Oluştur</h2>
              <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">Klinik takvimine yeni bir randevu kaydedin</p>
            </div>
          </div>
          <button
            onClick={closeAppointmentModal}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-[#ECF3EE] hover:bg-stone-100 dark:hover:bg-[#1D3328] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Hasta Arama / Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Hasta Adı / Telefon No
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Örn: Ayşe Demir veya +90 532..."
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/60 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] px-3 text-sm focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] outline-none"
                required
              />
              {filteredPatients.length > 0 && patientQuery !== `${filteredPatients[0]?.firstName} ${filteredPatients[0]?.lastName}` && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-xl bg-white dark:bg-[#1A2C23] border border-stone-200 dark:border-[#243B2F] shadow-lg max-h-40 overflow-y-auto">
                  {filteredPatients.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPatientQuery(`${p.firstName} ${p.lastName}`)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-stone-50 dark:hover:bg-[#1D3328] transition-colors"
                    >
                      <span className="font-semibold text-stone-900 dark:text-[#ECF3EE]">{p.firstName} {p.lastName}</span>
                      <span className="text-stone-400 dark:text-[#A2B5A8]">{p.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Diş Hekimi & Tedavi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
                Diş Hekimi
              </label>
              <select
                value={selectedDentist}
                onChange={(e) => setSelectedDentist(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/60 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] px-3 text-sm focus:border-[#4A7C68] outline-none"
              >
                <option value="Dr. Selin Yılmaz" className="dark:bg-[#1A2C23]">Dr. Selin Yılmaz</option>
                <option value="Dr. Mahir Açıkkalın" className="dark:bg-[#1A2C23]">Dr. Mahir Açıkkalın</option>
                <option value="Dr. Elif Karaca" className="dark:bg-[#1A2C23]">Dr. Elif Karaca (Ortodonti)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
                Tedavi Türü
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/60 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] px-3 text-sm focus:border-[#4A7C68] outline-none"
              >
                {treatments.map((t) => (
                  <option key={t} value={t} className="dark:bg-[#1A2C23]">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarih */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Randevu Tarihi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/60 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] px-3 text-sm focus:border-[#4A7C68] outline-none"
              required
            />
          </div>

          {/* Saat Seçimi (Grid Slots) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Saat Slotu
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = time === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-xs"
                        : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] hover:bg-stone-50 dark:hover:bg-[#1D3328] text-stone-600 dark:text-[#A2B5A8]"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#C5D4CB] mb-1.5">
              Randevu Notu / Şikayet (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Sol üst molar ağrısı, anestezi hassasiyeti..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/60 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] p-2.5 text-xs focus:border-[#4A7C68] outline-none resize-none"
            />
          </div>

          {/* SMS Bildirimi Onayı */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-600 dark:text-[#A2B5A8]">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
              className="rounded accent-[#2D4A3E]"
            />
            <span>Hastaya otomatik randevu onay SMS'i gönder</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-[#243B2F]">
            <button
              type="button"
              onClick={closeAppointmentModal}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-stone-300 dark:border-[#243B2F] text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-50 dark:hover:bg-[#1D3328] transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2D4A3E] hover:bg-[#3A5F50] text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Randevuyu Onayla & Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
