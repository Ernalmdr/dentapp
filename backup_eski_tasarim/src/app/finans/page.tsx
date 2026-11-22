"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CreditCard,
  Banknote,
  Building,
  Printer,
  Calendar,
  Filter,
  Pencil,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useModal } from "@/components/modals/ModalContext";

export interface Transaction {
  id: string;
  patientName: string;
  type: "Gelir" | "Gider";
  category: string;
  method: "Kredi Kartı" | "Nakit" | "Havale/EFT";
  amount: number;
  date: string;
  dentist: string;
  notes?: string;
}

const defaultTransactions: Transaction[] = [
  { id: "1", patientName: "Mahir Açıkkalın", type: "Gelir", category: "İmplant 1. Taksit", method: "Kredi Kartı", amount: 9000, date: "21.11.2026", dentist: "Dr. Selin Yılmaz" },
  { id: "2", patientName: "Tuğçe Üngör", type: "Gelir", category: "Kanal Tedavisi Peşin", method: "Nakit", amount: 4500, date: "21.11.2026", dentist: "Dr. Selin Yılmaz" },
  { id: "3", patientName: "DentLab Protez Ltd.", type: "Gider", category: "Zirkonyum Laboratuvar Faturası", method: "Havale/EFT", amount: 6200, date: "20.11.2026", dentist: "Klinik Gideri" },
  { id: "4", patientName: "Deniz Yılmaz", type: "Gelir", category: "Kompozit Dolgu", method: "Kredi Kartı", amount: 1200, date: "20.11.2026", dentist: "Dr. Selin Yılmaz" },
  { id: "5", patientName: "Meda Dental Depo", type: "Gider", category: "Anestezi & İğne Uçları", method: "Kredi Kartı", amount: 3750, date: "19.11.2026", dentist: "Klinik Gideri" },
  { id: "6", patientName: "Elif Karaca", type: "Gelir", category: "Gömülü 20'lik Çekim", method: "Nakit", amount: 1850, date: "19.11.2026", dentist: "Dr. Mahir Açıkkalın" },
  { id: "7", patientName: "Klinik Kira & Aidat", type: "Gider", category: "Gayrimenkul Kirası", method: "Havale/EFT", amount: 25000, date: "15.11.2026", dentist: "Klinik Gideri" },
  { id: "8", patientName: "Ayşe Demir", type: "Gelir", category: "Zirkonyum Kaplama Ön Ödeme", method: "Kredi Kartı", amount: 13000, date: "14.11.2026", dentist: "Dr. Selin Yılmaz" },
];

export default function FinansPage() {
  const { showToast, openPrintPreview } = useModal();
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [filterMethod, setFilterMethod] = useState("Tümü");
  const [filterType, setFilterType] = useState("Tümü");
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form Fields
  const [patientName, setPatientName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Gelir" | "Gider">("Gelir");
  const [category, setCategory] = useState("Tedavi Tahsilatı");
  const [method, setMethod] = useState<"Kredi Kartı" | "Nakit" | "Havale/EFT">("Kredi Kartı");
  const [dentist, setDentist] = useState("Dr. Selin Yılmaz");
  const [date, setDate] = useState("2026-11-21");

  // Delete State
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_finance_transactions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updated: Transaction[]) => {
    setTransactions(updated);
    try {
      localStorage.setItem("dentapp_finance_transactions", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setPatientName("");
    setAmount("");
    setType("Gelir");
    setCategory("Tedavi Tahsilatı");
    setMethod("Kredi Kartı");
    setDentist("Dr. Selin Yılmaz");
    setDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setPatientName(t.patientName);
    setAmount(String(t.amount));
    setType(t.type);
    setCategory(t.category);
    setMethod(t.method);
    setDentist(t.dentist);
    setDate(t.date.includes(".") ? t.date.split(".").reverse().join("-") : t.date);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!patientName.trim() || isNaN(numAmount) || numAmount <= 0) {
      showToast("Lütfen geçerli bir isim ve tutar giriniz.", "error");
      return;
    }

    const formattedDate = date.includes("-") ? date.split("-").reverse().join(".") : date;

    if (editingTransaction) {
      const updated = transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              patientName: patientName.trim(),
              type,
              category,
              method,
              amount: numAmount,
              date: formattedDate,
              dentist: type === "Gider" ? "Klinik Gideri" : dentist,
            }
          : t
      );
      saveToStorage(updated);
      showToast(`✓ İşlem güncellendi: ${formatCurrency(numAmount)} ₺`, "success");
    } else {
      const newItem: Transaction = {
        id: String(Date.now()),
        patientName: patientName.trim(),
        type,
        category: category || (type === "Gelir" ? "Tedavi Tahsilatı" : "Genel Gider"),
        method,
        amount: numAmount,
        date: formattedDate,
        dentist: type === "Gider" ? "Klinik Gideri" : dentist,
      };
      saveToStorage([newItem, ...transactions]);
      showToast(`✓ Yeni ${type} kaydı eklendi: ${formatCurrency(numAmount)} ₺`, "success");
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!transactionToDelete) return;
    const target = transactionToDelete;
    const updated = transactions.filter((t) => t.id !== transactionToDelete.id);
    saveToStorage(updated);
    setTransactionToDelete(null);
    showToast(`✓ ${formatCurrency(target.amount)} ₺ tutarındaki işlem silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveToStorage(defaultTransactions);
    showToast("✓ Finans kayıtları varsayılana sıfırlandı.", "info");
  };

  const handlePrintSummary = () => {
    openPrintPreview({
      type: "invoice",
      title: "Resmi Kasa & Gün Sonu Hesap Özeti",
      patientName: "DentaSphere Klinik Muhasebesi",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "Dr. Selin Yılmaz",
      total: netKasa,
      items: filtered.slice(0, 10).map((t) => ({
        name: `${t.patientName} (${t.category})`,
        detail: `${t.method} • ${t.date}`,
        price: `${t.type === "Gelir" ? "+" : "-"}${formatCurrency(t.amount)} ₺`,
      })),
      extraInfo: {
        "Toplam Tahsilat": `+${formatCurrency(totalGelir)} ₺`,
        "Toplam Gider": `-${formatCurrency(totalGider)} ₺`,
        "Net Kasa": `${formatCurrency(netKasa)} ₺`,
        "İşlem Adedi": `${filtered.length} Adet`,
      },
    });
  };

  const filtered = transactions.filter((t) => {
    if (filterMethod !== "Tümü" && t.method !== filterMethod) return false;
    if (filterType !== "Tümü" && t.type !== filterType) return false;
    if (search.trim() && !t.patientName.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalGelir = transactions.filter((t) => t.type === "Gelir").reduce((sum, t) => sum + t.amount, 0);
  const totalGider = transactions.filter((t) => t.type === "Gider").reduce((sum, t) => sum + t.amount, 0);
  const netKasa = totalGelir - totalGider;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <BannerHeader
        title="Finans & Kasa Yönetimi"
        description="Klinik gelirleri, giderleri, tahsilat makbuzları, kasa hareketleri ve gün sonu raporlama."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Finans" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSummary}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#122019] px-3.5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Kasa Raporu Yazdır
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + İşlem Kaydet
            </button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Kasa */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1B3329] to-[#12241C] p-5 text-white shadow-sm border border-emerald-950/20">
          <span className="text-xs font-medium text-[#A0B8AD]">Net Günlük Kasa</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight">{formatCurrency(netKasa)} ₺</span>
            <span className="inline-flex items-center text-xs font-semibold text-[#7CC9A6]">
              <ArrowUpRight className="h-3.5 w-3.5" /> +%14
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#A0B8AD]/80">Tüm nakit ve kart akışı dahil</p>
        </div>

        {/* Toplam Gelir */}
        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#90A199]">Toplam Tahsilat</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
              +{formatCurrency(totalGelir)} ₺
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Gelir
            </span>
          </div>
          <p className="mt-2 text-[11px] text-stone-400">Hasta ödemeleri & POS akışı</p>
        </div>

        {/* Toplam Gider */}
        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#90A199]">Klinik Giderleri</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-red-600 dark:text-red-400">
              -{formatCurrency(totalGider)} ₺
            </span>
            <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
              Gider
            </span>
          </div>
          <p className="mt-2 text-[11px] text-stone-400">Laboratuvar & malzeme alımları</p>
        </div>

        {/* Bekleyen Alacaklar */}
        <div className="rounded-2xl bg-white dark:bg-[#122019] p-5 shadow-xs border border-stone-200/80 dark:border-[#1E332A]">
          <span className="text-xs font-medium text-stone-500 dark:text-[#90A199]">Bekleyen Alacaklar</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              42.600 ₺
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              Taksitli
            </span>
          </div>
          <p className="mt-2 text-[11px] text-stone-400">Tamamlanacak tedavilerden</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white dark:bg-[#122019] p-4 border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        <div className="flex items-center gap-2">
          {["Tümü", "Gelir", "Gider"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === t
                  ? "bg-[#2D4A3E] text-white shadow-xs"
                  : "bg-stone-100 dark:bg-[#1A2D23] text-stone-600 dark:text-[#90A199] hover:bg-stone-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Hasta veya kategori ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-48 sm:w-60 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs outline-none"
          />

          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Ödeme Metodu:</span>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="h-9 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs font-semibold outline-none"
            >
              <option value="Tümü">Tüm Metotlar</option>
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Nakit">Nakit</option>
              <option value="Havale/EFT">Havale / EFT</option>
            </select>
          </div>

          <button
            onClick={handleResetDefaults}
            title="Sıfırla"
            className="p-2 rounded-xl border border-stone-200 dark:border-[#233C30] text-stone-500 hover:text-stone-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-[#16261F] border-b border-stone-200 dark:border-[#1E332A] text-stone-500 dark:text-[#90A199] uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Tarih</th>
                <th className="py-3.5 px-4">Kişi / Kurum / Hasta</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Ödeme Yöntemi</th>
                <th className="py-3.5 px-4">İlgili Hekim</th>
                <th className="py-3.5 px-4 text-right">Tutar</th>
                <th className="py-3.5 px-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#1A2D23] text-stone-800 dark:text-[#E2ECE7]">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-[#172B20] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-stone-500 dark:text-[#90A199]">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold">{item.patientName}</td>
                    <td className="py-3.5 px-4">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1A2D23] font-medium text-stone-700 dark:text-[#C5D6CD]">
                        {item.method === "Kredi Kartı" && <CreditCard className="h-3 w-3" />}
                        {item.method === "Nakit" && <Banknote className="h-3 w-3" />}
                        {item.method === "Havale/EFT" && <Building className="h-3 w-3" />}
                        {item.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 dark:text-[#90A199]">{item.dentist}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                      item.type === "Gelir" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {item.type === "Gelir" ? "+" : "-"}{formatCurrency(item.amount)} ₺
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-lg border border-stone-200 dark:border-[#233C30] hover:bg-stone-100 dark:hover:bg-[#1A2D23] text-stone-600 dark:text-stone-300 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransactionToDelete(item)}
                          className="p-1 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 text-red-600 cursor-pointer"
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
                    <p className="font-semibold text-xs">Arama kriterlerine uygun işlem bulunamadı.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#122019] p-6 shadow-2xl border border-stone-200 dark:border-[#1E332A] text-stone-900 dark:text-[#F0F5F2]">
            <h3 className="text-base font-bold mb-4">
              {editingTransaction ? "Finansal İşlemi Düzenle" : "Yeni Finansal İşlem Kaydet"}
            </h3>
            <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">İşlem Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("Gelir")}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      type === "Gelir"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-stone-200 dark:border-[#233C30]"
                    }`}
                  >
                    Gelir (Tahsilat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("Gider")}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      type === "Gider"
                        ? "bg-red-600 text-white border-red-600"
                        : "border-stone-200 dark:border-[#233C30]"
                    }`}
                  >
                    Gider (Ödeme)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kişi / Kurum / Hasta Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Ayşe Demir veya DentLab A.Ş."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tutar (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">İşlem Tarihi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Ödeme Yöntemi</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  >
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Nakit">Nakit</option>
                    <option value="Havale/EFT">Havale/EFT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Tedavi Tahsilatı vb."
                    className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-[#233C30]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-white font-bold"
                >
                  {editingTransaction ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  İşlemi Silmek İstiyor musunuz?
                </h3>
                <p className="text-xs text-stone-500">
                  Bu kayıt kasa defterinden kaldırılacaktır.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold p-3 bg-stone-50 dark:bg-[#16261F] rounded-xl border border-stone-200 dark:border-[#1E332A]">
              {transactionToDelete.patientName} — {formatCurrency(transactionToDelete.amount)} ₺ ({transactionToDelete.type})
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setTransactionToDelete(null)}
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
