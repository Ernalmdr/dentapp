"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Printer,
  Calendar,
  Filter,
  Pencil,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  FileText,
  CheckCircle2,
  X,
  Search,
  Wallet,
  Check,
  ChevronRight,
  Info,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
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
  // Gider Kartı Detayları
  invoiceNo?: string;
  taxRate?: number;
  accountType?: string;
  currency?: string;
  taxOffice?: string;
  taxNumber?: string;
  contactPerson?: string;
  phone?: string;
  landlinePhone?: string;
  email?: string;
  country?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  address?: string;
  workingConditions?: string;
  status?: "Ödendi" | "Bekliyor" | "Taksitli" | "İptal";
  salesRep?: string;
  salesRepPhone?: string;
  salesRepEmail?: string;
  technician?: string;
  technicianPhone?: string;
  technicianEmail?: string;
}

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    patientName: "Mahir Açıkkalın",
    type: "Gelir",
    category: "İmplant 1. Taksit",
    method: "Kredi Kartı",
    amount: 9000,
    date: "21.11.2026",
    dentist: "Dr. Selin Yılmaz",
  },
  {
    id: "2",
    patientName: "Tuğçe Üngör",
    type: "Gelir",
    category: "Kanal Tedavisi Peşin",
    method: "Nakit",
    amount: 4500,
    date: "21.11.2026",
    dentist: "Dr. Selin Yılmaz",
  },
  {
    id: "3",
    patientName: "DentLab Protez Ltd.",
    type: "Gider",
    category: "Zirkonyum Laboratuvar Faturası",
    method: "Havale/EFT",
    amount: 6200,
    date: "20.11.2026",
    dentist: "Klinik Gideri",
    invoiceNo: "FT-2026-0842",
    taxRate: 20,
    accountType: "Cari Hesap",
    currency: "TRY",
    taxOffice: "Kadıköy V.D.",
    taxNumber: "2849102948",
    contactPerson: "Ahmet Yılmaz",
    phone: "0532 555 10 20",
    landlinePhone: "0216 444 30 20",
    email: "muhasebe@dentlab.com",
    country: "TÜRKİYE",
    city: "İstanbul",
    district: "Kadıköy",
    postalCode: "34710",
    address: "Bağdat Cad. No: 142/5 Kadıköy / İstanbul",
    workingConditions: "30 Gün Vade",
    status: "Ödendi",
    salesRep: "Murat Güven",
    salesRepPhone: "0533 111 22 33",
    salesRepEmail: "murat@dentlab.com",
    technician: "Kemal Usta",
    technicianPhone: "0535 999 88 77",
    technicianEmail: "kemal@dentlab.com",
    notes: "5 üye zirkon kron ve 2 adet e-max abutment teslimatı karşılığı laboratuvar faturası.",
  },
  {
    id: "4",
    patientName: "Deniz Yılmaz",
    type: "Gelir",
    category: "Kompozit Dolgu",
    method: "Kredi Kartı",
    amount: 1200,
    date: "20.11.2026",
    dentist: "Dr. Selin Yılmaz",
  },
  {
    id: "5",
    patientName: "Meda Dental Depo",
    type: "Gider",
    category: "Anestezi & İğne Uçları",
    method: "Kredi Kartı",
    amount: 3750,
    date: "19.11.2026",
    dentist: "Klinik Gideri",
    invoiceNo: "MD-99104",
    taxRate: 10,
    accountType: "Cari Hesap",
    currency: "TRY",
    taxOffice: "Marmara V.D.",
    taxNumber: "6190284712",
    contactPerson: "Seda Akman",
    phone: "0542 333 44 55",
    email: "siparis@medadental.com",
    city: "İstanbul",
    district: "Şişli",
    address: "Halaskargazi Cad. No: 88 Şişli / İstanbul",
    workingConditions: "Peşin",
    status: "Ödendi",
    notes: "10 kutu Septanest anestezi ve muhtelif uçlar.",
  },
  {
    id: "6",
    patientName: "Elif Karaca",
    type: "Gelir",
    category: "Gömülü 20'lik Çekim",
    method: "Nakit",
    amount: 1850,
    date: "19.11.2026",
    dentist: "Dr. Mahir Açıkkalın",
  },
  {
    id: "7",
    patientName: "Klinik Kira & Aidat",
    type: "Gider",
    category: "Gayrimenkul Kirası",
    method: "Havale/EFT",
    amount: 25000,
    date: "15.11.2026",
    dentist: "Klinik Gideri",
    invoiceNo: "KIRA-2026-11",
    taxRate: 20,
    accountType: "Banka Hesabı",
    currency: "TRY",
    contactPerson: "Mülk Sahibi",
    phone: "0533 444 55 66",
    email: "kira@dentclinic.com",
    city: "İstanbul",
    district: "Kadıköy",
    address: "Fahrettin Kerim Gökay Cad. No: 44 Kadıköy",
    workingConditions: "Aylık",
    status: "Ödendi",
    notes: "Kasım 2026 klinik ana kat kira bedeli.",
  },
  {
    id: "8",
    patientName: "Ayşe Demir",
    type: "Gelir",
    category: "Zirkonyum Kaplama Ön Ödeme",
    method: "Kredi Kartı",
    amount: 13000,
    date: "14.11.2026",
    dentist: "Dr. Selin Yılmaz",
  },
];

export default function FinansPage() {
  const { showToast, openPrintPreview } = useModal();
  const [activeTab, setActiveTab] = useState<"gider-karti" | "hareketler">("gider-karti");
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);

  // Tab 2 Filters
  const [filterMethod, setFilterMethod] = useState("Tümü");
  const [filterType, setFilterType] = useState("Tümü");
  const [search, setSearch] = useState("");

  // Edit / Active State for Gider Kartı Form
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Hesap Bilgileri Form States
  const [companyName, setCompanyName] = useState("DentLab Protez Ltd.");
  const [invoiceNo, setInvoiceNo] = useState("FT-2026-0842");
  const [expenseType, setExpenseType] = useState("Laboratuvar & Protez");
  const [expenseDate, setExpenseDate] = useState("2026-11-20");
  const [amount, setAmount] = useState<string>("6200");
  const [taxRate, setTaxRate] = useState<number>(20);
  const [accountType, setAccountType] = useState("Cari Hesap");
  const [currency, setCurrency] = useState("TRY");
  const [taxOffice, setTaxOffice] = useState("Kadıköy V.D.");
  const [taxNumber, setTaxNumber] = useState("2849102948");

  // 2. İletişim Bilgileri Form States
  const [contactPerson, setContactPerson] = useState("Ahmet Yılmaz");
  const [phone, setPhone] = useState("0532 555 10 20");
  const [landlinePhone, setLandlinePhone] = useState("0216 444 30 20");
  const [email, setEmail] = useState("muhasebe@dentlab.com");
  const [country, setCountry] = useState("TÜRKİYE");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("Kadıköy");
  const [postalCode, setPostalCode] = useState("34710");
  const [address, setAddress] = useState("Bağdat Cad. No: 142/5 Kadıköy / İstanbul");

  // 3. Diğer Bilgiler Form States
  const [workingConditions, setWorkingConditions] = useState("30 Gün Vade");
  const [paymentMethod, setPaymentMethod] = useState<"Kredi Kartı" | "Nakit" | "Havale/EFT">("Havale/EFT");
  const [status, setStatus] = useState<"Ödendi" | "Bekliyor" | "Taksitli" | "İptal">("Ödendi");
  const [salesRep, setSalesRep] = useState("Murat Güven");
  const [salesRepPhone, setSalesRepPhone] = useState("0533 111 22 33");
  const [salesRepEmail, setSalesRepEmail] = useState("murat@dentlab.com");
  const [technician, setTechnician] = useState("Kemal Usta");
  const [technicianPhone, setTechnicianPhone] = useState("0535 999 88 77");
  const [technicianEmail, setTechnicianEmail] = useState("kemal@dentlab.com");
  const [notes, setNotes] = useState("5 üye zirkon kron ve 2 adet e-max abutment teslimatı karşılığı laboratuvar faturası.");

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

  // Reset Form to Blank (or new)
  const handleResetForm = () => {
    setEditingId(null);
    setCompanyName("");
    setInvoiceNo("");
    setExpenseType("Laboratuvar & Protez");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setAmount("");
    setTaxRate(20);
    setAccountType("Cari Hesap");
    setCurrency("TRY");
    setTaxOffice("");
    setTaxNumber("");
    setContactPerson("");
    setPhone("");
    setLandlinePhone("");
    setEmail("");
    setCountry("TÜRKİYE");
    setCity("İstanbul");
    setDistrict("");
    setPostalCode("");
    setAddress("");
    setWorkingConditions("Peşin");
    setPaymentMethod("Havale/EFT");
    setStatus("Ödendi");
    setSalesRep("");
    setSalesRepPhone("");
    setSalesRepEmail("");
    setTechnician("");
    setTechnicianPhone("");
    setTechnicianEmail("");
    setNotes("");
    showToast("Gider kartı formu yeni kayıt için temizlendi.", "info");
  };

  // Load an existing transaction into the Gider Kartı Form
  const handleLoadTransactionToForm = (t: Transaction) => {
    setEditingId(t.id);
    setCompanyName(t.patientName);
    setInvoiceNo(t.invoiceNo || `FT-${t.id.slice(-4)}`);
    setExpenseType(t.category);
    setExpenseDate(t.date.includes(".") ? t.date.split(".").reverse().join("-") : t.date);
    setAmount(String(t.amount));
    setTaxRate(t.taxRate || 20);
    setAccountType(t.accountType || "Cari Hesap");
    setCurrency(t.currency || "TRY");
    setTaxOffice(t.taxOffice || "Kadıköy V.D.");
    setTaxNumber(t.taxNumber || "");
    setContactPerson(t.contactPerson || "");
    setPhone(t.phone || "");
    setLandlinePhone(t.landlinePhone || "");
    setEmail(t.email || "");
    setCountry(t.country || "TÜRKİYE");
    setCity(t.city || "İstanbul");
    setDistrict(t.district || "");
    setPostalCode(t.postalCode || "");
    setAddress(t.address || "");
    setWorkingConditions(t.workingConditions || "30 Gün Vade");
    setPaymentMethod(t.method);
    setStatus(t.status || "Ödendi");
    setSalesRep(t.salesRep || "");
    setSalesRepPhone(t.salesRepPhone || "");
    setSalesRepEmail(t.salesRepEmail || "");
    setTechnician(t.technician || "");
    setTechnicianPhone(t.technicianPhone || "");
    setTechnicianEmail(t.technicianEmail || "");
    setNotes(t.notes || "");

    setActiveTab("gider-karti");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`"${t.patientName}" gider kartı düzenleme modunda açıldı.`, "info");
  };

  // Submit / Save Gider Kartı Form
  const handleSaveGiderKarti = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!companyName.trim()) {
      showToast("Lütfen firma adını giriniz.", "error");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast("Lütfen geçerli bir tutar giriniz.", "error");
      return;
    }

    const formattedDate = expenseDate.includes("-")
      ? expenseDate.split("-").reverse().join(".")
      : expenseDate;

    if (editingId) {
      // Update
      const updated = transactions.map((t) =>
        t.id === editingId
          ? {
              ...t,
              patientName: companyName.trim(),
              type: "Gider" as const,
              category: expenseType,
              method: paymentMethod,
              amount: numAmount,
              date: formattedDate,
              dentist: "Klinik Gideri",
              invoiceNo,
              taxRate,
              accountType,
              currency,
              taxOffice,
              taxNumber,
              contactPerson,
              phone,
              landlinePhone,
              email,
              country,
              city,
              district,
              postalCode,
              address,
              workingConditions,
              status,
              salesRep,
              salesRepPhone,
              salesRepEmail,
              technician,
              technicianPhone,
              technicianEmail,
              notes,
            }
          : t
      );
      saveToStorage(updated);
      showToast(`✓ Gider kartı güncellendi: ${formatCurrency(numAmount)} ₺`, "success");
    } else {
      // Create new
      const newItem: Transaction = {
        id: String(Date.now()),
        patientName: companyName.trim(),
        type: "Gider",
        category: expenseType,
        method: paymentMethod,
        amount: numAmount,
        date: formattedDate,
        dentist: "Klinik Gideri",
        invoiceNo: invoiceNo || `FT-${Date.now().toString().slice(-4)}`,
        taxRate,
        accountType,
        currency,
        taxOffice,
        taxNumber,
        contactPerson,
        phone,
        landlinePhone,
        email,
        country,
        city,
        district,
        postalCode,
        address,
        workingConditions,
        status,
        salesRep,
        salesRepPhone,
        salesRepEmail,
        technician,
        technicianPhone,
        technicianEmail,
        notes,
      };
      saveToStorage([newItem, ...transactions]);
      setEditingId(newItem.id);
      showToast(`✓ Yeni gider kartı kaydedildi: ${formatCurrency(numAmount)} ₺`, "success");
    }
  };

  // Print Gider Kartı
  const handlePrintGiderKarti = () => {
    const numAmount = parseFloat(amount) || 0;
    openPrintPreview({
      type: "invoice",
      title: `Gider Kartı & Fatura Belgesi — ${invoiceNo || "FT-2026"}`,
      patientName: companyName || "Tedarikçi Firma",
      date: expenseDate,
      doctorName: contactPerson || "Klinik Yönetimi",
      total: numAmount,
      items: [
        {
          name: `${expenseType || "Gider Kalemi"} (${invoiceNo || "Fatura"})`,
          detail: `KDV Oranı: %${taxRate} • Ödeme: ${paymentMethod} • Durum: ${status}`,
          price: `${formatCurrency(numAmount)} ₺`,
        },
      ],
      extraInfo: {
        "Firma Adı": companyName || "-",
        "Fatura No": invoiceNo || "-",
        "Masraf Türü": expenseType || "-",
        "Vergi Bilgisi": `${taxOffice || "-"} / ${taxNumber || "-"}`,
        "Yetkili Kişi": `${contactPerson || "-"} (${phone || "-"})`,
        "E-posta": email || "-",
        "Ödeme Şekli": paymentMethod,
        "İşlem Durumu": status,
        "Vade / Koşul": workingConditions,
        "Açık Adres": address || "-",
        "Açıklama": notes || "-",
      },
    });
  };

  // Print Kasa Özeti (Tab 2)
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

  const confirmDelete = () => {
    if (!transactionToDelete) return;
    const target = transactionToDelete;
    const updated = transactions.filter((t) => t.id !== transactionToDelete.id);
    saveToStorage(updated);
    if (editingId === target.id) {
      handleResetForm();
    }
    setTransactionToDelete(null);
    showToast(`✓ ${formatCurrency(target.amount)} ₺ tutarındaki kayıt silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveToStorage(defaultTransactions);
    showToast("✓ Finans kayıtları varsayılana sıfırlandı.", "info");
  };

  // Calculations for Tab 2
  const filtered = transactions.filter((t) => {
    if (filterMethod !== "Tümü" && t.method !== filterMethod) return false;
    if (filterType !== "Tümü" && t.type !== filterType) return false;
    if (
      search.trim() &&
      !t.patientName.toLowerCase().includes(search.toLowerCase()) &&
      !t.category.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalGelir = transactions.filter((t) => t.type === "Gelir").reduce((sum, t) => sum + t.amount, 0);
  const totalGider = transactions.filter((t) => t.type === "Gider").reduce((sum, t) => sum + t.amount, 0);
  const netKasa = totalGelir - totalGider;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <BannerHeader
        title={activeTab === "gider-karti" ? "Gider Kartı" : "Finans & Kasa Yönetimi"}
        description={
          activeTab === "gider-karti"
            ? "Klinik gider bilgilerini kaydedin ve yönetin."
            : "Klinik gelirleri, giderleri, tahsilat makbuzları, kasa hareketleri ve gün sonu raporlama."
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Finans", href: "#" },
          { label: activeTab === "gider-karti" ? "Gider Kartı" : "Gider Hareketleri & Rapor" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "gider-karti" ? (
              <>
                <button
                  type="button"
                  onClick={handlePrintGiderKarti}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-[#5F665F]" />
                  Gider Kartı Yazdır
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hareketler")}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] hover:bg-[#EEEBE4] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
                >
                  <Receipt className="h-4 w-4 text-[#5F665F]" />
                  Hareketleri Gör ({transactions.length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePrintSummary}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-[#5F665F]" />
                  Kasa Raporu Yazdır
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab("gider-karti");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  + Yeni Gider Kartı
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E1D8] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("gider-karti")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "gider-karti"
                ? "bg-[#1F3327] text-white shadow-xs"
                : "bg-[#FBFAF7] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] border border-[#E6E1D8]"
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span>Gider Kartı (Yeni / Düzenle)</span>
            {editingId && (
              <span className="rounded-full bg-[#E2EEDD] text-[#2C6A3B] text-[10px] px-2 py-0.5 font-bold">
                Düzenleniyor
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hareketler")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "hareketler"
                ? "bg-[#1F3327] text-white shadow-xs"
                : "bg-[#FBFAF7] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] border border-[#E6E1D8]"
            )}
          >
            <Receipt className="h-4 w-4" />
            <span>Gider Hareketleri & Rapor</span>
            <span className="rounded-full bg-[#EEEBE4] text-[#1C211E] text-[10px] px-2 py-0.5 font-bold">
              {transactions.length}
            </span>
          </button>
        </div>

        {activeTab === "gider-karti" && editingId && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5F665F]">
              Kayıt Düzenleniyor (ID: #{editingId.slice(-4)})
            </span>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-semibold text-[#B3261E] hover:underline cursor-pointer"
            >
              Yeni Kayda Geç
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: GİDER KARTI (Figma node 7:5147 - 3 Kartlık Form)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "gider-karti" && (
        <form onSubmit={handleSaveGiderKarti} className="flex flex-col gap-6">
          {/* KART 1: Hesap Bilgileri */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E]">
                    1. Hesap Bilgileri
                  </h3>
                  <p className="text-xs text-[#5F665F]">
                    Firma, fatura ve gider maliyet tanımları
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#5F665F] bg-[#EEEBE4] px-2.5 py-1 rounded-lg">
                Firma & Vergi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Firma Adı (Ad) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Firma / Tedarikçi Adı <span className="text-[#B3261E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Örn: DentLab Protez Ltd."
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Fatura No (Hesap No) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Fatura No / Belge No
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="Örn: FT-2026-0842"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Masraf Türü (Hesap Tipi) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Masraf Türü
                </label>
                <select
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="Laboratuvar & Protez">Laboratuvar & Protez</option>
                  <option value="Anestezi & İğne Uçları">Anestezi & İğne Uçları</option>
                  <option value="Zirkonyum Laboratuvar Faturası">Zirkonyum Laboratuvar Faturası</option>
                  <option value="Tıbbi Sarf Malzeme">Tıbbi Sarf Malzeme</option>
                  <option value="Cihaz & Ekipman Bakımı">Cihaz & Ekipman Bakımı</option>
                  <option value="Gayrimenkul Kirası">Gayrimenkul Kirası & Aidat</option>
                  <option value="Elektrik, Su & Doğalgaz">Elektrik, Su & Doğalgaz</option>
                  <option value="Personel & Maaş">Personel & Maaş</option>
                  <option value="Klinik Genel Gideri">Klinik Genel Gideri</option>
                  <option value="Yazılım & Lisans">Yazılım & Lisans</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              {/* Tarih */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Fatura / İşlem Tarihi
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Tutar */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Toplam Tutar (₺) <span className="text-[#B3261E]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white pl-3.5 pr-8 text-sm font-semibold text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5F665F]">
                    ₺
                  </span>
                </div>
              </div>

              {/* KDV Oranı */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  KDV Oranı (%)
                </label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value={0}>%0 (Muaf / İstisna)</option>
                  <option value={1}>%1 (Özel Tıbbi)</option>
                  <option value={10}>%10 (Tıbbi Sarf & İlaç)</option>
                  <option value={20}>%20 (Standart KDV)</option>
                </select>
              </div>

              {/* Hesap Tipi (Cari / Kasa / Banka) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Hesap Tipi
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="Cari Hesap">Cari Hesap</option>
                  <option value="Kasa (Nakit)">Kasa (Nakit)</option>
                  <option value="Banka Hesabı">Banka Hesabı</option>
                  <option value="Kredi Kartı">Kurumsal Kredi Kartı</option>
                </select>
              </div>

              {/* Para Birimi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Para Birimi
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="TRY">Türk Lirası (TRY)</option>
                  <option value="USD">Amerikan Doları (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              {/* Vergi Dairesi & Numarası */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Vergi Dairesi / No
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={taxOffice}
                    onChange={(e) => setTaxOffice(e.target.value)}
                    placeholder="Kadıköy V.D."
                    className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3 text-xs text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                  />
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    placeholder="Vergi No"
                    className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3 text-xs text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KART 2: İletişim Bilgileri */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E]">
                    2. İletişim Bilgileri
                  </h3>
                  <p className="text-xs text-[#5F665F]">
                    Tedarikçi yetkili ve adres iletişim kanalları
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#5F665F] bg-[#EEEBE4] px-2.5 py-1 rounded-lg">
                İletişim & Lokasyon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Yetkili */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Yetkili Ad Soyad
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Cep Telefonu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Cep Telefonu
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0532 XXX XX XX"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Sabit Telefon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Sabit Telefon
                </label>
                <input
                  type="text"
                  value={landlinePhone}
                  onChange={(e) => setLandlinePhone(e.target.value)}
                  placeholder="0216 XXX XX XX"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* E-posta */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="muhasebe@tedarikci.com"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>

              {/* Ülke */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Ülke
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                />
              </div>

              {/* Şehir */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Şehir
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Kocaeli">Kocaeli</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              {/* İlçe */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  İlçe
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Kadıköy"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                />
              </div>

              {/* Posta Kodu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="34710"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327]"
                />
              </div>

              {/* Adres (Tam Satır) */}
              <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Firma / Fatura Açık Adresi
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Fatura ve teslimat adresi..."
                  className="w-full rounded-xl border border-[#E6E1D8] bg-white p-3 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                />
              </div>
            </div>
          </div>

          {/* KART 3: Diğer Bilgiler */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E]">
                    3. Diğer Bilgiler
                  </h3>
                  <p className="text-xs text-[#5F665F]">
                    Ödeme koşulları, görevliler ve klinik açıklamaları
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#5F665F] bg-[#EEEBE4] px-2.5 py-1 rounded-lg">
                Koşullar & Notlar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {/* Çalışma Koşulları */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Çalışma Koşulları (Vade)
                </label>
                <select
                  value={workingConditions}
                  onChange={(e) => setWorkingConditions(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="Peşin">Peşin Ödeme</option>
                  <option value="15 Gün Vade">15 Gün Vade</option>
                  <option value="30 Gün Vade">30 Gün Vade</option>
                  <option value="60 Gün Vade">60 Gün Vade</option>
                  <option value="Konsinye">Konsinye Malzeme</option>
                </select>
              </div>

              {/* Ödeme Şekli */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Ödeme Şekli
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="Havale/EFT">Havale / EFT</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Nakit">Nakit Ödeme</option>
                </select>
              </div>

              {/* Durum */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  Ödeme Durumu
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                >
                  <option value="Ödendi">Ödendi (Kapalı)</option>
                  <option value="Bekliyor">Ödeme Bekliyor</option>
                  <option value="Taksitli">Taksitli Plan</option>
                  <option value="İptal">İptal Edildi</option>
                </select>
              </div>
            </div>

            {/* Görevli Personel Bilgileri Tablosu */}
            <div className="mt-4 rounded-xl border border-[#E6E1D8] bg-white p-4">
              <span className="text-xs font-bold text-[#1C211E] mb-3 block">
                İlgili Kişiler & Görevliler
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Yetkili */}
                <div className="rounded-lg bg-[#FBFAF7] p-3 border border-[#E6E1D8]">
                  <span className="font-semibold text-[#2F5A3D] block mb-2">
                    Firma Yetkilisi
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Ad Soyad"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Cep Telefonu"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                  </div>
                </div>

                {/* Plasiyer */}
                <div className="rounded-lg bg-[#FBFAF7] p-3 border border-[#E6E1D8]">
                  <span className="font-semibold text-[#2F5A3D] block mb-2">
                    Plasiyer / Müşteri Temsilcisi
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      value={salesRep}
                      onChange={(e) => setSalesRep(e.target.value)}
                      placeholder="Ad Soyad"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={salesRepPhone}
                      onChange={(e) => setSalesRepPhone(e.target.value)}
                      placeholder="Cep Telefonu"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={salesRepEmail}
                      onChange={(e) => setSalesRepEmail(e.target.value)}
                      placeholder="E-posta"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                  </div>
                </div>

                {/* Teknisyen */}
                <div className="rounded-lg bg-[#FBFAF7] p-3 border border-[#E6E1D8]">
                  <span className="font-semibold text-[#2F5A3D] block mb-2">
                    Laboratuvar Teknisyeni
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      placeholder="Ad Soyad"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={technicianPhone}
                      onChange={(e) => setTechnicianPhone(e.target.value)}
                      placeholder="Cep Telefonu"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                    <input
                      type="text"
                      value={technicianEmail}
                      onChange={(e) => setTechnicianEmail(e.target.value)}
                      placeholder="E-posta"
                      className="rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#5F665F]">
                Klinik Açıklama & Fatura Notları
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gider kalemi, sipariş veya teslimatla ilgili ek açıklamalar..."
                className="w-full rounded-xl border border-[#E6E1D8] bg-white p-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
              />
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FBFAF7] p-4 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-[#5F665F]" />
                Formu Temizle / Yeni
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab("hareketler");
                  }}
                  className="rounded-xl border border-[#E6E1D8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#5F665F] hover:text-[#1C211E] transition-colors cursor-pointer"
                >
                  Düzenlemeyi Kapat
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintGiderKarti}
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#5F665F]" />
                Kartı Yazdır
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4" />
                {editingId ? "Gider Kartını Güncelle" : "Gider Kartını Kaydet"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: GİDER HAREKETLERİ & RAPOR (Mevcut Finansal Akış)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "hareketler" && (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net Kasa */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1F3327] to-[#121815] p-5 text-white shadow-sm border border-[#1F3327]/50">
              <span className="text-xs font-medium text-[#C9DDC3]">Net Günlük Kasa</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight">
                  {formatCurrency(netKasa)} ₺
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-[#E2EEDD] bg-[#2D3A32] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +%14
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#C9DDC3]/80">Tüm nakit ve kart akışı dahil</p>
            </div>

            {/* Toplam Gelir */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
              <span className="text-xs font-medium text-[#5F665F]">Toplam Tahsilat</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#2C6A3B]">
                  +{formatCurrency(totalGelir)} ₺
                </span>
                <span className="text-xs font-semibold text-[#2C6A3B] bg-[#E2EEDD] px-2 py-0.5 rounded-full">
                  Gelir
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F]">Hasta ödemeleri & POS akışı</p>
            </div>

            {/* Toplam Gider */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
              <span className="text-xs font-medium text-[#5F665F]">Klinik Giderleri</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#B3261E]">
                  -{formatCurrency(totalGider)} ₺
                </span>
                <span className="text-xs font-semibold text-[#B3261E] bg-[#FBE9E7] px-2 py-0.5 rounded-full">
                  Gider
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F]">Laboratuvar & malzeme alımları</p>
            </div>

            {/* Bekleyen Alacaklar */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8]">
              <span className="text-xs font-medium text-[#5F665F]">Bekleyen Alacaklar</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#7A5320]">
                  42.600 ₺
                </span>
                <span className="text-xs font-semibold text-[#7A5320] bg-[#F3EADB] px-2 py-0.5 rounded-full">
                  Taksitli
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F]">Tamamlanacak tedavilerden</p>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FBFAF7] p-4 border border-[#E6E1D8] shadow-xs">
            <div className="flex items-center gap-2">
              {["Tümü", "Gelir", "Gider"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    filterType === t
                      ? "bg-[#1F3327] text-white shadow-2xs"
                      : "bg-[#EEEBE4] text-[#5F665F] hover:bg-[#E6E1D8] hover:text-[#1C211E]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Method filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-[#5F665F]" />
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="rounded-xl border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none focus:border-[#1F3327]"
                >
                  <option value="Tümü">Tüm Ödeme Yöntemleri</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Havale/EFT">Havale / EFT</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5F665F]" />
                <input
                  type="text"
                  placeholder="Kayıt veya firma ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 sm:w-60 rounded-xl border border-[#E6E1D8] bg-white pl-8 pr-3 text-xs text-[#1C211E] outline-none placeholder:text-[#5F665F]/60 focus:border-[#1F3327]"
                />
              </div>

              {/* Reset to defaults */}
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer"
                title="Varsayılan Verileri Geri Yükle"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-[#FBFAF7] border border-[#E6E1D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EEEBE4] border-b border-[#E6E1D8] text-[#5F665F] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tarih</th>
                    <th className="py-3 px-4">Açıklama / Kişi / Firma</th>
                    <th className="py-3 px-4">Tür</th>
                    <th className="py-3 px-4">Kategori / Masraf Türü</th>
                    <th className="py-3 px-4">Ödeme Yöntemi</th>
                    <th className="py-3 px-4">Sorumlu / Hekim</th>
                    <th className="py-3 px-4 text-right">Tutar</th>
                    <th className="py-3 px-4 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#5F665F]">
                        Filtrelere uygun kayıt bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-[#F3F0EA]/70 transition-colors group cursor-default"
                      >
                        <td className="py-3 px-4 font-mono text-[#5F665F] whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1C211E]">
                              {t.patientName}
                            </span>
                            {t.invoiceNo && (
                              <span className="text-[10px] text-[#5F665F] font-mono">
                                Fatura: {t.invoiceNo}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                              t.type === "Gelir"
                                ? "bg-[#E2EEDD] text-[#2C6A3B]"
                                : "bg-[#FBE9E7] text-[#B3261E]"
                            )}
                          >
                            {t.type === "Gelir" ? "+ Gelir" : "- Gider"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#1C211E] font-medium">
                          {t.category}
                        </td>
                        <td className="py-3 px-4 text-[#5F665F] whitespace-nowrap">
                          {t.method}
                        </td>
                        <td className="py-3 px-4 text-[#5F665F] whitespace-nowrap">
                          {t.dentist}
                        </td>
                        <td
                          className={cn(
                            "py-3 px-4 text-right font-mono font-bold whitespace-nowrap text-sm",
                            t.type === "Gelir" ? "text-[#2C6A3B]" : "text-[#B3261E]"
                          )}
                        >
                          {t.type === "Gelir" ? "+" : "-"}
                          {formatCurrency(t.amount)} ₺
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleLoadTransactionToForm(t)}
                              className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer"
                              title="Gider Kartında Düzenle"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setTransactionToDelete(t)}
                              className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#FBE9E7] hover:text-[#B3261E] transition-colors cursor-pointer"
                              title="Kaydı Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#FBFAF7] p-6 shadow-xl border border-[#E6E1D8]">
            <div className="flex items-center gap-3 text-[#B3261E] mb-3">
              <div className="rounded-xl bg-[#FBE9E7] p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C211E]">
                  Kayıt Silinecek
                </h3>
                <p className="text-xs text-[#5F665F]">
                  Bu işlem finansal raporlardan bu kaydı kaldırır.
                </p>
              </div>
            </div>

            <div className="my-4 rounded-xl bg-white p-3.5 border border-[#E6E1D8] text-xs">
              <p className="font-semibold text-[#1C211E]">
                {transactionToDelete.patientName}
              </p>
              <p className="text-[#5F665F] mt-1">
                {transactionToDelete.category} • {transactionToDelete.date}
              </p>
              <p
                className={cn(
                  "font-mono font-bold mt-2 text-sm",
                  transactionToDelete.type === "Gelir"
                    ? "text-[#2C6A3B]"
                    : "text-[#B3261E]"
                )}
              >
                {transactionToDelete.type === "Gelir" ? "+" : "-"}
                {formatCurrency(transactionToDelete.amount)} ₺
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTransactionToDelete(null)}
                className="rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2 text-xs font-semibold text-[#1C211E] transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[#B3261E] hover:bg-[#9B1C1C] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
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
