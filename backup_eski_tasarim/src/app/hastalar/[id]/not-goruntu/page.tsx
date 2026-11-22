"use client";

import React, { useState } from "react";
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
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import { patientNotes as initialNotes } from "@/lib/mock-data";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/modals/ModalContext";

export default function NotGoruntuPage() {
  const { openLightbox, showToast } = useModal();
  // Notes State
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes[0]?.id || null
  );
  const [sortAsc, setSortAsc] = useState(false);

  // New Note Modal / Inline State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteContent, setEditNoteContent] = useState("");

  // Image State
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");

  // Filtered & Sorted Notes
  const filteredNotes = notes
    .filter((n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.date.includes(searchQuery)
    )
    .sort((a, b) => {
      // Parse DD.MM.YYYY
      const parseDate = (d: string) => {
        const parts = d.split(".");
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
        }
        return new Date(d).getTime() || 0;
      };
      return sortAsc
        ? parseDate(a.date) - parseDate(b.date)
        : parseDate(b.date) - parseDate(a.date);
    });

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
  };

  const handleDeleteNote = (id: string | null) => {
    if (!id) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setSelectedNoteId(remaining[0]?.id || null);
  };

  const handleSaveEdit = () => {
    if (!selectedNoteId || !editNoteContent.trim()) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, content: editNoteContent.trim() } : n
      )
    );
    setIsEditingNote(false);
  };

  const startEditNote = () => {
    const current = notes.find((n) => n.id === selectedNoteId);
    if (current) {
      setEditNoteContent(current.content);
      setIsEditingNote(true);
    }
  };

  // Mock Upload Image
  const handleUploadClick = () => {
    // Add a placeholder dental xray simulation
    const simulatedImage =
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800";
    setImages([...images, simulatedImage]);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* Top Header Row with "+ Yeni Not" & "Düzenle" */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Notlar ve Klinik Görüntüler
          </h2>
          <p className="text-xs text-gray-500">
            Hasta tedavi süreci notları ve radyolojik görüntü arşivleri
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={startEditNote}
            disabled={!selectedNoteId}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 disabled:opacity-50"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
            <span>Düzenle</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#3A5F50]"
          >
            <Plus className="h-4 w-4" />
            <span>+ Yeni Not</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Two-Panel Layout (Left: Notlar | Right: Görüntü) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ============================================================ */}
        {/* Left Panel: Notlar (6 cols) */}
        {/* ============================================================ */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
            {/* Blue Info Banner at Top */}
            <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/90 dark:bg-blue-950/40 dark:border-blue-900/60 p-4 text-blue-900 dark:text-blue-200 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 text-xs leading-relaxed">
                  <span className="font-semibold text-blue-950 dark:text-white">
                    Yapay Zeka Destekli Radyoloji
                  </span>
                  <p className="text-blue-800/90 dark:text-blue-300">
                    Panoramik, Bitewing, Periapikal görüntüyü
                    yükledikten sonra üzerindeki renkli düğmeye basarak filmlerinizin
                    yapay zeka ile analizini yapabilirsiniz.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  openLightbox({
                    imageSrc: "/images/dashboard/xray-1.png",
                    title: "Tuğçe Üngör - Panoramik",
                    patientName: "Tuğçe Üngör",
                    date: "09.09.2026",
                    type: "Panoramik",
                  })
                }
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Analizini Aç
              </button>
            </div>

            {/* Toolbar: Add (+), Delete (trash), Edit (pencil) & Search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Not Ekle"
                  onClick={() => setIsAddingNote(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Seçili Notu Sil"
                  onClick={() => handleDeleteNote(selectedNoteId)}
                  disabled={!selectedNoteId}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Seçili Notu Düzenle"
                  onClick={startEditNote}
                  disabled={!selectedNoteId}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              {/* Search input: "Not ara..." */}
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Not ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-800 outline-none transition focus:border-[#4A7C68] focus:ring-1 focus:ring-[#4A7C68]"
                />
              </div>
            </div>

            {/* Inline Add Note Form */}
            {isAddingNote && (
              <div className="mb-4 rounded-xl border border-[#4A7C68]/30 bg-[#4A7C68]/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2D4A3E]">
                  <span>Yeni Not Ekle</span>
                  <button
                    onClick={() => setIsAddingNote(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Not metnini giriniz..."
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 outline-none focus:border-[#4A7C68]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="flex items-center gap-1 rounded-lg bg-[#2D4A3E] px-3 py-1 text-xs font-semibold text-white hover:bg-[#3A5F50]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Kaydet</span>
                  </button>
                </div>
              </div>
            )}

            {/* Inline Edit Note Form */}
            {isEditingNote && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                  <span>Notu Düzenle</span>
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editNoteContent}
                  onChange={(e) => setEditNoteContent(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-800 outline-none focus:border-[#4A7C68]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(false)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 rounded-lg bg-[#2D4A3E] px-3 py-1 text-xs font-semibold text-white hover:bg-[#3A5F50]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Güncelle</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notes Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th
                      onClick={() => setSortAsc(!sortAsc)}
                      className="cursor-pointer py-2.5 px-3 w-28 hover:text-gray-900 select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>Tarih</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Not</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredNotes.map((note) => {
                    const isSelected = selectedNoteId === note.id;
                    return (
                      <tr
                        key={note.id}
                        onClick={() => setSelectedNoteId(note.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#4A7C68]/10 font-medium text-[#1B3329]"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap align-top">
                          {note.date}
                        </td>
                        <td className="py-3 px-3 leading-relaxed text-gray-800">
                          {note.content}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredNotes.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-400">
                        Eşleşen not bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Right Panel: Görüntü (6 cols) */}
        {/* ============================================================ */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
            {/* Header + Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#4A7C68]" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Görüntü
                </h3>
              </div>

              {/* Toolbar Icons & Counter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                  <button
                    type="button"
                    title="Kamera"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Yükle"
                    onClick={handleUploadClick}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="İndir"
                    disabled={images.length === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Grid Görünümü"
                    onClick={() =>
                      setViewMode(viewMode === "single" ? "grid" : "single")
                    }
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition",
                      viewMode === "grid"
                        ? "bg-[#2D4A3E] text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Grid Toggle"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

                {/* Counter & Navigation */}
                <div className="flex items-center gap-1.5 pl-1">
                  <button
                    type="button"
                    title="Önceki Görüntü"
                    disabled={images.length <= 1 || imageIndex === 0}
                    onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-xs font-mono font-medium text-gray-600 px-1">
                    {images.length > 0 ? `${imageIndex + 1} / ${images.length}` : "0 / 0"}
                  </span>

                  <button
                    type="button"
                    title="Sonraki Görüntü"
                    disabled={images.length <= 1 || imageIndex >= images.length - 1}
                    onClick={() =>
                      setImageIndex(
                        Math.min(images.length - 1, imageIndex + 1)
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State / Image Viewer Canvas */}
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              {images.length > 0 ? (
                <div className="relative flex flex-col items-center justify-center w-full">
                  <img
                    src={images[imageIndex]}
                    alt="Dental Film"
                    className="max-h-[300px] rounded-lg object-contain shadow-sm"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg bg-[#4A7C68] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3A5F50]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Yapay Zeka ile Analiz Et</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== imageIndex))
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Görüntü seçin veya yükleyin
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-gray-400">
                    Panoramik, Bitewing, Periapikal röntgen veya klinik fotoğrafları
                    buraya sürükleyip bırakabilirsiniz
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-[#3A5F50]"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Dosya Seç</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-xs transition hover:bg-gray-50"
                    >
                      <Camera className="h-3.5 w-3.5 text-gray-500" />
                      <span>Kamera Aç</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
