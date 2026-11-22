"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
  X,
  RotateCcw,
  Check,
  AlertTriangle,
  List,
  CalendarDays,
  User,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import {
  CalendarAppointment,
  initialAppointmentsList,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointments-data";

export default function RandevularPage() {
  const { showToast } = useModal();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedDentist, setSelectedDentist] = useState("Tüm Hekimler");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [currentWeek, setCurrentWeek] = useState("24 – 29 Ekim 2026");
  const [mobileDay, setMobileDay] = useState("Per");
  const [mobileViewMode, setMobileViewMode] = useState<"agenda" | "grid">("agenda");

  // Selected Appointment for Detail / Full Edit / Delete
  const [selectedApt, setSelectedApt] = useState<CalendarAppointment | null>(null);
  const [editPatient, setEditPatient] = useState("");
  const [editTreatment, setEditTreatment] = useState("");
  const [editDentist, setEditDentist] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDay, setEditDay] = useState("Per");
  const [editPhone, setEditPhone] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Create appointment modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPatient, setCreatePatient] = useState("");
  const [createTreatment, setCreateTreatment] = useState("Kontrol & Muayene");
  const [createDentist, setCreateDentist] = useState("Dr. Selin Yılmaz");
  const [createTime, setCreateTime] = useState("10:30");
  const [createDay, setCreateDay] = useState("Per");
  const [createPhone, setCreatePhone] = useState("+90 ");

  // Delete Confirmation
  const [aptToDelete, setAptToDelete] = useState<CalendarAppointment | null>(null);

  // Load from shared storage & listen to updates
  useEffect(() => {
    const load = () => {
      const all = getStoredAppointments();
      setAppointments(all);
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener("dentapp_appointments_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("dentapp_appointments_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const days = [
    { key: "Pzt", label: "Pazartesi", date: "24 Ekim" },
    { key: "Sal", label: "Salı", date: "25 Ekim" },
    { key: "Çar", label: "Çarşamba", date: "26 Ekim" },
    { key: "Per", label: "Perşembe (Bugün)", date: "27 Ekim", isToday: true },
    { key: "Cum", label: "Cuma", date: "28 Ekim" },
    { key: "Cmt", label: "Cumartesi", date: "29 Ekim" },
  ];

  const timeSlots = ["09:00", "09:45", "10:30", "11:15", "12:00", "13:30", "14:15", "15:00", "15:45", "16:30"];

  // Exact Figma Event Colors
  const getAppointmentCardClasses = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        // Event/Green: #DDE7D9 / #C5D6C0 -> dark: #173022 / #26533B
        return "bg-[#DDE7D9] border-[#C5D6C0] text-[#1F3327] dark:bg-[#173022] dark:border-[#26533B] dark:text-[#A7F3D0]";
      case "Devam Ediyor":
        // Event/Purple: #E6DFF1 / #D3C7E6 -> dark: #241E38 / #3D325C
        return "bg-[#E6DFF1] border-[#D3C7E6] text-[#2C5282] dark:bg-[#241E38] dark:border-[#3D325C] dark:text-[#C4B5FD]";
      case "İptal":
        // Event/Red: #F4D9D6 / #E8BFBA -> dark: #341818 / #572727
        return "bg-[#F4D9D6] border-[#E8BFBA] text-[#B3261E] dark:bg-[#341818] dark:border-[#572727] dark:text-[#FCA5A5] opacity-80";
      case "Bekliyor":
      default:
        // Event/Yellow: #F7E9C9 / #E9D3A0 -> dark: #332514 / #573F22
        return "bg-[#F7E9C9] border-[#E9D3A0] text-[#7A5320] dark:bg-[#332514] dark:border-[#573F22] dark:text-[#FDE68A]";
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0 bg-[#E2EEDD] text-[#2C6A3B] border border-[#C9DDC3] dark:bg-[#1A3324] dark:text-[#4ADE80] dark:border-[#2D5A3C]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F8F55] shrink-0" />
            Tamamlandı
          </span>
        );
      case "Devam Ediyor":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0 bg-[#E3ECF7] text-[#2C5282] border border-[#C5D6E8] dark:bg-[#172B3C] dark:text-[#7BAEF0] dark:border-[#23425E]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4A78B5] animate-pulse shrink-0" />
            Devam Ediyor
          </span>
        );
      case "İptal":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 bg-[#FBE9E7] text-[#B3261E] border border-[#F3D0CC] dark:bg-[#3B1C1B] dark:text-[#F87171] dark:border-[#5A2422]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#B3261E] shrink-0" />
            İptal
          </span>
        );
      case "Bekliyor":
      default:
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0 bg-[#F3EADB] text-[#7A5320] border border-[#EADFC8] dark:bg-[#342817] dark:text-[#E2B77A] dark:border-[#523E23]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#B07D47] shrink-0" />
            Bekliyor
          </span>
        );
    }
  };

  const handleOpenSelected = (apt: CalendarAppointment) => {
    setSelectedApt(apt);
    setEditPatient(apt.patientName);
    setEditTreatment(apt.treatment);
    setEditDentist(apt.dentist);
    setEditTime(apt.time);
    setEditDay(apt.day);
    setEditPhone(apt.phone || "+90 505 321 45 67");
    setEditNotes(apt.notes || "");
  };

  const handleSaveSelected = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    const updated = appointments.map((a) =>
      a.id === selectedApt.id
        ? {
            ...a,
            patientName: editPatient.trim(),
            treatment: editTreatment.trim(),
            dentist: editDentist.trim(),
            time: editTime.trim(),
            day: editDay,
            phone: editPhone.trim(),
            notes: editNotes.trim(),
          }
        : a
    );
    saveStoredAppointments(updated);
    setAppointments(updated);
    setSelectedApt(null);
    showToast(`✓ ${editPatient} randevusu ve detayları güncellendi.`, "success");
  };

  const handleUpdateStatus = (id: string, newStatus: CalendarAppointment["status"]) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    saveStoredAppointments(updated);
    setAppointments(updated);
    if (selectedApt && selectedApt.id === id) {
      setSelectedApt({ ...selectedApt, status: newStatus });
    }
    showToast(`✓ Randevu durumu güncellendi: "${newStatus}"`, "success");
  };

  const confirmDelete = () => {
    if (!aptToDelete) return;
    const targetName = aptToDelete.patientName;
    const updated = appointments.filter((a) => a.id !== aptToDelete.id);
    saveStoredAppointments(updated);
    setAppointments(updated);
    setAptToDelete(null);
    setSelectedApt(null);
    showToast(`✓ ${targetName} randevusu takvimden silindi.`, "info");
  };

  const handleOpenSlotCreate = (dayKey: string, time: string) => {
    setCreatePatient("");
    setCreateTreatment("Kontrol & Muayene");
    setCreateDentist("Dr. Selin Yılmaz");
    setCreateDay(dayKey);
    setCreateTime(time);
    setCreatePhone("+90 ");
    setIsCreateOpen(true);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createPatient.trim()) return;

    const newApt: CalendarAppointment = {
      id: `apt-${Date.now()}`,
      patientName: createPatient.trim(),
      dentist: createDentist,
      treatment: createTreatment,
      time: createTime,
      day: createDay,
      status: "Bekliyor",
      phone: createPhone,
    };

    const updated = [...appointments, newApt];
    saveStoredAppointments(updated);
    setAppointments(updated);
    setIsCreateOpen(false);
    showToast(`✓ Yeni randevu eklendi: ${createPatient} (${createDay} ${createTime}).`, "success");
  };

  const handleResetDefaults = () => {
    saveStoredAppointments(initialAppointmentsList);
    setAppointments(initialAppointmentsList);
    showToast("✓ Randevu takvimi varsayılan listeye sıfırlandı.", "info");
  };

  const filtered = appointments.filter((a) => {
    const matchDentist = selectedDentist === "Tüm Hekimler" || a.dentist === selectedDentist;
    const matchStatus = selectedStatus === "Tümü" || a.status === selectedStatus;
    return matchDentist && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <BannerHeader
        title="Randevu Takvimi"
        description="Klinik hekimlerinin haftalık ve günlük tedavi randevularını yönetin, durumlarını güncelleyin ve anasayfa ile senkronize edin."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Randevular" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenSlotCreate("Per", "10:30")}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
            >
              <Plus className="h-4 w-4" />
              + Yeni Randevu
            </button>
          </div>
        }
      />

      {/* Calendar Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 shadow-xs bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
      >
        {/* Week navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F]"
          >
            <button
              onClick={() => setCurrentWeek("17 – 22 Ekim 2026")}
              className="p-2 transition-colors cursor-pointer hover:bg-[#EEEBE4] dark:hover:bg-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span
              className="px-3 text-xs font-bold select-none text-[#1C211E] dark:text-[#ECF3EE]"
            >
              {currentWeek}
            </span>
            <button
              onClick={() => setCurrentWeek("31 Ekim – 5 Kasım 2026")}
              className="p-2 transition-colors cursor-pointer hover:bg-[#EEEBE4] dark:hover:bg-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#DDEBD8] border border-[#C9DDC3] text-[#1F3327] dark:bg-[#1E3527] dark:border-[#2D4C3C] dark:text-[#9AB395]"
          >
            Aktif Hafta
          </span>

          <button
            onClick={handleResetDefaults}
            title="Varsayılan Randevu Listesine Sıfırla"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
          >
            <RotateCcw className="h-3 w-3" />
            Sıfırla
          </button>
        </div>

        {/* Mobile View Toggle Buttons (< md) */}
        <div className="flex md:hidden items-center w-full sm:w-auto p-1 rounded-xl bg-[#EEEBE4] border border-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F]">
          <button
            type="button"
            onClick={() => setMobileViewMode("agenda")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileViewMode === "agenda"
                ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#2D4C3C]"
                : "text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-[#ECF3EE]"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Ajanda (Google Takvim)</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode("grid")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileViewMode === "grid"
                ? "bg-[#1F3327] text-white shadow-xs dark:bg-[#2D4C3C]"
                : "text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-[#ECF3EE]"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Haftalık Izgara</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <Filter className="h-3.5 w-3.5" />
            <span>Hekim:</span>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <option value="Tüm Hekimler">Tüm Hekimler</option>
              <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
              <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <span>Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <option value="Tümü">Tüm Durumlar</option>
              <option value="Bekliyor">Bekliyor</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal">İptal Edildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBİL GÖRÜNÜM (< 768px, md öncesi) */}
      <div className="flex md:hidden flex-col gap-4">
        {mobileViewMode === "agenda" ? (
          /* Google Takvim Ajanda Modu */
          <div className="flex flex-col gap-3">
            {/* Üstte Google Takvim tarzı yatay gün şeridi */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {days.map((day) => {
                const isSelected = mobileDay === day.key;
                const dayApts = filtered.filter((a) => a.day === day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setMobileDay(day.key)}
                    className={`flex flex-col items-center justify-center flex-1 min-w-[50px] py-2 px-1 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#1F3327] text-white border-[#1F3327] shadow-sm dark:bg-[#2D4C3C] dark:border-[#345844]"
                        : day.isToday
                        ? "bg-[#DDEBD8]/60 border-[#C9DDC3] text-[#1F3327] dark:bg-[#1E3527] dark:border-[#2D4C3C] dark:text-[#9AB395]"
                        : "bg-[#FBFAF7] border-[#E6E1D8] text-[#1C211E] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21]"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? "text-white/80" : "text-[#8A8F89] dark:text-[#A2B5A8]"
                      }`}
                    >
                      {day.key}
                    </span>
                    <span className="text-base font-bold font-serif leading-tight mt-0.5">
                      {day.date.split(" ")[0]}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {day.isToday && (
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#2C6A3B]/10 text-[#2C6A3B] dark:text-[#4ADE80]"
                          }`}
                        >
                          Bugün
                        </span>
                      )}
                      {dayApts.length > 0 && !day.isToday && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-white" : "bg-[#2C6A3B] dark:bg-[#4ADE80]"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Seçili Gün Başlığı & Randevu Özeti */}
            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#1C211E] dark:text-[#ECF3EE]">
                  {days.find((d) => d.key === mobileDay)?.label}
                </span>
                <span className="text-[#8A8F89] dark:text-[#A2B5A8]">
                  • {days.find((d) => d.key === mobileDay)?.date} 2026
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEEBE4] border border-[#E6E1D8] text-[#5F665F] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#A2B5A8]">
                {filtered.filter((a) => a.day === mobileDay).length} Randevu
              </span>
            </div>

            {/* Altta seçili günün dikey saat ajandası */}
            <div className="flex flex-col gap-2 rounded-2xl p-3 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
              {timeSlots.map((time) => {
                const appointment = filtered.find((a) => a.day === mobileDay && a.time === time);

                return (
                  <div key={time} className="flex items-start gap-3 py-1">
                    {/* Sol tarafta saat damgası */}
                    <div className="w-12 pt-2 shrink-0 text-right">
                      <span className="font-mono text-xs font-bold text-[#8A8F89] dark:text-[#A2B5A8]">
                        {time}
                      </span>
                    </div>

                    {/* Sağ tarafta o saate ait randevu kartı veya boş saat dilimi */}
                    <div className="flex-1 min-w-0">
                      {appointment ? (
                        <div
                          onClick={() => handleOpenSelected(appointment)}
                          className={`p-3 rounded-xl shadow-2xs border transition-all cursor-pointer hover:shadow-md ${getAppointmentCardClasses(
                            appointment.status
                          )}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-xs truncate">
                              {appointment.patientName}
                            </span>
                            {renderStatusBadge(appointment.status)}
                          </div>
                          <p className="text-xs font-medium opacity-90 truncate">
                            {appointment.treatment}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 text-[11px] opacity-80">
                            <span className="flex items-center gap-1 font-semibold">
                              <User className="h-3 w-3" />
                              {appointment.dentist}
                            </span>
                            <span className="font-mono text-[10px]">{appointment.time}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenSlotCreate(mobileDay, time)}
                          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#E6E1D8] dark:border-[#243B2F] bg-white/50 dark:bg-[#1A2B21]/30 hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21] transition-colors flex items-center justify-between text-xs text-[#8A8F89] dark:text-[#A2B5A8] group cursor-pointer"
                        >
                          <span className="text-[11px] font-medium group-hover:text-[#1C211E] dark:group-hover:text-[#ECF3EE]">
                            Boş Saat Dilimi
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#1F3327] dark:text-[#4ADE80]">
                            <Plus className="h-3 w-3" /> Ekle
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Haftalık Izgara Modu (Mobilde kaydırmalı) */
          <div className="rounded-2xl shadow-xs overflow-x-auto bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="p-2.5 text-center text-[11px] font-medium text-[#8A8F89] dark:text-[#A2B5A8] border-b border-[#ECE8E1] dark:border-[#182A20] flex items-center justify-center gap-2">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Haftalık tabloyu sağa-sola kaydırarak görüntüleyebilirsiniz</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-[760px]">
              {/* Day Headers */}
              <div
                className="grid grid-cols-7 border-b border-[#ECE8E1] dark:border-[#182A20] bg-[#FBFAF7] dark:bg-[#15221B]"
              >
                <div
                  className="p-3 text-center text-xs font-bold flex items-center justify-center border-r border-[#ECE8E1] dark:border-[#182A20] text-[#8A8F89] dark:text-[#A2B5A8]"
                >
                  Saat
                </div>
                {days.map((day) => (
                  <div
                    key={day.key}
                    className={`p-3 text-center border-r border-[#ECE8E1] dark:border-[#182A20] ${
                      day.isToday ? "bg-[rgba(221,235,216,0.4)] dark:bg-[rgba(31,51,39,0.5)]" : "bg-transparent"
                    }`}
                  >
                    <p
                      className={`text-xs ${
                        day.isToday ? "font-serif text-sm font-bold text-[#1F3327] dark:text-[#4ADE80]" : "font-bold text-[#1C211E] dark:text-[#ECF3EE]"
                      }`}
                    >
                      {day.label}
                    </p>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        day.isToday ? "text-[#2F5A3D] dark:text-[#9AB395]" : "text-[#8A8F89] dark:text-[#A2B5A8]"
                      }`}
                    >
                      {day.date}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              <div>
                {timeSlots.map((time, rowIdx) => (
                  <div
                    key={time}
                    className={`grid grid-cols-7 min-h-[68px] ${
                      rowIdx < timeSlots.length - 1 ? "border-b border-[#ECE8E1] dark:border-[#182A20]" : ""
                    }`}
                  >
                    {/* Time Column */}
                    <div
                      className="p-2.5 text-center text-xs font-mono font-semibold flex items-center justify-center select-none border-r border-[#ECE8E1] dark:border-[#182A20] text-[#8A8F89] dark:text-[#A2B5A8] bg-[#FBFAF7] dark:bg-[#15221B]"
                    >
                      {time}
                    </div>

                    {/* Days Columns */}
                    {days.map((day) => {
                      const appointment = filtered.find((a) => a.day === day.key && a.time === time);

                      return (
                        <div
                          key={day.key}
                          onClick={() => !appointment && handleOpenSlotCreate(day.key, time)}
                          className={`p-1 transition-colors relative group border-r border-[#ECE8E1] dark:border-[#182A20] ${
                            day.isToday
                              ? "bg-[rgba(221,235,216,0.15)] dark:bg-[rgba(31,51,39,0.2)]"
                              : "bg-transparent"
                          }`}
                        >
                          {appointment ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSelected(appointment);
                              }}
                              className={`h-full p-2 rounded-xl shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all border ${getAppointmentCardClasses(
                                appointment.status
                              )}`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <p className="text-[11px] font-bold leading-tight truncate">
                                    {appointment.patientName}
                                  </p>
                                </div>
                                <p className="text-[10px] opacity-85 leading-tight truncate font-medium">
                                  {appointment.treatment}
                                </p>
                              </div>
                              <span className="text-[9px] font-semibold opacity-75 mt-1">
                                {appointment.dentist.split(" ")[1]}
                              </span>
                            </div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-[#F3F0EA] dark:hover:bg-[#1A2B21] cursor-pointer">
                              <span className="text-[9px] font-semibold flex items-center gap-1 text-[#5F665F] dark:text-[#A2B5A8]">
                                <Plus className="h-2.5 w-2.5" /> Ekle
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MASAÜSTÜ GÖRÜNÜM (md: ve üzeri) - 100% Orijinal Figma 7 Kolonlu Grid */}
      <div
        className="hidden md:block rounded-2xl shadow-xs overflow-x-auto bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
      >
        <div className="min-w-[850px]">
          {/* Day Headers */}
          <div
            className="grid grid-cols-7 border-b border-[#ECE8E1] dark:border-[#182A20] bg-[#FBFAF7] dark:bg-[#15221B]"
          >
            <div
              className="p-3 text-center text-xs font-bold flex items-center justify-center border-r border-[#ECE8E1] dark:border-[#182A20] text-[#8A8F89] dark:text-[#A2B5A8]"
            >
              Saat
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className={`p-3 text-center border-r border-[#ECE8E1] dark:border-[#182A20] ${
                  day.isToday ? "bg-[rgba(221,235,216,0.4)] dark:bg-[rgba(31,51,39,0.5)]" : "bg-transparent"
                }`}
              >
                <p
                  className={`text-xs ${
                    day.isToday ? "font-serif text-sm font-bold text-[#1F3327] dark:text-[#4ADE80]" : "font-bold text-[#1C211E] dark:text-[#ECF3EE]"
                  }`}
                >
                  {day.label}
                </p>
                <p
                  className={`text-[11px] font-medium mt-0.5 ${
                    day.isToday ? "text-[#2F5A3D] dark:text-[#9AB395]" : "text-[#8A8F89] dark:text-[#A2B5A8]"
                  }`}
                >
                  {day.date}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          <div>
            {timeSlots.map((time, rowIdx) => (
              <div
                key={time}
                className={`grid grid-cols-7 min-h-[72px] ${
                  rowIdx < timeSlots.length - 1 ? "border-b border-[#ECE8E1] dark:border-[#182A20]" : ""
                }`}
              >
                {/* Time Column */}
                <div
                  className="p-3 text-center text-xs font-mono font-semibold flex items-center justify-center select-none border-r border-[#ECE8E1] dark:border-[#182A20] text-[#8A8F89] dark:text-[#A2B5A8] bg-[#FBFAF7] dark:bg-[#15221B]"
                >
                  {time}
                </div>

                {/* Days Columns */}
                {days.map((day) => {
                  const appointment = filtered.find((a) => a.day === day.key && a.time === time);

                  return (
                    <div
                      key={day.key}
                      onClick={() => !appointment && handleOpenSlotCreate(day.key, time)}
                      className={`p-1.5 transition-colors relative group border-r border-[#ECE8E1] dark:border-[#182A20] ${
                        day.isToday
                          ? "bg-[rgba(221,235,216,0.15)] dark:bg-[rgba(31,51,39,0.2)]"
                          : "bg-transparent"
                      }`}
                    >
                      {appointment ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSelected(appointment);
                          }}
                          className={`h-full p-2.5 rounded-xl shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all border ${getAppointmentCardClasses(
                            appointment.status
                          )}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <p className="text-xs font-bold leading-tight truncate">
                                {appointment.patientName}
                              </p>
                              {renderStatusBadge(appointment.status)}
                            </div>
                            <p className="text-[11px] opacity-85 leading-tight truncate font-medium">
                              {appointment.treatment}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold opacity-75 mt-1">
                            {appointment.dentist.split(" ")[1]}
                          </span>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-[#F3F0EA] dark:hover:bg-[#1A2B21] cursor-pointer">
                          <span
                            className="text-[10px] font-semibold flex items-center gap-1 text-[#5F665F] dark:text-[#A2B5A8]"
                          >
                            <Plus className="h-3 w-3" /> Ekle
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Detail / Edit / Status Modal */}
      {selectedApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="w-full max-w-md rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shadow-2xs bg-[#E7EEE6] border border-[#C9DDC3] text-[#1F3327] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#9AB395]"
                >
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3
                    className="text-base font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
                  >
                    Randevu Kartı & Durumu
                  </h3>
                  <p className="text-xs font-mono font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    {selectedApt.day} {selectedApt.time} • {selectedApt.dentist}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-[#ECF3EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick 1-Click Status Switcher */}
            <div>
              <label className="block text-xs font-bold mb-2 text-[#3F4540] dark:text-[#CDD5CF]">
                Randevu Durumu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Bekliyor", "Devam Ediyor", "Tamamlandı", "İptal"] as const).map((st) => {
                  const isSelected = selectedApt.status === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedApt.id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs border ${
                        isSelected
                          ? st === "Tamamlandı"
                            ? "bg-[#2C6A3B] border-[#2C6A3B] text-white dark:bg-[#2C6A3B] dark:border-[#3F8F55]"
                            : st === "Devam Ediyor"
                            ? "bg-[#2C5282] border-[#2C5282] text-white dark:bg-[#2C5282] dark:border-[#4A78B5]"
                            : st === "Bekliyor"
                            ? "bg-[#7A5320] border-[#7A5320] text-white dark:bg-[#7A5320] dark:border-[#B07D47]"
                            : "bg-[#B3261E] border-[#B3261E] text-white dark:bg-[#B3261E] dark:border-[#E53E3E]"
                          : st === "Tamamlandı"
                          ? "bg-[#E2EEDD] border-[#C9DDC3] text-[#2C6A3B] dark:bg-[#1A3324] dark:border-[#2D5A3C] dark:text-[#4ADE80]"
                          : st === "Devam Ediyor"
                          ? "bg-[#E3ECF7] border-[#C5D6E8] text-[#2C5282] dark:bg-[#172B3C] dark:border-[#23425E] dark:text-[#7BAEF0]"
                          : st === "Bekliyor"
                          ? "bg-[#F3EADB] border-[#EADFC8] text-[#7A5320] dark:bg-[#342817] dark:border-[#523E23] dark:text-[#E2B77A]"
                          : "bg-[#FBE9E7] border-[#F3D0CC] text-[#B3261E] dark:bg-[#3B1C1B] dark:border-[#5A2422] dark:text-[#F87171]"
                      }`}
                    >
                      {st === "Tamamlandı" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {st === "Devam Ediyor" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                      )}
                      {st === "Bekliyor" && <Clock className="h-3.5 w-3.5" />}
                      {st === "İptal" && <X className="h-3.5 w-3.5" />}
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Details Form */}
            <form
              onSubmit={handleSaveSelected}
              className="space-y-3 pt-2 text-xs border-t border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <span
                className="block font-bold uppercase tracking-wider text-[10px] text-[#8A8F89] dark:text-[#A2B5A8]"
              >
                Randevu Bilgilerini Düzenle
              </span>

              <div>
                <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                  Hasta Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={editPatient}
                  onChange={(e) => setEditPatient(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Tedavi / İşlem
                  </label>
                  <input
                    type="text"
                    required
                    value={editTreatment}
                    onChange={(e) => setEditTreatment(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Diş Hekimi
                  </label>
                  <select
                    value={editDentist}
                    onChange={(e) => setEditDentist(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Gün
                  </label>
                  <select
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none font-bold transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    {days.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Saat
                  </label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none font-mono font-bold transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                  Klinik Notu / Detay
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans açıklaması..."
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                />
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center justify-between pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]"
              >
                <button
                  type="button"
                  onClick={() => setAptToDelete(selectedApt)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-[#B3261E] dark:text-[#F87171] hover:bg-[#FBE9E7] dark:hover:bg-[#3B1C1B]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Randevuyu Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApt(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-xs bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
                  >
                    Güncelle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Slot Create Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <div>
                <h3
                  className="text-base font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
                >
                  Yeni Randevu Ekle
                </h3>
                <p className="text-xs font-mono font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                  {days.find((d) => d.key === createDay)?.label} • {createTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-[#ECF3EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                  Hasta Adı Soyadı <span className="text-[#B3261E] dark:text-[#F87171]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tuğçe Üngör..."
                  value={createPatient}
                  onChange={(e) => setCreatePatient(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                  Tedavi / İşlem
                </label>
                <select
                  value={createTreatment}
                  onChange={(e) => setCreateTreatment(e.target.value)}
                  className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Kontrol & Muayene">Kontrol & Muayene</option>
                  <option value="Kompozit Dolgu">Kompozit Dolgu</option>
                  <option value="Kanal Tedavisi">Kanal Tedavisi</option>
                  <option value="Ortodonti Seansı">Ortodonti Seansı</option>
                  <option value="İmplant Cerrahisi">İmplant Cerrahisi</option>
                  <option value="Diş Çekimi">Diş Çekimi</option>
                  <option value="Diş Taşı Temizliği">Diş Taşı Temizliği</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Diş Hekimi
                  </label>
                  <select
                    value={createDentist}
                    onChange={(e) => setCreateDentist(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Telefon No
                  </label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none font-mono transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]"
              >
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold transition-colors cursor-pointer shadow-xs bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
                >
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {aptToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAptToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE9E7] dark:bg-[#3B1C1B] text-[#B3261E] dark:text-[#F87171]"
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  className="text-base font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
                >
                  Randevuyu Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                  Bu randevu takvimden kalıcı olarak kaldırılacaktır.
                </p>
              </div>
            </div>

            <p
              className="text-xs font-semibold p-3 rounded-xl bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
            >
              {aptToDelete.patientName} — {aptToDelete.treatment} ({aptToDelete.day} {aptToDelete.time})
            </p>

            <div
              className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <button
                type="button"
                onClick={() => setAptToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-xs bg-[#B3261E] hover:bg-[#991B1B] dark:bg-[#C53030] dark:hover:bg-[#9B2C2C]"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
