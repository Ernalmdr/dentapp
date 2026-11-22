"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Package,
  AlertTriangle,
  Plus,
  CheckCircle2,
  ShoppingCart,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
  PlusCircle,
  MinusCircle,
  Building2,
  Filter,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";

export interface StockItem {
  id: string;
  name: string;
  category: "Restoratif" | "Anestezi" | "Endodonti" | "Sarf Malzeme" | "Protez" | "Cerrahi";
  quantity: number;
  unit: string;
  minThreshold: number;
  status: "Normal" | "Kritik";
  supplier?: string;
  shelfLocation?: string;
}

const defaultStock: StockItem[] = [
  { id: "1", name: "3M Filtek Z250 Kompozit Dolgu (A2)", category: "Restoratif", quantity: 2, unit: "Tüp", minThreshold: 5, status: "Kritik", supplier: "Meda Dental Deposu", shelfLocation: "Dolap A-2" },
  { id: "2", name: "Septanest %4 Adrenalinli Anestezi", category: "Anestezi", quantity: 14, unit: "Kutu", minThreshold: 10, status: "Normal", supplier: "Dentasya Ecza", shelfLocation: "Soğuk Dolap 1" },
  { id: "3", name: "ProTaper Next Kanal Eğesi (X1-X3)", category: "Endodonti", quantity: 3, unit: "Set", minThreshold: 6, status: "Kritik", supplier: "DentLab Dental", shelfLocation: "Dolap B-4" },
  { id: "4", name: "Nitril Muayene Eldiveni (M)", category: "Sarf Malzeme", quantity: 45, unit: "Kutu", minThreshold: 20, status: "Normal", supplier: "Güler Medikal", shelfLocation: "Depo Raf 3" },
  { id: "5", name: "C-Silikon Ölçü Maddesi (Zetaplus)", category: "Protez", quantity: 8, unit: "Kutu", minThreshold: 5, status: "Normal", supplier: "OMS Dental", shelfLocation: "Dolap C-1" },
  { id: "6", name: "Cerrahi Dikiş İpi (4-0 İpek)", category: "Cerrahi", quantity: 4, unit: "Kutu", minThreshold: 10, status: "Kritik", supplier: "Güler Medikal", shelfLocation: "Cerrahi Seti" },
  { id: "7", name: "Kavron Geçici Dolgu Simanı", category: "Restoratif", quantity: 6, unit: "Kavanoz", minThreshold: 4, status: "Normal", supplier: "Meda Dental Deposu", shelfLocation: "Dolap A-1" },
  { id: "8", name: "Klorheksidin %0.2 Ağız Çalkalama", category: "Sarf Malzeme", quantity: 18, unit: "Şişe", minThreshold: 12, status: "Normal", supplier: "Dentasya Ecza", shelfLocation: "Depo Raf 2" },
];

export default function StokPage() {
  const { showToast, openStockOrderModal } = useModal();
  const [items, setItems] = useState<StockItem[]>(defaultStock);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [statusFilter, setStatusFilter] = useState<"Tümü" | "Kritik" | "Normal">("Tümü");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StockItem["category"]>("Restoratif");
  const [quantity, setQuantity] = useState<number | string>(10);
  const [unit, setUnit] = useState("Kutu");
  const [minThreshold, setMinThreshold] = useState<number | string>(5);
  const [supplier, setSupplier] = useState("Meda Dental Deposu");
  const [shelfLocation, setShelfLocation] = useState("Dolap A-1");

  // Delete Confirmation
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_stock_catalog");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const saveToStorage = (updated: StockItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem("dentapp_stock_catalog", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setCategory("Restoratif");
    setQuantity(10);
    setUnit("Kutu");
    setMinThreshold(5);
    setSupplier("Meda Dental Deposu");
    setShelfLocation("Dolap A-1");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StockItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setMinThreshold(item.minThreshold);
    setSupplier(item.supplier || "Meda Dental Deposu");
    setShelfLocation(item.shelfLocation || "Dolap A-1");
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numQty = Number(quantity) || 0;
    const numMin = Number(minThreshold) || 1;
    const computedStatus: "Normal" | "Kritik" = numQty <= numMin ? "Kritik" : "Normal";

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              name: name.trim(),
              category,
              quantity: numQty,
              unit,
              minThreshold: numMin,
              status: computedStatus,
              supplier,
              shelfLocation,
            }
          : it
      );
      saveToStorage(updated);
      showToast(`✓ "${name}" malzeme bilgileri güncellendi.`, "success");
    } else {
      const newItem: StockItem = {
        id: String(Date.now()),
        name: name.trim(),
        category,
        quantity: numQty,
        unit,
        minThreshold: numMin,
        status: computedStatus,
        supplier,
        shelfLocation,
      };
      saveToStorage([newItem, ...items]);
      showToast(`✓ Yeni malzeme eklendi: "${name}" (${numQty} ${unit}).`, "success");
    }
    setIsModalOpen(false);
  };

  const handleQuickAdjustQty = (id: string, delta: number) => {
    const updated = items.map((it) => {
      if (it.id === id) {
        const nextQty = Math.max(0, it.quantity + delta);
        return {
          ...it,
          quantity: nextQty,
          status: nextQty <= it.minThreshold ? ("Kritik" as const) : ("Normal" as const),
        };
      }
      return it;
    });
    saveToStorage(updated);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const targetName = itemToDelete.name;
    const updated = items.filter((it) => it.id !== itemToDelete.id);
    saveToStorage(updated);
    setItemToDelete(null);
    showToast(`✓ "${targetName}" malzeme envanterden silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveToStorage(defaultStock);
    showToast("✓ Envanter varsayılan klinik listesine sıfırlandı.", "info");
  };

  const categories = ["Tümü", "Restoratif", "Anestezi", "Endodonti", "Sarf Malzeme", "Protez", "Cerrahi"];

  // Filtered
  const filtered = items.filter((it) => {
    const matchCat = selectedCategory === "Tümü" || it.category === selectedCategory;
    const matchStatus = statusFilter === "Tümü" || it.status === statusFilter;
    const matchSearch =
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase()) ||
      (it.supplier && it.supplier.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchStatus && matchSearch;
  });

  const criticalCount = items.filter((it) => it.status === "Kritik").length;

  return (
    <div className="flex flex-col gap-6">
      <BannerHeader
        title="Klinik Malzeme & Stok Yönetimi"
        description="Dental sarf malzeme seviyeleri, kritik tükenme uyarıları, depo siparişleri ve envanter takibi."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Stok" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + Yeni Malzeme Girişi
            </button>
          </div>
        }
      />

      {/* Filter, Search & Status Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-[#122019] p-4 border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        {/* Category Pills & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((c) => {
              const count = c === "Tümü" ? items.length : items.filter((it) => it.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === c
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
            title="Varsayılan Envanter Listesine Sıfırla"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Varsayılana Sıfırla
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Malzeme adı veya tedarikçi ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Stok Durumu:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-stone-100 dark:bg-[#16261F] border border-stone-200 dark:border-[#1E332A]">
              {(["Tümü", "Kritik", "Normal"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? st === "Kritik"
                        ? "bg-red-600 text-white shadow-2xs"
                        : "bg-[#2D4A3E] text-white shadow-2xs"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                  }`}
                >
                  {st} {st === "Kritik" && criticalCount > 0 && `(${criticalCount})`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-[#16261F] border-b border-stone-200 dark:border-[#1E332A] text-stone-500 dark:text-[#90A199] uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Malzeme Adı</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Mevcut Miktar & Hızlı Ayar</th>
                <th className="py-3.5 px-4">Kritik Eşik</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4">Tedarikçi Depo</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#1A2D23] text-stone-800 dark:text-[#E2ECE7]">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-[#172B20] transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-stone-100 dark:bg-[#1A2D23] text-stone-600 dark:text-[#90A199] flex items-center justify-center shrink-0">
                        <Package className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="block text-stone-900 dark:text-stone-100">{item.name}</span>
                        {item.shelfLocation && (
                          <span className="text-[10px] text-stone-400 font-mono">Raf: {item.shelfLocation}</span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-stone-500 dark:text-[#90A199] font-medium">
                      {item.category}
                    </td>

                    {/* Quantity with +/- adjustment buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100 min-w-14">
                          {item.quantity} {item.unit}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustQty(item.id, -1)}
                            title="1 Adet Düşür (Kullanım)"
                            className="p-1 rounded-lg border border-stone-200 dark:border-[#233C30] text-stone-500 hover:bg-stone-100 dark:hover:bg-[#1A2D23] cursor-pointer"
                          >
                            <MinusCircle className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjustQty(item.id, 1)}
                            title="1 Adet Ekle (Giriş)"
                            className="p-1 rounded-lg border border-stone-200 dark:border-[#233C30] text-stone-500 hover:bg-stone-100 dark:hover:bg-[#1A2D23] cursor-pointer"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Threshold */}
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      Min: {item.minThreshold} {item.unit}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === "Kritik" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200/60 dark:border-red-900/40">
                          <AlertTriangle className="h-3 w-3" /> Kritik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                          <CheckCircle2 className="h-3 w-3" /> Yeterli
                        </span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {item.supplier || "Anlaşmalı Depo"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openStockOrderModal(item.name, item.quantity, item.unit)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] hover:bg-stone-50 dark:hover:bg-[#1A2D23] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="h-3 w-3" /> Sipariş Ver
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Malzeme Bilgilerini Düzenle"
                          className="p-1.5 rounded-lg border border-stone-200 dark:border-[#233C30] hover:bg-stone-50 dark:hover:bg-[#1A2D23] text-stone-600 dark:text-stone-300 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          title="Malzemeyi Sil"
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <p className="font-semibold text-xs">Arama kriterlerine uygun malzeme bulunamadı.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {editingItem ? "Malzeme Bilgilerini Düzenle" : "Yeni Malzeme Girişi"}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Malzeme Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 3M Filtek Kompozit Tüp..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2.5 outline-none"
                  >
                    {categories.filter((c) => c !== "Tümü").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Birim
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2.5 outline-none"
                  >
                    <option value="Kutu">Kutu</option>
                    <option value="Tüp">Tüp</option>
                    <option value="Set">Set</option>
                    <option value="Şişe">Şişe</option>
                    <option value="Adet">Adet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Mevcut Stok Miktarı
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Kritik Eşik Seviyesi
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(e.target.value)}
                    className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Tedarikçi Depo
                </label>
                <input
                  type="text"
                  placeholder="Meda Dental, DentLab vb."
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1A2D23]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-white font-bold hover:bg-[#3A5F50]"
                >
                  {editingItem ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Malzemeyi Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs text-stone-500">
                  Bu işlem malzemeyi klinik envanterinden kaldıracaktır.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold p-3 bg-stone-50 dark:bg-[#16261F] rounded-xl border border-stone-200 dark:border-[#1E332A]">
              {itemToDelete.name} ({itemToDelete.quantity} {itemToDelete.unit})
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
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
