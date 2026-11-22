"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import {
  RotateCcw,
  Plus,
  Save,
  ArrowLeft,
  ArrowRight,
  Printer,
  Copy,
  Pencil,
  Search,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { patients, medicines } from "@/lib/mock-data";
import { PrescriptionItem } from "@/lib/types";
import { useModal } from "@/components/modals/ModalContext";

export default function PatientRecetePage() {
  const { showToast, openPrintPreview } = useModal();
  const params = useParams();
  const patientId = (params?.id as string) || "2";

  const patient =
    patients.find((p) => p.id === patientId) ||
    patients.find((p) => p.id === "2") ||
    patients[0];

  const fullNameUpper = `${patient.firstName} ${patient.lastName}`.toLocaleUpperCase("tr-TR");

  // Form states
  const [endikasyon, setEndikasyon] = useState("");
  const [dishekimi, setDishekimi] = useState("Mahir AÇIKALIN");
  const [protokolNo, setProtokolNo] = useState("PRT-9042");
  const [tarih, setTarih] = useState("2026-11-21");

  // Medicine search & prescription items
  const [searchQuery, setSearchQuery] = useState("");
  // Starts empty as requested and shown in screenshot
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);

  // Filtered medicine list
  const filteredMedicines = medicines.filter((med) =>
    med.toLocaleLowerCase("tr-TR").includes(searchQuery.toLocaleLowerCase("tr-TR"))
  );

  const addMedicineToPrescription = (medicineName: string) => {
    if (prescriptionItems.length >= 7) {
      alert("En fazla 6–7 ilaç ekleyebilirsiniz.");
      return;
    }
    const newItem: PrescriptionItem = {
      id: String(Date.now() + Math.random()),
      medicine: medicineName,
      dosage: "1 Kutu",
      usage: "2x1 Tok",
      description: "Aç karnına alınmamalıdır",
    };
    setPrescriptionItems((prev) => [...prev, newItem]);
  };

  const removePrescriptionItem = (id: string) => {
    setPrescriptionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ========================================================= */}
      {/* LEFT PANEL: Prescription Form & Table (lg:col-span-8) */}
      {/* ========================================================= */}
      <div className="lg:col-span-8 flex flex-col rounded-xl bg-white p-6 shadow-sm border border-gray-200/80 space-y-6">
        {/* Top Header: Title + Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif sm:font-sans">
            Reçete
          </h2>

          {/* Top Toolbar: Undo, Add, Save, Previous, Next, Print */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="Geri Al"
              onClick={() => {
                setPrescriptionItems([]);
                showToast("Reçete temizlendi.", "info");
              }}
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => addMedicineToPrescription("Parol 500 mg 20 tablet")}
              title="İlaç Ekle"
              className="rounded-lg bg-[#2D4A3E] p-2 text-white shadow-2xs hover:bg-[#3A5F50] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Kaydet"
              onClick={() => showToast(`✓ E-Reçete ${protokolNo} başarıyla kaydedildi.`, "success")}
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Önceki"
              onClick={() => showToast("Önceki reçeteye geçildi.", "info")}
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Sonraki"
              onClick={() => showToast("Sonraki reçeteye geçildi.", "info")}
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Yazdır"
              onClick={() => {
                openPrintPreview({
                  type: "prescription",
                  title: "T.C. Sağlık Bakanlığı E-Reçete Dökümü",
                  patientName: fullNameUpper,
                  date: tarih,
                  doctorName: dishekimi,
                  items: prescriptionItems.length > 0 ? prescriptionItems.map((item) => ({
                    name: item.medicine,
                    detail: `${item.dosage} - ${item.usage}`,
                  })) : undefined,
                  extraInfo: {
                    "Protokol No": protokolNo,
                    "Endikasyon": endikasyon || "Akut Dental Enfeksiyon & Cerrahi Sonrası",
                    "Hasta T.C.": patient.tcNo,
                  },
                });
              }}
              className="rounded-lg border border-gray-200/90 bg-white p-2 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form Fields (2-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Endikasyon: wide text input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Endikasyon
            </label>
            <input
              type="text"
              value={endikasyon}
              onChange={(e) => setEndikasyon(e.target.value)}
              placeholder="Endikasyon giriniz..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Dişhekimi dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Dişhekimi
            </label>
            <div className="relative">
              <select
                value={dishekimi}
                onChange={(e) => setDishekimi(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
              >
                <option value="Mahir AÇIKALIN">Mahir AÇIKALIN</option>
                <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                <option value="Dt. Kemal Aydın">Dt. Kemal Aydın</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Tarih: date picker with calendar icon */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Tarih
            </label>
            <input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>

          {/* Protokol No */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Protokol No
            </label>
            <input
              type="text"
              value={protokolNo}
              onChange={(e) => setProtokolNo(e.target.value)}
              placeholder="Protokol No"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
            />
          </div>
        </div>

        {/* Prescription Table Section */}
        <div className="rounded-xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
          {/* Sub-Card Header: Reçete (Tuğçe ÜNGÖR) with copy + edit icon buttons */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF7F2]/60 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 tracking-tight">
              Reçete ({fullNameUpper})
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="Kopyala"
                className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Düzenle"
                className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Table Headers: İlaç | Doz | Kullanım | Açıklama */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200/70 text-gray-600 bg-white">
                  <th className="py-3 px-4 font-semibold w-2/5">İlaç</th>
                  <th className="py-3 px-4 font-semibold w-1/5">Doz</th>
                  <th className="py-3 px-4 font-semibold w-1/5">Kullanım</th>
                  <th className="py-3 px-4 font-semibold w-1/5">Açıklama</th>
                  <th className="py-3 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems.length > 0 ? (
                  prescriptionItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-gray-900">
                        {item.medicine}
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) =>
                            updateItem(item.id, "dosage", e.target.value)
                          }
                          className="h-8 w-full rounded border border-gray-200 px-2 text-xs text-gray-800"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={item.usage}
                          onChange={(e) =>
                            updateItem(item.id, "usage", e.target.value)
                          }
                          className="h-8 w-full rounded border border-gray-200 px-2 text-xs text-gray-800"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          className="h-8 w-full rounded border border-gray-200 px-2 text-xs text-gray-800"
                        />
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removePrescriptionItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {prescriptionItems.length === 0 && (
            <div className="py-14 px-6">
              <EmptyState
                icon="pill"
                message="Yukarıda sırasıyla tanımlı yazdırılmak için en fazla 6–7 ilaç ekleyiniz."
                subMessage={
                  <button
                    type="button"
                    onClick={() => addMedicineToPrescription(medicines[0])}
                    className="italic text-[#4A7C68] hover:underline cursor-pointer transition-colors"
                  >
                    İlaç listesinden olmayan eklemenizi istediğiniz ilaçları eklemek için tıklayınız.
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: İlaç Listesi (lg:col-span-4) */}
      {/* ========================================================= */}
      <div className="lg:col-span-4 flex flex-col rounded-xl bg-white p-6 shadow-sm border border-gray-200/80 min-h-[580px]">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif sm:font-sans mb-4">
          İlaç Listesi
        </h2>

        {/* Search Input: "İlaç ara..." with search icon */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İlaç ara..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68] transition-colors"
          />
        </div>

        {/* Scrollable list of medicines (use medicines array from mock-data) */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[460px] pr-1">
          {filteredMedicines.map((med, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addMedicineToPrescription(med)}
              className="w-full text-left py-3 px-2 text-xs sm:text-sm text-gray-700 hover:bg-[#F5F0EB]/70 hover:text-[#2D4A3E] font-medium rounded-lg transition-colors flex items-center justify-between group"
            >
              <span className="truncate pr-2">{med}</span>
              <span className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-[#4A7C68] transition-opacity shrink-0">
                + Ekle
              </span>
            </button>
          ))}

          {filteredMedicines.length === 0 && (
            <div className="py-8 text-center text-xs text-gray-400">
              Aranan ilaç bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
