"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  X,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import {
  CalendarAppointment,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointments-data";

export default function AppointmentsList() {
  const { showToast } = useModal();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Detail / Edit modal on homepage
  const [editingApt, setEditingApt] = useState<CalendarAppointment | null>(null);
  const [editPatient, setEditPatient] = useState("");
  const [editTreatment, setEditTreatment] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDentist, setEditDentist] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

  // Load and listen for updates
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

  // Close status popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  // Today's appointments (Perşembe)
  const todayList = appointments.filter((a) => a.day === "Per");

  const handleQuickStatusChange = (
    e: React.MouseEvent,
    id: string,
    newStatus: CalendarAppointment["status"]
  ) => {
    e.stopPropagation();
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    saveStoredAppointments(updated);
    setAppointments(updated);
    setActiveMenuId(null);
    showToast(`✓ Randevu durumu güncellendi: "${newStatus}"`, "success");
  };

  const handleOpenEdit = (apt: CalendarAppointment) => {
    setEditingApt(apt);
    setEditPatient(apt.patientName);
    setEditTreatment(apt.treatment);
    setEditTime(apt.time);
    setEditDentist(apt.dentist);
    setEditNotes(apt.notes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    const updated = appointments.map((a) =>
      a.id === editingApt.id
        ? {
            ...a,
            patientName: editPatient.trim(),
            treatment: editTreatment.trim(),
            time: editTime.trim(),
            dentist: editDentist.trim(),
            notes: editNotes.trim(),
          }
        : a
    );
    saveStoredAppointments(updated);
    setAppointments(updated);
    setEditingApt(null);
    showToast(`✓ ${editPatient} randevusu başarıyla güncellendi.`, "success");
  };

  const handleDelete = (id: string) => {
    const target = appointments.find((a) => a.id === id);
    const updated = appointments.filter((a) => a.id !== id);
    saveStoredAppointments(updated);
    setAppointments(updated);
    setEditingApt(null);
    showToast(`✓ ${target?.patientName} randevusu silindi.`, "info");
  };

  return (
    <div
      className="flex flex-col justify-between rounded-[20px] p-6 shadow-xs h-full"
      style={{
        backgroundColor: "#FBFAF7",
        border: "1px solid #E6E1D8",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl md:text-[22px] font-normal tracking-tight font-serif"
          style={{ color: "#1C211E" }}
        >
          Bugünkü Randevular
        </h2>
        <Link
          href="/randevular"
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer"
          style={{
            backgroundColor: "#FBFAF7",
            border: "1px solid #E6E1D8",
            color: "#1C211E",
          }}
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="h-3.5 w-3.5" style={{ color: "#5F665F" }} />
        </Link>
      </div>

      {/* Appointment Rows List */}
      <div className="flex-1 flex flex-col justify-between gap-2.5">
        {todayList.map((item, index) => {
          // Highlight row #3 (10:30 Zeynep Arslan) or current active appointment like in Figma screenshot
          const isHighlighted = item.id === "apt-3" || (item.time === "10:30" && item.status !== "Tamamlandı");
          const isActiveMenu = activeMenuId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenEdit(item)}
              className={`relative flex items-center justify-between rounded-2xl px-4 py-3 transition-all cursor-pointer group ${
                isActiveMenu ? "z-40 ring-2 ring-[#2F5A3D]/40 shadow-md" : "z-10"
              }`}
              style={{
                backgroundColor: isHighlighted ? "#1F3327" : "transparent",
                color: isHighlighted ? "#FFFFFF" : "#1C211E",
                border: isHighlighted ? "1px solid #1F3327" : "1px solid transparent",
              }}
              title="Randevu detaylarını düzenlemek için tıklayın"
            >
              {/* Left Side: Dot, Time, Avatar, Patient, Treatment */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Dot */}
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isHighlighted
                      ? "#3F8F55"
                      : item.status === "Tamamlandı"
                      ? "#3F8F55"
                      : item.status === "Devam Ediyor"
                      ? "#4A78B5"
                      : "#B7C4B9",
                  }}
                />

                {/* Time */}
                <span
                  className="text-xs font-semibold w-12 shrink-0 font-mono"
                  style={{
                    color: isHighlighted ? "#FFFFFF" : "#1C211E",
                  }}
                >
                  {item.time}
                </span>

                {/* Avatar Icon */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                  style={{
                    backgroundColor: isHighlighted ? "rgba(255, 255, 255, 0.12)" : "#EEEBE4",
                    color: isHighlighted ? "#FFFFFF" : "#5F665F",
                  }}
                >
                  <User className="h-4 w-4" />
                </div>

                {/* Patient Name & Treatment */}
                <div className="min-w-0 flex items-center gap-2 sm:gap-6">
                  <p
                    className="text-sm font-bold tracking-tight truncate min-w-[100px] sm:min-w-[120px]"
                    style={{
                      color: isHighlighted ? "#FFFFFF" : "#1C211E",
                    }}
                  >
                    {item.patientName}
                  </p>
                  <p
                    className="text-xs font-medium truncate hidden sm:block"
                    style={{
                      color: isHighlighted ? "#CDD5CF" : "#5F665F",
                    }}
                  >
                    {item.treatment}
                  </p>
                </div>
              </div>

              {/* Right Side: Status Badge OR Dark Highlight Action */}
              <div className="relative shrink-0 flex items-center gap-2">
                {isHighlighted ? (
                  // Figma Highlighted Row Action (Arrow in Circle) + Clickable Status Popover
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:bg-white/20"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        color: "#FFFFFF",
                      }}
                      title="Durumu değiştirmek için tıklayın"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3F8F55]" />
                      <span>{item.status}</span>
                      <ChevronDown className="h-3 w-3 opacity-70 ml-0.5" />
                    </button>

                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: "#2D3A32",
                        color: "#FFFFFF",
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  // Normal Row Status Badge
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 cursor-pointer shadow-2xs"
                    style={{
                      backgroundColor:
                        item.status === "Tamamlandı"
                          ? "#E2EEDD"
                          : item.status === "Devam Ediyor"
                          ? "#E3ECF7"
                          : item.status === "İptal"
                          ? "#FBE9E7"
                          : "#F3EADB",
                      color:
                        item.status === "Tamamlandı"
                          ? "#2C6A3B"
                          : item.status === "Devam Ediyor"
                          ? "#2C5282"
                          : item.status === "İptal"
                          ? "#B3261E"
                          : "#7A5320",
                      border:
                        item.status === "Tamamlandı"
                          ? "1px solid #C9DDC3"
                          : item.status === "Devam Ediyor"
                          ? "1px solid #C5D6E8"
                          : item.status === "İptal"
                          ? "1px solid #F3D0CC"
                          : "1px solid #EADFC8",
                    }}
                    title="Durumu değiştirmek için tıklayın"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          item.status === "Tamamlandı"
                            ? "#3F8F55"
                            : item.status === "Devam Ediyor"
                            ? "#4A78B5"
                            : item.status === "İptal"
                            ? "#B3261E"
                            : "#B07D47",
                      }}
                    />
                    <span>{item.status}</span>
                    <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                  </button>
                )}

                {/* 1-Click Status Popover */}
                {activeMenuId === item.id && (
                  <div
                    ref={popoverRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 z-50 w-48 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: "#FBFAF7",
                      border: "1px solid #E6E1D8",
                    }}
                  >
                    <span
                      className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: "#8A8F89" }}
                    >
                      Durumu Değiştir
                    </span>

                    {/* Tamamlandı */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Tamamlandı")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: item.status === "Tamamlandı" ? "#E2EEDD" : "transparent",
                        color: "#2C6A3B",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3F8F55]" />
                        Tamamlandı
                      </span>
                      {item.status === "Tamamlandı" && <Check className="h-3.5 w-3.5 text-[#2C6A3B]" />}
                    </button>

                    {/* Devam Ediyor */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Devam Ediyor")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: item.status === "Devam Ediyor" ? "#E3ECF7" : "transparent",
                        color: "#2C5282",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#4A78B5] animate-pulse" />
                        Devam Ediyor
                      </span>
                      {item.status === "Devam Ediyor" && <Check className="h-3.5 w-3.5 text-[#2C5282]" />}
                    </button>

                    {/* Bekliyor */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Bekliyor")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: item.status === "Bekliyor" ? "#F3EADB" : "transparent",
                        color: "#7A5320",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#B07D47]" />
                        Bekliyor
                      </span>
                      {item.status === "Bekliyor" && <Check className="h-3.5 w-3.5 text-[#7A5320]" />}
                    </button>

                    {/* İptal */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "İptal")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: item.status === "İptal" ? "#FBE9E7" : "transparent",
                        color: "#B3261E",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#B3261E]" />
                        İptal
                      </span>
                      {item.status === "İptal" && <Check className="h-3.5 w-3.5 text-[#B3261E]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Appointment Modal on Homepage */}
      {editingApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingApt(null)}
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
              <h3
                className="text-base font-normal tracking-tight font-serif"
                style={{ color: "#1C211E" }}
              >
                Randevuyu Düzenle
              </h3>
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                    Randevu Saati
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none font-mono transition-all focus:ring-1 focus:ring-[#1F3327]"
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

              <div>
                <label className="block font-semibold mb-1" style={{ color: "#3F4540" }}>
                  Klinik Notu
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans notu..."
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E1D8",
                    color: "#1C211E",
                  }}
                />
              </div>

              <div
                className="flex items-center justify-between pt-3.5"
                style={{ borderTop: "1px solid #E6E1D8" }}
              >
                <button
                  type="button"
                  onClick={() => handleDelete(editingApt.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  style={{
                    color: "#B3261E",
                    backgroundColor: "transparent",
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "#EEEBE4",
                      color: "#1C211E",
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                    style={{
                      backgroundColor: "#1F3327",
                    }}
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
