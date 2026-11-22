"use client";

import React, { useState, useMemo } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import {
  FileCheck2,
  Search,
  Filter,
  Plus,
  Printer,
  Eye,
  PenTool,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Download,
  Calendar,
  User,
  ShieldCheck,
  Stethoscope,
  X,
  FileText,
  RotateCcw,
} from "lucide-react";

export interface ConsentForm {
  id: string;
  protocolNo: string;
  patientName: string;
  patientTc: string;
  patientPhone: string;
  treatmentType: string;
  treatmentCategory: "İmplantoloji" | "Endodonti" | "Çene Cerrahisi" | "Anestezi" | "Ortodonti" | "Pedodonti";
  doctorName: string;
  createdAt: string;
  signedAt?: string;
  status: "İmzalandı" | "Bekliyor" | "İptal Edildi";
  signatureType?: "Dijital Tablet" | "SMS Onay Kodu" | "Islak İmza";
  riskLevel: "Yüksek Risk" | "Standart Risk" | "Düşük Risk";
  notes?: string;
}

const initialConsentForms: ConsentForm[] = [
  {
    id: "onm-1",
    protocolNo: "ONM-2026-0142",
    patientName: "Ahmet Yılmaz",
    patientTc: "28491029482",
    patientPhone: "+90 532 411 22 33",
    treatmentType: "Çene Cerrahisi & İmplant Uygulaması (Sinüs Lifting Dahil)",
    treatmentCategory: "İmplantoloji",
    doctorName: "Dr. Dt. Selin Vural",
    createdAt: "22.11.2026 10:15",
    signedAt: "22.11.2026 10:28",
    status: "İmzalandı",
    signatureType: "Dijital Tablet",
    riskLevel: "Yüksek Risk",
    notes: "Hastaya greftleme ve olası parestezi riskleri anlatıldı, dijital rıza alındı.",
  },
  {
    id: "onm-2",
    protocolNo: "ONM-2026-0143",
    patientName: "Zeynep Kaya",
    patientTc: "49201948572",
    patientPhone: "+90 544 322 11 00",
    treatmentType: "Kök Kanal Tedavisi (Endodontik Cerrahi & Perforasyon Onarımı)",
    treatmentCategory: "Endodonti",
    doctorName: "Dt. Kaan Demir",
    createdAt: "22.11.2026 11:30",
    status: "Bekliyor",
    riskLevel: "Standart Risk",
    notes: "Alet kırılması ve retreatment olasılıkları aktarıldı, hasta incelemede.",
  },
  {
    id: "onm-3",
    protocolNo: "ONM-2026-0144",
    patientName: "Mehmet Demir",
    patientTc: "10394857281",
    patientPhone: "+90 505 889 77 66",
    treatmentType: "Gömülü 20 Yaş Diş Çekimi (Kemik Retansiyonlu)",
    treatmentCategory: "Çene Cerrahisi",
    doctorName: "Dr. Dt. Selin Vural",
    createdAt: "21.11.2026 15:40",
    signedAt: "21.11.2026 15:52",
    status: "İmzalandı",
    signatureType: "SMS Onay Kodu",
    riskLevel: "Yüksek Risk",
    notes: "Mandibular sinir yakınlığı ve trismus riskleri paylaşıldı.",
  },
  {
    id: "onm-4",
    protocolNo: "ONM-2026-0145",
    patientName: "Ayşe Özdemir",
    patientTc: "39482019485",
    patientPhone: "+90 533 112 34 56",
    treatmentType: "Sedasyon / Genel Anestezi Altında Cerrahi Girişim",
    treatmentCategory: "Anestezi",
    doctorName: "Dr. Anestezi Uzm. Murat Kaya",
    createdAt: "21.11.2026 14:10",
    status: "Bekliyor",
    riskLevel: "Yüksek Risk",
    notes: "Açlık süresi ve kardiyak anamnez kontrolü yapıldı, refakatçi onayı bekleniyor.",
  },
  {
    id: "onm-5",
    protocolNo: "ONM-2026-0146",
    patientName: "Burak Çelik",
    patientTc: "58291048592",
    patientPhone: "+90 530 998 87 76",
    treatmentType: "Sabit Ortodontik Tedavi & Şeffaf Plak Protokolü",
    treatmentCategory: "Ortodonti",
    doctorName: "Dr. Dt. Elif Karaca",
    createdAt: "20.11.2026 09:20",
    signedAt: "20.11.2026 09:45",
    status: "İmzalandı",
    signatureType: "Dijital Tablet",
    riskLevel: "Düşük Risk",
    notes: "Tedavi süresi, braket bakımı ve nüks riskleri onaylandı.",
  },
  {
    id: "onm-6",
    protocolNo: "ONM-2026-0147",
    patientName: "Ece Korkmaz",
    patientTc: "19283746501",
    patientPhone: "+90 538 777 66 55",
    treatmentType: "Pedodontik Genel Anestezi ve Paslanmaz Çelik Kron",
    treatmentCategory: "Pedodonti",
    doctorName: "Dt. Ceren Arslan",
    createdAt: "19.11.2026 16:30",
    signedAt: "19.11.2026 16:45",
    status: "İmzalandı",
    signatureType: "Islak İmza",
    riskLevel: "Standart Risk",
    notes: "Veli aydınlatıldı, fiziksel form taranıp dijital arşive yüklendi.",
  },
  {
    id: "onm-7",
    protocolNo: "ONM-2026-0148",
    patientName: "Caner Aydın",
    patientTc: "60291837461",
    patientPhone: "+90 555 432 10 98",
    treatmentType: "Akut Apikal Periodontitis Drenaj ve Kanal Tedavisi",
    treatmentCategory: "Endodonti",
    doctorName: "Dt. Kaan Demir",
    createdAt: "19.11.2026 11:00",
    status: "İptal Edildi",
    riskLevel: "Standart Risk",
    notes: "Hasta tedavi protokolünü kabul etmeyerek sevk istedi.",
  },
];

export default function OnamFormlariPage() {
  const { showToast, openPrintPreview, openSmsModal } = useModal();
  const [forms, setForms] = useState<ConsentForm[]>(initialConsentForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tümü");

  // Modals state
  const [selectedFormForDetail, setSelectedFormForDetail] = useState<ConsentForm | null>(null);
  const [selectedFormForSign, setSelectedFormForSign] = useState<ConsentForm | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Form Fields
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientTc, setNewPatientTc] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newTreatmentCategory, setNewTreatmentCategory] = useState<ConsentForm["treatmentCategory"]>("İmplantoloji");
  const [newTreatmentType, setNewTreatmentType] = useState("Dental İmplant Cerrahi Operasyonu");
  const [newDoctorName, setNewDoctorName] = useState("Dr. Dt. Selin Vural");
  const [newRiskLevel, setNewRiskLevel] = useState<ConsentForm["riskLevel"]>("Yüksek Risk");
  const [newNotes, setNewNotes] = useState("");

  // Filtering
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchSearch =
        form.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.patientTc.includes(searchQuery) ||
        form.protocolNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.treatmentType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "Tümü" || form.treatmentCategory === selectedCategory;

      const matchStatus =
        selectedStatus === "Tümü" || form.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [forms, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = forms.length;
    const signed = forms.filter((f) => f.status === "İmzalandı").length;
    const pending = forms.filter((f) => f.status === "Bekliyor").length;
    const cancelled = forms.filter((f) => f.status === "İptal Edildi").length;
    return { total, signed, pending, cancelled };
  }, [forms]);

  // Actions
  const handleOpenPrint = (form: ConsentForm) => {
    openPrintPreview({
      type: "consent",
      title: `${form.treatmentType} — Aydınlatılmış Onam Formu`,
      patientName: form.patientName,
      date: form.signedAt || form.createdAt,
      doctorName: form.doctorName,
      extraInfo: {
        "Protokol No": form.protocolNo,
        "T.C. Kimlik": form.patientTc,
        "Telefon": form.patientPhone,
        "Tedavi Branşı": form.treatmentCategory,
        "Risk Seviyesi": form.riskLevel,
        "Onay Durumu": form.status,
        "İmza Türü": form.signatureType || "Bekleniyor",
      },
      items: [
        { name: "Cerrahi / Klinik Girişim", detail: form.treatmentType },
        { name: "Olası Komplikasyonlar ve Riskler", detail: "Kanama, enfeksiyon, komşu diş/doku hasarı, his kaybı, anestezi komplikasyonları konusunda tam bilgilendirme." },
        { name: "Post-Operatif Hasta Sorumluluğu", detail: "İlk 24 saat gargara/tükürme yasağı, reçete edilen antibiyotik/ağrı kesici düzenli kullanımı, acil iletişim kanalları." },
      ],
    });
  };

  const handleSimulateSigning = (form: ConsentForm) => {
    setForms((prev) =>
      prev.map((f) =>
        f.id === form.id
          ? {
              ...f,
              status: "İmzalandı",
              signedAt: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
              signatureType: "Dijital Tablet",
            }
          : f
      )
    );
    setSelectedFormForSign(null);
    showToast(`${form.patientName} adına onam formu dijital tablet üzerinden başarıyla imzalandı.`, "success");
  };

  const handleSendReminderSms = (form: ConsentForm) => {
    openSmsModal(form.patientName, form.patientPhone);
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientTc.trim()) {
      showToast("Lütfen hasta adı ve T.C. kimlik numarasını giriniz.", "error");
      return;
    }

    const nextId = `onm-${Date.now()}`;
    const nextProtocol = `ONM-2026-0${Math.floor(100 + Math.random() * 900)}`;

    const newForm: ConsentForm = {
      id: nextId,
      protocolNo: nextProtocol,
      patientName: newPatientName.trim(),
      patientTc: newPatientTc.trim(),
      patientPhone: newPatientPhone.trim() || "+90 530 000 00 00",
      treatmentType: newTreatmentType,
      treatmentCategory: newTreatmentCategory,
      doctorName: newDoctorName,
      createdAt: new Date().toLocaleDateString("tr-TR") + " " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      status: "Bekliyor",
      riskLevel: newRiskLevel,
      notes: newNotes.trim() || "Standart bilgilendirme yapıldı, onay süreci başlatıldı.",
    };

    setForms([newForm, ...forms]);
    setIsCreateModalOpen(false);
    showToast(`${newForm.protocolNo} numaralı aydınlatılmış onam formu oluşturuldu.`, "success");

    // Reset fields
    setNewPatientName("");
    setNewPatientTc("");
    setNewPatientPhone("");
    setNewNotes("");
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] dark:bg-[#0D1410] p-6 lg:p-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* BannerHeader */}
        <BannerHeader
          title="Aydınlatılmış Onam Formları"
          description="İmplant cerrahisi, endodonti, sedasyon ve ortodontik operasyonlar için yasal aydınlatılmış dijital hasta rıza formları ve dijital imza arşivi."
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Belgeler & Hukuk", href: "/belgeler" },
            { label: "Aydınlatılmış Onam Formları" },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  showToast("Onam formları arşivi dışa aktarıldı (CSV/PDF)", "info");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2A3E33] px-4 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
              >
                <Download className="h-4 w-4 text-[#5F665F] dark:text-[#90A199]" />
                Toplu İndir
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" />
                Yeni Onam Formu Oluştur
              </button>
            </div>
          }
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Toplam Onam Formu</span>
              <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2">
                <FileCheck2 className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#1C211E] dark:text-[#F3F0EA]">{stats.total}</span>
              <span className="text-xs text-[#2C6A3B] font-medium">Bu Ay +%18</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Kayıtlı dijital ve fiziki formlar</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">İmzalanmış & Onaylı</span>
              <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2">
                <CheckCircle2 className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2C6A3B] dark:text-[#7CC9A6]">{stats.signed}</span>
              <span className="text-xs text-[#5F665F] dark:text-[#90A199]">
                %{Math.round((stats.signed / (stats.total || 1)) * 100)} oranında
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Hukuki geçerli rıza kaydı</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">İmza Bekleyenler</span>
              <div className="rounded-xl bg-[#F3EADB] dark:bg-[#3D2C13] p-2">
                <Clock className="h-5 w-5 text-[#7A5320] dark:text-[#ECC089]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#7A5320] dark:text-[#ECC089]">{stats.pending}</span>
              <span className="text-xs text-[#7A5320] dark:text-[#ECC089] font-medium">Tablet / SMS Gönderildi</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">İşlem öncesi onay zorunlu</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">İptal / Reddedilen</span>
              <div className="rounded-xl bg-[#FBE9E7] dark:bg-[#431B1A] p-2">
                <XCircle className="h-5 w-5 text-[#B3261E] dark:text-[#FCA5A5]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#B3261E] dark:text-[#FCA5A5]">{stats.cancelled}</span>
              <span className="text-xs text-[#5F665F] dark:text-[#90A199]">Hasta vazgeçti</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Arşivlenen red beyanları</p>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F89]" />
              <input
                type="text"
                placeholder="Hasta adı, T.C. Kimlik, Protokol No veya Hekim ara..."
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

            {/* Category Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              >
                <option value="Tümü">Tüm Branşlar</option>
                <option value="İmplantoloji">İmplantoloji</option>
                <option value="Endodonti">Endodonti</option>
                <option value="Çene Cerrahisi">Çene Cerrahisi</option>
                <option value="Anestezi">Genel Anestezi & Sedasyon</option>
                <option value="Ortodonti">Ortodonti</option>
                <option value="Pedodonti">Pedodonti</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="İmzalandı">İmzalandı (Onaylı)</option>
                <option value="Bekliyor">İmza Bekliyor</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E1D8] dark:border-[#23352A] bg-[#EEEBE4]/60 dark:bg-[#14231C]/60 text-xs uppercase tracking-wider text-[#5F665F] dark:text-[#90A199]">
                  <th className="py-3.5 px-4 font-semibold">Protokol & Tarih</th>
                  <th className="py-3.5 px-4 font-semibold">Hasta Bilgileri</th>
                  <th className="py-3.5 px-4 font-semibold">Tedavi & Branş</th>
                  <th className="py-3.5 px-4 font-semibold">Sorumlu Hekim</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Düzeyi</th>
                  <th className="py-3.5 px-4 font-semibold">Durum</th>
                  <th className="py-3.5 px-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8]/70 dark:divide-[#23352A]/70 text-sm">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#5F665F] dark:text-[#90A199]">
                      <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      Aradığınız kriterlere uygun onam formu bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => (
                    <tr
                      key={form.id}
                      className="hover:bg-[#EEEBE4]/30 dark:hover:bg-[#1A2820]/40 transition-colors"
                    >
                      {/* Protocol & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]">
                          {form.protocolNo}
                        </div>
                        <div className="text-xs text-[#5F665F] dark:text-[#90A199] mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {form.createdAt}
                        </div>
                      </td>

                      {/* Patient Info */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#1C211E] dark:text-[#F3F0EA] flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#E2EEDD] dark:bg-[#1F3327] flex items-center justify-center text-xs font-bold text-[#1F3327] dark:text-[#E2EEDD]">
                            {form.patientName.charAt(0)}
                          </div>
                          <div>
                            <div>{form.patientName}</div>
                            <div className="text-xs text-[#5F665F] dark:text-[#90A199] font-mono">
                              TC: {form.patientTc}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Treatment & Branch */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-[#1C211E] dark:text-[#F3F0EA] truncate" title={form.treatmentType}>
                          {form.treatmentType}
                        </div>
                        <div className="inline-block mt-0.5 rounded-md bg-[#EEEBE4] dark:bg-[#213027] px-2 py-0.5 text-xs text-[#5F665F] dark:text-[#90A199]">
                          {form.treatmentCategory}
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-[#1C211E] dark:text-[#F3F0EA] flex items-center gap-1.5">
                          <Stethoscope className="h-3.5 w-3.5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
                          <span>{form.doctorName}</span>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            form.riskLevel === "Yüksek Risk"
                              ? "bg-[#FBE9E7] text-[#B3261E] dark:bg-[#431B1A] dark:text-[#FCA5A5]"
                              : form.riskLevel === "Standart Risk"
                              ? "bg-[#F3EADB] text-[#7A5320] dark:bg-[#3D2C13] dark:text-[#ECC089]"
                              : "bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#1B3624] dark:text-[#7CC9A6]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              form.riskLevel === "Yüksek Risk"
                                ? "bg-[#B3261E]"
                                : form.riskLevel === "Standart Risk"
                                ? "bg-[#B07D47]"
                                : "bg-[#3F8F55]"
                            }`}
                          />
                          {form.riskLevel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {form.status === "İmzalandı" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#1B3624] dark:text-[#7CC9A6]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              İmzalandı
                            </span>
                            <div className="text-[11px] text-[#5F665F] dark:text-[#90A199] mt-0.5">
                              {form.signatureType}
                            </div>
                          </div>
                        ) : form.status === "Bekliyor" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3EADB] text-[#7A5320] dark:bg-[#3D2C13] dark:text-[#ECC089]">
                              <Clock className="h-3.5 w-3.5" />
                              İmza Bekliyor
                            </span>
                            <div className="text-[11px] text-[#7A5320] dark:text-[#ECC089] mt-0.5">
                              Bekleme: 2 saat
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FBE9E7] text-[#B3261E] dark:bg-[#431B1A] dark:text-[#FCA5A5]">
                            <XCircle className="h-3.5 w-3.5" />
                            İptal Edildi
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Review Details */}
                          <button
                            onClick={() => setSelectedFormForDetail(form)}
                            className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#1C211E] hover:bg-[#EEEBE4] dark:text-[#90A199] dark:hover:text-[#F3F0EA] dark:hover:bg-[#213027] transition-colors"
                            title="Formu İncele"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Digital Sign button if pending */}
                          {form.status === "Bekliyor" && (
                            <button
                              onClick={() => setSelectedFormForSign(form)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1F3327] hover:bg-[#2D3A32] text-white text-xs font-medium transition-colors"
                              title="Tablette İmzalat"
                            >
                              <PenTool className="h-3.5 w-3.5" />
                              <span>İmzalat</span>
                            </button>
                          )}

                          {/* Print / PDF */}
                          <button
                            onClick={() => handleOpenPrint(form)}
                            className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#1C211E] hover:bg-[#EEEBE4] dark:text-[#90A199] dark:hover:text-[#F3F0EA] dark:hover:bg-[#213027] transition-colors"
                            title="Yazdır / PDF Önizle"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {/* SMS Reminder if pending */}
                          {form.status === "Bekliyor" && (
                            <button
                              onClick={() => handleSendReminderSms(form)}
                              className="p-1.5 rounded-lg text-[#7A5320] hover:bg-[#F3EADB] dark:hover:bg-[#3D2C13] transition-colors"
                              title="SMS Onay Linki Gönder"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal 1: Onam Detay & İnceleme Modalı */}
        {selectedFormForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2.5">
                    <ShieldCheck className="h-6 w-6 text-[#2C6A3B] dark:text-[#7CC9A6]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Aydınlatılmış Onam Belgesi
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Protokol: {selectedFormForDetail.protocolNo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFormForDetail(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-sm text-[#3F4540] dark:text-[#D1D9D4]">
                {/* Patient & Doctor Box */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#EEEBE4]/60 dark:bg-[#1C2821] p-3.5">
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199]">Hasta</span>
                    <p className="font-medium text-[#1C211E] dark:text-[#F3F0EA]">{selectedFormForDetail.patientName}</p>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">T.C: {selectedFormForDetail.patientTc}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199]">Uygulayan Hekim</span>
                    <p className="font-medium text-[#1C211E] dark:text-[#F3F0EA]">{selectedFormForDetail.doctorName}</p>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">Tarih: {selectedFormForDetail.createdAt}</p>
                  </div>
                </div>

                {/* Treatment Scope */}
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Tedavi & Müdahale Kapsamı</h4>
                  <p className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-3 text-xs leading-relaxed">
                    {selectedFormForDetail.treatmentType} — Bu işlem sırasında hekimin öngördüğü lokal anestezi, cerrahi insizyon, kemik greftleme, dikiş veya membran uygulaması gibi yardımcı tıbbi gereklilikler hastaya anlatılmıştır.
                  </p>
                </div>

                {/* Risks & Complications */}
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Aydınlatılan Riskler ve Komplikasyonlar</h4>
                  <ul className="list-disc pl-5 text-xs space-y-1 text-[#5F665F] dark:text-[#90A199]">
                    <li>Operasyon sonrasında beklenen hafif/orta şiddette ağrı, şişlik (ödem) ve hematom oluşumu.</li>
                    <li>Alt çenede mandibular sinire komşuluk durumunda geçici veya nadiren kalıcı uyuşukluk (parestezi) ihtimali.</li>
                    <li>Üst çenede sinüs membranı perforasyonu ve greft migrasyonu olasılığı.</li>
                    <li>Kök kanalında alet ayrılması veya kök ucu rezeksiyonu gereksinimi.</li>
                    <li>Hastanın tütün mamulü kullanımı, sistemik hastalıkları veya hijyen eksikliğine bağlı doku reddi riski.</li>
                  </ul>
                </div>

                {/* Signature Status */}
                <div className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] p-4 bg-white dark:bg-[#0F1713]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#5F665F] dark:text-[#90A199]">Onay ve İmza Durumu</span>
                      <p className="font-semibold text-[#1C211E] dark:text-[#F3F0EA]">
                        {selectedFormForDetail.status}
                        {selectedFormForDetail.signedAt && ` — ${selectedFormForDetail.signedAt}`}
                      </p>
                    </div>
                    {selectedFormForDetail.signatureType && (
                      <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-medium text-[#2C6A3B] dark:text-[#7CC9A6]">
                        {selectedFormForDetail.signatureType}
                      </span>
                    )}
                  </div>
                  {selectedFormForDetail.notes && (
                    <p className="mt-2 text-xs italic text-[#5F665F] dark:text-[#90A199]">
                      Hekim Notu: "{selectedFormForDetail.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => handleOpenPrint(selectedFormForDetail)}
                  className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] px-4 py-2 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  <Printer className="h-4 w-4" />
                  Yazdır
                </button>
                {selectedFormForDetail.status === "Bekliyor" && (
                  <button
                    onClick={() => {
                      const form = selectedFormForDetail;
                      setSelectedFormForDetail(null);
                      setSelectedFormForSign(form);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2 text-sm font-medium text-white"
                  >
                    <PenTool className="h-4 w-4" />
                    Şimdi İmzalat
                  </button>
                )}
                <button
                  onClick={() => setSelectedFormForDetail(null)}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] px-4 py-2 text-sm font-medium text-[#1C211E] dark:text-[#F3F0EA]"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Dijital Tablet İmza Simülasyonu Modalı */}
        {selectedFormForSign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Hasta Dijital İmza Alanı
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Hasta: {selectedFormForSign.patientName} (Tablet Dokunmatik İmza)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFormForSign(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-[#EEEBE4]/50 dark:bg-[#121A15] p-3 text-xs text-[#3F4540] dark:text-[#A0ABA4]">
                  <strong>Yasal Beyan:</strong> Tedavimle ilgili teşhis, alternatifler ve olası komplikasyonlar tarafıma anlaşılır şekilde aktarılmış olup, tedaviyi özgür irademle kabul ediyorum.
                </div>

                {/* Simulated Signature Canvas Box */}
                <div className="relative h-44 w-full rounded-xl border-2 border-dashed border-[#1F3327]/40 dark:border-[#7CC9A6]/40 bg-white dark:bg-[#0A0F0D] flex flex-col items-center justify-center p-4">
                  <div className="absolute top-2 left-3 text-[11px] font-mono text-[#8A8F89]">
                    [Dokunmatik Ekran İmza Pedi — Simülasyon]
                  </div>

                  {/* Visual signature curve */}
                  <svg className="w-48 h-16 text-[#1F3327] dark:text-[#7CC9A6] opacity-80" viewBox="0 0 200 60">
                    <path
                      d="M10 40 Q 40 5, 70 35 T 120 20 T 170 30 Q 185 5, 195 45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="mt-2 text-xs text-[#8A8F89]">
                    Hasta stylus kalem / parmak izi ile onayladı
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => setSelectedFormForSign(null)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027]"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => handleSimulateSigning(selectedFormForSign)}
                  className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-sm font-medium text-white shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  İmzayı Onayla ve Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Yeni Onam Formu Oluştur Modalı */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Yeni Aydınlatılmış Onam Formu Oluştur
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Hastaya özel yasal bilgilendirme ve dijital imza talebi başlatın.
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

              <form onSubmit={handleCreateForm} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Hasta Adı Soyadı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ayşe Kaya"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      T.C. Kimlik No *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      placeholder="11 haneli T.C."
                      value={newPatientTc}
                      onChange={(e) => setNewPatientTc(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      İletişim Telefonu
                    </label>
                    <input
                      type="tel"
                      placeholder="+90 5XX XXX XX XX"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Tedavi Branşı
                    </label>
                    <select
                      value={newTreatmentCategory}
                      onChange={(e) =>
                        setNewTreatmentCategory(e.target.value as ConsentForm["treatmentCategory"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="İmplantoloji">İmplantoloji</option>
                      <option value="Endodonti">Endodonti</option>
                      <option value="Çene Cerrahisi">Çene Cerrahisi</option>
                      <option value="Anestezi">Genel Anestezi & Sedasyon</option>
                      <option value="Ortodonti">Ortodonti</option>
                      <option value="Pedodonti">Pedodonti</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Uygulanacak Tedavi Tanımı & Şablon
                  </label>
                  <input
                    type="text"
                    value={newTreatmentType}
                    onChange={(e) => setNewTreatmentType(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Sorumlu Hekim
                    </label>
                    <select
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Dr. Dt. Selin Vural">Dr. Dt. Selin Vural</option>
                      <option value="Dt. Kaan Demir">Dt. Kaan Demir</option>
                      <option value="Dr. Dt. Elif Karaca">Dr. Dt. Elif Karaca</option>
                      <option value="Dt. Ceren Arslan">Dt. Ceren Arslan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Risk Seviyesi
                    </label>
                    <select
                      value={newRiskLevel}
                      onChange={(e) =>
                        setNewRiskLevel(e.target.value as ConsentForm["riskLevel"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Düşük Risk">Düşük Risk</option>
                      <option value="Standart Risk">Standart Risk</option>
                      <option value="Yüksek Risk">Yüksek Risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Özel Risk Notları & Anamnez Uyarısı
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hastaya özel aktarılan riskler veya ilave rıza notları..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-3 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-sm font-medium text-white shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    Formu Başlat & Kaydet
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
