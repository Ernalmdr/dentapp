"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  CheckCircle2,
  Trash2,
  Pencil,
  X,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import {
  CalendarAppointment,
  initialAppointmentsList,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointments-data";

export default function RandevularPage() {
  const { openAppointmentModal, showToast } = useModal();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedDentist, setSelectedDentist] = useState("Tüm Hekimler");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [currentWeek, setCurrentWeek] = useState("24 – 29 Ekim 2026");

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

  const getAppointmentCardStyle = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return "border-l-4 border-l-emerald-600 bg-emerald-50/70 dark:bg-[#13271D] border-stone-200/70 dark:border-[#1E382A] text-stone-900 dark:text-stone-100";
      case "Devam Ediyor":
        return "border-l-4 border-l-blue-600 bg-blue-50/80 dark:bg-[#122332] border-blue-200/80 dark:border-[#1A334A] text-stone-900 dark:text-stone-100 ring-1 ring-blue-400/30";
      case "İptal":
        return "border-l-4 border-l-rose-400 bg-rose-50/40 dark:bg-[#201416] border-rose-200/50 opacity-60 text-stone-600 dark:text-stone-400";
      case "Bekliyor":
      default:
        return "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-[#1C1810] border-amber-200/70 dark:border-[#2C2416] text-stone-900 dark:text-stone-100";
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 shadow-2xs">
            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Tamamlandı
          </span>
        );
      case "Devam Ediyor":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/90 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-700/60 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-200 shadow-2xs">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            Devam Ediyor
          </span>
        );
      case "İptal":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700/60 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-200">
            <X className="h-3 w-3 text-rose-500 shrink-0" />
            İptal
          </span>
        );
      case "Bekliyor":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200 shadow-2xs">
            <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
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
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + Yeni Randevu
            </button>
          </div>
        }
      />

      {/* Calendar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white dark:bg-[#122019] p-4 border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        {/* Week navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-stone-200 dark:border-[#233C30] rounded-xl overflow-hidden bg-stone-50 dark:bg-[#16261F]">
            <button
              onClick={() => setCurrentWeek("17 – 22 Ekim 2026")}
              className="p-2 hover:bg-stone-200 dark:hover:bg-[#1E332A] text-stone-600 dark:text-[#90A199] transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-bold text-stone-800 dark:text-white select-none">
              {currentWeek}
            </span>
            <button
              onClick={() => setCurrentWeek("31 Ekim – 5 Kasım 2026")}
              className="p-2 hover:bg-stone-200 dark:hover:bg-[#1E332A] text-stone-600 dark:text-[#90A199] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-emerald-700 dark:text-[#7CC9A6] bg-emerald-50 dark:bg-[#182C22] px-3 py-1.5 rounded-xl">
            Aktif Hafta
          </span>

          <button
            onClick={handleResetDefaults}
            title="Varsayılan Randevu Listesine Sıfırla"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Sıfırla
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Hekim:</span>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="h-9 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs font-semibold outline-none"
            >
              <option value="Tüm Hekimler">Tüm Hekimler</option>
              <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
              <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <span>Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs font-semibold outline-none"
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

      {/* Week Grid Calendar View */}
      <div className="rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-stone-200 dark:border-[#1E332A] bg-stone-50/70 dark:bg-[#16261F]">
            <div className="p-3 text-center text-xs font-bold text-stone-400 border-r border-stone-200 dark:border-[#1E332A] flex items-center justify-center">
              Saat
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className={`p-3 text-center border-r last:border-r-0 border-stone-200 dark:border-[#1E332A] ${
                  day.isToday ? "bg-emerald-500/10 dark:bg-emerald-950/30" : ""
                }`}
              >
                <p className={`text-xs font-bold ${day.isToday ? "text-[#2D4A3E] dark:text-[#7CC9A6]" : "text-stone-800 dark:text-white"}`}>
                  {day.label}
                </p>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5">{day.date}</p>
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          <div className="divide-y divide-stone-100 dark:divide-[#1A2D23]">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-7 min-h-[68px]">
                {/* Time Column */}
                <div className="p-3 text-center text-xs font-mono font-semibold text-stone-400 border-r border-stone-200 dark:border-[#1E332A] flex items-center justify-center bg-stone-50/30 dark:bg-[#14231C]">
                  {time}
                </div>

                {/* Days Columns */}
                {days.map((day) => {
                  const appointment = filtered.find((a) => a.day === day.key && a.time === time);

                  return (
                    <div
                      key={day.key}
                      onClick={() => !appointment && handleOpenSlotCreate(day.key, time)}
                      className={`p-1.5 border-r last:border-r-0 border-stone-100 dark:border-[#1A2D23] transition-colors relative group ${
                        day.isToday ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                      } ${!appointment ? "hover:bg-stone-50/80 dark:hover:bg-[#16261F] cursor-pointer" : ""}`}
                    >
                      {appointment ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSelected(appointment);
                          }}
                          className={`h-full p-2.5 rounded-xl shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all ${getAppointmentCardStyle(
                            appointment.status
                          )}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <p className="text-xs font-bold leading-tight truncate">{appointment.patientName}</p>
                              {renderStatusBadge(appointment.status)}
                            </div>
                            <p className="text-[11px] opacity-80 leading-tight truncate">{appointment.treatment}</p>
                          </div>
                          <span className="text-[10px] font-semibold opacity-70 mt-1.5">{appointment.dentist.split(" ")[1]}</span>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-[#1A3125] text-[#2D4A3E] dark:text-[#7CC9A6] flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Randevu Kartı & Durumu
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    {selectedApt.day} {selectedApt.time} • {selectedApt.dentist}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApt(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick 1-Click Status Switcher */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Randevu Durumu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Bekliyor", "Devam Ediyor", "Tamamlandı", "İptal"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, st)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedApt.status === st
                        ? st === "Tamamlandı"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : st === "Devam Ediyor"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : st === "İptal"
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-stone-50 dark:bg-[#16261F] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#1E332A] hover:bg-stone-100 dark:hover:bg-[#1D3227]"
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
                ))}
              </div>
            </div>

            {/* Editable Details Form */}
            <form onSubmit={handleSaveSelected} className="space-y-3 pt-2 border-t border-stone-100 dark:border-[#1E332A] text-xs">
              <span className="block font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                Randevu Bilgilerini Düzenle
              </span>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Hasta Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={editPatient}
                  onChange={(e) => setEditPatient(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Tedavi / İşlem
                  </label>
                  <input
                    type="text"
                    required
                    value={editTreatment}
                    onChange={(e) => setEditTreatment(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Diş Hekimi
                  </label>
                  <select
                    value={editDentist}
                    onChange={(e) => setEditDentist(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2 outline-none"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Gün
                  </label>
                  <select
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2 outline-none font-bold"
                  >
                    {days.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Saat
                  </label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2 outline-none font-mono font-bold"
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
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Klinik Notu / Detay
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans açıklaması..."
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setAptToDelete(selectedApt)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Randevuyu Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApt(null)}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] text-xs font-semibold"
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2D4A3E] text-white text-xs font-bold hover:bg-[#3A5F50]"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Yeni Randevu Ekle
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  {days.find((d) => d.key === createDay)?.label} • {createTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Hasta Adı Soyadı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tuğçe Üngör..."
                  value={createPatient}
                  onChange={(e) => setCreatePatient(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Tedavi / İşlem
                </label>
                <select
                  value={createTreatment}
                  onChange={(e) => setCreateTreatment(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2 outline-none"
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
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Diş Hekimi
                  </label>
                  <select
                    value={createDentist}
                    onChange={(e) => setCreateDentist(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2 outline-none"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Telefon No
                  </label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-[#2D4A3E] text-white font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Randevuyu Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs text-stone-500">
                  Bu randevu takvimden kalıcı olarak kaldırılacaktır.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold p-3 bg-stone-50 dark:bg-[#16261F] rounded-xl border border-stone-200 dark:border-[#1E332A]">
              {aptToDelete.patientName} — {aptToDelete.treatment} ({aptToDelete.day} {aptToDelete.time})
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setAptToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
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
