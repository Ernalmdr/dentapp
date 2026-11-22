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
  const getAppointmentCardStyle = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        // Event/Green: #DDE7D9 / #C5D6C0
        return {
          backgroundColor: "#DDE7D9",
          border: "1px solid #C5D6C0",
          color: "#1F3327",
        };
      case "Devam Ediyor":
        // Event/Purple: #E6DFF1 / #D3C7E6
        return {
          backgroundColor: "#E6DFF1",
          border: "1px solid #D3C7E6",
          color: "#2C5282",
        };
      case "İptal":
        // Event/Red: #F4D9D6 / #E8BFBA
        return {
          backgroundColor: "#F4D9D6",
          border: "1px solid #E8BFBA",
          color: "#B3261E",
          opacity: 0.8,
        };
      case "Bekliyor":
      default:
        // Event/Yellow: #F7E9C9 / #E9D3A0
        return {
          backgroundColor: "#F7E9C9",
          border: "1px solid #E9D3A0",
          color: "#7A5320",
        };
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0"
            style={{
              backgroundColor: "#E2EEDD",
              color: "#2C6A3B",
              border: "1px solid #C9DDC3",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#3F8F55] shrink-0" />
            Tamamlandı
          </span>
        );
      case "Devam Ediyor":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0"
            style={{
              backgroundColor: "#E3ECF7",
              color: "#2C5282",
              border: "1px solid #C5D6E8",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4A78B5] animate-pulse shrink-0" />
            Devam Ediyor
          </span>
        );
      case "İptal":
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0"
            style={{
              backgroundColor: "#FBE9E7",
              color: "#B3261E",
              border: "1px solid #F3D0CC",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#B3261E] shrink-0" />
            İptal
          </span>
        );
      case "Bekliyor":
      default:
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs shrink-0"
            style={{
              backgroundColor: "#F3EADB",
              color: "#7A5320",
              border: "1px solid #EADFC8",
            }}
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
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all shadow-xs hover:shadow-md cursor-pointer"
              style={{
                backgroundColor: "#1F3327", // Green/800
              }}
            >
              <Plus className="h-4 w-4" />
              + Yeni Randevu
            </button>
          </div>
        }
      />

      {/* Calendar Controls */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 shadow-xs"
        style={{
          backgroundColor: "#FBFAF7",
          border: "1px solid #E6E1D8",
        }}
      >
        {/* Week navigation */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center rounded-xl overflow-hidden shadow-2xs"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E1D8",
            }}
          >
            <button
              onClick={() => setCurrentWeek("17 – 22 Ekim 2026")}
              className="p-2 transition-colors cursor-pointer hover:bg-[#EEEBE4]"
              style={{ color: "#1C211E" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span
              className="px-3 text-xs font-bold select-none"
              style={{ color: "#1C211E" }}
            >
              {currentWeek}
            </span>
            <button
              onClick={() => setCurrentWeek("31 Ekim – 5 Kasım 2026")}
              className="p-2 transition-colors cursor-pointer hover:bg-[#EEEBE4]"
              style={{ color: "#1C211E" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span
            className="text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: "#DDEBD8", // Green/100
              border: "1px solid #C9DDC3", // Green/200
              color: "#1F3327", // Green/800
            }}
          >
            Aktif Hafta
          </span>

          <button
            onClick={handleResetDefaults}
            title="Varsayılan Randevu Listesine Sıfırla"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: "#EEEBE4",
              border: "1px solid #E6E1D8",
              color: "#1C211E",
            }}
          >
            <RotateCcw className="h-3 w-3" />
            Sıfırla
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#5F665F" }}>
            <Filter className="h-3.5 w-3.5" />
            <span>Hekim:</span>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E1D8",
                color: "#1C211E",
              }}
            >
              <option value="Tüm Hekimler">Tüm Hekimler</option>
              <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
              <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#5F665F" }}>
            <span>Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-xl px-3 text-xs font-semibold outline-none"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E1D8",
                color: "#1C211E",
              }}
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
      <div
        className="rounded-2xl shadow-xs overflow-x-auto"
        style={{
          backgroundColor: "#FBFAF7",
          border: "1px solid #E6E1D8",
        }}
      >
        <div className="min-w-[850px]">
          {/* Day Headers */}
          <div
            className="grid grid-cols-7"
            style={{
              borderBottom: "1px solid #ECE8E1", // Takvim çizgileri: #ECE8E1
              backgroundColor: "#FBFAF7",
            }}
          >
            <div
              className="p-3 text-center text-xs font-bold flex items-center justify-center"
              style={{
                borderRight: "1px solid #ECE8E1",
                color: "#8A8F89",
              }}
            >
              Saat
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className="p-3 text-center"
                style={{
                  borderRight: "1px solid #ECE8E1",
                  backgroundColor: day.isToday ? "rgba(221, 235, 216, 0.4)" : "transparent",
                }}
              >
                <p
                  className={`text-xs ${
                    day.isToday ? "font-serif text-sm font-bold" : "font-bold"
                  }`}
                  style={{
                    color: day.isToday ? "#1F3327" : "#1C211E",
                  }}
                >
                  {day.label}
                </p>
                <p
                  className="text-[11px] font-medium mt-0.5"
                  style={{
                    color: day.isToday ? "#2F5A3D" : "#8A8F89",
                  }}
                >
                  {day.date}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          <div style={{ borderColor: "#ECE8E1" }}>
            {timeSlots.map((time, rowIdx) => (
              <div
                key={time}
                className="grid grid-cols-7 min-h-[72px]"
                style={{
                  borderBottom: rowIdx < timeSlots.length - 1 ? "1px solid #ECE8E1" : "none",
                }}
              >
                {/* Time Column */}
                <div
                  className="p-3 text-center text-xs font-mono font-semibold flex items-center justify-center select-none"
                  style={{
                    borderRight: "1px solid #ECE8E1",
                    color: "#8A8F89",
                    backgroundColor: "#FBFAF7",
                  }}
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
                      className="p-1.5 transition-colors relative group"
                      style={{
                        borderRight: "1px solid #ECE8E1",
                        backgroundColor: day.isToday
                          ? "rgba(221, 235, 216, 0.15)"
                          : "transparent",
                      }}
                    >
                      {appointment ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSelected(appointment);
                          }}
                          className="h-full p-2.5 rounded-xl shadow-2xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
                          style={getAppointmentCardStyle(appointment.status)}
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
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-[#F3F0EA] cursor-pointer">
                          <span
                            className="text-[10px] font-semibold flex items-center gap-1"
                            style={{ color: "#5F665F" }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="w-full max-w-md rounded-[20px] p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: "#FBFAF7",
              border: "1px solid #E6E1D8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: "1px solid #E6E1D8" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shadow-2xs"
                  style={{
                    backgroundColor: "#E7EEE6", // Green/50
                    border: "1px solid #C9DDC3", // Green/200
                    color: "#1F3327",
                  }}
                >
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3
                    className="text-base font-normal tracking-tight font-serif"
                    style={{ color: "#1C211E" }}
                  >
                    Randevu Kartı & Durumu
                  </h3>
                  <p className="text-xs font-mono font-medium" style={{ color: "#5F665F" }}>
                    {selectedApt.day} {selectedApt.time} • {selectedApt.dentist}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick 1-Click Status Switcher */}
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: "#3F4540" }}>
                Randevu Durumu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Bekliyor", "Devam Ediyor", "Tamamlandı", "İptal"] as const).map((st) => {
                  const isSelected = selectedApt.status === st;
                  let bg = "#FBFAF7";
                  let border = "#E6E1D8";
                  let color = "#3F4540";

                  if (isSelected) {
                    if (st === "Tamamlandı") {
                      bg = "#2C6A3B";
                      border = "#2C6A3B";
                      color = "#FFFFFF";
                    } else if (st === "Devam Ediyor") {
                      bg = "#2C5282";
                      border = "#2C5282";
                      color = "#FFFFFF";
                    } else if (st === "Bekliyor") {
                      bg = "#7A5320";
                      border = "#7A5320";
                      color = "#FFFFFF";
                    } else if (st === "İptal") {
                      bg = "#B3261E";
                      border = "#B3261E";
                      color = "#FFFFFF";
                    }
                  } else {
                    if (st === "Tamamlandı") {
                      bg = "#E2EEDD";
                      border = "#C9DDC3";
                      color = "#2C6A3B";
                    } else if (st === "Devam Ediyor") {
                      bg = "#E3ECF7";
                      border = "#C5D6E8";
                      color = "#2C5282";
                    } else if (st === "Bekliyor") {
                      bg = "#F3EADB";
                      border = "#EADFC8";
                      color = "#7A5320";
                    } else if (st === "İptal") {
                      bg = "#FBE9E7";
                      border = "#F3D0CC";
                      color = "#B3261E";
                    }
                  }

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedApt.id, st)}
                      className="py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      style={{
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color: color,
                      }}
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
              className="space-y-3 pt-2 text-xs"
              style={{ borderTop: "1px solid #E6E1D8" }}
            >
              <span
                className="block font-bold uppercase tracking-wider text-[10px]"
                style={{ color: "#8A8F89" }}
              >
                Randevu Bilgilerini Düzenle
              </span>

              <div>
                <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                  Hasta Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={editPatient}
                  onChange={(e) => setEditPatient(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E1D8",
                    color: "#1C211E",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Tedavi / İşlem
                  </label>
                  <input
                    type="text"
                    required
                    value={editTreatment}
                    onChange={(e) => setEditTreatment(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Diş Hekimi
                  </label>
                  <select
                    value={editDentist}
                    onChange={(e) => setEditDentist(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Gün
                  </label>
                  <select
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none font-bold transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
                  >
                    {days.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Saat
                  </label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none font-mono font-bold transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
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
                <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                  Klinik Notu / Detay
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans açıklaması..."
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E1D8",
                    color: "#1C211E",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid #E6E1D8" }}
              >
                <button
                  type="button"
                  onClick={() => setAptToDelete(selectedApt)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: "#B3261E" }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Randevuyu Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApt(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "#EEEBE4",
                      color: "#1C211E",
                    }}
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    style={{
                      backgroundColor: "#1F3327",
                    }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: "#FBFAF7",
              border: "1px solid #E6E1D8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: "1px solid #E6E1D8" }}
            >
              <div>
                <h3
                  className="text-base font-normal tracking-tight font-serif"
                  style={{ color: "#1C211E" }}
                >
                  Yeni Randevu Ekle
                </h3>
                <p className="text-xs font-mono font-medium" style={{ color: "#5F665F" }}>
                  {days.find((d) => d.key === createDay)?.label} • {createTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                  Hasta Adı Soyadı <span style={{ color: "#B3261E" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tuğçe Üngör..."
                  value={createPatient}
                  onChange={(e) => setCreatePatient(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E1D8",
                    color: "#1C211E",
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                  Tedavi / İşlem
                </label>
                <select
                  value={createTreatment}
                  onChange={(e) => setCreateTreatment(e.target.value)}
                  className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E1D8",
                    color: "#1C211E",
                  }}
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
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Diş Hekimi
                  </label>
                  <select
                    value={createDentist}
                    onChange={(e) => setCreateDentist(e.target.value)}
                    className="w-full h-10 rounded-xl px-2.5 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Telefon No
                  </label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E6E1D8",
                      color: "#1C211E",
                    }}
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-2 pt-3"
                style={{ borderTop: "1px solid #E6E1D8" }}
              >
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#EEEBE4",
                    color: "#1C211E",
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold transition-colors cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: "#1F3327",
                  }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAptToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: "#FBFAF7",
              border: "1px solid #E6E1D8",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "#FBE9E7",
                  color: "#B3261E",
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  className="text-base font-normal tracking-tight font-serif"
                  style={{ color: "#1C211E" }}
                >
                  Randevuyu Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs" style={{ color: "#5F665F" }}>
                  Bu randevu takvimden kalıcı olarak kaldırılacaktır.
                </p>
              </div>
            </div>

            <p
              className="text-xs font-semibold p-3 rounded-xl"
              style={{
                backgroundColor: "#EEEBE4",
                border: "1px solid #E6E1D8",
                color: "#1C211E",
              }}
            >
              {aptToDelete.patientName} — {aptToDelete.treatment} ({aptToDelete.day} {aptToDelete.time})
            </p>

            <div
              className="flex items-center justify-end gap-2 pt-3"
              style={{ borderTop: "1px solid #E6E1D8" }}
            >
              <button
                type="button"
                onClick={() => setAptToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: "#EEEBE4",
                  color: "#1C211E",
                }}
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                style={{
                  backgroundColor: "#B3261E",
                }}
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
