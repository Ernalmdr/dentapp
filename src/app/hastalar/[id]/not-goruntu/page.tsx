"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  Pencil,
  Search,
  Camera,
  Upload,
  Download,
  Grid,
  Columns2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  X,
  FileText,
  ImageIcon,
} from "lucide-react";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modals/ModalContext";

export default function NotGoruntuPage() {
  const { openLightbox, showToast } = useModal();
  const params = useParams();
  const patientId = (params?.id as string) || "2";

  // Initial Sample Notes matching Figma requirements
  const defaultNotes: Note[] = [
    {
      id: "note-1",
      date: "21.11.2026",
      content: "5 üye kaplama toplam 40.000TL olarak anlaşıldı. 15.000TL peşinat alındı, kalan bakiye teslimde ödenecek.",
    },
    {
      id: "note-2",
      date: "09.11.2026",
      content: "11 NOLU DİŞ KANALA GİDEBİLİR. Perküsyon hassasiyeti mevcut, 1 hafta sonra kontrol edilecek.",
    },
    {
      id: "note-3",
      date: "26.08.2026",
      content: "16 nolu dişe kompozit dolgu yapıldı. Anestezi komplikasyonsuz tamamlandı.",
    },
    {
      id: "note-4",
      date: "14.08.2026",
      content: "25 nolu diş çekimi ve aynı seansta cerrahi implant uygulaması gerçekleştirildi.",
    },
  ];

  // Notes state
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("note-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Images state
  const defaultImages = [
    "/images/dashboard/xray-1.png",
    "/images/dashboard/xray-2.png",
    "/images/dashboard/xray-3.png",
    "/images/dashboard/xray-4.png",
  ];
  const [images, setImages] = useState<string[]>(defaultImages);
  const [imageIndex, setImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"single" | "compare" | "grid">("single");
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dentapp_patient_notes_${patientId}`);
      if (stored) {
        setNotes(JSON.parse(stored));
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
      localStorage.setItem(`dentapp_patient_notes_${patientId}`, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes, patientId, isLoaded]);

  // Handlers
  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const newNote: Note = {
      id: String(Date.now()),
      date: formattedDate,
      content: newNoteContent.trim(),
    };

    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setNewNoteContent("");
    setIsAddingNote(false);
    showToast("✓ Yeni klinik notu kaydedildi.", "success");
  };

  const handleSaveEdit = () => {
    if (!selectedNoteId || !editNoteContent.trim()) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, content: editNoteContent.trim() } : n
      )
    );
    setIsEditingNote(false);
    showToast("✓ Klinik notu güncellendi.", "success");
  };

  const handleDeleteNote = (id: string | null) => {
    if (!id) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setSelectedNoteId(remaining[0]?.id || null);
    showToast("Klinik notu silindi.", "info");
  };

  const startEditNote = () => {
    const current = notes.find((n) => n.id === selectedNoteId);
    if (current) {
      setEditNoteContent(current.content);
      setIsEditingNote(true);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImages((prev) => [url, ...prev]);
        setImageIndex(0);
        showToast("✓ Radyolojik görüntü yüklendi.", "success");
      }
    };
    input.click();
  };

  const handleDownloadImage = () => {
    const currentSrc = images[imageIndex];
    if (!currentSrc) return;
    const a = document.createElement("a");
    a.href = currentSrc;
    a.download = `dental-xray-${patientId}-${imageIndex + 1}.png`;
    a.click();
    showToast("Görüntü indirme başlatıldı.", "info");
  };

  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.date.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. ÜST KISIM: AI Analiz Bilgilendirme Banner'ı */}
      {/* ============================================================ */}
      <div className="rounded-[16px] border border-[#C5D6C0] bg-[#E2EEDD] p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2C6A3B] text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F3327]">
              Yapay Zeka Destekli Radyoloji Analizi
            </h3>
            <p className="text-xs sm:text-sm text-[#2C6A3B] leading-relaxed">
              Panoramik, Bitewing, Periapikal ve Sefalometrik filmlerinizin yapay zeka ile otomatik analizini yapabilirsiniz.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAiBoxes(true);
            openLightbox({
              imageSrc: images[imageIndex] || "/images/dashboard/xray-1.png",
              title: "Tuğçe Üngör - Panoramik AI Teşhis Dökümü",
              patientName: "Tuğçe Üngör",
              date: "21.11.2026",
              type: "Panoramik Röntgen",
            });
          }}
          className="flex items-center gap-2 rounded-xl bg-[#1F3327] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#2D3A32] cursor-pointer shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Analizini Başlat</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. İKİ KOLONLU ANA PANEL: Notlar (Sol) | Görüntüleme (Sağ) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* SOL PANEL: Notlar Tablosu (5 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs min-h-[560px]">
          <div>
            {/* Header: Title + Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D8]">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#1F3327]" />
                <h3 className="text-xl font-serif font-bold text-[#1C211E] tracking-tight">
                  Notlar
                </h3>
                <span className="rounded-full bg-[#EEEBE4] px-2.5 py-0.5 text-xs font-semibold text-[#3F4540]">
                  {notes.length}
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Yeni Not Ekle"
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#1F3327] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Yeni Not</span>
                </button>
                <button
                  type="button"
                  title="Seçili Notu Düzenle"
                  onClick={startEditNote}
                  disabled={!selectedNoteId}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-[#5F665F]" />
                </button>
                <button
                  type="button"
                  title="Seçili Notu Sil"
                  onClick={() => handleDeleteNote(selectedNoteId)}
                  disabled={!selectedNoteId}
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#B3261E] shadow-2xs hover:bg-[#FBE9E7] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mt-3 mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F]" />
              <input
                type="text"
                placeholder="Notlarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#E6E1D8] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#1C211E] placeholder-[#8A8F89] outline-none transition focus:border-[#1F3327]"
              />
            </div>

            {/* Add Note Inline Form */}
            {isAddingNote && (
              <div className="mb-4 rounded-xl border border-[#EADFC8] bg-[#F6EEDC] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1C211E]">
                  <span>Yeni Klinik Not Ekle</span>
                  <button
                    onClick={() => setIsAddingNote(false)}
                    className="text-[#5F665F] hover:text-[#1C211E] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Not metnini giriniz (ör. 11 NOLU DİŞ KANALA GİDEBİLİR...)"
                  className="w-full rounded-lg border border-[#E6E1D8] bg-white p-2.5 text-xs text-[#1C211E] outline-none focus:border-[#1F3327]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="rounded-lg border border-[#E6E1D8] bg-white px-3 py-1 text-xs font-medium text-[#3F4540] hover:bg-[#F3F0EA] cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="flex items-center gap-1 rounded-lg bg-[#1F3327] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#2D3A32] cursor-pointer shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Kaydet</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edit Note Inline Form */}
            {isEditingNote && (
              <div className="mb-4 rounded-xl border border-[#CFCAC0] bg-white p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1C211E]">
                  <span>Notu Düzenle</span>
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="text-[#5F665F] hover:text-[#1C211E] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editNoteContent}
                  onChange={(e) => setEditNoteContent(e.target.value)}
                  className="w-full rounded-lg border border-[#E6E1D8] bg-white p-2.5 text-xs text-[#1C211E] outline-none focus:border-[#1F3327]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(false)}
                    className="rounded-lg border border-[#E6E1D8] bg-white px-3 py-1 text-xs font-medium text-[#3F4540] hover:bg-[#F3F0EA] cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 rounded-lg bg-[#1F3327] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#2D3A32] cursor-pointer shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Güncelle</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notes Table */}
            <div className="overflow-hidden rounded-xl border border-[#E6E1D8] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E6E1D8] bg-[#EEEBE4]/60 text-[#5F665F]">
                  <tr>
                    <th className="py-2.5 px-3 w-28 font-semibold">Tarih</th>
                    <th className="py-2.5 px-3 font-semibold">Klinik Notu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {filteredNotes.map((note) => {
                    const isSelected = selectedNoteId === note.id;
                    return (
                      <tr
                        key={note.id}
                        onClick={() => setSelectedNoteId(note.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#F6EEDC] text-[#1C211E]"
                            : "hover:bg-[#F3F0EA]/60 text-[#3F4540]"
                        )}
                      >
                        <td className="py-3 px-3 font-semibold text-[#1C211E] whitespace-nowrap align-top">
                          {note.date}
                        </td>
                        <td className="py-3 px-3 leading-relaxed">
                          {note.content}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredNotes.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-[#5F665F]">
                        Aramaya uygun not bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6E1D8] text-xs text-[#5F665F]">
            Toplam {notes.length} klinik not kayıtlıdır.
          </div>
        </div>

        {/* ========================================================= */}
        {/* SAĞ PANEL: Görüntüleme & Radyoloji (7 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-[16px] border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs min-h-[560px]">
          <div>
            {/* Görüntüleme Üst Araç Çubuğu */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6E1D8]">
              {/* Sol: Başlık & Aksiyon Butonları (Fotoğraf Çek, Yükle, İndir, Karşılaştır, Izgara) */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast("Klinik kamera bağlantısı başlatılıyor...", "info")}
                  title="Fotoğraf Çek"
                  className="flex items-center gap-1.5 rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5 text-[#5F665F]" />
                  <span>Fotoğraf Çek</span>
                </button>

                <button
                  type="button"
                  onClick={handleUploadClick}
                  title="Görüntü Yükle"
                  className="flex items-center gap-1.5 rounded-lg border border-[#E6E1D8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-[#5F665F]" />
                  <span>Görüntü Yükle</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  title="İndir"
                  className="rounded-lg border border-[#E6E1D8] bg-white p-2 text-[#3F4540] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-[#5F665F]" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "compare" ? "single" : "compare")}
                  title="Karşılaştır"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium shadow-2xs transition-colors cursor-pointer",
                    viewMode === "compare"
                      ? "border-[#1F3327] bg-[#1F3327] text-white"
                      : "border-[#E6E1D8] bg-white text-[#3F4540] hover:bg-[#F3F0EA]"
                  )}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                  <span>Karşılaştır</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "grid" ? "single" : "grid")}
                  title="Izgara Görünümü"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium shadow-2xs transition-colors cursor-pointer",
                    viewMode === "grid"
                      ? "border-[#1F3327] bg-[#1F3327] text-white"
                      : "border-[#E6E1D8] bg-white text-[#3F4540] hover:bg-[#F3F0EA]"
                  )}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>Izgara</span>
                </button>
              </div>

              {/* Sağ: Sayaç & Navigasyon & Zoom */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  title="Küçült"
                  className="rounded-lg border border-[#E6E1D8] bg-white p-1.5 text-[#5F665F] hover:bg-[#F3F0EA] cursor-pointer"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
                  title="Büyüt"
                  className="rounded-lg border border-[#E6E1D8] bg-white p-1.5 text-[#5F665F] hover:bg-[#F3F0EA] cursor-pointer"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1 pl-1 border-l border-[#E6E1D8]">
                  <button
                    type="button"
                    onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
                    disabled={imageIndex === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E6E1D8] bg-white text-[#5F665F] hover:bg-[#F3F0EA] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-xs font-mono font-bold text-[#1C211E] px-1">
                    {images.length > 0 ? `${imageIndex + 1} / ${images.length}` : "0 / 0"}
                  </span>

                  <button
                    type="button"
                    onClick={() => setImageIndex(Math.min(images.length - 1, imageIndex + 1))}
                    disabled={imageIndex >= images.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E6E1D8] bg-white text-[#5F665F] hover:bg-[#F3F0EA] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Image Viewer Canvas */}
            <div className="mt-4 relative overflow-hidden rounded-xl border border-[#E6E1D8] bg-[#121815] min-h-[360px] flex items-center justify-center p-4">
              {viewMode === "single" && (
                <div
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={images[imageIndex] || "/images/dashboard/xray-1.png"}
                    alt="Dental Röntgen"
                    className="max-h-[340px] w-auto rounded-lg object-contain select-none shadow-md"
                  />

                  {/* AI Detection Overlays if active */}
                  {showAiBoxes && (
                    <>
                      {/* Detection Box 1: Tooth 11 */}
                      <div className="absolute top-[35%] left-[45%] w-12 h-16 border-2 border-dashed border-[#F59E0B] rounded bg-[#F59E0B]/20 pointer-events-none flex flex-col justify-between p-0.5">
                        <span className="bg-[#F59E0B] text-black font-bold text-[9px] px-1 rounded-xs self-start">
                          11: Kanal İhtiyacı
                        </span>
                      </div>

                      {/* Detection Box 2: Tooth 36 */}
                      <div className="absolute top-[50%] left-[25%] w-14 h-16 border-2 border-dashed border-[#10B981] rounded bg-[#10B981]/20 pointer-events-none flex flex-col justify-between p-0.5">
                        <span className="bg-[#10B981] text-white font-bold text-[9px] px-1 rounded-xs self-start">
                          36: Başarılı Dolgu
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {viewMode === "compare" && (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-[#8A8F89] mb-1">Önceki Film (14.08.2026)</span>
                    <img
                      src={images[1] || images[0]}
                      alt="Önceki Film"
                      className="max-h-[280px] rounded-lg object-contain border border-[#34483B]"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-[#8A8F89] mb-1">Mevcut Film (21.11.2026)</span>
                    <img
                      src={images[0]}
                      alt="Mevcut Film"
                      className="max-h-[280px] rounded-lg object-contain border border-[#34483B]"
                    />
                  </div>
                </div>
              )}

              {viewMode === "grid" && (
                <div className="grid grid-cols-2 gap-3 w-full max-h-[340px] overflow-y-auto">
                  {images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImageIndex(idx);
                        setViewMode("single");
                      }}
                      className={cn(
                        "p-1.5 rounded-lg border cursor-pointer transition-all",
                        imageIndex === idx
                          ? "border-[#3F8F55] bg-[#34483B]/50"
                          : "border-white/10 hover:border-white/30"
                      )}
                    >
                      <img
                        src={imgSrc}
                        alt={`Film ${idx + 1}`}
                        className="h-28 w-full object-cover rounded"
                      />
                      <span className="block mt-1 text-center text-[10px] font-mono text-gray-300">
                        Film #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="mt-4 pt-3 border-t border-[#E6E1D8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAiBoxes(!showAiBoxes)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  showAiBoxes
                    ? "bg-[#E2EEDD] border-[#C5D6C0] text-[#2C6A3B] font-semibold"
                    : "bg-white border-[#E6E1D8] text-[#5F665F]"
                }`}
              >
                {showAiBoxes ? "✓ AI İşaretçileri Açık" : "AI İşaretçilerini Göster"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  openLightbox({
                    imageSrc: images[imageIndex] || "/images/dashboard/xray-1.png",
                    title: `Tuğçe Üngör - Film #${imageIndex + 1}`,
                    patientName: "Tuğçe Üngör",
                    date: "21.11.2026",
                    type: "Dental Röntgen",
                  })
                }
                className="flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] bg-white px-3.5 py-2 text-xs font-medium text-[#1C211E] shadow-2xs hover:bg-[#F3F0EA] transition-colors cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5 text-[#5F665F]" />
                <span>Tam Ekran İncele</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAiBoxes(true);
                  showToast("✓ Yapay zeka ile panoramik film analizi tamamlandı. 2 bulgu tespit edildi.", "success");
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#2D3A32] transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Yapay Zeka ile Analiz Et</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
