"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FileText,
  Search,
  LayoutGrid,
  List as ListIcon,
  ArrowRight,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  X,
  FileCheck2,
  GraduationCap,
  Sparkles,
  HandMetal,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";

// Figma Section Definition
interface DocItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "onam" | "egitim" | "drdentes" | "isaret" | "sozlesme";
  href: string;
}

interface DocSection {
  id: "onam" | "egitim" | "drdentes" | "isaret" | "sozlesme";
  title: string;
  count: number;
  href: string;
  icon: any;
  items: DocItem[];
}

const figmaSections: DocSection[] = [
  {
    id: "onam",
    title: "Onam Formları",
    count: 8,
    href: "/onam-formlari",
    icon: FileCheck2,
    items: [
      { id: "o1", title: "Adli Vaka Rapor Formu", category: "onam", href: "/onam-formlari" },
      { id: "o2", title: "Genel Bilgilendirme ve Genel Onam Formu", category: "onam", href: "/onam-formlari" },
      { id: "o3", title: "Botulinum Toksin (Tip A) Tedavisi Onam Formu", category: "onam", href: "/onam-formlari" },
      { id: "o4", title: "Endodontik Tedavi Onam Formu", category: "onam", href: "/onam-formlari" },
      { id: "o5", title: "Ortodontik Tedaviler İçin Hasta Bilgilendirme ve Onam Formu", category: "onam", href: "/onam-formlari" },
      { id: "o6", title: "İmplant Uygulaması İçin Hasta Bilgilendirme ve Onam Formu", category: "onam", href: "/onam-formlari" },
      { id: "o7", title: "COVID-19 Yönünden Anamnez Formu", category: "onam", href: "/onam-formlari" },
      { id: "o8", title: "Diş Beyazlatma Onam Formu", category: "onam", href: "/onam-formlari" },
    ],
  },
  {
    id: "egitim",
    title: "Hasta Eğitimi",
    count: 6,
    href: "/hasta-egitimi",
    icon: GraduationCap,
    items: [
      { id: "e1", title: "Diş Fırçalama", category: "egitim", href: "/hasta-egitimi" },
      { id: "e2", title: "Detertraj (Diş Taşı Temizliği)", category: "egitim", href: "/hasta-egitimi" },
      { id: "e3", title: "Dolgu", category: "egitim", href: "/hasta-egitimi" },
      { id: "e4", title: "Gömülü Dişler", category: "egitim", href: "/hasta-egitimi" },
      { id: "e5", title: "Kanal Tedavi", category: "egitim", href: "/hasta-egitimi" },
      { id: "e6", title: "İmplant", category: "egitim", href: "/hasta-egitimi" },
      { id: "e7", title: "Ortodonti", category: "egitim", href: "/hasta-egitimi" },
    ],
  },
  {
    id: "drdentes",
    title: "Dr.DENTES Eğitimi",
    count: 6,
    href: "/dr-dentes",
    icon: Sparkles,
    items: [
      { id: "d1", title: "HASTA » Hasta Kartı", category: "drdentes", href: "/dr-dentes" },
      { id: "d2", title: "HASTA » Oral", category: "drdentes", href: "/dr-dentes" },
      { id: "d3", title: "HASTA » Not ve Görüntü", category: "drdentes", href: "/dr-dentes" },
      { id: "d4", title: "HASTA » Hesap", category: "drdentes", href: "/dr-dentes" },
      { id: "d5", title: "HASTA » Fatura", category: "drdentes", href: "/dr-dentes" },
      { id: "d6", title: "HASTA » Reçete", category: "drdentes", href: "/dr-dentes" },
    ],
  },
  {
    id: "isaret",
    title: "Hasta İşaret Dili",
    count: 1,
    href: "/isaret-dili",
    icon: HandMetal,
    items: [
      { id: "i1", title: "Hasta İşaret Dili Rehberi", category: "isaret", href: "/isaret-dili" },
    ],
  },
  {
    id: "sozlesme",
    title: "Sözleşme",
    count: 1,
    href: "/sozlesme",
    icon: ScrollText,
    items: [
      { id: "s1", title: "Dr.DENTES Kullanım Lisans Sözleşmesi", category: "sozlesme", href: "/sozlesme" },
    ],
  },
];

export default function BelgelerPage() {
  const { showToast, openPrintPreview } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"az" | "za">("az");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Selected doc for preview modal
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

  // Category filter tabs from Figma
  const categories = [
    { id: "all", label: "Tümü", count: 20 },
    { id: "onam", label: "Onam Formları", count: 8 },
    { id: "egitim", label: "Hasta Eğitimi", count: 6 },
    { id: "drdentes", label: "Dr.DENTES Eğitimi", count: 6 },
    { id: "isaret", label: "Hasta İşaret Dili", count: 1 },
    { id: "sozlesme", label: "Sözleşme", count: 1 },
  ];

  // Filter sections and items
  const filteredSections = useMemo(() => {
    return figmaSections
      .filter((sec) => selectedCategory === "all" || sec.id === selectedCategory)
      .map((sec) => {
        let items = sec.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
        if (sortOrder === "az") {
          items = [...items].sort((a, b) => a.title.localeCompare(b.title, "tr"));
        } else {
          items = [...items].sort((a, b) => b.title.localeCompare(a.title, "tr"));
        }
        return { ...sec, items };
      })
      .filter((sec) => sec.items.length > 0);
  }, [selectedCategory, searchQuery, sortOrder]);

  const handlePrint = (item: DocItem) => {
    openPrintPreview({
      type: "consent",
      title: item.title,
      doctorName: "Dr. Selin Yılmaz",
      patientName: "Klinik Şablonu",
      date: "22 Kasım 2026",
      extraInfo: {
        "Protokol": "Standart TDB Klinik Şablonu",
        "Geçerlilik": "2026/2027",
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1500px] mx-auto w-full">
      {/* ── Figma Header Section (node-id: 7:6202, 7:6203) ── */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between pb-2 pt-1 overflow-hidden">
        <div>
          <h1
            className="text-4xl lg:text-[52px] leading-[1.05] tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
          >
            Belgeler
          </h1>
          <p
            className="mt-2 text-[15px] font-normal leading-[21px] text-[#5F665F] dark:text-[#A2B5A8]"
          >
            Klinik belgelerinizi, onam formlarını, eğitim materyallerini ve sözleşmeleri görüntüleyin ve yönetin.
          </p>

          {/* Hızlı Alt Sayfa Bağlantıları */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs font-semibold text-[#5F665F] uppercase tracking-wider mr-1 dark:text-[#A2B5A8]">
              Bölümler:
            </span>
            {figmaSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={sec.id}
                  href={sec.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6E1D8] text-xs font-medium text-[#1C211E] hover:border-[#1F3327] hover:text-[#1F3327] hover:bg-[#F6EEDC]/40 transition-all shadow-2xs dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:border-[#285A3B] dark:hover:bg-[#1E3026]"
                >
                  <Icon className="size-3.5 text-[#1F3327] dark:text-[#76D28F]" />
                  <span>{sec.title}</span>
                  <ArrowRight className="size-3 text-[#5F665F] dark:text-[#A2B5A8]" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Figma Nav - Belge Kategorileri (node-id: 7:6204) ── */}
      <div className="flex flex-wrap items-center gap-2.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 h-12 px-4 rounded-[14px] text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap",
                isSelected
                  ? "bg-[#1F3327] text-white shadow-xs"
                  : "bg-white/80 hover:bg-white text-[#1C211E] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  "text-[12px] px-1.5 py-0.5 rounded-full font-semibold",
                  isSelected
                    ? "bg-[#34483B] text-[#9AB395]"
                    : "bg-[#EEEBE4] text-[#5F665F] dark:bg-[#1A2C23] dark:text-[#A2B5A8]"
                )}
              >
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Figma Controls Bar (Search, Sorting, View Switcher) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Search Bar matching Figma Label node: 7:6000 */}
        <div
          className="flex items-center gap-3 h-[46px] px-4 rounded-[12px] bg-white border border-[#E6E1D8] flex-1 min-w-[280px] max-w-xl shadow-2xs dark:bg-[#15221B] dark:border-[#243B2F]"
        >
          <Search className="h-[18px] w-[18px] shrink-0 text-[#8A8F89] dark:text-[#A2B5A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Belge ara..."
            className="w-full bg-transparent text-[14px] text-[#1C211E] placeholder:text-[#8A8F89] outline-none dark:text-[#ECF3EE] dark:placeholder-[#5F665F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#8A8F89] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & View Switcher */}
        <div className="flex items-center gap-3">
          {/* Sort Button listbox matching Figma node: 7:5983 */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "az" ? "za" : "az")}
            className="flex items-center gap-2 h-[46px] px-4 rounded-[12px] bg-white border border-[#E6E1D8] text-[14px] font-medium text-[#1C211E] hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
          >
            <span>{sortOrder === "az" ? "A'dan Z'ye" : "Z'den A'ya"}</span>
            <ChevronDown className="h-4 w-4 text-[#5F665F] dark:text-[#A2B5A8]" />
          </button>

          {/* View Switcher matching Figma node: 7:5987 */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "size-[46px] rounded-[12px] flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                viewMode === "card"
                  ? "bg-[#1F3327] text-white border border-[#1F3327]"
                  : "bg-white text-[#1C211E] border border-[#E6E1D8] hover:bg-stone-50 dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              )}
              title="Kart görünümü"
            >
              <LayoutGrid className="size-[19px]" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "size-[46px] rounded-[12px] flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                viewMode === "list"
                  ? "bg-[#1F3327] text-white border border-[#1F3327]"
                  : "bg-white text-[#1C211E] border border-[#E6E1D8] hover:bg-stone-50 dark:bg-[#15221B] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
              )}
              title="Liste görünümü"
            >
              <ListIcon className="size-[19px]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Figma Exact Sections Layout ── */}
      {viewMode === "card" ? (
        <div className="space-y-6">
          {/* Top Row: 3 Primary Cards (Onam Formları, Hasta Eğitimi, Dr.DENTES Eğitimi) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredSections
              .filter((s) => ["onam", "egitim", "drdentes"].includes(s.id))
              .map((section) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.id}
                    className="flex flex-col rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
                  >
                    {/* Section Header with Direct Link Arrow */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]">
                      <Link
                        href={section.href}
                        className="flex items-center gap-2.5 group"
                      >
                        <div
                          className="flex size-[34px] items-center justify-center rounded-xl shrink-0 bg-[#EEEBE4] dark:bg-[#1A2C23]"
                        >
                          <Icon className="size-4 text-[#1F3327] dark:text-[#76D28F]" />
                        </div>
                        <h2 className="text-[20px] font-serif text-[#1C211E] group-hover:text-[#2F5A3D] transition-colors dark:text-[#ECF3EE] dark:group-hover:text-[#76D28F]">
                          {section.title} ({section.items.length})
                        </h2>
                      </Link>

                      <Link
                        href={section.href}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-[#EEEBE4] transition-colors text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                        title={`${section.title} sayfasına git`}
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>

                    {/* Section Items List */}
                    <div className="mt-4 space-y-2 flex-1">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setPreviewDoc(item)}
                          className="flex items-center justify-between h-[56px] px-3.5 rounded-[10px] bg-white border border-[#E6E1D8] hover:border-[#1F3327] hover:bg-[#F6EEDC]/40 transition-all cursor-pointer group shadow-2xs dark:bg-[#1A2C23] dark:border-[#243B2F] dark:hover:border-[#285A3B] dark:hover:bg-[#1E3026]"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <FileText className="size-4 text-[#8A8F89] group-hover:text-[#1F3327] shrink-0 transition-colors dark:text-[#A2B5A8] dark:group-hover:text-[#76D28F]" />
                            <span className="text-[13.5px] font-normal text-[#1C211E] group-hover:font-medium truncate leading-tight dark:text-[#ECF3EE]">
                              {item.title}
                            </span>
                          </div>
                          <div className="size-4 text-[#CFCAC0] group-hover:text-[#1F3327] shrink-0 transition-colors dark:text-[#5F665F] dark:group-hover:text-[#76D28F]">
                            <ArrowRight className="size-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom Row: 2 Secondary Cards (Hasta İşaret Dili, Sözleşme) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSections
              .filter((s) => ["isaret", "sozlesme"].includes(s.id))
              .map((section) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.id}
                    className="flex flex-col rounded-[20px] p-5 shadow-xs transition-all hover:shadow-md bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#E6E1D8]/60 dark:border-[#243B2F]">
                      <Link
                        href={section.href}
                        className="flex items-center gap-2.5 group"
                      >
                        <div
                          className="flex size-[34px] items-center justify-center rounded-xl shrink-0 bg-[#EEEBE4] dark:bg-[#1A2C23]"
                        >
                          <Icon className="size-4 text-[#1F3327] dark:text-[#76D28F]" />
                        </div>
                        <h2 className="text-[20px] font-serif text-[#1C211E] group-hover:text-[#2F5A3D] transition-colors dark:text-[#ECF3EE] dark:group-hover:text-[#76D28F]">
                          {section.title} ({section.items.length})
                        </h2>
                      </Link>

                      <Link
                        href={section.href}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-[#EEEBE4] transition-colors text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                        title={`${section.title} sayfasına git`}
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>

                    {/* Items List */}
                    <div className="mt-3.5 space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setPreviewDoc(item)}
                          className="flex items-center justify-between h-[56px] px-3.5 rounded-[10px] bg-white border border-[#E6E1D8] hover:border-[#1F3327] hover:bg-[#F6EEDC]/40 transition-all cursor-pointer group shadow-2xs dark:bg-[#1A2C23] dark:border-[#243B2F] dark:hover:border-[#285A3B] dark:hover:bg-[#1E3026]"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <FileText className="size-4 text-[#8A8F89] group-hover:text-[#1F3327] shrink-0 transition-colors dark:text-[#A2B5A8] dark:group-hover:text-[#76D28F]" />
                            <span className="text-[13.5px] font-normal text-[#1C211E] group-hover:font-medium truncate leading-tight dark:text-[#ECF3EE]">
                              {item.title}
                            </span>
                          </div>
                          <div className="size-4 text-[#CFCAC0] group-hover:text-[#1F3327] shrink-0 transition-colors dark:text-[#5F665F] dark:group-hover:text-[#76D28F]">
                            <ArrowRight className="size-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* ── Full List View Mode ── */
        <div
          className="rounded-[20px] p-5 shadow-xs bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
        >
          <div className="space-y-3">
            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center justify-between pt-2 pb-1 border-b border-[#E6E1D8] dark:border-[#243B2F]">
                  <h3 className="text-sm font-bold text-[#1C211E] font-serif uppercase tracking-wider dark:text-[#ECF3EE]">
                    {section.title}
                  </h3>
                  <Link
                    href={section.href}
                    className="text-xs font-semibold text-[#2F5A3D] hover:underline flex items-center gap-1 dark:text-[#76D28F]"
                  >
                    Bölüme Git <ArrowRight className="size-3" />
                  </Link>
                </div>
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPreviewDoc(item)}
                    className="flex items-center justify-between h-[52px] px-4 rounded-[10px] bg-white border border-[#E6E1D8] hover:bg-[#F6EEDC]/40 transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:hover:bg-[#1E3026]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-[#1F3327] dark:text-[#76D28F]" />
                      <span className="text-[14px] text-[#1C211E] dark:text-[#ECF3EE]">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(item);
                        }}
                        className="p-1.5 rounded-lg text-[#5F665F] hover:bg-[#EEEBE4] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE]"
                        title="Yazdır"
                      >
                        <Printer className="size-4" />
                      </button>
                      <ArrowRight className="size-4 text-[#CFCAC0] dark:text-[#5F665F]" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Document Preview & Action Modal ── */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="w-full max-w-lg rounded-[20px] p-6 shadow-2xl space-y-4 bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E6E1D8] dark:border-[#243B2F]">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl shrink-0 bg-[#1F3327] text-white"
                >
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C211E] font-serif leading-snug dark:text-[#ECF3EE]">
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-[#5F665F] mt-0.5 dark:text-[#A2B5A8]">
                    Sağlık Bakanlığı & TDB Onaylı Klinik Şablonu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-[#8A8F89] hover:text-[#1C211E] p-1 rounded-lg dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content Preview */}
            <div
              className="p-4 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#3F4540] space-y-2 leading-relaxed font-mono max-h-56 overflow-y-auto dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE]"
            >
              <p className="font-bold text-[#1C211E] dark:text-[#ECF3EE]">T.C. SAĞLIK BAKANLIĞI STANDART PROTOKOLÜ</p>
              <p>
                Bu resmi doküman, kliniğimizde uygulanan tedavi öncesinde hastanın ve hekimin yasal haklarını,
                tedavi süreçlerini, olası komplikasyonları ve aydınlatılmış rıza şartlarını kayıt altına alır.
              </p>
              <p className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
                • Revizyon No: 2026/04 • Geçerlilik: 1 Yıl • Dijital ve Islak İmza Geçerlidir.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8] dark:border-[#243B2F]">
              <Link
                href={previewDoc.href}
                className="text-xs font-semibold text-[#2F5A3D] hover:underline flex items-center gap-1 dark:text-[#76D28F]"
              >
                İlgili Modüle Git <ArrowRight className="size-3.5" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrint(previewDoc)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6E1D8] bg-white text-xs font-semibold text-[#1C211E] hover:bg-[#EEEBE4] transition-colors cursor-pointer dark:bg-[#1A2C23] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#1E3026]"
                >
                  <Printer className="size-3.5" /> Yazdır / PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDoc(null);
                    showToast(`✓ "${previewDoc.title}" başarıyla indirildi.`, "success");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3327] text-white text-xs font-bold hover:bg-[#2D3A32] transition-colors cursor-pointer dark:hover:bg-[#285A3B]"
                >
                  <Download className="size-3.5" /> İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
