"use client";

import React, { useState, useEffect } from "react";
import Link from "next/image";
import NextLink from "next/link";
import Image from "next/image";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Search,
  UploadCloud,
  Sparkles,
  Maximize2,
  Pencil,
  Trash2,
  Filter,
  Calendar,
  RotateCcw,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  User,
  Activity,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";
import { ImageUploadModal, ArchiveImageItem } from "@/components/modals/ImageUploadModal";

const defaultArchiveImages: ArchiveImageItem[] = [
  {
    id: "img-1",
    patientName: "Tuğçe Üngör",
    type: "Panoramik",
    date: "21.11.2026",
    src: "/images/dashboard/xray-1.png",
    notes: "Sol alt 38 nolu gömülü 20 yaş dişinin mandibular kanala yakınlığı ve ortodontik planlama.",
    doctor: "Dr. Selin Yılmaz",
    region: "Tüm Çene",
  },
  {
    id: "img-2",
    patientName: "Ayşe Demir",
    type: "Periapikal",
    date: "20.11.2026",
    src: "/images/dashboard/xray-2.png",
    notes: "16 nolu molar kök ucunda şüpheli radyolüsensi; kanal tedavisi öncesi detay inceleme.",
    doctor: "Dt. Mahir Açıkalın",
    region: "16 Molar",
  },
  {
    id: "img-3",
    patientName: "Mehmet Kaya",
    type: "CBCT (3D)",
    date: "27.10.2026",
    src: "/images/dashboard/xray-3.png",
    notes: "Üst çene posterior sinüs tabanı kemik yüksekliği ölçümü ve implant planlaması.",
    doctor: "Dr. Selin Yılmaz",
    region: "Sağ Üst Sinüs",
  },
  {
    id: "img-4",
    patientName: "Zeynep Arslan",
    type: "Bitewing",
    date: "26.10.2026",
    src: "/images/dashboard/xray-4.png",
    notes: "Molar ve premolar arayüz başlangıç çürüklerinin erken teşhis taraması.",
    doctor: "Dt. Kemal Aydın",
    region: "Bilateral Premolar",
  },
  {
    id: "img-5",
    patientName: "Emre Çelik",
    type: "Panoramik",
    date: "09.09.2026",
    src: "/images/dashboard/xray-1.png",
    notes: "Ortodontik braketleme öncesi kök paralelizm ve kemik kret seviyesi kontrolü.",
    doctor: "Dr. Selin Yılmaz",
    region: "Tüm Çene",
  },
  {
    id: "img-6",
    patientName: "Mahir Açıkalın",
    type: "Periapikal",
    date: "14.08.2026",
    src: "/images/dashboard/xray-2.png",
    notes: "25 nolu implant post-op osseointegrasyon ve krestal kemik stabilitesi kontrolü.",
    doctor: "Dr. Selin Yılmaz",
    region: "25 Premolar",
  },
];

export default function GoruntulerPage() {
  const { openLightbox, showToast } = useModal();

  const [images, setImages] = useState<ArchiveImageItem[]>(defaultArchiveImages);
  const [filterType, setFilterType] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "patient">("newest");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ArchiveImageItem | null>(null);

  // Delete Confirmation State
  const [imageToDelete, setImageToDelete] = useState<ArchiveImageItem | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_images_catalog");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed);
        }
      }
    } catch {
      // fallback to default
    }
  }, []);

  const saveImagesToStorage = (updated: ArchiveImageItem[]) => {
    setImages(updated);
    try {
      localStorage.setItem("dentapp_images_catalog", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenCreate = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ArchiveImageItem) => {
    setEditingImage(item);
    setIsModalOpen(true);
  };

  const handleSaveImage = (item: ArchiveImageItem) => {
    if (editingImage) {
      const updated = images.map((img) => (img.id === item.id ? item : img));
      saveImagesToStorage(updated);
      showToast(`✓ "${item.patientName}" hastasına ait ${item.type} kaydı güncellendi.`, "success");
    } else {
      const updated = [item, ...images];
      saveImagesToStorage(updated);
      showToast(`✓ Yeni ${item.type} görüntüsü "${item.patientName}" hastasına kaydedildi.`, "success");
    }
  };

  const confirmDeleteImage = () => {
    if (!imageToDelete) return;
    const targetInfo = `${imageToDelete.patientName} (${imageToDelete.type})`;
    const updated = images.filter((img) => img.id !== imageToDelete.id);
    saveImagesToStorage(updated);
    setImageToDelete(null);
    showToast(`✓ ${targetInfo} arşivi başarıyla silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveImagesToStorage(defaultArchiveImages);
    showToast("✓ Görüntü arşivi varsayılan klinik kayıtlarına sıfırlandı.", "info");
  };

  const types = ["Tümü", "Panoramik", "Periapikal", "CBCT (3D)", "Bitewing"];

  // Filtering & Sorting
  let filtered = images.filter((img) => {
    const matchesType =
      filterType === "Tümü" || img.type.toLowerCase().includes(filterType.toLowerCase().replace(" (3d)", ""));
    const matchesSearch =
      img.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.region && img.region.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  if (sortBy === "patient") {
    filtered = [...filtered].sort((a, b) => a.patientName.localeCompare(b.patientName, "tr-TR"));
  } else if (sortBy === "oldest") {
    filtered = [...filtered].reverse();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <BannerHeader
        title="Röntgen & Görüntü Arşivi"
        description="Klinik hastalarına ait panoramik, periapikal, CBCT 3D tomografi ve yapay zeka destekli radyoloji analizi."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Görüntüler" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <NextLink
              href="/goruntuler/yeni"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#122019] px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Yeni Sayfada Yükle
            </NextLink>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" />
              + Röntgen Yükle
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-[#122019] p-4 border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        {/* Modality Tabs & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => {
              const count =
                t === "Tümü"
                  ? images.length
                  : images.filter((img) =>
                      img.type.toLowerCase().includes(t.toLowerCase().replace(" (3d)", ""))
                    ).length;
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterType === t
                      ? "bg-[#2D4A3E] text-white shadow-xs"
                      : "bg-stone-100 dark:bg-[#1A2D23] text-stone-600 dark:text-[#90A199] hover:bg-stone-200 dark:hover:bg-[#233C30]"
                  }`}
                >
                  {t} <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetDefaults}
            title="Varsayılan Röntgen Arşivine Sıfırla"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#233C30] text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1A2D23] transition-colors cursor-pointer"
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
              placeholder="Hasta adı, diş bölgesi veya klinik not ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <option value="newest">En Yeni Çekimler</option>
              <option value="oldest">En Eski Çekimler</option>
              <option value="patient">Hasta Adı (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {filtered.length > 0 ? (
          filtered.map((img) => (
            <div
              key={img.id}
              className="flex flex-col rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] p-4 shadow-xs hover:shadow-lg transition-all group"
            >
              {/* Image Preview Container (Clicking opens Lightbox) */}
              <div
                onClick={() =>
                  openLightbox({
                    imageSrc: img.src,
                    title: `${img.patientName} — ${img.type}`,
                    patientName: img.patientName,
                    date: img.date,
                    type: img.type,
                  })
                }
                className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black border border-stone-900/60 shadow-inner cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={`${img.patientName} ${img.type}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-white/10">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  {img.type}
                </div>

                <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-xs text-white/80 group-hover:text-white group-hover:bg-[#2D4A3E] transition-all shadow-sm">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>

                {img.region && (
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-stone-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                    Bölge: {img.region}
                  </div>
                )}
              </div>

              {/* Meta & Actions */}
              <div className="mt-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2] group-hover:text-[#2D4A3E] dark:group-hover:text-[#7CC9A6] transition-colors">
                      {img.patientName}
                    </h3>
                    <span className="text-[11px] text-stone-400 font-mono">{img.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 dark:text-[#90A199] line-clamp-2">
                    {img.notes}
                  </p>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-[#1E332A] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox({
                        imageSrc: img.src,
                        title: `${img.patientName} — ${img.type}`,
                        patientName: img.patientName,
                        date: img.date,
                        type: img.type,
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Büyüt & AI Analiz
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(img)}
                      title="Kaydı Düzenle"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1D3227] hover:text-[#2D4A3E] transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageToDelete(img)}
                      title="Kaydı Arşivden Sil"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#16261F] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-stone-500 rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A]">
            <p className="font-semibold text-xs">Aradığınız kriterlere uygun röntgen kaydı bulunamadı.</p>
            <p className="text-[11px] text-stone-400 mt-1">
              Filtreleri temizleyebilir veya yeni bir röntgen yükleyebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Image Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveImage}
        initialData={editingImage}
      />

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Radyoloji Kaydını Sil
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Bu işlem görüntüyü arşivden kalıcı olarak silecektir.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-[#16261F] border border-stone-200/70 dark:border-[#1E332A]">
              <div className="relative h-12 w-14 rounded-lg bg-black overflow-hidden shrink-0">
                <Image src={imageToDelete.src} alt={imageToDelete.patientName} fill className="object-cover" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {imageToDelete.patientName}
                </span>
                <span className="text-[11px] text-stone-500">
                  {imageToDelete.type} • {imageToDelete.date}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1A2D23] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDeleteImage}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
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
