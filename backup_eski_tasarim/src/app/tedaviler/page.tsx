"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Stethoscope,
  Search,
  Plus,
  Pencil,
  Trash2,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useModal } from "@/components/modals/ModalContext";
import { TreatmentModal, TreatmentItem } from "@/components/modals/TreatmentModal";

// Initial comprehensive TDB 2026 dental catalog
const defaultTreatments: TreatmentItem[] = [
  // Cerrahi
  { id: "c1", name: "Diş Çekimi (Tek Köklü)", category: "Cerrahi", tdbCode: "TDB-1001", price: 650, currency: "TRY", durationMinutes: 20 },
  { id: "c2", name: "Komplikasyonlu Diş Çekimi", category: "Cerrahi", tdbCode: "TDB-1002", price: 1200, currency: "TRY", durationMinutes: 35 },
  { id: "c3", name: "Gömülü Diş Operasyonu (Yarı Kemik)", category: "Cerrahi", tdbCode: "TDB-1003", price: 2400, currency: "TRY", durationMinutes: 45 },
  { id: "c4", name: "Gömülü Diş Operasyonu (Kemik Retansiyonlu)", category: "Cerrahi", tdbCode: "TDB-1004", price: 3800, currency: "TRY", durationMinutes: 60 },
  { id: "c5", name: "Kemik Grefti ve Membran Uygulaması", category: "Cerrahi", tdbCode: "TDB-1005", price: 5500, currency: "TRY", durationMinutes: 50 },
  { id: "c6", name: "Apikal Rezeksiyon (Kök Ucu Cerrahi)", category: "Cerrahi", tdbCode: "TDB-1006", price: 3200, currency: "TRY", durationMinutes: 45 },

  // Endodonti
  { id: "e1", name: "Kanal Tedavisi (Tek Kanal)", category: "Endodonti", tdbCode: "TDB-2001", price: 2200, currency: "TRY", durationMinutes: 40 },
  { id: "e2", name: "Kanal Tedavisi (İki Kanal)", category: "Endodonti", tdbCode: "TDB-2002", price: 3400, currency: "TRY", durationMinutes: 50 },
  { id: "e3", name: "Kanal Tedavisi (Üç ve Fazla Kanal)", category: "Endodonti", tdbCode: "TDB-2003", price: 4800, currency: "TRY", durationMinutes: 60 },
  { id: "e4", name: "Kanal Yenileme (Retreatment)", category: "Endodonti", tdbCode: "TDB-2004", price: 5400, currency: "TRY", durationMinutes: 75 },

  // Restoratif
  { id: "r1", name: "Kompozit Dolgu (Tek Yüzlü)", category: "Restoratif", tdbCode: "TDB-3001", price: 1100, currency: "TRY", durationMinutes: 30 },
  { id: "r2", name: "Kompozit Dolgu (İki Yüzlü)", category: "Restoratif", tdbCode: "TDB-3002", price: 1500, currency: "TRY", durationMinutes: 40 },
  { id: "r3", name: "Kompozit Dolgu (Üç Yüzlü - MOD)", category: "Restoratif", tdbCode: "TDB-3003", price: 1950, currency: "TRY", durationMinutes: 50 },
  { id: "r4", name: "Kuafaj (Direkt / İndirekt Pulpa Koruma)", category: "Restoratif", tdbCode: "TDB-3004", price: 650, currency: "TRY", durationMinutes: 20 },

  // Protez
  { id: "p1", name: "Zirkonyum Kron Kaplama (Üye Başı)", category: "Protez", tdbCode: "TDB-4001", price: 6500, currency: "TRY", durationMinutes: 45 },
  { id: "p2", name: "Tam Seramik (E-max) Kron Kaplama", category: "Protez", tdbCode: "TDB-4002", price: 7800, currency: "TRY", durationMinutes: 45 },
  { id: "p3", name: "Porselen Lamine (Veneer)", category: "Protez", tdbCode: "TDB-4003", price: 8500, currency: "TRY", durationMinutes: 60 },
  { id: "p4", name: "Total / Parsiyel Protez (Tek Çene)", category: "Protez", tdbCode: "TDB-4004", price: 16500, currency: "TRY", durationMinutes: 60 },

  // Periodontoloji
  { id: "pe1", name: "Diş Taşı Temizliği (Detertraj)", category: "Periodontoloji", tdbCode: "TDB-5001", price: 1200, currency: "TRY", durationMinutes: 30 },
  { id: "pe2", name: "Subgingival Küretaj (Dört Kadran)", category: "Periodontoloji", tdbCode: "TDB-5002", price: 4200, currency: "TRY", durationMinutes: 60 },
  { id: "pe3", name: "Gingivektomi & Gingivoplasti", category: "Periodontoloji", tdbCode: "TDB-5003", price: 2800, currency: "TRY", durationMinutes: 40 },

  // Estetik
  { id: "es1", name: "Ofis Tipi Diş Beyazlatma (Bleaching)", category: "Estetik", tdbCode: "TDB-6001", price: 5500, currency: "TRY", durationMinutes: 60 },
  { id: "es2", name: "Ev Tipi Beyazlatma (Plak ve Jel)", category: "Estetik", tdbCode: "TDB-6002", price: 3200, currency: "TRY", durationMinutes: 20 },
  { id: "es3", name: "Kompozit Bonding (Estetik Tasarım)", category: "Estetik", tdbCode: "TDB-6003", price: 2900, currency: "TRY", durationMinutes: 45 },
];

export default function TedavilerPage() {
  const { showToast } = useModal();

  const [treatments, setTreatments] = useState<TreatmentItem[]>(defaultTreatments);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentItem | null>(null);

  // Delete Confirmation State
  const [treatmentToDelete, setTreatmentToDelete] = useState<TreatmentItem | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_treatments_catalog");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTreatments(parsed);
        }
      }
    } catch {
      // fallback to default
    }
  }, []);

  // Sync to LocalStorage
  const saveTreatmentsToStorage = (updated: TreatmentItem[]) => {
    setTreatments(updated);
    try {
      localStorage.setItem("dentapp_treatments_catalog", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTreatment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TreatmentItem) => {
    setEditingTreatment(item);
    setIsModalOpen(true);
  };

  const handleSaveTreatment = (item: TreatmentItem) => {
    if (editingTreatment) {
      // Edit existing
      const updated = treatments.map((t) => (t.id === item.id ? item : t));
      saveTreatmentsToStorage(updated);
      showToast(`✓ "${item.name}" tedavisi ve fiyatı güncellendi.`, "success");
    } else {
      // Add new
      const updated = [item, ...treatments];
      saveTreatmentsToStorage(updated);
      showToast(`✓ Yeni tedavi eklendi: "${item.name}" (${formatCurrency(item.price)} ${item.currency}).`, "success");
    }
  };

  const confirmDeleteTreatment = () => {
    if (!treatmentToDelete) return;
    const targetName = treatmentToDelete.name;
    const updated = treatments.filter((t) => t.id !== treatmentToDelete.id);
    saveTreatmentsToStorage(updated);
    setTreatmentToDelete(null);
    showToast(`✓ "${targetName}" tedavisi listeden silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveTreatmentsToStorage(defaultTreatments);
    showToast("✓ Tedavi listesi TDB 2026 varsayılan kataloğuna sıfırlandı.", "info");
  };

  const categories = [
    "Tümü",
    "Cerrahi",
    "Endodonti",
    "Restoratif",
    "Protez",
    "Periodontoloji",
    "Estetik",
  ];

  // Filtering & Sorting
  let filtered = treatments.filter((t) => {
    const matchesCategory = category === "Tümü" || t.category === category;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tdbCode.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
  }

  // Category badge colors
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "Cerrahi":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40";
      case "Endodonti":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40";
      case "Restoratif":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40";
      case "Protez":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60 dark:border-sky-900/40";
      case "Periodontoloji":
        return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200/60 dark:border-teal-900/40";
      case "Estetik":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/40";
      default:
        return "bg-stone-50 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BannerHeader
        title="Tedavi Protokolleri & Fiyat Listesi"
        description="Türk Dişhekimleri Birliği (TDB) 2026 asgari tarifesi ve klinik özel tedavi fiyatlandırmaları."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Tedaviler" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/tedaviler/yeni"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#122019] px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Yeni Sayfada Ekle
            </Link>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + Yeni Tedavi Ekle
            </button>
          </div>
        }
      />

      {/* Filter, Search & Sorting Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-[#122019] p-4 border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        {/* Categories Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((c) => {
              const count =
                c === "Tümü"
                  ? treatments.length
                  : treatments.filter((t) => t.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    category === c
                      ? "bg-[#2D4A3E] text-white shadow-xs"
                      : "bg-stone-100 dark:bg-[#1A2D23] text-stone-600 dark:text-[#90A199] hover:bg-stone-200 dark:hover:bg-[#233C30]"
                  }`}
                >
                  {c} <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetDefaults}
            title="TDB 2026 Varsayılan Fiyat Listesine Sıfırla"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Varsayılana Sıfırla
          </button>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Tedavi adı veya TDB kodu ile ara (örn: Dolgu, TDB-1001)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> Sırala:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs text-stone-800 dark:text-stone-200 outline-none"
            >
              <option value="default">Önerilen (Kategoriye Göre)</option>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="name">Alfabetik (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Treatment List Table */}
      <div className="rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-[#16261F] border-b border-stone-200 dark:border-[#1E332A] text-stone-500 dark:text-[#90A199] uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Tedavi Adı</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">TDB Kodu</th>
                <th className="py-3.5 px-4">Tahmini Süre</th>
                <th className="py-3.5 px-4 text-right">Klinik Liste Fiyatı</th>
                <th className="py-3.5 px-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#1A2D23] text-stone-800 dark:text-[#E2ECE7]">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/70 dark:hover:bg-[#172B20] transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-[#182C22] text-[#2D4A3E] dark:text-[#7CC9A6] flex items-center justify-center shrink-0">
                          <Stethoscope className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="block text-stone-900 dark:text-stone-100 text-xs">
                            {item.name}
                          </span>
                          {item.description && (
                            <span className="block text-[11px] font-normal text-stone-400 max-w-xs truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* TDB Code */}
                    <td className="py-3.5 px-4 font-mono text-stone-500 dark:text-stone-400">
                      {item.tdbCode}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-stone-400" />
                        {item.durationMinutes || 30} dk
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        title="Fiyatı Düzenle"
                        className="font-mono font-bold text-sm text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline cursor-pointer"
                      >
                        {formatCurrency(item.price)} {item.currency}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          title="Tedaviyi & Fiyatı Düzenle"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1D3227] hover:text-[#2D4A3E] transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTreatmentToDelete(item)}
                          title="Tedaviyi Sil"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#16261F] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    <p className="font-semibold text-xs">Aradığınız kriterlere uygun tedavi bulunamadı.</p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Filtreleri temizleyebilir veya yeni bir tedavi ekleyebilirsiniz.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Treatment Modal */}
      <TreatmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTreatment}
        initialData={editingTreatment}
      />

      {/* Delete Confirmation Modal */}
      {treatmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Tedaviyi Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Bu işlem klinik fiyat listenizden tedaviyi kaldıracaktır.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#16261F] border border-stone-200/70 dark:border-[#1E332A] text-xs">
              <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                {treatmentToDelete.name}
              </span>
              <span className="font-mono text-stone-500 text-[11px]">
                {treatmentToDelete.tdbCode} • {formatCurrency(treatmentToDelete.price)} {treatmentToDelete.currency}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setTreatmentToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1A2D23] transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDeleteTreatment}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
