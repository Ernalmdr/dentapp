"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Calendar,
  List,
  LayoutGrid,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  User,
  Check,
  Trash2,
  Edit,
  Eye,
  CalendarPlus,
  Filter,
  FileText,
  AlertCircle,
} from "lucide-react";
import { patients as initialPatients } from "@/lib/mock-data";
import { Patient, PatientStatus } from "@/lib/types";
import { cn, formatDate, formatPhone } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";

type TabKey = "all" | "Aktif Tedavi" | "Takip" | "Arşiv";
type ViewMode = "list" | "grid";

interface TabItem {
  key: TabKey;
  label: string;
  count: string;
}

const TABS: TabItem[] = [
  { key: "all", label: "Tüm Hastalar", count: "1.248" },
  { key: "Aktif Tedavi", label: "Aktif Tedavi", count: "312" },
  { key: "Takip", label: "Takip", count: "164" },
  { key: "Arşiv", label: "Arşiv", count: "72" },
];

const AVATAR_COLORS = [
  { bg: "bg-[#E6F4EA]", text: "text-[#137333]" }, // sage/green
  { bg: "bg-[#F3E8FD]", text: "text-[#7B1FA2]" }, // purple
  { bg: "bg-[#E8F0FE]", text: "text-[#1967D2]" }, // blue
  { bg: "bg-[#FEF7E0]", text: "text-[#B06000]" }, // amber
  { bg: "bg-[#E0F2F1]", text: "text-[#00796B]" }, // teal
  { bg: "bg-[#FCE8E6]", text: "text-[#C5221F]" }, // rose
];

function getAvatarStyle(id: string) {
  const num = parseInt(id, 10);
  const idx = isNaN(num) ? 0 : (num - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[Math.max(0, idx)];
}

function getInitials(firstName: string, lastName: string): string {
  const f = firstName?.trim().charAt(0) || "";
  const l = lastName?.trim().charAt(0) || "";
  return (f + l).toLocaleUpperCase("tr-TR");
}

export default function HastalarPage() {
  const { openAppointmentModal } = useModal();
  const [patientList, setPatientList] = useState<Patient[]>(initialPatients);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [treatmentFilter, setTreatmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewPatient, setPreviewPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    tcNo: "",
    phone: "+90",
    gender: "Erkek" as "Erkek" | "Kadın",
    age: 30,
    status: "Aktif Tedavi" as PatientStatus,
    lastTreatment: "İmplant",
  });

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  // Filter Logic
  const filteredPatients = useMemo(() => {
    return patientList.filter((patient) => {
      // Tab filter
      if (activeTab !== "all" && patient.status !== activeTab) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLocaleLowerCase("tr-TR");
        const fullName = `${patient.firstName} ${patient.lastName}`.toLocaleLowerCase("tr-TR");
        const tc = patient.tcNo || "";
        const phone = patient.phone || "";
        const treatment = (patient.lastTreatment || "").toLocaleLowerCase("tr-TR");

        const matches =
          fullName.includes(query) ||
          tc.includes(query) ||
          phone.includes(query) ||
          treatment.includes(query);

        if (!matches) return false;
      }

      // Treatment Dropdown filter
      if (treatmentFilter && patient.lastTreatment !== treatmentFilter) {
        return false;
      }

      // Status Dropdown filter
      if (statusFilter && patient.status !== statusFilter) {
        return false;
      }

      // Registration Date filter
      if (dateFilter) {
        const regDate = patient.registrationDate; // YYYY-MM-DD
        if (dateFilter === "eylul-2026" && !regDate.startsWith("2026-09")) {
          return false;
        }
        if (dateFilter === "agustos-2026" && !regDate.startsWith("2026-08")) {
          return false;
        }
      }

      return true;
    });
  }, [patientList, activeTab, searchQuery, treatmentFilter, statusFilter, dateFilter]);

  // Selection handlers
  const isAllSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPatients.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setTreatmentFilter("");
    setStatusFilter("");
    setDateFilter("");
    setActiveTab("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    treatmentFilter !== "" ||
    statusFilter !== "" ||
    dateFilter !== "" ||
    activeTab !== "all";

  // Create Patient Handler
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.firstName.trim() || !newPatient.lastName.trim() || !newPatient.tcNo.trim()) {
      alert("Lütfen gerekli alanları doldurunuz.");
      return;
    }

    const created: Patient = {
      id: String(Date.now()),
      hsNo: `HS-${10250 + patientList.length + 1}`,
      firstName: newPatient.firstName.trim(),
      lastName: newPatient.lastName.trim(),
      gender: newPatient.gender,
      age: Number(newPatient.age) || 30,
      birthDate: "1994-01-01",
      tcNo: newPatient.tcNo.trim(),
      phone: newPatient.phone.trim(),
      status: newPatient.status,
      lastTreatment: newPatient.lastTreatment,
      registrationDate: new Date().toISOString().split("T")[0],
      dentist: "Dr. Selin Yılmaz",
      city: "İstanbul",
      district: "Kadıköy",
      country: "Türkiye",
    };

    setPatientList([created, ...patientList]);
    setIsAddModalOpen(false);
    setNewPatient({
      firstName: "",
      lastName: "",
      tcNo: "",
      phone: "+90",
      gender: "Erkek",
      age: 30,
      status: "Aktif Tedavi",
      lastTreatment: "İmplant",
    });
    showNotification(`${created.firstName} ${created.lastName} başarıyla hasta listesine eklendi.`);
  };

  // Delete Patient Handler
  const handleDeletePatient = (id: string) => {
    const p = patientList.find((item) => item.id === id);
    if (confirm(`${p?.firstName} ${p?.lastName} kaydını silmek istediğinize emin misiniz?`)) {
      setPatientList((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setActiveMenuId(null);
      showNotification("Hasta kaydı silindi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#1F3327] px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-3">
          <Check className="h-4 w-4 text-[#3F8F55]" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 1. Banner Header */}
      <BannerHeader
        title="Hasta Listesi"
        description="Klinik hastalarınızı görüntüleyin, yönetin ve hasta bilgilerine tek yerden hızlıca ulaşın."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hastalar" },
        ]}
      />

      {/* 2. Filter Tabs Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Horizontal Pill-style Tabs (Figma #7:2842) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2.5 h-[48px] rounded-[14px] px-5 py-2 text-[15px] font-medium transition-all duration-150 cursor-pointer border",
                  isActive
                    ? "bg-[#1F3327] border-[#1F3327] text-white shadow-xs"
                    : "bg-[rgba(255,255,255,0.75)] border-[#E6E1D8] text-[#1C211E] hover:bg-white dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[12px] font-medium",
                    isActive
                      ? "bg-[#34483B] text-white"
                      : "bg-[#EEEBE4] text-[#5F665F] dark:bg-[#1A2C23] dark:text-[#A2B5A8]"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Far Right: "+ Yeni Hasta Ekle" Button (Figma #7:2858) */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-[46px] rounded-[12px] bg-[#1F3327] border border-[#1F3327] px-5 text-[14px] font-medium text-white shadow-xs transition-all hover:bg-[#2D3A32] cursor-pointer"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Yeni Hasta Ekle</span>
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-3 shadow-xs sm:flex-row sm:items-center dark:bg-[#15221B] dark:border-[#243B2F]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F] dark:text-[#A2B5A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hasta adı, TC, telefon..."
            className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white pl-10 pr-9 text-sm text-[#3F4540] placeholder-[#5F665F] outline-none transition-colors focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:placeholder-[#A2B5A8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tedavi Türü Dropdown */}
        <div className="w-full sm:w-44">
          <select
            value={treatmentFilter}
            onChange={(e) => setTreatmentFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition-colors hover:border-[#EADFC8] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
          >
            <option value="">Tedavi Türü</option>
            <option value="İmplant">İmplant</option>
            <option value="Ortodonti">Ortodonti</option>
            <option value="Kanal Tedavisi">Kanal Tedavisi</option>
            <option value="Dolgu">Dolgu</option>
            <option value="Diş Çekimi">Diş Çekimi</option>
          </select>
        </div>

        {/* Durum Dropdown */}
        <div className="w-full sm:w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition-colors hover:border-[#EADFC8] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
          >
            <option value="">Durum</option>
            <option value="Aktif Tedavi">Aktif Tedavi</option>
            <option value="Takip">Takip</option>
            <option value="Tamamlandı">Tamamlandı</option>
            <option value="Arşiv">Arşiv</option>
          </select>
        </div>

        {/* Kayıt Tarihi Dropdown with Calendar Icon */}
        <div className="relative w-full sm:w-44">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F] dark:text-[#A2B5A8]" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#E6E1D8] bg-white pl-9 pr-7 text-sm text-[#3F4540] outline-none transition-colors hover:border-[#EADFC8] focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
          >
            <option value="">Kayıt Tarihi</option>
            <option value="eylul-2026">Eylül 2026</option>
            <option value="agustos-2026">Ağustos 2026</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5F665F] dark:text-[#A2B5A8]">
            ▼
          </div>
        </div>

        {/* Reset Filters Pill (if active) */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
            title="Filtreleri Temizle"
          >
            <X className="h-3.5 w-3.5" />
            <span>Temizle</span>
          </button>
        )}

        {/* Far Right: List View / Grid View Toggle */}
        <div className="flex items-center rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] p-0.5 dark:border-[#243B2F] dark:bg-[#1A2C23]">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md p-1.5 transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-[#FBFAF7] text-[#1F3327] shadow-xs dark:bg-[#15221B] dark:text-[#ECF3EE]"
                : "text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            )}
            title="Liste Görünümü"
            aria-label="Liste Görünümü"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-1.5 transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-[#FBFAF7] text-[#1F3327] shadow-xs dark:bg-[#15221B] dark:text-[#ECF3EE]"
                : "text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            )}
            title="Kart Görünümü"
            aria-label="Kart Görünümü"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Items Bulk Actions Bar (if any selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-[#1F3327] px-4 py-2.5 text-sm text-white shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
              {selectedIds.length}
            </span>
            <span className="font-medium">hasta seçildi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                showNotification(`${selectedIds.length} hastaya toplu SMS gönderildi.`);
                setSelectedIds([]);
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              Toplu Mesaj
            </button>
            <button
              type="button"
              onClick={() => {
                showNotification(`${selectedIds.length} hastanın durumu güncellendi.`);
                setSelectedIds([]);
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              Durum Güncelle
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Seçimi İptal Et"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Patient Table / Grid View */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
          <EmptyState
            message="Arama kriterlerinize uygun hasta bulunamadı."
            icon="default"
          />
        </div>
      ) : viewMode === "list" ? (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E1D8] bg-[#EEEBE4]/70 text-[11px] font-semibold text-[#5F665F] uppercase tracking-wider dark:border-[#243B2F] dark:bg-[#1A2C23]/80 dark:text-[#A2B5A8]">
                  <th className="w-12 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] focus:ring-[#1F3327] cursor-pointer dark:border-[#243B2F]"
                    />
                  </th>
                  <th className="px-4 py-3.5">HASTA</th>
                  <th className="px-4 py-3.5">TC KİMLİK NO</th>
                  <th className="px-4 py-3.5">TELEFON</th>
                  <th className="px-4 py-3.5">SON TEDAVİ</th>
                  <th className="px-4 py-3.5">DURUM</th>
                  <th className="px-4 py-3.5">KAYIT TARİHİ</th>
                  <th className="w-12 px-4 py-3.5 text-right">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8] text-sm dark:divide-[#243B2F]">
                {filteredPatients.map((patient) => {
                  const isChecked = selectedIds.includes(patient.id);
                  const avatar = getAvatarStyle(patient.id);
                  const initials = getInitials(patient.firstName, patient.lastName);
                  const isMenuOpen = activeMenuId === patient.id;

                  return (
                    <tr
                      key={patient.id}
                      className={cn(
                        "transition-colors group hover:bg-[#F3F0EA]/60 dark:hover:bg-[#1E3026]/60",
                        isChecked && "bg-[#F6EEDC]/50 dark:bg-[#1E3026]"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(patient.id)}
                          className="h-4 w-4 rounded border-[#E6E1D8] accent-[#1F3327] text-[#1F3327] focus:ring-[#1F3327] cursor-pointer dark:border-[#243B2F]"
                        />
                      </td>

                      {/* Hasta Avatar & Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif font-bold text-xs shadow-2xs",
                              avatar.bg,
                              avatar.text
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <Link
                              href={`/hastalar/${patient.id}`}
                              className="block text-left font-serif font-bold text-[#1C211E] group-hover:text-[#1F3327] transition-colors hover:underline dark:text-[#ECF3EE] dark:group-hover:text-[#76D28F]"
                            >
                              {patient.firstName} {patient.lastName}
                            </Link>
                            <div className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                              {patient.gender} · {patient.age}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TC Kimlik No */}
                      <td className="px-4 py-3.5 font-mono text-xs text-[#3F4540] tracking-wide dark:text-[#ECF3EE]">
                        {patient.tcNo}
                      </td>

                      {/* Telefon */}
                      <td className="px-4 py-3.5 text-[#3F4540] whitespace-nowrap text-sm dark:text-[#ECF3EE]">
                        {formatPhone(patient.phone)}
                      </td>

                      {/* Son Tedavi */}
                      <td className="px-4 py-3.5 font-medium text-[#1C211E] text-sm dark:text-[#ECF3EE]">
                        {patient.lastTreatment || "—"}
                      </td>

                      {/* Durum */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={patient.status} />
                      </td>

                      {/* Kayıt Tarihi */}
                      <td className="px-4 py-3.5 text-[#5F665F] whitespace-nowrap text-sm dark:text-[#A2B5A8]">
                        {formatDate(patient.registrationDate)}
                      </td>

                      {/* Three Dots Menu Button */}
                      <td className="px-4 py-3.5 text-right relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(isMenuOpen ? null : patient.id)
                          }
                          className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
                          title="İşlemler"
                          aria-label="İşlemler"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-3 top-11 z-30 w-44 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] py-1.5 shadow-lg text-left text-xs animate-in fade-in dark:border-[#243B2F] dark:bg-[#15221B]">
                              <Link
                                href={`/hastalar/${patient.id}`}
                                onClick={() => setActiveMenuId(null)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-[#3F4540] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                              >
                                <Eye className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                                <span>Hasta Kartını Aç</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  openAppointmentModal(`${patient.firstName} ${patient.lastName}`);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-[#3F4540] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                              >
                                <CalendarPlus className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                                <span>Yeni Randevu Ver</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setPreviewPatient(patient);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-[#3F4540] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                              >
                                <Edit className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                                <span>Düzenle</span>
                              </button>
                              <div className="my-1 border-t border-[#E6E1D8] dark:border-[#243B2F]" />
                              <button
                                type="button"
                                onClick={() => handleDeletePatient(patient.id)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-[#B3261E] hover:bg-[#FBE9E7] transition-colors cursor-pointer dark:text-[#FF8B8B] dark:hover:bg-[#2C1919]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Kaydı Sil</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. Pagination (at bottom of table card) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E6E1D8] px-6 py-4 bg-[#FBFAF7] dark:border-[#243B2F] dark:bg-[#15221B]">
            {/* Left: Text */}
            <p className="text-xs text-[#5F665F] font-medium dark:text-[#A2B5A8]">
              1.248 hasta arasından 1 – {filteredPatients.length} görüntüleniyor
            </p>

            {/* Right: < 1 2 3 ... 250 > Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
                aria-label="Önceki Sayfa"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer",
                  currentPage === 1
                    ? "bg-[#1F3327] text-white shadow-xs"
                    : "text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                )}
              >
                1
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer",
                  currentPage === 2
                    ? "bg-[#1F3327] text-white shadow-xs"
                    : "text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                )}
              >
                2
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(3)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer",
                  currentPage === 3
                    ? "bg-[#1F3327] text-white shadow-xs"
                    : "text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                )}
              >
                3
              </button>

              <span className="flex h-8 w-5 items-center justify-center text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                ...
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(250)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer",
                  currentPage === 250
                    ? "bg-[#1F3327] text-white shadow-xs"
                    : "text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
                )}
              >
                250
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(250, p + 1))}
                disabled={currentPage === 250}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
                aria-label="Sonraki Sayfa"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => {
              const avatar = getAvatarStyle(patient.id);
              const initials = getInitials(patient.firstName, patient.lastName);
              const isChecked = selectedIds.includes(patient.id);

              return (
                <div
                  key={patient.id}
                  className={cn(
                    "relative flex flex-col justify-between rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs transition-all hover:shadow-md dark:bg-[#15221B] dark:border-[#243B2F]",
                    isChecked && "ring-2 ring-[#1F3327]"
                  )}
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif font-bold text-sm shadow-2xs",
                            avatar.bg,
                            avatar.text
                          )}
                        >
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                            {patient.gender} · {patient.age} Yaş
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={patient.status} />
                    </div>

                    {/* Meta Info */}
                    <div className="mt-4 space-y-2 border-t border-[#E6E1D8] pt-3 text-xs text-[#3F4540] dark:border-[#243B2F] dark:text-[#ECF3EE]">
                      <div className="flex justify-between">
                        <span className="text-[#5F665F] dark:text-[#A2B5A8]">TC Kimlik:</span>
                        <span className="font-mono">{patient.tcNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F665F] dark:text-[#A2B5A8]">Telefon:</span>
                        <span>{formatPhone(patient.phone)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F665F] dark:text-[#A2B5A8]">Son Tedavi:</span>
                        <span className="font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                          {patient.lastTreatment || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F665F] dark:text-[#A2B5A8]">Kayıt Tarihi:</span>
                        <span>{formatDate(patient.registrationDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#E6E1D8] pt-3 dark:border-[#243B2F]">
                    <button
                      type="button"
                      onClick={() => toggleSelect(patient.id)}
                      className="text-xs text-[#5F665F] hover:text-[#1C211E] cursor-pointer dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
                    >
                      {isChecked ? "✓ Seçildi" : "+ Seç"}
                    </button>
                    <Link
                      href={`/hastalar/${patient.id}`}
                      className="rounded-lg bg-[#1F3327]/10 px-3 py-1.5 text-xs font-semibold text-[#1F3327] hover:bg-[#1F3327] hover:text-white transition-colors dark:bg-[#1A2C23] dark:text-[#76D28F] dark:hover:bg-[#1F3327] dark:hover:text-white"
                    >
                      Profili Görüntüle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination for Grid View */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-6 py-4 shadow-xs dark:bg-[#15221B] dark:border-[#243B2F]">
            <p className="text-xs text-[#5F665F] font-medium dark:text-[#A2B5A8]">
              1.248 hasta arasından 1 – {filteredPatients.length} görüntüleniyor
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#5F665F] hover:bg-[#EEEBE4] disabled:opacity-40 cursor-pointer dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F3327] text-xs font-semibold text-white shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
              >
                3
              </button>
              <span className="flex h-8 w-5 items-center justify-center text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                ...
              </span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-[#3F4540] hover:bg-[#EEEBE4] dark:text-[#ECF3EE] dark:hover:bg-[#1A2C23]"
              >
                250
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(250, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#5F665F] hover:bg-[#EEEBE4] cursor-pointer dark:border-[#243B2F] dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Yeni Hasta Ekle */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#E6E1D8] bg-[#FBFAF7] p-6 shadow-2xl animate-in zoom-in-95 dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-4 dark:border-[#243B2F]">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                  Yeni Hasta Kaydı
                </h2>
                <p className="text-xs text-[#5F665F] mt-0.5 dark:text-[#A2B5A8]">
                  Klinik sistemine yeni hasta bilgilerini ekleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Ad *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.firstName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, firstName: e.target.value })
                    }
                    placeholder="Örn: Ahmet"
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, lastName: e.target.value })
                    }
                    placeholder="Örn: Yılmaz"
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    TC Kimlik No *
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    required
                    value={newPatient.tcNo}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, tcNo: e.target.value })
                    }
                    placeholder="11 haneli TC no"
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 font-mono text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Telefon *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                    placeholder="+905321234567"
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Cinsiyet
                  </label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        gender: e.target.value as "Erkek" | "Kadın",
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Yaş
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        age: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Tedavi Türü
                  </label>
                  <select
                    value={newPatient.lastTreatment}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        lastTreatment: e.target.value,
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="İmplant">İmplant</option>
                    <option value="Ortodonti">Ortodonti</option>
                    <option value="Kanal Tedavisi">Kanal Tedavisi</option>
                    <option value="Dolgu">Dolgu</option>
                    <option value="Diş Çekimi">Diş Çekimi</option>
                    <option value="Protez">Protez</option>
                    <option value="Kontrol">Kontrol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8]">
                    Durum
                  </label>
                  <select
                    value={newPatient.status}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        status: e.target.value as PatientStatus,
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327] dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                  >
                    <option value="Aktif Tedavi">Aktif Tedavi</option>
                    <option value="Takip">Takip</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="Arşiv">Arşiv</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E1D8] pt-4 dark:border-[#243B2F]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] px-4 py-2 text-sm font-medium text-[#3F4540] hover:bg-[#EADFC8] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1F3327] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2D3A32] transition-colors shadow-sm cursor-pointer"
                >
                  Hastayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Hasta Önizleme Kartı */}
      {previewPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E6E1D8] bg-[#FBFAF7] p-6 shadow-2xl animate-in zoom-in-95 dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE]">
            <button
              type="button"
              onClick={() => setPreviewPatient(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-[#5F665F] hover:bg-[#EEEBE4] hover:text-[#1C211E] transition-colors cursor-pointer dark:text-[#A2B5A8] dark:hover:bg-[#1A2C23] dark:hover:text-[#ECF3EE]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Info */}
            <div className="flex items-center gap-4 border-b border-[#E6E1D8] pb-4 dark:border-[#243B2F]">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-serif font-bold text-base shadow-2xs",
                  getAvatarStyle(previewPatient.id).bg,
                  getAvatarStyle(previewPatient.id).text
                )}
              >
                {getInitials(previewPatient.firstName, previewPatient.lastName)}
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1C211E] dark:text-[#ECF3EE]">
                  {previewPatient.firstName} {previewPatient.lastName}
                </h3>
                <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                  {previewPatient.gender} · {previewPatient.age} Yaş · {previewPatient.hsNo}
                </p>
                <div className="mt-1">
                  <StatusBadge status={previewPatient.status} />
                </div>
              </div>
            </div>

            {/* Detail Rows */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">TC Kimlik:</span>
                <span className="font-mono text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                  {previewPatient.tcNo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">Telefon:</span>
                <span className="text-xs text-[#3F4540] dark:text-[#ECF3EE]">
                  {formatPhone(previewPatient.phone)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">E-Posta:</span>
                <span className="text-xs text-[#3F4540] dark:text-[#ECF3EE]">
                  {previewPatient.email || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">Son Tedavi:</span>
                <span className="text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                  {previewPatient.lastTreatment || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">Sorumlu Hekim:</span>
                <span className="text-xs text-[#3F4540] dark:text-[#ECF3EE]">
                  {previewPatient.dentist || "Dr. Selin Yılmaz"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]/60">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">Kayıt Tarihi:</span>
                <span className="text-xs text-[#3F4540] dark:text-[#ECF3EE]">
                  {formatDate(previewPatient.registrationDate)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5F665F] text-xs font-medium dark:text-[#A2B5A8]">Şehir / İlçe:</span>
                <span className="text-xs text-[#3F4540] dark:text-[#ECF3EE]">
                  {previewPatient.city} / {previewPatient.district || "—"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E6E1D8] pt-4 dark:border-[#243B2F]">
              <button
                type="button"
                onClick={() => setPreviewPatient(null)}
                className="rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] px-4 py-2 text-xs font-medium text-[#3F4540] hover:bg-[#EADFC8] cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewPatient(null);
                  showNotification(`${previewPatient.firstName} için yeni randevu planlanıyor.`);
                }}
                className="rounded-lg bg-[#1F3327] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2D3A32] transition-colors shadow-sm cursor-pointer"
              >
                Yeni Randevu Planla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
