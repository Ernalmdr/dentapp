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
  Boxes,
  Barcode,
  Printer,
  Calendar,
  Layers,
  Tag,
  Check,
  ChevronRight,
  Warehouse,
  Coins,
  ArrowUpDown,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import { formatCurrency, cn } from "@/lib/utils";

export interface UnitConversion {
  purchaseUnit: string;
  usageUnit: string;
  multiplier: number;
}

export interface StockItem {
  id: string;
  // 1. Ürün / Malzeme Bilgileri
  name: string;
  category: "Restoratif" | "Anestezi" | "Endodonti" | "Sarf Malzeme" | "Protez" | "Cerrahi";
  barcode: string;
  brand: string;
  trackingType: "Normal" | "Seri No Takibi" | "Parti / Lot Takibi";
  itemType: "Sarf Malzeme" | "Tıbbi Cihaz" | "İlaç & Anestezi" | "El Aleti & Cerrahi" | "Laboratuvar Malzemesi";
  consumptionType: "Normal" | "Hızlı Tüketim" | "Tedavi Başına";

  // 2. Stok & Fiyatlama
  quantity: number;
  unit: string;
  minThreshold: number;
  status: "Normal" | "Kritik";
  purchasePrice: number;
  taxRate: number;
  currency: string;
  usageUnit: string;
  usagePrice: number;

  // 3. Tedarikçi & Depo
  supplier: string;
  shelfLocation: string;
  expiryDate?: string;
  altBarcode?: string;
  notes?: string;
  unitConversions?: UnitConversion[];
}

const defaultStock: StockItem[] = [
  {
    id: "1",
    name: "Aeratör Sterilizasyon Başlığı",
    category: "Cerrahi",
    barcode: "DNTS-309",
    brand: "W&H Dental",
    trackingType: "Normal",
    itemType: "El Aleti & Cerrahi",
    consumptionType: "Normal",
    quantity: 12,
    unit: "Adet",
    minThreshold: 5,
    status: "Normal",
    purchasePrice: 1450,
    taxRate: 20,
    currency: "TRY",
    usageUnit: "Adet",
    usagePrice: 1450,
    supplier: "Meda Dental Deposu",
    shelfLocation: "Dolap A-1 (Steril Oda)",
    expiryDate: "2028-12-31",
    altBarcode: "869012398412",
    notes: "Otomatik otoklav sterilizasyonu için uygun titanyum başlık.",
    unitConversions: [
      { purchaseUnit: "Kutu", usageUnit: "Adet", multiplier: 1 },
      { purchaseUnit: "Adet", usageUnit: "Adet", multiplier: 1 },
    ],
  },
  {
    id: "2",
    name: "3M Filtek Z250 Kompozit Dolgu (A2)",
    category: "Restoratif",
    barcode: "3M-FLT-Z250",
    brand: "3M ESPE",
    trackingType: "Parti / Lot Takibi",
    itemType: "Sarf Malzeme",
    consumptionType: "Normal",
    quantity: 2,
    unit: "Tüp",
    minThreshold: 5,
    status: "Kritik",
    purchasePrice: 650,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "gr",
    usagePrice: 162.5,
    supplier: "Meda Dental Deposu",
    shelfLocation: "Dolap A-2",
    expiryDate: "2027-06-30",
    notes: "Universal hibrit kompozit dolgu maddesi, A2 rengi.",
    unitConversions: [
      { purchaseUnit: "Tüp", usageUnit: "gr", multiplier: 4 },
      { purchaseUnit: "Kutu", usageUnit: "Tüp", multiplier: 5 },
    ],
  },
  {
    id: "3",
    name: "Septanest %4 Adrenalinli Anestezi (1/100.000)",
    category: "Anestezi",
    barcode: "SPT-4AD-100",
    brand: "Septodont",
    trackingType: "Parti / Lot Takibi",
    itemType: "İlaç & Anestezi",
    consumptionType: "Hızlı Tüketim",
    quantity: 14,
    unit: "Kutu",
    minThreshold: 10,
    status: "Normal",
    purchasePrice: 920,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Karpül",
    usagePrice: 18.4,
    supplier: "Dentasya Ecza",
    shelfLocation: "Soğuk Dolap 1",
    expiryDate: "2027-10-15",
    notes: "Artikain hidroklorür + epinefrin içeren dental anestezi karpülü.",
    unitConversions: [
      { purchaseUnit: "Kutu", usageUnit: "Karpül", multiplier: 50 },
    ],
  },
  {
    id: "4",
    name: "ProTaper Next Kanal Eğesi (X1-X3 25mm)",
    category: "Endodonti",
    barcode: "PTN-X13-25",
    brand: "Dentsply Sirona",
    trackingType: "Normal",
    itemType: "Sarf Malzeme",
    consumptionType: "Normal",
    quantity: 3,
    unit: "Set",
    minThreshold: 6,
    status: "Kritik",
    purchasePrice: 1350,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Set",
    usagePrice: 1350,
    supplier: "DentLab Dental",
    shelfLocation: "Dolap B-4",
    expiryDate: "2029-01-01",
    notes: "Döner alet sistemi M-Wire nikel titanyum kanal eğesi seti.",
    unitConversions: [
      { purchaseUnit: "Paket", usageUnit: "Set", multiplier: 3 },
    ],
  },
  {
    id: "5",
    name: "Nitril Muayene Eldiveni (M - Pudrasız)",
    category: "Sarf Malzeme",
    barcode: "GLV-NIT-M100",
    brand: "Beybi Medical",
    trackingType: "Normal",
    itemType: "Sarf Malzeme",
    consumptionType: "Hızlı Tüketim",
    quantity: 45,
    unit: "Kutu",
    minThreshold: 20,
    status: "Normal",
    purchasePrice: 195,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Adet",
    usagePrice: 1.95,
    supplier: "Güler Medikal",
    shelfLocation: "Depo Raf 3",
    expiryDate: "2028-05-20",
    notes: "Mavi renkli pudrasız medikal nitril muayene eldiveni 100'lük.",
    unitConversions: [
      { purchaseUnit: "Kutu", usageUnit: "Adet", multiplier: 100 },
      { purchaseUnit: "Koli", usageUnit: "Kutu", multiplier: 10 },
    ],
  },
  {
    id: "6",
    name: "C-Silikon Ölçü Maddesi (Zetaplus)",
    category: "Protez",
    barcode: "ZTP-SIL-900",
    brand: "Zhermack",
    trackingType: "Normal",
    itemType: "Sarf Malzeme",
    consumptionType: "Normal",
    quantity: 8,
    unit: "Kutu",
    minThreshold: 5,
    status: "Normal",
    purchasePrice: 880,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Kutu",
    usagePrice: 880,
    supplier: "OMS Dental",
    shelfLocation: "Dolap C-1",
    expiryDate: "2027-09-01",
    notes: "Kondansasyon esaslı hassas silikon ölçü malzemesi başlangıç kiti.",
  },
  {
    id: "7",
    name: "Cerrahi Dikiş İpi (4-0 İpek Keskin İğne)",
    category: "Cerrahi",
    barcode: "ST-SLK-40",
    brand: "Doğsan",
    trackingType: "Parti / Lot Takibi",
    itemType: "Sarf Malzeme",
    consumptionType: "Normal",
    quantity: 4,
    unit: "Kutu",
    minThreshold: 10,
    status: "Kritik",
    purchasePrice: 340,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Adet",
    usagePrice: 28.3,
    supplier: "Güler Medikal",
    shelfLocation: "Cerrahi Seti Rafı",
    expiryDate: "2028-04-10",
    notes: "Ağız içi cerrahi dikiş için 12'lik steril tek kullanımlık paket.",
    unitConversions: [
      { purchaseUnit: "Kutu", usageUnit: "Adet", multiplier: 12 },
    ],
  },
  {
    id: "8",
    name: "Kavron Geçici Dolgu Simanı (Kavur)",
    category: "Restoratif",
    barcode: "KVR-SMP-30",
    brand: "GC Dental",
    trackingType: "Normal",
    itemType: "Sarf Malzeme",
    consumptionType: "Normal",
    quantity: 6,
    unit: "Kavanoz",
    minThreshold: 4,
    status: "Normal",
    purchasePrice: 290,
    taxRate: 10,
    currency: "TRY",
    usageUnit: "Kavanoz",
    usagePrice: 290,
    supplier: "Meda Dental Deposu",
    shelfLocation: "Dolap A-1",
    expiryDate: "2027-11-20",
    notes: "Nem ile sertleşen hazır pembe geçici dolgu materyali.",
  },
];

export default function StokPage() {
  const { showToast, openStockOrderModal, openPrintPreview } = useModal();
  const [activeTab, setActiveTab] = useState<"stok-karti" | "liste">("stok-karti");
  const [items, setItems] = useState<StockItem[]>(defaultStock);

  // Tab 2 Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [statusFilter, setStatusFilter] = useState<"Tümü" | "Kritik" | "Normal">("Tümü");

  // Edit / Form State for Stok Kartı Form
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Ürün / Malzeme Bilgileri
  const [name, setName] = useState("Aeratör Sterilizasyon Başlığı");
  const [barcode, setBarcode] = useState("DNTS-309");
  const [category, setCategory] = useState<StockItem["category"]>("Cerrahi");
  const [brand, setBrand] = useState("W&H Dental");
  const [trackingType, setTrackingType] = useState<StockItem["trackingType"]>("Normal");
  const [itemType, setItemType] = useState<StockItem["itemType"]>("El Aleti & Cerrahi");
  const [consumptionType, setConsumptionType] = useState<StockItem["consumptionType"]>("Normal");

  // 2. Stok & Fiyatlama
  const [quantity, setQuantity] = useState<string>("12");
  const [unit, setUnit] = useState("Adet");
  const [minThreshold, setMinThreshold] = useState<string>("5");
  const [purchasePrice, setPurchasePrice] = useState<string>("1450");
  const [taxRate, setTaxRate] = useState<number>(20);
  const [currency, setCurrency] = useState("TRY");
  const [usageUnit, setUsageUnit] = useState("Adet");
  const [usagePrice, setUsagePrice] = useState<string>("1450");

  // 3. Tedarikçi & Depo
  const [supplier, setSupplier] = useState("Meda Dental Deposu");
  const [shelfLocation, setShelfLocation] = useState("Dolap A-1 (Steril Oda)");
  const [expiryDate, setExpiryDate] = useState("2028-12-31");
  const [altBarcode, setAltBarcode] = useState("869012398412");
  const [notes, setNotes] = useState("Otomatik otoklav sterilizasyonu için uygun titanyum başlık.");
  const [unitConversions, setUnitConversions] = useState<UnitConversion[]>([
    { purchaseUnit: "Kutu", usageUnit: "Adet", multiplier: 100 },
    { purchaseUnit: "Paket", usageUnit: "Adet", multiplier: 10 },
    { purchaseUnit: "Adet", usageUnit: "Adet", multiplier: 1 },
  ]);

  // Delete State
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

  // Reset form to blank
  const handleResetForm = () => {
    setEditingId(null);
    setName("");
    setBarcode(`DNTS-${Math.floor(100 + Math.random() * 900)}`);
    setCategory("Restoratif");
    setBrand("");
    setTrackingType("Normal");
    setItemType("Sarf Malzeme");
    setConsumptionType("Normal");
    setQuantity("10");
    setUnit("Kutu");
    setMinThreshold("5");
    setPurchasePrice("150");
    setTaxRate(10);
    setCurrency("TRY");
    setUsageUnit("Adet");
    setUsagePrice("15");
    setSupplier("Meda Dental Deposu");
    setShelfLocation("Dolap A-1");
    setExpiryDate(new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0]);
    setAltBarcode("");
    setNotes("");
    showToast("Stok kartı formu yeni ürün girişi için hazırlandı.", "info");
  };

  // Load an existing item into form
  const handleLoadItemToForm = (item: StockItem) => {
    setEditingId(item.id);
    setName(item.name);
    setBarcode(item.barcode || `DNTS-${item.id}`);
    setCategory(item.category);
    setBrand(item.brand || "");
    setTrackingType(item.trackingType || "Normal");
    setItemType(item.itemType || "Sarf Malzeme");
    setConsumptionType(item.consumptionType || "Normal");
    setQuantity(String(item.quantity));
    setUnit(item.unit);
    setMinThreshold(String(item.minThreshold));
    setPurchasePrice(item.purchasePrice ? String(item.purchasePrice) : "0");
    setTaxRate(item.taxRate || 10);
    setCurrency(item.currency || "TRY");
    setUsageUnit(item.usageUnit || item.unit);
    setUsagePrice(item.usagePrice ? String(item.usagePrice) : String(item.purchasePrice || 0));
    setSupplier(item.supplier || "Meda Dental Deposu");
    setShelfLocation(item.shelfLocation || "Dolap A-1");
    setExpiryDate(item.expiryDate || "");
    setAltBarcode(item.altBarcode || "");
    setNotes(item.notes || "");
    if (item.unitConversions && item.unitConversions.length > 0) {
      setUnitConversions(item.unitConversions);
    }

    setActiveTab("stok-karti");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`"${item.name}" stok kartı düzenleme modunda açıldı.`, "info");
  };

  // Submit / Save Stok Kartı
  const handleSaveStokKarti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Lütfen malzeme adını giriniz.", "error");
      return;
    }

    const numQty = parseFloat(quantity) || 0;
    const numMin = parseFloat(minThreshold) || 1;
    const numPrice = parseFloat(purchasePrice) || 0;
    const numUsagePrice = parseFloat(usagePrice) || numPrice;
    const computedStatus: "Normal" | "Kritik" = numQty <= numMin ? "Kritik" : "Normal";

    if (editingId) {
      // Update
      const updated = items.map((it) =>
        it.id === editingId
          ? {
              ...it,
              name: name.trim(),
              barcode,
              category,
              brand,
              trackingType,
              itemType,
              consumptionType,
              quantity: numQty,
              unit,
              minThreshold: numMin,
              status: computedStatus,
              purchasePrice: numPrice,
              taxRate,
              currency,
              usageUnit,
              usagePrice: numUsagePrice,
              supplier,
              shelfLocation,
              expiryDate,
              altBarcode,
              notes,
              unitConversions,
            }
          : it
      );
      saveToStorage(updated);
      showToast(`✓ "${name}" stok kartı başarıyla güncellendi.`, "success");
    } else {
      // Create new
      const newItem: StockItem = {
        id: String(Date.now()),
        name: name.trim(),
        barcode: barcode || `DNTS-${Date.now().toString().slice(-4)}`,
        category,
        brand: brand || "Genel",
        trackingType,
        itemType,
        consumptionType,
        quantity: numQty,
        unit,
        minThreshold: numMin,
        status: computedStatus,
        purchasePrice: numPrice,
        taxRate,
        currency,
        usageUnit,
        usagePrice: numUsagePrice,
        supplier,
        shelfLocation,
        expiryDate,
        altBarcode,
        notes,
        unitConversions,
      };
      saveToStorage([newItem, ...items]);
      setEditingId(newItem.id);
      showToast(`✓ "${name}" yeni stok kartı olarak kaydedildi.`, "success");
    }
  };

  // Quick Inline Quantity Change (+ / -)
  const handleQuickAdjustQuantity = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.map((it) => {
      if (it.id === id) {
        const newQty = Math.max(0, it.quantity + delta);
        const newStatus: "Normal" | "Kritik" = newQty <= it.minThreshold ? "Kritik" : "Normal";
        return {
          ...it,
          quantity: newQty,
          status: newStatus,
        };
      }
      return it;
    });
    saveToStorage(updated);
    const target = updated.find((it) => it.id === id);
    if (target) {
      showToast(
        `✓ "${target.name}" miktarı: ${target.quantity} ${target.unit}`,
        target.status === "Kritik" ? "error" : "success"
      );
    }
  };

  // Print Barcode / Label
  const handlePrintBarcode = () => {
    openPrintPreview({
      type: "patient_card",
      title: `Stok & Barkod Etiketi — ${barcode || "DNTS-001"}`,
      patientName: name || "Malzeme Adı",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: supplier || "Klinik Deposu",
      total: `${quantity} ${unit}`,
      items: [
        {
          name: name,
          detail: `Barkod: ${barcode} • Kategori: ${category} • Konum: ${shelfLocation}`,
          price: `${purchasePrice} ₺`,
        },
      ],
      extraInfo: {
        "Stok Kodu / Barkod": barcode || "-",
        "Kategori": category || "-",
        "Marka": brand || "-",
        "Depo Konumu": shelfLocation || "-",
        "Mevcut Stok": `${quantity} ${unit}`,
        "Kritik Eşik": `${minThreshold} ${unit}`,
        "Birim Fiyat": `${purchasePrice} ₺ (KDV %${taxRate})`,
        "Son Kullanma": expiryDate || "Belirtilmedi",
        "Tedarikçi Firma": supplier || "-",
      },
    });
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const target = itemToDelete;
    const updated = items.filter((it) => it.id !== itemToDelete.id);
    saveToStorage(updated);
    if (editingId === target.id) {
      handleResetForm();
    }
    setItemToDelete(null);
    showToast(`✓ "${target.name}" stok listesinden kaldırıldı.`, "info");
  };

  const handleResetDefaults = () => {
    saveToStorage(defaultStock);
    showToast("✓ Stok veritabanı varsayılanlara sıfırlandı.", "info");
  };

  // Calculations for Tab 2
  const filtered = items.filter((it) => {
    if (selectedCategory !== "Tümü" && it.category !== selectedCategory) return false;
    if (statusFilter !== "Tümü" && it.status !== statusFilter) return false;
    if (
      search.trim() &&
      !it.name.toLowerCase().includes(search.toLowerCase()) &&
      !(it.barcode && it.barcode.toLowerCase().includes(search.toLowerCase())) &&
      !(it.brand && it.brand.toLowerCase().includes(search.toLowerCase())) &&
      !(it.supplier && it.supplier.toLowerCase().includes(search.toLowerCase()))
    )
      return false;
    return true;
  });

  const totalStockCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const criticalItems = items.filter((it) => it.status === "Kritik");
  const normalItems = items.filter((it) => it.status === "Normal");
  const totalStockValue = items.reduce(
    (sum, it) => sum + (it.purchasePrice || 0) * it.quantity,
    0
  );

  const isCurrentStatusCritical = (parseFloat(quantity) || 0) <= (parseFloat(minThreshold) || 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <BannerHeader
        title={activeTab === "stok-karti" ? "Stok Kartı" : "Stok & Envanter Yönetimi"}
        description={
          activeTab === "stok-karti"
            ? "Klinik stok bilgilerini kaydedin ve yönetin."
            : "Malzeme adetleri, kritik stok seviyeleri ve anlık tüketim takibi."
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Stok", href: "#" },
          { label: activeTab === "stok-karti" ? "Stok Kartı" : "Stok Listesi & Hareketler" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "stok-karti" ? (
              <>
                <button
                  type="button"
                  onClick={handlePrintBarcode}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Barcode className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                  Barkod & Etiket Yazdır
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("liste")}
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] hover:bg-[#EEEBE4] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Boxes className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                  Stok Listesini Gör ({items.length})
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    openStockOrderModal(
                      criticalItems.length > 0 ? criticalItems[0].name : "Toplu İkmal Siparişi",
                      criticalItems.length > 0 ? criticalItems[0].quantity : 0,
                      criticalItems.length > 0 ? criticalItems[0].unit : "Kutu"
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-3.5 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <ShoppingCart className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                  Sipariş Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab("stok-karti");
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer dark:hover:bg-[#285A3B]"
                >
                  <Plus className="h-4 w-4" />
                  + Yeni Stok Kartı
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E1D8] pb-3 dark:border-[#243B2F]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("stok-karti")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "stok-karti"
                ? "bg-[#1F3327] text-white shadow-xs"
                : "bg-[#FBFAF7] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
            )}
          >
            <Package className="h-4 w-4" />
            <span>Stok Kartı (Yeni / Düzenle)</span>
            {editingId && (
              <span className="rounded-full bg-[#E2EEDD] text-[#2C6A3B] text-[10px] px-2 py-0.5 font-bold dark:bg-[#163321] dark:text-[#76D28F]">
                Düzenleniyor
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("liste")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              activeTab === "liste"
                ? "bg-[#1F3327] text-white shadow-xs"
                : "bg-[#FBFAF7] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
            )}
          >
            <Boxes className="h-4 w-4" />
            <span>Stok Listesi & Hareketler</span>
            <span className="rounded-full bg-[#EEEBE4] text-[#1C211E] text-[10px] px-2 py-0.5 font-bold dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
              {items.length}
            </span>
          </button>
        </div>

        {activeTab === "stok-karti" && editingId && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
              Stok Kartı Düzenleniyor (ID: #{editingId.slice(-4)})
            </span>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-semibold text-[#B3261E] hover:underline cursor-pointer dark:text-[#FF8A80]"
            >
              Yeni Ürüne Geç
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: STOK KARTI (Figma node 7:5542 - 3 Kartlık Form)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "stok-karti" && (
        <form onSubmit={handleSaveStokKarti} className="flex flex-col gap-6">
          {/* KART 1: Ürün / Malzeme Bilgileri */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327] dark:bg-[#1A2C23] dark:text-[#76D28F]">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                    1. Ürün / Malzeme Bilgileri
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                    Malzeme adı, barkod, kategori ve marka tanımları
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#5F665F] bg-[#EEEBE4] px-2.5 py-1 rounded-lg dark:bg-[#1A2C23] dark:text-[#A2B5A8]">
                Malzeme & Barkod
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Malzeme Adı (Ad) */}
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Malzeme / Ürün Adı <span className="text-[#B3261E] dark:text-[#FF8A80]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Aeratör Sterilizasyon Başlığı veya 3M Filtek Kompozit"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
                />
              </div>

              {/* Barkod / Stok Kodu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Stok Kodu / Barkod
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="DNTS-309"
                    className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white pl-3.5 pr-8 text-sm font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
                  />
                  <Barcode className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                </div>
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Restoratif">Restoratif</option>
                  <option value="Anestezi">Anestezi</option>
                  <option value="Endodonti">Endodonti</option>
                  <option value="Sarf Malzeme">Sarf Malzeme</option>
                  <option value="Protez">Protez</option>
                  <option value="Cerrahi">Cerrahi</option>
                </select>
              </div>

              {/* Marka */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Üretici / Marka
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Örn: 3M ESPE, Septodont, W&H"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
                />
              </div>

              {/* Takip Tipi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Takip Tipi
                </label>
                <select
                  value={trackingType}
                  onChange={(e) => setTrackingType(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Normal">Normal Adet Takibi</option>
                  <option value="Seri No Takibi">Seri No Takibi</option>
                  <option value="Parti / Lot Takibi">Parti / Lot Takibi</option>
                </select>
              </div>

              {/* Malzeme Tipi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Malzeme Tipi
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Sarf Malzeme">Sarf Malzeme</option>
                  <option value="El Aleti & Cerrahi">El Aleti & Cerrahi</option>
                  <option value="Tıbbi Cihaz">Tıbbi Cihaz Parçası</option>
                  <option value="İlaç & Anestezi">İlaç & Anestezi</option>
                  <option value="Laboratuvar Malzemesi">Laboratuvar Malzemesi</option>
                </select>
              </div>

              {/* Tüketim Tipi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Tüketim Tipi
                </label>
                <select
                  value={consumptionType}
                  onChange={(e) => setConsumptionType(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Normal">Normal Tüketim</option>
                  <option value="Hızlı Tüketim">Hızlı Tüketim</option>
                  <option value="Tedavi Başına">Tedavi Başına Kullanım</option>
                </select>
              </div>
            </div>
          </div>

          {/* KART 2: Stok & Fiyatlama */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327] dark:bg-[#1A2C23] dark:text-[#76D28F]">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                    2. Stok & Fiyatlama
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                    Birim, mevcut stok, kritik eşik ve birim maliyet fiyatları
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">Hesaplanan Durum:</span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold",
                    isCurrentStatusCritical
                      ? "bg-[#FBE9E7] text-[#B3261E] border border-[#F3D0CC] dark:bg-[#3D1A1A] dark:text-[#FF8A80] dark:border-[#5C2424]"
                      : "bg-[#E2EEDD] text-[#2C6A3B] border border-[#C5D6C0] dark:bg-[#163321] dark:text-[#76D28F] dark:border-[#285A3B]"
                  )}
                >
                  {isCurrentStatusCritical ? "Kritik Seviye" : "Normal Seviye"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Alış Birimi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Alış Birimi
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Adet">Adet</option>
                  <option value="Kutu">Kutu</option>
                  <option value="Tüp">Tüp</option>
                  <option value="Set">Set</option>
                  <option value="Paket">Paket</option>
                  <option value="Şişe">Şişe</option>
                  <option value="Kavanoz">Kavanoz</option>
                </select>
              </div>

              {/* Mevcut Stok */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Mevcut Stok Miktarı <span className="text-[#B3261E] dark:text-[#FF8A80]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm font-semibold font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                />
              </div>

              {/* Kritik Eşik */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Kritik Eşik Miktarı
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm font-semibold font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                />
              </div>

              {/* Alış Para Birimi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Alış Para Birimi
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="TRY">Türk Lirası (TRY)</option>
                  <option value="USD">Amerikan Doları (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              {/* Alış Fiyatı */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Alış Birim Fiyatı (KDV Dahil)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white pl-3.5 pr-8 text-sm font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5F665F] dark:text-[#A2B5A8]">
                    ₺
                  </span>
                </div>
              </div>

              {/* KDV (%) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F]">
                  KDV Oranı (%)
                </label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value={0}>%0 (Muaf)</option>
                  <option value={1}>%1 (Özel)</option>
                  <option value={10}>%10 (Tıbbi Sarf)</option>
                  <option value={20}>%20 (Standart)</option>
                </select>
              </div>

              {/* Sarf Birimi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Sarf / Kullanım Birimi
                </label>
                <select
                  value={usageUnit}
                  onChange={(e) => setUsageUnit(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Adet">Adet</option>
                  <option value="gr">Gram (gr)</option>
                  <option value="ml">Mililitre (ml)</option>
                  <option value="Karpül">Karpül</option>
                  <option value="Doz">Doz</option>
                </select>
              </div>

              {/* Sarf Birim Fiyatı */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Sarf Birim Fiyatı
                </label>
                <input
                  type="number"
                  step="any"
                  value={usagePrice}
                  onChange={(e) => setUsagePrice(e.target.value)}
                  placeholder="0.00"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                />
              </div>
            </div>
          </div>

          {/* KART 3: Tedarikçi & Depo */}
          <div className="rounded-2xl bg-[#FBFAF7] p-6 border border-[#E6E1D8] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE6] text-[#1F3327] dark:bg-[#1A2C23] dark:text-[#76D28F]">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                    3. Tedarikçi & Depo Bilgileri
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                    Tedarikçi firma, depo konumu, son kullanma tarihi ve birim dönüşümleri
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#5F665F] bg-[#EEEBE4] px-2.5 py-1 rounded-lg dark:bg-[#1A2C23] dark:text-[#A2B5A8]">
                Depo & Lokasyon
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {/* Tedarikçi Firma */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Tedarikçi Firma
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                >
                  <option value="Meda Dental Deposu">Meda Dental Deposu</option>
                  <option value="Dentasya Ecza">Dentasya Ecza</option>
                  <option value="DentLab Dental">DentLab Dental</option>
                  <option value="Güler Medikal">Güler Medikal</option>
                  <option value="OMS Dental">OMS Dental</option>
                  <option value="Diğer Tedarikçi">Diğer Tedarikçi</option>
                </select>
              </div>

              {/* Raf / Dolap No */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Depo / Raf / Dolap No
                </label>
                <input
                  type="text"
                  value={shelfLocation}
                  onChange={(e) => setShelfLocation(e.target.value)}
                  placeholder="Örn: Dolap A-2 veya Raf 3"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
                />
              </div>

              {/* Son Kullanma Tarihi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Son Kullanma Tarihi
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B]"
                />
              </div>

              {/* Alternatif Barkod */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                  Alternatif Barkod No
                </label>
                <input
                  type="text"
                  value={altBarcode}
                  onChange={(e) => setAltBarcode(e.target.value)}
                  placeholder="İkincil barkod"
                  className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white px-3.5 text-sm font-mono text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
                />
              </div>
            </div>

            {/* Birim Dönüşümleri Mini Tablosu */}
            <div className="rounded-xl border border-[#E6E1D8] bg-white p-4 mb-4 dark:bg-[#1A2C23] dark:border-[#243B2F]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-[#2F5A3D] dark:text-[#76D28F]" />
                  <span className="text-xs font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                    Birim Dönüşümleri Tablosu
                  </span>
                </div>
                <span className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
                  Alış birimi ile klinik sarf birimi arasındaki çarpanlar
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unitConversions.map((conv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-[#FBFAF7] p-2.5 border border-[#E6E1D8] text-xs dark:bg-[#15221B] dark:border-[#243B2F]"
                  >
                    <div className="flex items-center gap-1.5 font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                      <span>1 {conv.purchaseUnit}</span>
                      <span className="text-[#5F665F] dark:text-[#A2B5A8]">=</span>
                      <span className="font-bold text-[#2F5A3D] dark:text-[#76D28F]">{conv.multiplier} {conv.usageUnit}</span>
                    </div>
                    <span className="text-[10px] bg-[#EEEBE4] px-1.5 py-0.5 rounded text-[#5F665F] dark:bg-[#1A2C23] dark:text-[#A2B5A8]">
                      Çarpan: x{conv.multiplier}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notlar & Özellikler */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#5F665F] dark:text-[#A2B5A8]">
                Malzeme Özellikleri & Saklama Koşulları
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: 2-8°C buzdolabında saklanmalıdır, doğrudan güneş ışığından koruyunuz..."
                className="w-full rounded-xl border border-[#E6E1D8] bg-white p-3.5 text-sm text-[#1C211E] outline-none transition-colors hover:border-[#CFCAC0] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:placeholder-[#5F665F]"
              />
            </div>
          </div>

          {/* Form Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FBFAF7] p-4 border border-[#E6E1D8] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              >
                <RotateCcw className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                Formu Temizle / Yeni Ürün
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab("liste");
                  }}
                  className="rounded-xl border border-[#E6E1D8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#5F665F] hover:text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
                >
                  Düzenlemeyi Kapat
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintBarcode}
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2.5 text-xs font-semibold text-[#1C211E] transition-colors shadow-2xs cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              >
                <Barcode className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
                Etiket Yazdır
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer dark:hover:bg-[#285A3B]"
              >
                <Check className="h-4 w-4" />
                {editingId ? "Stok Kartını Güncelle" : "Stok Kartını Kaydet"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: STOK LİSTESİ & HAREKETLER (Mevcut Envanter Tablosu)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "liste" && (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Toplam Çeşit */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
              <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">Kayıtlı Malzeme Çeşidi</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#1C211E] dark:text-[#ECF3EE]">
                  {items.length} Kalem
                </span>
                <span className="text-xs font-semibold text-[#2F5A3D] bg-[#E7EEE6] px-2 py-0.5 rounded-full dark:bg-[#163321] dark:text-[#76D28F]">
                  Katalog
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">Tüm dental sarf & cerrahi</p>
            </div>

            {/* Kritik Stokta */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
              <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">Kritik Eşikteki Malzemeler</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#B3261E] dark:text-[#FF8A80]">
                  {criticalItems.length} Ürün
                </span>
                <span className="text-xs font-semibold text-[#B3261E] bg-[#FBE9E7] px-2 py-0.5 rounded-full dark:bg-[#3D1A1A] dark:text-[#FF8A80]">
                  Sipariş Gerekli
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">Eşik seviyesinin altındakiler</p>
            </div>

            {/* Normal Seviye */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
              <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">Yeterli Stok Seviyesi</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#2C6A3B] dark:text-[#76D28F]">
                  {normalItems.length} Ürün
                </span>
                <span className="text-xs font-semibold text-[#2C6A3B] bg-[#E2EEDD] px-2 py-0.5 rounded-full dark:bg-[#163321] dark:text-[#76D28F]">
                  Normal
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">Tedavi için yeterli miktarda</p>
            </div>

            {/* Toplam Adet */}
            <div className="rounded-2xl bg-[#FBFAF7] p-5 shadow-xs border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
              <span className="text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">Toplam Envanter Adedi</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#1F3327] dark:text-[#76D28F]">
                  {totalStockCount} Birim
                </span>
                <span className="text-xs font-semibold text-[#7A5320] bg-[#F3EADB] px-2 py-0.5 rounded-full dark:bg-[#2C2415] dark:text-[#E8BA73]">
                  Depoda
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">Klinik raf ve depolarında</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FBFAF7] p-4 border border-[#E6E1D8] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex flex-wrap items-center gap-2">
              {["Tümü", "Restoratif", "Anestezi", "Endodonti", "Sarf Malzeme", "Protez", "Cerrahi"].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      selectedCategory === cat
                        ? "bg-[#1F3327] text-white shadow-2xs"
                        : "bg-[#EEEBE4] text-[#5F665F] hover:bg-[#E6E1D8] hover:text-[#1C211E] dark:bg-[#1A2C23] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="rounded-xl border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs text-[#1C211E] outline-none focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  <option value="Tümü">Tüm Durumlar</option>
                  <option value="Kritik">Kritik Stoklar</option>
                  <option value="Normal">Normal Stoklar</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5F665F] dark:text-[#A2B5A8]" />
                <input
                  type="text"
                  placeholder="Malzeme, kod veya marka ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-48 sm:w-60 rounded-xl border border-[#E6E1D8] bg-white pl-8 pr-3 text-xs text-[#1C211E] outline-none placeholder:text-[#5F665F]/60 focus:border-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
                />
              </div>

              {/* Reset to defaults */}
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                title="Varsayılan Verileri Geri Yükle"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="rounded-2xl bg-[#FBFAF7] border border-[#E6E1D8] overflow-hidden shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs">
                <thead className="bg-[#EEEBE4] border-b border-[#E6E1D8] text-[#5F665F] font-semibold dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#A2B5A8]">
                  <tr>
                    <th className="py-3 px-4">Malzeme Adı & Kod</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Raf / Konum</th>
                    <th className="py-3 px-4">Tedarikçi Firma</th>
                    <th className="py-3 px-4 text-center">Stok & Hızlı Güncelle</th>
                    <th className="py-3 px-4 text-center">Kritik Eşik</th>
                    <th className="py-3 px-4 text-center">Durum</th>
                    <th className="py-3 px-4 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8] dark:divide-[#243B2F]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#5F665F] dark:text-[#A2B5A8]">
                        Filtrelere uygun malzeme bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F3F0EA]/70 transition-colors group cursor-default dark:hover:bg-[#1A2C23]/60"
                      >
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1C211E] text-sm dark:text-[#ECF3EE]">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.barcode && (
                                <span className="text-[10px] text-[#5F665F] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E6E1D8] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#A2B5A8]">
                                  {item.barcode}
                                </span>
                              )}
                              {item.brand && (
                                <span className="text-[10px] text-[#5F665F] dark:text-[#A2B5A8]">
                                  {item.brand}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="rounded-lg bg-[#EEEBE4] px-2.5 py-1 text-[11px] font-semibold text-[#1C211E] dark:bg-[#1A2C23] dark:text-[#ECF3EE]">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#5F665F] whitespace-nowrap font-medium dark:text-[#A2B5A8]">
                          {item.shelfLocation || "Belirtilmedi"}
                        </td>
                        <td className="py-3 px-4 text-[#5F665F] whitespace-nowrap dark:text-[#A2B5A8]">
                          {item.supplier || "Genel Tedarikçi"}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-[#E6E1D8] dark:bg-[#1A2C23] dark:border-[#243B2F]">
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdjustQuantity(item.id, -1, e)}
                              className="text-[#5F665F] hover:text-[#B3261E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#FF8A80]"
                              title="1 Azalt"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </button>
                            <span className="font-mono font-bold text-sm text-[#1C211E] min-w-[3rem] text-center dark:text-[#ECF3EE]">
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleQuickAdjustQuantity(item.id, 1, e)}
                              className="text-[#5F665F] hover:text-[#2C6A3B] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#76D28F]"
                              title="1 Artır"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[#5F665F] whitespace-nowrap dark:text-[#A2B5A8]">
                          {item.minThreshold} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                              item.status === "Kritik"
                                ? "bg-[#FBE9E7] text-[#B3261E] border border-[#F3D0CC] dark:bg-[#3D1A1A] dark:text-[#FF8A80] dark:border-[#5C2424]"
                                : "bg-[#E2EEDD] text-[#2C6A3B] border border-[#C5D6C0] dark:bg-[#163321] dark:text-[#76D28F] dark:border-[#285A3B]"
                            )}
                          >
                            {item.status === "Kritik" ? "Kritik Eşik" : "Yeterli"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleLoadItemToForm(item)}
                              className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                              title="Stok Kartında Düzenle"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openStockOrderModal(item.name, item.quantity, item.unit)
                              }
                              className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#E7EEE6] hover:text-[#2C6A3B] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#76D28F]"
                              title="Tedarikçiye Sipariş Ver"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#FBE9E7] hover:text-[#B3261E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#3D1A1A] dark:hover:text-[#FF8A80]"
                              title="Stoktan Sil"
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
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#FBFAF7] p-6 shadow-xl border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]">
            <div className="flex items-center gap-3 text-[#B3261E] mb-3 dark:text-[#FF8A80]">
              <div className="rounded-xl bg-[#FBE9E7] p-2.5 dark:bg-[#3D1A1A]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                  Malzeme Silinecek
                </h3>
                <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                  Bu işlem malzemeyi klinik stok listesinden tamamen siler.
                </p>
              </div>
            </div>

            <div className="my-4 rounded-xl bg-white p-3.5 border border-[#E6E1D8] text-xs dark:bg-[#1A2C23] dark:border-[#243B2F]">
              <p className="font-semibold text-[#1C211E] text-sm dark:text-[#ECF3EE]">
                {itemToDelete.name}
              </p>
              <p className="text-[#5F665F] mt-1 dark:text-[#A2B5A8]">
                Kategori: {itemToDelete.category} • Konum: {itemToDelete.shelfLocation || "Belirtilmedi"}
              </p>
              <p className="font-mono font-bold mt-2 text-sm text-[#1C211E] dark:text-[#ECF3EE]">
                Mevcut Miktar: {itemToDelete.quantity} {itemToDelete.unit}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-xl border border-[#E6E1D8] bg-[#EEEBE4] hover:bg-[#E6E1D8] px-4 py-2 text-xs font-semibold text-[#1C211E] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[#B3261E] hover:bg-[#9B1C1C] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer dark:bg-[#D32F2F] dark:hover:bg-[#B71C1C]"
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
