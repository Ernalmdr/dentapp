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
  Pencil,
  Plus,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import {
  CalendarAppointment,
  getStoredAppointments,
  saveStoredAppointments,
} from "@/lib/appointments-data";

export default function AppointmentsList() {
  const { openAppointmentModal, showToast } = useModal();
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
    <div className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#122019] p-6 shadow-xs border border-stone-200/60 dark:border-[#1E332A] h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-[#F0F5F2] tracking-tight">
            Bugünkü Randevular
          </h2>
          <p className="text-xs text-stone-400">27 Ekim Perşembe • 5 Randevu</p>
        </div>
        <Link
          href="/randevular"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-[#233C30] px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-[#90A199] hover:bg-stone-50 dark:hover:bg-[#1A2D23] hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          Haftalık Takvim
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Appointment Timeline List */}
      <div className="relative flex-1 flex flex-col justify-between space-y-3">
        {/* Subtle vertical timeline connecting line */}
        <div className="absolute left-[7px] top-4 bottom-4 w-px bg-stone-200/80 dark:bg-[#1E332A] pointer-events-none" />

        {todayList.map((item, index) => {
          const isDevamEdiyor = item.status === "Devam Ediyor";
          const isActiveMenu = activeMenuId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenEdit(item)}
              className={`relative flex items-center justify-between rounded-xl p-3 transition-all cursor-pointer group border ${
                isActiveMenu
                  ? "z-40 ring-2 ring-emerald-500/30 shadow-lg"
                  : isDevamEdiyor
                  ? "z-20"
                  : "z-10"
              } ${
                isDevamEdiyor
                  ? "bg-gradient-to-r from-[#1A2E24] to-[#243F32] text-white shadow-md border-l-4 border-l-[#7CC9A6] border-stone-800"
                  : "bg-stone-50/50 dark:bg-[#16261F]/60 border-stone-100 dark:border-[#1E332A] hover:bg-stone-100/70 dark:hover:bg-[#182C22]"
              }`}
              title="Randevu detaylarını düzenlemek için tıklayın"
            >
              {/* Timeline node & patient info */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full border-2 -ml-[18px] shrink-0 transition-transform ${
                    isDevamEdiyor
                      ? "bg-[#7CC9A6] border-white shadow-xs scale-110"
                      : item.status === "Tamamlandı"
                      ? "bg-emerald-500 border-white dark:border-[#122019]"
                      : "bg-stone-300 dark:bg-[#2A4638] border-white dark:border-[#122019]"
                  }`}
                />
                <span
                  className={`text-xs font-mono font-bold w-12 ${
                    isDevamEdiyor ? "text-emerald-200" : "text-stone-500 dark:text-[#90A199]"
                  }`}
                >
                  {item.time}
                </span>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                    isDevamEdiyor
                      ? "bg-white/10 text-white"
                      : "bg-stone-200/60 dark:bg-[#1E332A] text-stone-600 dark:text-[#90A199]"
                  }`}
                >
                  <User className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className={`text-sm font-bold tracking-tight ${
                      isDevamEdiyor
                        ? "text-white"
                        : "text-stone-900 dark:text-[#F0F5F2] group-hover:text-emerald-700 dark:group-hover:text-[#7CC9A6] transition-colors"
                    }`}
                  >
                    {item.patientName}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      isDevamEdiyor ? "text-emerald-100/70" : "text-stone-400 dark:text-[#7A8E83]"
                    }`}
                  >
                    {item.treatment} • <span className="opacity-80">{item.dentist.split(" ")[1]}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge with Interactive Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === item.id ? null : item.id);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all shadow-2xs hover:scale-105 cursor-pointer ${
                    item.status === "Tamamlandı"
                      ? "bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300"
                      : item.status === "Devam Ediyor"
                      ? "bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-700/60 text-blue-800 dark:text-blue-300 ring-2 ring-blue-400/40"
                      : item.status === "İptal"
                      ? "bg-rose-100 dark:bg-rose-950/70 border border-rose-300 text-rose-800 dark:text-rose-300"
                      : "bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300"
                  }`}
                  title="Durumu değiştirmek için tıklayın"
                >
                  {item.status === "Tamamlandı" && (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {item.status === "Devam Ediyor" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                  {item.status === "Bekliyor" && <Clock className="h-3.5 w-3.5 text-amber-600" />}
                  {item.status === "İptal" && <X className="h-3.5 w-3.5 text-rose-600" />}

                  <span>{item.status}</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                </button>

                {/* 1-Click Status Popover */}
                {activeMenuId === item.id && (
                  <div
                    ref={popoverRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl bg-white dark:bg-[#16261F] border border-stone-200/90 dark:border-[#233C30] p-1.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <span className="block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Durumu Değiştir
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Tamamlandı")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors ${
                        item.status === "Tamamlandı"
                          ? "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200"
                          : "text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Tamamlandı
                      </span>
                      {item.status === "Tamamlandı" && <span className="text-xs font-bold text-emerald-600">✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Devam Ediyor")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors ${
                        item.status === "Devam Ediyor"
                          ? "bg-blue-100/70 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200"
                          : "text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        Devam Ediyor
                      </span>
                      {item.status === "Devam Ediyor" && <span className="text-xs font-bold text-blue-600">✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "Bekliyor")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors ${
                        item.status === "Bekliyor"
                          ? "bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200"
                          : "text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        Bekliyor
                      </span>
                      {item.status === "Bekliyor" && <span className="text-xs font-bold text-amber-600">✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickStatusChange(e, item.id, "İptal")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors ${
                        item.status === "İptal"
                          ? "bg-rose-100/70 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200"
                          : "text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <X className="h-3.5 w-3.5 text-rose-600" />
                        İptal
                      </span>
                      {item.status === "İptal" && <span className="text-xs font-bold text-rose-600">✓</span>}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingApt(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Randevuyu Düzenle
              </h3>
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Randevu Saati
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
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

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Klinik Notu
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Seans notu..."
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => handleDelete(editingApt.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Randevuyu Sil
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2D4A3E] text-white font-bold"
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
