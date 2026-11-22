"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import {
  RotateCcw,
  Plus,
  Save,
  ArrowLeft,
  ArrowRight,
  Printer,
  Search,
  Trash2,
  Info,
  Pill,
  Check,
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
  const [endikasyon, setEndikasyon] = useState("Akut Dental Enfeksiyon ve Cerrahi Sonrası");
  const [dishekimi, setDishekimi] = useState("Dr. Selin Yılmaz");
  const [protokolNo, setProtokolNo] = useState("PRT-9042");
  const [tarih, setTarih] = useState("2026-11-21");

  // Initial Sample Prescription Items
  const defaultItems: PrescriptionItem[] = [
    {
      id: "med-1",
      medicine: "Augmentin-BID 1000 mg 14 film tablet",
      dosage: "1 Kutu",
      usage: "2x1 Tok",
      description: "12 saat arayla tok karnına",
    },
    {
      id: "med-2",
      medicine: "Arveles 25 mg 20 film tablet",
      dosage: "1 Kutu",
      usage: "3x1 Tok",
      description: "Ağrı durumunda tok karnına",
    },
    {
      id: "med-3",
      medicine: "Kloroben Gargara 200 ml",
      dosage: "1 Şişe",
      usage: "3x1",
      description: "Yemeklerden sonra çalkalanacak",
    },
  ];

  // Prescription items state
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>(defaultItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dentapp_recete_items_${patientId}`);
      if (stored) {
        setPrescriptionItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, [patientId]);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`dentapp_recete_items_${patientId}`, JSON.stringify(prescriptionItems));
    } catch {
      // ignore
    }
  }, [prescriptionItems, patientId, isLoaded]);

  // Categories
  const categories = ["Tümü", "Antibiyotik", "Ağrı Kesici", "Gargara", "Diğer"];

  // Categorize medicine
  const getCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("augmentin") || lower.includes("amoklavin") || lower.includes("klasid") || lower.includes("kroksil") || lower.includes("largopen")) {
      return "Antibiyotik";
    }
    if (lower.includes("arveles") || lower.includes("parol") || lower.includes("apranax") || lower.includes("majezik") || lower.includes("dolorex") || lower.includes("minoset")) {
      return "Ağrı Kesici";
    }
    if (lower.includes("gargara") || lower.includes("kloroben") || lower.includes("andorex") || lower.includes("tantum")) {
      return "Gargara";
    }
    return "Diğer";
  };

  // Filtered medicine list
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.toLocaleLowerCase("tr-TR").includes(searchQuery.toLocaleLowerCase("tr-TR"));
    if (!matchesSearch) return false;
    if (selectedCategory === "Tümü") return true;
    return getCategory(med) === selectedCategory;
  });

  const addMedicineToPrescription = (medicineName: string) => {
    if (prescriptionItems.length >= 7) {
      showToast("⚠️ Reçeteye en fazla 6-7 ilaç ekleyebilirsiniz.", "info");
      return;
    }

    const lower = medicineName.toLowerCase();
    const isGargara = lower.includes("gargara");
    const isAnti = lower.includes("augmentin") || lower.includes("amoklavin") || lower.includes("largopen");

    const newItem: PrescriptionItem = {
      id: String(Date.now() + Math.random()),
      medicine: medicineName,
      dosage: isGargara ? "1 Şişe" : "1 Kutu",
      usage: isAnti ? "2x1 Tok" : isGargara ? "3x1" : "3x1 Tok",
      description: isAnti ? "12 saatte bir tok karnına" : isGargara ? "Yemek sonrası ağız çalkalama" : "Ağrı hissedildiğinde",
    };

    setPrescriptionItems((prev) => [...prev, newItem]);
    showToast(`✓ ${medicineName} reçeteye eklendi.`, "success");
  };

  const removePrescriptionItem = (id: string) => {
    setPrescriptionItems((prev) => prev.filter((item) => item.id !== id));
    showToast("İlaç reçeteden çıkarıldı.", "info");
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handlePrint = () => {
    openPrintPreview({
      type: "prescription",
      title: "T.C. Sağlık Bakanlığı E-Reçete Dökümü",
      patientName: fullNameUpper,
      date: tarih,
      doctorName: dishekimi,
      items: prescriptionItems.length > 0 ? prescriptionItems.map((item) => ({
        name: item.medicine,
        detail: `${item.dosage} - ${item.usage} (${item.description})`,
      })) : undefined,
      extraInfo: {
        "Protokol No": protokolNo,
        "Endikasyon": endikasyon,
        "Hasta T.C.": patient.tcNo || "23456789012",
        "Tesis": "DentaSphere Ağız ve Diş Sağlığı Merkezi",
      },
    });
  };

  const handleSave = () => {
    showToast(`✓ E-Reçete (${protokolNo}) başarıyla kaydedildi ve sisteme aktarıldı.`, "success");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ========================================================= */}
      {/* LEFT PANEL: Reçete Tablosu ve Detayları (8 cols) */}
      {/* ========================================================= */}
      <div className="lg:col-span-8 flex flex-col rounded-[16px] bg-[#FBFAF7] p-6 shadow-xs border border-[#E6E1D8] space-y-5">
        {/* Header: Title + Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2.5">
            <Pill className="h-5 w-5 text-[#1F3327]" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C211E] tracking-tight">
              Reçete
            </h2>
            <span className="rounded-full bg-[#E2EEDD] border border-[#C5D6C0] px-2.5 py-0.5 text-xs font-semibold text-[#2C6A3B]">
              {prescriptionItems.length} / 7 İlaç
            </span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="Temizle"
              onClick={() => {
                setPrescriptionItems([]);
                showToast("Reçete temizlendi.", "info");
              }}
              className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-[#5F665F]" />
            </button>
            <button
              type="button"
              onClick={() => addMedicineToPrescription("Parol 500 mg 20 tablet")}
              title="Hızlı Parol Ekle"
              className="rounded-lg bg-[#1F3327] p-2 text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Önceki Reçete"
              onClick={() => showToast("Önceki reçete dökümü yüklendi.", "info")}
              className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-[#5F665F]" />
            </button>
            <button
              type="button"
              title="Sonraki Reçete"
              onClick={() => showToast("Sonraki reçeteye geçildi.", "info")}
              className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
            >
              <ArrowRight className="h-4 w-4 text-[#5F665F]" />
            </button>
            <button
              type="button"
              title="Yazdır"
              onClick={handlePrint}
              className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 text-[#5F665F]" />
            </button>
          </div>
        </div>

        {/* Prescription Metadata Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-xl border border-[#E6E1D8] bg-white/70 p-3 text-xs">
          <div>
            <span className="block text-[#5F665F] font-medium">Protokol No</span>
            <input
              type="text"
              value={protokolNo}
              onChange={(e) => setProtokolNo(e.target.value)}
              className="mt-0.5 font-serif font-bold text-[#1C211E] bg-transparent outline-none w-full"
            />
          </div>
          <div>
            <span className="block text-[#5F665F] font-medium">Reçete Tarihi</span>
            <input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              className="mt-0.5 font-medium text-[#1C211E] bg-transparent outline-none w-full"
            />
          </div>
          <div>
            <span className="block text-[#5F665F] font-medium">Yazan Dişhekimi</span>
            <input
              type="text"
              value={dishekimi}
              onChange={(e) => setDishekimi(e.target.value)}
              className="mt-0.5 font-medium text-[#1C211E] bg-transparent outline-none w-full"
            />
          </div>
          <div>
            <span className="block text-[#5F665F] font-medium">Endikasyon / Tanı</span>
            <input
              type="text"
              value={endikasyon}
              onChange={(e) => setEndikasyon(e.target.value)}
              className="mt-0.5 font-medium text-[#1C211E] bg-transparent outline-none w-full truncate"
            />
          </div>
        </div>

        {/* Prescription Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E6E1D8] bg-white">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E6E1D8] bg-[#EEEBE4]/60 text-[#5F665F]">
                <th className="py-2.5 px-3 w-8 font-semibold">#</th>
                <th className="py-2.5 px-3 font-semibold">İlaç Adı</th>
                <th className="py-2.5 px-3 font-semibold w-24">Dozaj / Adet</th>
                <th className="py-2.5 px-3 font-semibold w-28">Kullanım</th>
                <th className="py-2.5 px-3 font-semibold">Açıklama / Talimat</th>
                <th className="py-2.5 px-2 text-center w-12">Sil</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionItems.length > 0 ? (
                prescriptionItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E6E1D8] hover:bg-[#F6EEDC]/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#8A8F89]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#1C211E]">
                      {item.medicine}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) => updateItem(item.id, "dosage", e.target.value)}
                        className="w-full rounded-lg border border-[#E6E1D8] bg-white px-2 py-1 text-xs text-[#3F4540] outline-none focus:border-[#1F3327]"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.usage}
                        onChange={(e) => updateItem(item.id, "usage", e.target.value)}
                        className="w-full rounded-lg border border-[#E6E1D8] bg-white px-2 py-1 text-xs text-[#3F4540] outline-none focus:border-[#1F3327]"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full rounded-lg border border-[#E6E1D8] bg-white px-2 py-1 text-xs text-[#3F4540] outline-none focus:border-[#1F3327]"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removePrescriptionItem(item.id)}
                        className="text-[#8A8F89] hover:text-[#B3261E] transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>

          {prescriptionItems.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon="pill"
                message="Reçetede henüz ilaç bulunmuyor. Sağdaki listeden ilaç seçebilirsiniz."
              />
            </div>
          )}
        </div>

        {/* Bilgilendirme Notu ("En fazla 6-7 ilaç ekleyiniz") */}
        <div className="flex items-center gap-2.5 rounded-xl bg-[#F6EEDC] border border-[#EADFC8] p-3.5 text-xs text-[#7A5320] font-medium">
          <Info className="h-4 w-4 text-[#7A5320] shrink-0" />
          <span>
            En fazla 6-7 ilaç ekleyiniz. Günde kaç defa ve nasıl kullanılacağını (aç/tok) reçete tablosu üzerinde düzenleyebilirsiniz.
          </span>
        </div>

        {/* Alt Butonlar: Reçete Yazdır ve Kaydet */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E1D8]">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-5 py-2.5 text-sm font-medium text-[#1C211E] shadow-2xs transition-colors hover:bg-[#F3F0EA] cursor-pointer"
          >
            <Printer className="h-4 w-4 text-[#5F665F]" />
            <span>Reçete Yazdır</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#1F3327] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#2D3A32] cursor-pointer"
          >
            <Save className="h-4 w-4 text-white" />
            <span>Kaydet</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: İlaç Listesi Hızlı Arama & Seçim Kartı (4 cols) */}
      {/* ========================================================= */}
      <div className="lg:col-span-4 flex flex-col rounded-[16px] bg-[#FBFAF7] p-6 shadow-xs border border-[#E6E1D8] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <h3 className="text-lg font-serif font-bold text-[#1C211E] tracking-tight">
            İlaç Listesi
          </h3>
          <span className="rounded-full bg-[#EEEBE4] px-2.5 py-0.5 text-xs font-semibold text-[#3F4540]">
            {medicines.length} İlaç
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F]" />
          <input
            type="text"
            placeholder="İlaç ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#1C211E] placeholder-[#8A8F89] outline-none transition focus:border-[#1F3327]"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1F3327] text-white"
                  : "bg-white border border-[#E6E1D8] text-[#5F665F] hover:bg-[#EEEBE4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Medicine List */}
        <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {filteredMedicines.map((med, index) => {
            const cat = getCategory(med);
            const isAdded = prescriptionItems.some((item) => item.medicine === med);

            return (
              <div
                key={index}
                onClick={() => !isAdded && addMedicineToPrescription(med)}
                className={`group flex items-center justify-between gap-2 rounded-xl border p-2.5 transition-all cursor-pointer ${
                  isAdded
                    ? "border-[#C5D6C0] bg-[#E2EEDD]/50 text-[#2C6A3B]"
                    : "border-[#E6E1D8] bg-white hover:border-[#1F3327]/30 hover:bg-[#F3F0EA]/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs sm:text-sm font-medium text-[#1C211E] group-hover:text-[#1F3327]">
                    {med}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8A8F89]">
                    {cat}
                  </span>
                </div>

                <button
                  type="button"
                  title={isAdded ? "Reçetede Mevcut" : "Reçeteye Ekle"}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    isAdded
                      ? "bg-[#2C6A3B] text-white"
                      : "bg-[#EEEBE4] text-[#3F4540] group-hover:bg-[#1F3327] group-hover:text-white"
                  }`}
                >
                  {isAdded ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            );
          })}

          {filteredMedicines.length === 0 && (
            <div className="py-8 text-center text-xs text-[#5F665F]">
              Aranan kriterlere uygun ilaç bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
