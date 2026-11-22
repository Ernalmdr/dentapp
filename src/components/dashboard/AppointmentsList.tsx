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
      className="flex flex-col justify-between rounded-[20px] p-6 shadow-xs h-full bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl md:text-[22px] font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
        >
          Bugünkü Randevular
        </h2>
        <Link
          href="/randevular"
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer bg-[#FBFAF7] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#EEEBE4] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
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
              } ${
                isHighlighted
                  ? "bg-[#1F3327] dark:bg-[#182820] text-white dark:text-[#ECF3EE] border border-[#1F3327] dark:border-[#2D4C3C]"
                  : "bg-transparent hover:bg-[#EEEBE4]/40 dark:hover:bg-[#1A2B21]/50 border border-transparent text-[#1C211E] dark:text-[#ECF3EE]"
              }`}
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
                  className={`text-xs font-semibold w-12 shrink-0 font-mono ${
                    isHighlighted ? "text-white dark:text-[#ECF3EE]" : "text-[#1C211E] dark:text-[#ECF3EE]"
                  }`}
                >
                  {item.time}
                </span>

                {/* Avatar Icon */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    isHighlighted
                      ? "bg-white/12 text-white"
                      : "bg-[#EEEBE4] dark:bg-[#1A2B21] text-[#5F665F] dark:text-[#A2B5A8]"
                  }`}
                >
                  <User className="h-4 w-4" />
                </div>

                {/* Patient Name & Treatment */}
                <div className="min-w-0 flex items-center gap-2 sm:gap-6">
                  <p
                    className={`text-sm font-bold tracking-tight truncate min-w-[100px] sm:min-w-[120px] ${
                      isHighlighted ? "text-white dark:text-[#ECF3EE]" : "text-[#1C211E] dark:text-[#ECF3EE]"
                    }`}
                  >
                    {item.patientName}
                  </p>
                  <p
                    className={`text-xs font-medium truncate hidden sm:block ${
                      isHighlighted ? "text-[#CDD5CF] dark:text-[#A2B5A8]" : "text-[#5F665F] dark:text-[#A2B5A8]"
                    }`}
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
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:bg-white/20 bg-white/12 text-white"
                      title="Durumu değiştirmek için tıklayın"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3F8F55]" />
                      <span>{item.status}</span>
                      <ChevronDown className="h-3 w-3 opacity-70 ml-0.5" />
                    </button>

                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-105 bg-[#2D3A32] dark:bg-[#243B2F] text-white"
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 cursor-pointer shadow-2xs border ${
                      item.status === "Tamamlandı"
                        ? "bg-[#E2EEDD] text-[#2C6A3B] border-[#C9DDC3] dark:bg-[#1A3324] dark:text-[#4ADE80] dark:border-[#2D5A3C]"
                        : item.status === "Devam Ediyor"
                        ? "bg-[#E3ECF7] text-[#2C5282] border-[#C5D6E8] dark:bg-[#172B3C] dark:text-[#7BAEF0] dark:border-[#23425E]"
                        : item.status === "İptal"
                        ? "bg-[#FBE9E7] text-[#B3261E] border-[#F3D0CC] dark:bg-[#3B1C1B] dark:text-[#F87171] dark:border-[#5A2422]"
                        : "bg-[#F3EADB] text-[#7A5320] border-[#EADFC8] dark:bg-[#342817] dark:text-[#E2B77A] dark:border-[#523E23]"
                    }`}
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
                    className="absolute right-0 top-full mt-2 z-50 w-48 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
                  >
                    <span
                      className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8F89] dark:text-[#A2B5A8]"
                    >
                      Durumu Değiştir
                    </span>

                    {/* Tamamlandı */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Tamamlandı")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        item.status === "Tamamlandı"
                          ? "bg-[#E2EEDD] dark:bg-[#1A3324] text-[#2C6A3B] dark:text-[#4ADE80]"
                          : "text-[#2C6A3B] dark:text-[#4ADE80] hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3F8F55]" />
                        Tamamlandı
                      </span>
                      {item.status === "Tamamlandı" && <Check className="h-3.5 w-3.5 text-[#2C6A3B] dark:text-[#4ADE80]" />}
                    </button>

                    {/* Devam Ediyor */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Devam Ediyor")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        item.status === "Devam Ediyor"
                          ? "bg-[#E3ECF7] dark:bg-[#172B3C] text-[#2C5282] dark:text-[#7BAEF0]"
                          : "text-[#2C5282] dark:text-[#7BAEF0] hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#4A78B5] animate-pulse" />
                        Devam Ediyor
                      </span>
                      {item.status === "Devam Ediyor" && <Check className="h-3.5 w-3.5 text-[#2C5282] dark:text-[#7BAEF0]" />}
                    </button>

                    {/* Bekliyor */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Bekliyor")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        item.status === "Bekliyor"
                          ? "bg-[#F3EADB] dark:bg-[#342817] text-[#7A5320] dark:text-[#E2B77A]"
                          : "text-[#7A5320] dark:text-[#E2B77A] hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#B07D47]" />
                        Bekliyor
                      </span>
                      {item.status === "Bekliyor" && <Check className="h-3.5 w-3.5 text-[#7A5320] dark:text-[#E2B77A]" />}
                    </button>

                    {/* İptal */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "İptal")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                        item.status === "İptal"
                          ? "bg-[#FBE9E7] dark:bg-[#3B1C1B] text-[#B3261E] dark:text-[#F87171]"
                          : "text-[#B3261E] dark:text-[#F87171] hover:bg-[#EEEBE4] dark:hover:bg-[#1A2B21]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#B3261E]" />
                        İptal
                      </span>
                      {item.status === "İptal" && <Check className="h-3.5 w-3.5 text-[#B3261E] dark:text-[#F87171]" />}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingApt(null)}
        >
          <div
            className="w-full max-w-sm rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]"
            >
              <h3
                className="text-base font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
              >
                Randevuyu Düzenle
              </h3>
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-[#ECF3EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                    Randevu Saati
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-10 rounded-xl px-3 outline-none font-mono transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
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

              <div>
                <label className="block font-semibold mb-1 text-[#3F4540] dark:text-[#CDD5CF]">
                  Klinik Notu
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans notu..."
                  className="w-full h-10 rounded-xl px-3 outline-none transition-all focus:ring-1 focus:ring-[#1F3327] dark:focus:ring-[#3F8F55] bg-white border border-[#E6E1D8] text-[#1C211E] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                />
              </div>

              <div
                className="flex items-center justify-between pt-3.5 border-t border-[#E6E1D8] dark:border-[#243B2F]"
              >
                <button
                  type="button"
                  onClick={() => handleDelete(editingApt.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-[#B3261E] dark:text-[#F87171] hover:bg-[#FBE9E7] dark:hover:bg-[#3B1C1B]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer bg-[#EEEBE4] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#E6E1D8] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-xs bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#2D4C3C] dark:hover:bg-[#345844]"
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
