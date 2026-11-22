"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  FileText,
  Download,
  Printer,
  Plus,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Search,
  BookOpen,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";

export interface DocumentTemplate {
  id: string;
  title: string;
  type: "Onam" | "Sözleşme" | "Rapor" | "Protokol";
  lastUpdated: string;
  content?: string;
}

const defaultTemplates: DocumentTemplate[] = [
  { id: "1", title: "Aydınlatılmış Onam Formu (İmplant Cerrahi)", type: "Onam", lastUpdated: "Ekim 2026", content: "Hastaya implant cerrahisi, greft uygulaması, olası riskler ve post-op bakım detaylıca açıklanmıştır." },
  { id: "2", title: "Genel Dişhekimliği ve Anestezi Onam Formu", type: "Onam", lastUpdated: "Eylül 2026", content: "Lokal anestezi riskleri, alerji durumu ve genel konservatif tedavi rıza beyanıdır." },
  { id: "3", title: "Kök Kanal Tedavisi Bilgilendirme ve Rıza Belgesi", type: "Onam", lastUpdated: "Ağustos 2026", content: "Endodontik tedavi sürecinde alet kırılması, perforasyon ve başarı oranları konusunda bilgilendirilmiştir." },
  { id: "4", title: "Ortodontik Tedavi Sözleşmesi ve Taahhütname", type: "Sözleşme", lastUpdated: "Ekim 2026", content: "Braket bakımı, aparey kullanım saatleri, randevu devamlılığı ve mali takvim taahhüdünü kapsar." },
  { id: "5", title: "Hastane / İstirahat İş Göremezlik Rapor Şablonu", type: "Rapor", lastUpdated: "Kasım 2026", content: "Cerrahi müdahale sonrası hastanın fiziksel dinlenmesi için resmi istirahat şablonudur." },
  { id: "6", title: "Pedodonti (Çocuk Diş) Veli Bilgilendirme Formu", type: "Onam", lastUpdated: "Eylül 2026", content: "Çocuk hastalarda sedasyon/genel anestezi veya restoratif işlemlere yönelik veli onayıdır." },
];

export default function BelgelerPage() {
  const { showToast, openPrintPreview } = useModal();
  const [templates, setTemplates] = useState<DocumentTemplate[]>(defaultTemplates);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Tümü");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentTemplate | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocumentTemplate["type"]>("Onam");
  const [content, setContent] = useState("");

  // Delete State
  const [docToDelete, setDocToDelete] = useState<DocumentTemplate | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_document_templates");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updated: DocumentTemplate[]) => {
    setTemplates(updated);
    try {
      localStorage.setItem("dentapp_document_templates", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenCreate = () => {
    setEditingDoc(null);
    setTitle("");
    setType("Onam");
    setContent("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DocumentTemplate) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setType(doc.type);
    setContent(doc.content || "");
    setIsModalOpen(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingDoc) {
      const updated = templates.map((t) =>
        t.id === editingDoc.id
          ? {
              ...t,
              title: title.trim(),
              type,
              content: content.trim(),
              lastUpdated: "Kasım 2026",
            }
          : t
      );
      saveToStorage(updated);
      showToast(`✓ "${title}" şablonu güncellendi.`, "success");
    } else {
      const newDoc: DocumentTemplate = {
        id: String(Date.now()),
        title: title.trim(),
        type,
        lastUpdated: "Kasım 2026",
        content: content.trim(),
      };
      saveToStorage([newDoc, ...templates]);
      showToast(`✓ Yeni belge şablonu eklendi: "${title}".`, "success");
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!docToDelete) return;
    const targetTitle = docToDelete.title;
    const updated = templates.filter((t) => t.id !== docToDelete.id);
    saveToStorage(updated);
    setDocToDelete(null);
    showToast(`✓ "${targetTitle}" şablonu silindi.`, "info");
  };

  const handleResetDefaults = () => {
    saveToStorage(defaultTemplates);
    showToast("✓ Belge şablonları varsayılana sıfırlandı.", "info");
  };

  const handlePrint = (doc: DocumentTemplate) => {
    openPrintPreview({
      type: "consent",
      title: doc.title,
      patientName: "Tuğçe Üngör",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "Dr. Selin Yılmaz",
      extraInfo: {
        "Belge Türü": doc.type,
        "Son Revizyon": doc.lastUpdated,
        "Klinik Hukuki Kayıt No": `HL-${doc.id}092`,
        "Şablon Açıklaması": doc.content || "Standart aydınlatılmış onam ve hasta rıza taahhütnamesi.",
      },
    });
  };

  const filtered = templates.filter((doc) => {
    const matchType = selectedType === "Tümü" || doc.type === selectedType;
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <BannerHeader
        title="Belgeler & Hukuki Onam Formları"
        description="Resmi hasta onam formları, anamnez şablonları, tedavi sözleşmeleri ve imzaya hazır hukuki metinler."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Belgeler" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-[#2D4A3E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + Yeni Belge Şablonu
            </button>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs">
        <div className="flex items-center gap-2">
          {["Tümü", "Onam", "Sözleşme", "Rapor"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedType === t
                  ? "bg-[#2D4A3E] text-white shadow-2xs"
                  : "bg-stone-100 dark:bg-[#1A2D23] text-stone-600 dark:text-[#90A199] hover:bg-stone-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Form veya şablon adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-60 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 text-xs outline-none"
          />

          <button
            onClick={handleResetDefaults}
            title="Varsayılan Şablonlara Sıfırla"
            className="p-2 rounded-xl border border-stone-200 dark:border-[#233C30] text-stone-500 hover:text-stone-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#122019] border border-stone-200/80 dark:border-[#1E332A] shadow-xs hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-[#182C22] text-[#2D4A3E] dark:text-[#7CC9A6] text-[11px] font-bold">
                  {doc.type}
                </span>
                <span className="text-[11px] text-stone-400">{doc.lastUpdated}</span>
              </div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2] leading-snug">
                {doc.title}
              </h3>
              {doc.content && (
                <p className="mt-2 text-xs text-stone-500 line-clamp-2">{doc.content}</p>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 dark:border-[#1E332A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(doc)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-[#D1DDD6] hover:text-[#2D4A3E] transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Yazdır
                </button>
                <button
                  onClick={() => handlePrint(doc)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> PDF Önizle
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  title="Şablonu Düzenle"
                  className="p-1 rounded-lg border border-stone-200 dark:border-[#233C30] hover:bg-stone-50 text-stone-600 dark:text-stone-300 cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setDocToDelete(doc)}
                  title="Şablonu Sil"
                  className="p-1 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {editingDoc ? "Belge Şablonunu Düzenle" : "Yeni Belge Şablonu Tanımla"}
            </h3>

            <form onSubmit={handleSaveDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Belge & Form Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ortodontik Tedavi Rıza Formu..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Hukuki Tür
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2.5 outline-none"
                >
                  <option value="Onam">Aydınlatılmış Onam Formu</option>
                  <option value="Sözleşme">Hasta Tedavi Sözleşmesi</option>
                  <option value="Rapor">İstirahat / Sağlık Raporu</option>
                  <option value="Protokol">Klinik Protokolü</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Form İçeriği & Hukuki Metin
                </label>
                <textarea
                  rows={4}
                  placeholder="Hastanın bilgilendirilmesi gereken hususlar, hekim ve hasta sorumlulukları..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] p-2.5 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-white font-bold hover:bg-[#3A5F50]"
                >
                  {editingDoc ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Belge Şablonunu Sil?
                </h3>
                <p className="text-xs text-stone-500">
                  Bu şablon sistemden kalıcı olarak silinecektir.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold p-3 bg-stone-50 dark:bg-[#16261F] rounded-xl border border-stone-200 dark:border-[#1E332A]">
              {docToDelete.title}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-[#1E332A]">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600"
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
