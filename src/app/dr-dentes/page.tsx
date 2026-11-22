"use client";

import React, { useState, useMemo } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import {
  Sparkles,
  CheckSquare,
  Square,
  RotateCcw,
  Plus,
  Printer,
  ShieldCheck,
  Stethoscope,
  Flame,
  AlertTriangle,
  Search,
  BookOpen,
  Filter,
  Users,
  Award,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  X,
  FileCheck,
} from "lucide-react";

export interface ChecklistTask {
  id: string;
  text: string;
  completed: boolean;
  role: "Klinik Asistanı" | "Sterilizasyon Sorumlusu" | "Tedavi Hekimi" | "Tüm Ekip";
}

export interface AssistantProtocol {
  id: string;
  title: string;
  category: "Sterilizasyon" | "Cerrahi Hazırlık" | "Endodonti" | "Klinik Açılış/Kapanış" | "Acil Yönetim";
  role: "Klinik Asistanı" | "Sterilizasyon Sorumlusu" | "Tedavi Hekimi" | "Tüm Ekip";
  estimatedTime: string;
  priority: "Kritik" | "Yüksek" | "Standart";
  description: string;
  checklist: ChecklistTask[];
  sterileInstruments: string[];
  safetyWarnings: string[];
}

const initialProtocols: AssistantProtocol[] = [
  {
    id: "prot-1",
    title: "Günlük Ünit Açılış & Dezenfeksiyon Kontrolü",
    category: "Klinik Açılış/Kapanış",
    role: "Klinik Asistanı",
    estimatedTime: "15 dk",
    priority: "Kritik",
    description: "Klinik mesaisi başlamadan önce ünit su hatlarının tahliyesi, emme sistemleri, reflektör ve yüzey dezenfeksiyonu protokolü.",
    checklist: [
      { id: "c1-1", text: "Ana su ve hava kompresör vanasını açın; ünit su basıncını (2.2 - 2.5 bar) kontrol edin.", completed: true, role: "Klinik Asistanı" },
      { id: "c1-2", text: "Türbin ve mikromotor su hatlarını 2 dakika boyunca lavaboya boşaltarak flush yapın.", completed: true, role: "Klinik Asistanı" },
      { id: "c1-3", text: "Cerrahi aspiratör filtresini kontrol edin; dezenfektanlı solüsyon çekin.", completed: true, role: "Klinik Asistanı" },
      { id: "c1-4", text: "Reflektör tutamaklarına ve tabla tutamaklarına tek kullanımlık bariyer kılıfları takın.", completed: false, role: "Klinik Asistanı" },
      { id: "c1-5", text: "Yüzey dezenfektanı ile hasta koltuğu ve hekim taburesini silin.", completed: false, role: "Klinik Asistanı" },
    ],
    sterileInstruments: ["Tek kullanımlık bariyer rulosu", "Yüzey dezenfeksiyon mendili", "Aspiratör dezenfektanı"],
    safetyWarnings: [
      "Su hatlarında biofilm oluşumunu engellemek için her sabah mutlaka 2 dk flush yapılmalıdır.",
      "Elektronik ekranlara direkt sprey sıkmayınız, mendile sıkarak siliniz.",
    ],
  },
  {
    id: "prot-2",
    title: "Otoklav & B Sınıfı Sterilizasyon Standart Protokolü",
    category: "Sterilizasyon",
    role: "Sterilizasyon Sorumlusu",
    estimatedTime: "45 dk",
    priority: "Kritik",
    description: "Aletlerin ultrasonik banyodan geçirilmesi, kurutulması, poşetlenmesi, Bowie-Dick testi ve 134°C B sınıfı otoklav döngüsü.",
    checklist: [
      { id: "c2-1", text: "Aletleri enzimatik solüsyonda 10 dk bekletip ultrasonik banyoda temizleyin.", completed: true, role: "Sterilizasyon Sorumlusu" },
      { id: "c2-2", text: "Aletleri durulayıp hava tabancası ile tamamen kurutun (nem paslanmaya yol açar).", completed: true, role: "Sterilizasyon Sorumlusu" },
      { id: "c2-3", text: "Her poşete indikatör şeridi koyun, termal yapıştırma ile hava sızdırmaz kapatın.", completed: true, role: "Sterilizasyon Sorumlusu" },
      { id: "c2-4", text: "Günün ilk döngüsünden önce Bowie-Dick / Helix buhar penetrasyon testini yapın.", completed: true, role: "Sterilizasyon Sorumlusu" },
      { id: "c2-5", text: "134°C Prion/Hassas programını başlatın; döngü bittiğinde veri fişini dijital arşive işleyin.", completed: false, role: "Sterilizasyon Sorumlusu" },
    ],
    sterileInstruments: ["B-Sınıfı Otoklav", "Termal Poşetleme Cihazı", "Helix Test Kiti", "Enzimatik Yıkama Solüsyonu"],
    safetyWarnings: [
      "Poşetleri üst üste yığmayınız, aralarında buhar sirkülasyonu için 1 cm mesafe bırakınız.",
      "Nemli çıkan poşetler kontamine kabul edilir ve döngü tekrarlanmalıdır.",
    ],
  },
  {
    id: "prot-3",
    title: "İmplant Cerrahisi Steril Masa ve Drapaj Hazırlığı",
    category: "Cerrahi Hazırlık",
    role: "Klinik Asistanı",
    estimatedTime: "20 dk",
    priority: "Kritik",
    description: "İmplant cerrahisi öncesinde hekim ve hasta steril drapajı, fizyodispenser kalibrasyonu ve cerrahi set dizilimi.",
    checklist: [
      { id: "c3-1", text: "Cerrahi masayı dezenfekte edip steril yeşil örtü ile çift kat drapeleyin.", completed: true, role: "Klinik Asistanı" },
      { id: "c3-2", text: "Fizyodispenser serum hortumunu steril teknisyene dokunmadan aseptik teknikle takın.", completed: false, role: "Klinik Asistanı" },
      { id: "c3-3", text: "İmplant cerrahi kasetini açın; frezlerin aşınma ve keskinlik durumunu gözden geçirin.", completed: false, role: "Klinik Asistanı" },
      { id: "c3-4", text: "Hastaya klorheksidinli (%0.2) gargara yaptırıp cerrahi delikli steril örtü ile örtün.", completed: false, role: "Klinik Asistanı" },
      { id: "c3-5", text: "İstenen çap ve boydaki implant kutularını açmadan tabla yanına hazır edin.", completed: false, role: "Klinik Asistanı" },
    ],
    sterileInstruments: ["Fizyodispenser ve Angldurva", "Steril Cerrahi Önlükler & Eldivenler", "Cerrahi Aspiratör Uçları", "Greft Çanağı & Pres"],
    safetyWarnings: [
      "Steril masa hazırlandıktan sonra asistan asla maskesiz ve eldivensiz alana yaklaşamaz.",
      "İmplant tüpünü sadece hekim steril pensetle almalıdır; titanyum yüzeye el değmemelidir.",
    ],
  },
  {
    id: "prot-4",
    title: "Kanal Tedavisi (Endodonti) Tepsi ve Kofferdam Protokolü",
    category: "Endodonti",
    role: "Klinik Asistanı",
    estimatedTime: "10 dk",
    priority: "Yüksek",
    description: "Kanal eğeleri (NiTi rotary), apeks bulucu, sodyum hipoklorit (NaOCl) irrigasyon enjektörleri ve lastik örtü (rubber dam) hazırlığı.",
    checklist: [
      { id: "c4-1", text: "Diş numarasına uygun rubber dam klempi, delme pensi ve taşıyıcı forsepsi hazırlayın.", completed: true, role: "Klinik Asistanı" },
      { id: "c4-2", text: "Endomotor tork ve devir ayarlarını kullanılacak NiTi eğe sistemine göre ayarlayın.", completed: true, role: "Klinik Asistanı" },
      { id: "c4-3", text: "%5.25 NaOCl ve %17 EDTA irrigasyon enjektörlerine side-vented uçlar takıp etiketleyin.", completed: true, role: "Klinik Asistanı" },
      { id: "c4-4", text: "Apeks bulucunun dudak kancasını ve eğe tutucusunu steril paketten çıkarın.", completed: false, role: "Klinik Asistanı" },
      { id: "c4-5", text: "Guta-perka ve kağıt konları (paper point) steril petri kabına dizin.", completed: false, role: "Klinik Asistanı" },
    ],
    sterileInstruments: ["Rubber Dam Kiti", "Endomotor", "Apeks Bulucu", "Rotary NiTi Eğeler"],
    safetyWarnings: [
      "NaOCl enjektörlerini asla normal serum veya anestezi enjektörleriyle karıştırmayınız; renkli bantla kodlayınız.",
      "Kofferdam olmadan kanal tedavisi çapraz enfeksiyon ve alet aspirasyonu riski taşır.",
    ],
  },
  {
    id: "prot-5",
    title: "Medikal Acil Durum & Mavi Kod Çantası Kontrolü",
    category: "Acil Yönetim",
    role: "Tüm Ekip",
    estimatedTime: "10 dk",
    priority: "Kritik",
    description: "Klinik içi senkop, alerjik reaksiyon, anafilaksi veya hipoglisemi durumlarında kullanılan acil ilaç çantası ve oksijen tüpü haftalık denetimi.",
    checklist: [
      { id: "c5-1", text: "Medikal oksijen tüpünün manometre basıncını (min 100 bar) ve maske hortumlarını kontrol edin.", completed: true, role: "Tüm Ekip" },
      { id: "c5-2", text: "Adrenalin (Epinefrin 1 mg/ml) ampullerin son kullanma tarihlerini kontrol edin.", completed: true, role: "Tüm Ekip" },
      { id: "c5-3", text: "Antihistaminik (Avil) ve kortikosteroid (Dekort) ampullerini tam sayıda teyit edin.", completed: true, role: "Tüm Ekip" },
      { id: "c5-4", text: "Otomatik Eksternal Defibrilatör (OED / AED) batarya ve elektrot ped durumunu test edin.", completed: true, role: "Tüm Ekip" },
      { id: "c5-5", text: "Glukometre (şeker ölçüm cihazı) striptest ve lansetlerini hazır bulundurun.", completed: true, role: "Tüm Ekip" },
    ],
    sterileInstruments: ["Oksijen Tüpü ve Ambü", "OED Defibrilatör", "Acil İlaç Kiti", "Tansiyon Aleti & Pulse Oksimetre"],
    safetyWarnings: [
      "Acil ilaç çantasının anahtarı daima asistan bankosunun altındaki sabit kutuda kilitli olmadan durmalıdır.",
      "Herhangi bir ilaç kullanıldığında 24 saat içinde yerine yenisi konmalıdır.",
    ],
  },
];

export default function DrDentesPage() {
  const { showToast, openPrintPreview } = useModal();
  const [protocols, setProtocols] = useState<AssistantProtocol[]>(initialProtocols);
  const [selectedRole, setSelectedRole] = useState<string>("Tümü");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  // Detail Modal
  const [selectedProtocolForDetail, setSelectedProtocolForDetail] = useState<AssistantProtocol | null>(null);

  // New Protocol Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<AssistantProtocol["category"]>("Sterilizasyon");
  const [newRole, setNewRole] = useState<AssistantProtocol["role"]>("Klinik Asistanı");
  const [newEstimatedTime, setNewEstimatedTime] = useState("15 dk");
  const [newDesc, setNewDesc] = useState("");
  const [newTasks, setNewTasks] = useState("");

  // Toggle checklist item
  const handleToggleTask = (protocolId: string, taskId: string) => {
    setProtocols((prev) =>
      prev.map((proto) => {
        if (proto.id !== protocolId) return proto;
        const updatedChecklist = proto.checklist.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...proto, checklist: updatedChecklist };
      })
    );
  };

  // Reset checklist for a protocol
  const handleResetChecklist = (protocolId: string) => {
    setProtocols((prev) =>
      prev.map((proto) => {
        if (proto.id !== protocolId) return proto;
        const updatedChecklist = proto.checklist.map((task) => ({ ...task, completed: false }));
        return { ...proto, checklist: updatedChecklist };
      })
    );
    showToast("Kontrol listesi sıfırlandı; yeni döngüye hazır.", "info");
  };

  // Complete all tasks for a protocol
  const handleCompleteAllTasks = (protocolId: string) => {
    setProtocols((prev) =>
      prev.map((proto) => {
        if (proto.id !== protocolId) return proto;
        const updatedChecklist = proto.checklist.map((task) => ({ ...task, completed: true }));
        return { ...proto, checklist: updatedChecklist };
      })
    );
    showToast("Tüm görevler tamamlandı olarak işaretlendi!", "success");
  };

  // Print Protocol SOP
  const handlePrintProtocol = (proto: AssistantProtocol) => {
    openPrintPreview({
      type: "consent",
      title: `${proto.title} — Standart Operasyon Protokolü (SOP)`,
      patientName: "DentaSphere Klinik Ekip Rehberi",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "Dr. DENTES Klinik Koordinatörlüğü",
      extraInfo: {
        "Kategori": proto.category,
        "Sorumlu Rol": proto.role,
        "Öncelik": proto.priority,
        "Tahmini Süre": proto.estimatedTime,
      },
      items: [
        { name: "Protokol Açıklaması", detail: proto.description },
        { name: "Gerekli Alet & Ekipman", detail: proto.sterileInstruments.join(", ") },
        { name: "Güvenlik & Sterilizasyon Uyarıları", detail: proto.safetyWarnings.join(" | ") },
        { name: "Adım Adım Kontrol Listesi", detail: proto.checklist.map((c, i) => `${i + 1}. ${c.text}`).join(" | ") },
      ],
    });
  };

  // Filtering
  const filteredProtocols = useMemo(() => {
    return protocols.filter((proto) => {
      const matchSearch =
        proto.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proto.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proto.checklist.some((c) => c.text.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole =
        selectedRole === "Tümü" || proto.role === selectedRole || proto.role === "Tüm Ekip";

      const matchCategory =
        selectedCategory === "Tümü" || proto.category === selectedCategory;

      return matchSearch && matchRole && matchCategory;
    });
  }, [protocols, searchQuery, selectedRole, selectedCategory]);

  // Overall completion metrics
  const totalTasks = useMemo(() => {
    let total = 0;
    let completed = 0;
    protocols.forEach((p) => {
      p.checklist.forEach((c) => {
        total++;
        if (c.completed) completed++;
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [protocols]);

  const handleCreateProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast("Lütfen başlık ve açıklama alanlarını doldurunuz.", "error");
      return;
    }

    const taskLines = newTasks
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedTasks: ChecklistTask[] =
      taskLines.length > 0
        ? taskLines.map((line, idx) => ({
            id: `task-${Date.now()}-${idx}`,
            text: line,
            completed: false,
            role: newRole === "Tüm Ekip" ? "Klinik Asistanı" : newRole,
          }))
        : [
            { id: `task-1`, text: "Standart hazırlık adımlarını tamamlayın.", completed: false, role: "Klinik Asistanı" },
            { id: `task-2`, text: "Hekime hazır olduğunu bildiriniz.", completed: false, role: "Klinik Asistanı" },
          ];

    const nextProtocol: AssistantProtocol = {
      id: `prot-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      role: newRole,
      estimatedTime: newEstimatedTime || "15 dk",
      priority: "Yüksek",
      description: newDesc.trim(),
      checklist: generatedTasks,
      sterileInstruments: ["Standart Muayene Seti", "Bariyer Koruyucu"],
      safetyWarnings: ["Tüm adımları eksiksiz sırasıyla uygulayınız."],
    };

    setProtocols([nextProtocol, ...protocols]);
    setIsCreateModalOpen(false);
    showToast(`"${nextProtocol.title}" protokolü sisteme eklendi.`, "success");

    setNewTitle("");
    setNewDesc("");
    setNewTasks("");
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] dark:bg-[#0D1410] p-6 lg:p-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* BannerHeader */}
        <BannerHeader
          title="Dr.DENTES Eğitimi & Klinik Asistanı"
          description="Klinik personeli, hekimler ve dental asistanlar için standart operasyon protokolleri (SOP), sterilizasyon standartları ve canlı kontrol listeleri."
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Dr.DENTES Eğitimi & Asistan" },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  showToast("Klinik SOP Kitapçığı PDF formatında hazırlandı.", "info");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2A3E33] px-4 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
              >
                <Printer className="h-4 w-4 text-[#5F665F] dark:text-[#90A199]" />
                SOP El Kitabı Yazdır
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" />
                Yeni Protokol / Kontrol Listesi
              </button>
            </div>
          }
        />

        {/* Global Progress & Quick Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Günlük Klinik Hazırlık Durumu</span>
              <span className="text-xs font-bold text-[#2C6A3B] dark:text-[#7CC9A6] bg-[#E2EEDD] dark:bg-[#1B3624] px-2 py-0.5 rounded-md">
                %{totalTasks.percentage} Hazır
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                {totalTasks.completed} / {totalTasks.total}
              </span>
              <span className="text-xs text-[#5F665F] dark:text-[#90A199]">adım tamamlandı</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-[#EEEBE4] dark:bg-[#213027] overflow-hidden">
              <div
                className="h-full bg-[#1F3327] dark:bg-[#7CC9A6] transition-all duration-300 rounded-full"
                style={{ width: `${totalTasks.percentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Kritik Sterilizasyon Güvencesi</span>
              <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2">
                <ShieldCheck className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2C6A3B] dark:text-[#7CC9A6]">134°C B-Sınıfı</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Bowie-Dick & Helix testleri tam onaylı</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Dr.DENTES Asistan Rozeti</span>
              <div className="rounded-xl bg-[#F3EADB] dark:bg-[#3D2C13] p-2">
                <Award className="h-5 w-5 text-[#7A5320] dark:text-[#ECC089]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#7A5320] dark:text-[#ECC089]">Seviye 3</span>
              <span className="text-xs text-[#7A5320] dark:text-[#ECC089] font-medium">Kıdemli Klinik Yetkinliği</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Son periyodik eğitim: 18 Kasım 2026</p>
          </div>
        </div>

        {/* Filter and Role Bar */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F89]" />
              <input
                type="text"
                placeholder="Protokol, kontrol adımı veya sterilizasyon aleti ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] pl-10 pr-4 py-2.5 text-sm text-[#1C211E] dark:text-[#F3F0EA] placeholder-[#8A8F89] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#5F665F] dark:text-[#90A199] mr-1">Rol:</span>
              {["Tümü", "Klinik Asistanı", "Sterilizasyon Sorumlusu", "Tedavi Hekimi"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedRole === role
                      ? "bg-[#1F3327] text-white"
                      : "bg-[#EEEBE4] hover:bg-[#E3DFD6] text-[#1C211E] dark:bg-[#213027] dark:text-[#E2EEDD]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
            >
              <option value="Tümü">Tüm Kategoriler</option>
              <option value="Klinik Açılış/Kapanış">Klinik Açılış/Kapanış</option>
              <option value="Sterilizasyon">Sterilizasyon</option>
              <option value="Cerrahi Hazırlık">Cerrahi Hazırlık</option>
              <option value="Endodonti">Endodonti</option>
              <option value="Acil Yönetim">Acil Yönetim</option>
            </select>
          </div>
        </div>

        {/* Protocols & Checklists Stack */}
        <div className="space-y-6">
          {filteredProtocols.length === 0 ? (
            <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-12 text-center text-[#5F665F] dark:text-[#90A199]">
              <ClipboardList className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-base font-semibold text-[#1C211E] dark:text-[#F3F0EA]">Eşleşen protokol bulunamadı</p>
              <p className="text-sm mt-1">Filtreleri temizleyebilir veya yeni bir kontrol listesi oluşturabilirsiniz.</p>
            </div>
          ) : (
            filteredProtocols.map((proto) => {
              const completedCount = proto.checklist.filter((t) => t.completed).length;
              const isAllDone = completedCount === proto.checklist.length;
              const percent = Math.round((completedCount / (proto.checklist.length || 1)) * 100);

              return (
                <div
                  key={proto.id}
                  className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-6 shadow-xs"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2.5">
                        <Sparkles className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[#EEEBE4] dark:bg-[#213027] px-2 py-0.5 text-xs font-semibold text-[#5F665F] dark:text-[#90A199]">
                            {proto.category}
                          </span>
                          <span className="text-xs font-medium text-[#7A5320] dark:text-[#ECC089]">
                            {proto.role}
                          </span>
                          <span className="text-xs text-[#5F665F] dark:text-[#90A199] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {proto.estimatedTime}
                          </span>
                        </div>
                        <h3 className="mt-1 font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                          {proto.title}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Badge & Action Buttons */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isAllDone
                            ? "bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#1B3624] dark:text-[#7CC9A6]"
                            : "bg-[#F3EADB] text-[#7A5320] dark:bg-[#3D2C13] dark:text-[#ECC089]"
                        }`}
                      >
                        {isAllDone ? "Tamamlandı (%100)" : `%${percent} (${completedCount}/${proto.checklist.length})`}
                      </span>

                      <button
                        onClick={() => handleResetChecklist(proto.id)}
                        className="p-1.5 rounded-lg text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027] transition-colors"
                        title="Listeyi Sıfırla"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleCompleteAllTasks(proto.id)}
                        className="p-1.5 rounded-lg text-[#2C6A3B] hover:bg-[#E2EEDD] dark:hover:bg-[#1B3624] transition-colors"
                        title="Tümünü Tamamla"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handlePrintProtocol(proto)}
                        className="p-1.5 rounded-lg text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027] transition-colors"
                        title="SOP Yazdır"
                      >
                        <Printer className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setSelectedProtocolForDetail(proto)}
                        className="rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2D3A32] px-3 py-1.5 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
                      >
                        Detay & Aletler
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-[#5F665F] dark:text-[#90A199] leading-relaxed">
                    {proto.description}
                  </p>

                  {/* Interactive Checklist Items */}
                  <div className="mt-4 space-y-2">
                    {proto.checklist.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(proto.id, task.id)}
                        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors select-none ${
                          task.completed
                            ? "bg-[#E2EEDD]/40 border-[#C5D6C0] dark:bg-[#1B3624]/30 dark:border-[#23352A]"
                            : "bg-white border-[#E6E1D8] hover:bg-[#EEEBE4]/40 dark:bg-[#0F1713] dark:border-[#23352A] dark:hover:bg-[#16211B]"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {task.completed ? (
                            <CheckSquare className="h-4 w-4 text-[#2C6A3B] dark:text-[#7CC9A6]" />
                          ) : (
                            <Square className="h-4 w-4 text-[#8A8F89]" />
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            task.completed
                              ? "line-through text-[#5F665F] dark:text-[#88948D]"
                              : "text-[#1C211E] dark:text-[#F3F0EA] font-medium"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Safety Warning Snippet */}
                  {proto.safetyWarnings.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-[#7A5320] dark:text-[#ECC089] bg-[#F3EADB]/60 dark:bg-[#3D2C13]/40 rounded-xl px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        <strong>Kritik Kural:</strong> {proto.safetyWarnings[0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal 1: Protokol & SOP Detay Modalı */}
        {selectedProtocolForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div>
                  <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                    {selectedProtocolForDetail.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                    {selectedProtocolForDetail.title}
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-[#90A199] mt-0.5">
                    Sorumlu: {selectedProtocolForDetail.role} • Süre: {selectedProtocolForDetail.estimatedTime}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProtocolForDetail(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5 text-sm">
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Standart Operasyon Tanımı</h4>
                  <p className="text-xs text-[#5F665F] dark:text-[#90A199] leading-relaxed">
                    {selectedProtocolForDetail.description}
                  </p>
                </div>

                {/* Sterile Instruments */}
                <div className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-4">
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-[#1F3327] dark:text-[#7CC9A6] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Zorunlu Steril Cihaz ve Sarf Malzemeleri
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProtocolForDetail.sterileInstruments.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-[#EEEBE4] dark:bg-[#213027] px-2.5 py-1 text-xs font-medium text-[#1C211E] dark:text-[#E2EEDD]"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Safety & Sterilization Warnings */}
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-2 flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-[#B3261E]" />
                    Enfeksiyon Kontrol & Güvenlik İlkeleri
                  </h4>
                  <ul className="space-y-2 text-xs text-[#5F665F] dark:text-[#90A199]">
                    {selectedProtocolForDetail.safetyWarnings.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2 rounded-lg bg-[#FBE9E7]/60 dark:bg-[#431B1A]/40 p-2.5 text-[#B3261E] dark:text-[#FCA5A5]">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => handlePrintProtocol(selectedProtocolForDetail)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  <Printer className="h-4 w-4" />
                  SOP Belgesini Yazdır
                </button>
                <button
                  onClick={() => setSelectedProtocolForDetail(null)}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Yeni Protokol / Kontrol Listesi Ekle Modalı */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Yeni Klinik Protokolü Tanımla
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Dr.DENTES asistan kontrol listesine yeni operasyon standardı ekleyin.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProtocol} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Protokol Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Panoramik Röntgen Odası Güvenlik Protokolü"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Kategori
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as AssistantProtocol["category"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Sterilizasyon">Sterilizasyon</option>
                      <option value="Cerrahi Hazırlık">Cerrahi Hazırlık</option>
                      <option value="Endodonti">Endodonti</option>
                      <option value="Klinik Açılış/Kapanış">Klinik Açılış/Kapanış</option>
                      <option value="Acil Yönetim">Acil Yönetim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Sorumlu Personel Rolü
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) =>
                        setNewRole(e.target.value as AssistantProtocol["role"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Klinik Asistanı">Klinik Asistanı</option>
                      <option value="Sterilizasyon Sorumlusu">Sterilizasyon Sorumlusu</option>
                      <option value="Tedavi Hekimi">Tedavi Hekimi</option>
                      <option value="Tüm Ekip">Tüm Ekip</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Operasyon Amacı & Açıklama *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Bu protokolün amacı ve hedeflenen klinik standardı..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-2.5 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Kontrol Listesi Maddeleri (Her satıra bir adım)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={"Kurşun önlüğü hazırla\nHastanın metal takılarını çıkarttır\nPozisyonlama lazerini ayarla"}
                    value={newTasks}
                    onChange={(e) => setNewTasks(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-2.5 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-xs font-semibold text-white shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    Protokolü Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
