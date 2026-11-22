"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckCircle2,
  Trash2,
  X,
  RotateCcw,
  Check,
  Clock,
  User,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import {
  CalendarAppointment,
  initialAppointmentsList,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointments-data";
import { green, neutral, eventColors, status as statusTokens } from "@/lib/figma-tokens";

interface AppointmentCalendarProps {
  initialDay?: string;
  showFullControls?: boolean;
}

export default function AppointmentCalendar({
  initialDay = "Per",
  showFullControls = true,
}: AppointmentCalendarProps) {
  const { showToast } = useModal();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedDentist, setSelectedDentist] = useState("Tüm Hekimler");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [currentWeek, setCurrentWeek] = useState("24 – 29 Ekim 2026");

  // Selected Appointment for Detail / Status Change
  const [selectedApt, setSelectedApt] = useState<CalendarAppointment | null>(null);
  const [editPatient, setEditPatient] = useState("");
  const [editTreatment, setEditTreatment] = useState("");
  const [editDentist, setEditDentist] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDay, setEditDay] = useState(initialDay);
  const [editPhone, setEditPhone] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Create slot appointment modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPatient, setCreatePatient] = useState("");
  const [createTreatment, setCreateTreatment] = useState("Kontrol & Muayene");
  const [createDentist, setCreateDentist] = useState("Dr. Selin Yılmaz");
  const [createTime, setCreateTime] = useState("10:30");
  const [createDay, setCreateDay] = useState("Per");
  const [createPhone, setCreatePhone] = useState("+90 ");

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

  /**
   * Exact Figma Event Card Styles:
   * - Sarı: bg #F7E9C9, border #E9D3A0
   * - Mor: bg #E6DFF1, border #D3C7E6
   * - Yeşil: bg #DDE7D9, border #C5D6C0
   * - Kırmızı: bg #F4D9D6, border #E8BFBA
   */
  const getAppointmentCardClasses = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-[#DDE7D9] border-[#C5D6C0] text-[#1F3327] dark:bg-[#173022] dark:border-[#26533B] dark:text-[#A7F3D0]";
      case "Devam Ediyor":
        return "bg-[#E6DFF1] border-[#D3C7E6] text-[#2C5282] dark:bg-[#241E38] dark:border-[#3D325C] dark:text-[#C4B5FD]";
      case "İptal":
        return "bg-[#F4D9D6] border-[#E8BFBA] text-[#B3261E] dark:bg-[#341818] dark:border-[#572727] dark:text-[#FCA5A5]";
      case "Bekliyor":
      default:
        return "bg-[#F7E9C9] border-[#E9D3A0] text-[#7A5320] dark:bg-[#332514] dark:border-[#573F22] dark:text-[#FDE68A]";
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

  const handleUpdateStatus = (id: string, newStatus: CalendarAppointment["status"]) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    saveStoredAppointments(updated);
    setAppointments(updated);
    if (selectedApt && selectedApt.id === id) {
      setSelectedApt({ ...selectedApt, status: newStatus });
    }
    showToast(`✓ Randevu durumu güncellendi: "${newStatus}"`, "success");
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

  const filtered = appointments.filter((a) => {
    const matchDentist = selectedDentist === "Tüm Hekimler" || a.dentist === selectedDentist;
    const matchStatus = selectedStatus === "Tümü" || a.status === selectedStatus;
    return matchDentist && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Calendar Header & Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 shadow-xs bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
      >
        {/* Left: Week Navigation + Takvim Butonu Zemini (#DDEBD8 / #C9DDC3) */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F]"
          >
            <button
              type="button"
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
              type="button"
              onClick={() => setCurrentWeek("31 Ekim – 5 Kasım 2026")}
              className="p-2 transition-colors cursor-pointer hover:bg-[#EEEBE4] dark:hover:bg-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Figma Takvim butonu zemini: #DDEBD8, border #C9DDC3 */}
          <button
            type="button"
            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5 bg-[#DDEBD8] border border-[#C9DDC3] text-[#1F3327] dark:bg-[#1E3527] dark:border-[#2D4C3C] dark:text-[#9AB395]"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Aktif Hafta</span>
          </button>
        </div>

        {/* Right: Filters & Quick Add */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <Filter className="h-3.5 w-3.5" />
            <span>Hekim:</span>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none cursor-pointer bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <option value="Tüm Hekimler">Tüm Hekimler</option>
              <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
              <option value="Dr. Mehmet Demir">Dr. Mehmet Demir</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
            <span>Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none cursor-pointer bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE]"
            >
              <option value="Tümü">Tümü</option>
              <option value="Bekliyor">Bekliyor (Sarı)</option>
              <option value="Devam Ediyor">Devam Ediyor (Mor)</option>
              <option value="Tamamlandı">Tamamlandı (Yeşil)</option>
              <option value="İptal">İptal (Kırmızı)</option>
            </select>
          </div>

          {showFullControls && (
            <button
              type="button"
              onClick={() => handleOpenSlotCreate("Per", "10:30")}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
            >
              <Plus className="h-3.5 w-3.5" />
              + Randevu
            </button>
          )}
        </div>
      </div>

      {/* 2. Week Grid Calendar View: Grid Çizgileri #ECE8E1 / dark: #182A20 */}
      <div
        className="rounded-2xl shadow-xs overflow-x-auto bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
      >
        <div className="min-w-[850px]">
          {/* Day Headers */}
          <div
            className="grid grid-cols-7 border-b border-[#ECE8E1] dark:border-[#182A20] bg-[#FBFAF7] dark:bg-[#15221B]"
          >
            <div
              className="p-3 text-center text-xs font-bold flex items-center justify-center select-none border-r border-[#ECE8E1] dark:border-[#182A20] text-[#8A8F89] dark:text-[#A2B5A8]"
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

          {/* Time Slots Rows (Grid çizgileri #ECE8E1 / dark: #182A20) */}
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
                        day.isToday ? "bg-[rgba(221,235,216,0.15)] dark:bg-[rgba(31,51,39,0.2)]" : "bg-transparent"
                      }`}
                    >
                      {appointment ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSelected(appointment);
                          }}
                          className={`h-full p-2.5 rounded-xl shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all border ${getAppointmentCardClasses(
                            appointment.status
                          )}`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <p className="text-xs font-bold leading-tight truncate">
                                {appointment.patientName}
                              </p>
                              {/* Status dot */}
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    appointment.status === "Tamamlandı"
                                      ? "#3F8F55"
                                      : appointment.status === "Devam Ediyor"
                                      ? "#4A78B5"
                                      : appointment.status === "İptal"
                                      ? "#B3261E"
                                      : "#B07D47",
                                }}
                              />
                            </div>
                            <p className="text-[11px] opacity-90 leading-tight truncate font-medium">
                              {appointment.treatment}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[10px] font-semibold opacity-80">
                            <span>{appointment.dentist.split(" ")[1]}</span>
                            <span>{appointment.time}</span>
                          </div>
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

      {/* 3. Appointment Detail Modal */}
      {selectedApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="w-full max-w-md rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                    Randevu Kartı
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

            {/* Patient & Treatment info */}
            <div
              className={`p-3.5 rounded-xl space-y-1.5 border ${getAppointmentCardClasses(selectedApt.status)}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{selectedApt.patientName}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/40 dark:bg-black/30">
                  {selectedApt.status}
                </span>
              </div>
              <p className="text-xs font-medium">{selectedApt.treatment}</p>
              <p className="text-[11px] opacity-80">{selectedApt.phone || "Telefon belirtilmedi"}</p>
            </div>

            {/* Status change actions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#5F665F] dark:text-[#A2B5A8]">
                Durumu Güncelle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Bekliyor", cls: "bg-[#F7E9C9] border-[#E9D3A0] text-[#7A5320] dark:bg-[#332514] dark:border-[#573F22] dark:text-[#FDE68A]" },
                  { label: "Devam Ediyor", cls: "bg-[#E6DFF1] border-[#D3C7E6] text-[#2C5282] dark:bg-[#241E38] dark:border-[#3D325C] dark:text-[#C4B5FD]" },
                  { label: "Tamamlandı", cls: "bg-[#DDE7D9] border-[#C5D6C0] text-[#1F3327] dark:bg-[#173022] dark:border-[#26533B] dark:text-[#A7F3D0]" },
                  { label: "İptal", cls: "bg-[#F4D9D6] border-[#E8BFBA] text-[#B3261E] dark:bg-[#341818] dark:border-[#572727] dark:text-[#FCA5A5]" },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, s.label as CalendarAppointment["status"])}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${s.cls}`}
                  >
                    <span>{s.label}</span>
                    {selectedApt.status === s.label && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedApt(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Slot Create Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <h3 className="text-base font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]">
                Yeni Randevu Oluştur ({createDay} {createTime})
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-[#ECF3EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#5F665F] dark:text-[#A2B5A8]">
                  Hasta Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  value={createPatient}
                  onChange={(e) => setCreatePatient(e.target.value)}
                  placeholder="Örn: Ayşe Demir"
                  className="w-full h-10 rounded-xl px-3 text-xs font-medium outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE] focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#5F665F] dark:text-[#A2B5A8]">
                  Tedavi Türü
                </label>
                <input
                  type="text"
                  value={createTreatment}
                  onChange={(e) => setCreateTreatment(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 text-xs font-medium outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE] focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5F665F] dark:text-[#A2B5A8]">
                    Hekim
                  </label>
                  <select
                    value={createDentist}
                    onChange={(e) => setCreateDentist(e.target.value)}
                    className="w-full h-10 rounded-xl px-2 text-xs font-semibold outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE] focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55]"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mehmet Demir">Dr. Mehmet Demir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5F665F] dark:text-[#A2B5A8]">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 text-xs font-mono outline-none bg-white dark:bg-[#1A2B21] border border-[#E6E1D8] dark:border-[#243B2F] text-[#1C211E] dark:text-[#ECF3EE] focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#5F665F] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#243B2F]"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow-md transition-all cursor-pointer bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
