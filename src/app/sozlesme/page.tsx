"use client";

import React, { useState, useMemo } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import { formatCurrency } from "@/lib/utils";
import {
  ScrollText,
  Search,
  Plus,
  Printer,
  FileCheck2,
  Clock,
  Shield,
  CreditCard,
  Eye,
  Send,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  Stethoscope,
  Calendar,
  Lock,
} from "lucide-react";

export interface ContractRecord {
  id: string;
  contractNo: string;
  patientName: string;
  patientTc: string;
  patientPhone: string;
  contractType: "Tedavi Sözleşmesi" | "Taksitli Ödeme Anlaşması" | "Garanti Sertifikası" | "KVKK & Açık Rıza";
  treatmentScope: string;
  doctorName: string;
  totalAmount: number;
  installmentCount: number;
  downPayment: number;
  warrantyPeriod?: string;
  startDate: string;
  status: "Yürürlükte" | "Onay Bekliyor" | "Tamamlandı" | "Feshedildi";
  isSignedDigitally: boolean;
  notes?: string;
}

const initialContracts: ContractRecord[] = [
  {
    id: "szl-1",
    contractNo: "SZL-2026-1042",
    patientName: "Ahmet Yılmaz",
    patientTc: "28491029482",
    patientPhone: "+90 532 411 22 33",
    contractType: "Tedavi Sözleşmesi",
    treatmentScope: "Üst-Alt Çene All-on-4 İmplant Cerrahi + Monolitik Zirkonyum Köprü",
    doctorName: "Dr. Dt. Selin Vural",
    totalAmount: 185000,
    installmentCount: 6,
    downPayment: 65000,
    warrantyPeriod: "İmplant Gövdesi: Ömür Boyu / Zirkonyum Üstyapı: 5 Yıl",
    startDate: "15.11.2026",
    status: "Yürürlükte",
    isSignedDigitally: true,
    notes: "Greftleme ve geçici sabit protezler fiyata dahildir.",
  },
  {
    id: "szl-2",
    contractNo: "SZL-2026-1043",
    patientName: "Zeynep Kaya",
    patientTc: "49201948572",
    patientPhone: "+90 544 322 11 00",
    contractType: "Taksitli Ödeme Anlaşması",
    treatmentScope: "Çift Çene Şeffaf Plak (Invisalign) Ortodontik Tedavisi",
    doctorName: "Dr. Dt. Elif Karaca",
    totalAmount: 72000,
    installmentCount: 8,
    downPayment: 20000,
    warrantyPeriod: "Pekiştirme Plakları: 2 Yıl",
    startDate: "18.11.2026",
    status: "Onay Bekliyor",
    isSignedDigitally: false,
    notes: "Aylık 6.500 TL senet/kredi kartı blokesi şeklinde planlandı.",
  },
  {
    id: "szl-3",
    contractNo: "SZL-2026-1044",
    patientName: "Mehmet Demir",
    patientTc: "10394857281",
    patientPhone: "+90 505 889 77 66",
    contractType: "Garanti Sertifikası",
    treatmentScope: "Straumann Roxolid SLA Dental İmplant Sistemi (2 Adet)",
    doctorName: "Dr. Dt. Selin Vural",
    totalAmount: 58000,
    installmentCount: 1,
    downPayment: 58000,
    warrantyPeriod: "Uluslararası Resmi Pasaport — Ömür Boyu",
    startDate: "10.10.2026",
    status: "Yürürlükte",
    isSignedDigitally: true,
    notes: "Orijinal fabrika seri numaraları pasaporta işlendi.",
  },
  {
    id: "szl-4",
    contractNo: "SZL-2026-1045",
    patientName: "Ayşe Özdemir",
    patientTc: "39482019485",
    patientPhone: "+90 533 112 34 56",
    contractType: "KVKK & Açık Rıza",
    treatmentScope: "Kişisel Sağlık Verileri, Radyolojik Görüntü Arşivi ve İletişim İzni",
    doctorName: "Dr. Dt. Selin Vural",
    totalAmount: 0,
    installmentCount: 0,
    downPayment: 0,
    startDate: "02.11.2026",
    status: "Yürürlükte",
    isSignedDigitally: true,
    notes: "SMS randevu hatırlatması ve e-fatura onayı verildi.",
  },
  {
    id: "szl-5",
    contractNo: "SZL-2026-1046",
    patientName: "Burak Çelik",
    patientTc: "58291048592",
    patientPhone: "+90 530 998 87 76",
    contractType: "Tedavi Sözleşmesi",
    treatmentScope: "Gülüş Tasarımı (16 Üye E-Max Porselen Lamina Veneer)",
    doctorName: "Dt. Kaan Demir",
    totalAmount: 112000,
    installmentCount: 4,
    downPayment: 40000,
    warrantyPeriod: "E-Max Lamina: 3 Yıl Mekanik Garanti",
    startDate: "28.09.2026",
    status: "Tamamlandı",
    isSignedDigitally: true,
    notes: "Son taksit ödendi, kontrol seansı tamamlandı.",
  },
  {
    id: "szl-6",
    contractNo: "SZL-2026-1047",
    patientName: "Caner Aydın",
    patientTc: "60291837461",
    patientPhone: "+90 555 432 10 98",
    contractType: "Taksitli Ödeme Anlaşması",
    treatmentScope: "Komple Ağız Restorasyonu ve Metal Destekli Porselen",
    doctorName: "Dt. Kaan Demir",
    totalAmount: 64000,
    installmentCount: 5,
    downPayment: 15000,
    startDate: "05.09.2026",
    status: "Feshedildi",
    isSignedDigitally: true,
    notes: "Hasta şehir değişikliği nedeniyle sözleşmeyi karşılıklı feshetti.",
  },
];

export default function SozlesmePage() {
  const { showToast, openPrintPreview, openSmsModal } = useModal();
  const [contracts, setContracts] = useState<ContractRecord[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("Tümü");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tümü");

  // Modals state
  const [selectedContractForPreview, setSelectedContractForPreview] = useState<ContractRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Contract Form State
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientTc, setNewPatientTc] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newContractType, setNewContractType] = useState<ContractRecord["contractType"]>("Tedavi Sözleşmesi");
  const [newScope, setNewScope] = useState("");
  const [newDoctor, setNewDoctor] = useState("Dr. Dt. Selin Vural");
  const [newTotalAmount, setNewTotalAmount] = useState<number>(50000);
  const [newDownPayment, setNewDownPayment] = useState<number>(15000);
  const [newInstallments, setNewInstallments] = useState<number>(4);
  const [newWarranty, setNewWarranty] = useState("5 Yıl Klinik & Üretici Garantisi");
  const [newNotes, setNewNotes] = useState("");

  // Filtering
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchSearch =
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientTc.includes(searchQuery) ||
        c.contractNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.treatmentScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType =
        selectedType === "Tümü" || c.contractType === selectedType;

      const matchStatus =
        selectedStatus === "Tümü" || c.status === selectedStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [contracts, searchQuery, selectedType, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const active = contracts.filter((c) => c.status === "Yürürlükte").length;
    const pending = contracts.filter((c) => c.status === "Onay Bekliyor").length;
    const totalVolume = contracts.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const warrantyCount = contracts.filter((c) => c.warrantyPeriod).length;
    return { active, pending, totalVolume, warrantyCount };
  }, [contracts]);

  const handlePrintContract = (c: ContractRecord) => {
    openPrintPreview({
      type: "consent",
      title: `${c.contractType} — ${c.contractNo}`,
      patientName: c.patientName,
      date: c.startDate,
      doctorName: c.doctorName,
      extraInfo: {
        "Sözleşme No": c.contractNo,
        "T.C. Kimlik": c.patientTc,
        "Telefon": c.patientPhone,
        "Sözleşme Türü": c.contractType,
        "Yürürlük Durumu": c.status,
        "Garanti Süresi": c.warrantyPeriod || "Belirtilmedi",
        "Toplam Tutar": c.totalAmount > 0 ? `₺${formatCurrency(c.totalAmount)}` : "Mali Yükümlülük Yok",
        "Ödeme Planı": c.installmentCount > 1 ? `${c.installmentCount} Taksit (Peşinat: ₺${formatCurrency(c.downPayment)})` : "Tek Çekim / Peşin",
      },
      items: [
        { name: "Sözleşme ve Tedavi Konusu", detail: c.treatmentScope },
        { name: "Klinik Yükümlülükleri & Garanti", detail: "DentaSphere, Sağlık Bakanlığı standartlarında biyomekanik uyumlu CE belgeli implant ve protez kullanmayı, oluşabilecek hekim kaynaklı revizyonları taahhüt eder." },
        { name: "Hasta Yükümlülükleri & Hijyen", detail: "Hasta periyodik 6 aylık hekim kontrollerine uymak, post-op ağız hijyeni protokollerini sürdürmekle yükümlüdür." },
      ],
    });
  };

  const handleSendDigitalSignRequest = (c: ContractRecord) => {
    openSmsModal(c.patientName, c.patientPhone);
    showToast(`${c.patientName} için dijital imza SMS bağlantısı gönderim penceresi açıldı.`, "info");
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientTc.trim() || !newScope.trim()) {
      showToast("Lütfen hasta adı, TC No ve tedavi kapsamını doldurunuz.", "error");
      return;
    }

    const nextId = `szl-${Date.now()}`;
    const nextNo = `SZL-2026-${Math.floor(1050 + Math.random() * 800)}`;

    const newRecord: ContractRecord = {
      id: nextId,
      contractNo: nextNo,
      patientName: newPatientName.trim(),
      patientTc: newPatientTc.trim(),
      patientPhone: newPatientPhone.trim() || "+90 530 000 00 00",
      contractType: newContractType,
      treatmentScope: newScope.trim(),
      doctorName: newDoctor,
      totalAmount: Number(newTotalAmount) || 0,
      installmentCount: Number(newInstallments) || 1,
      downPayment: Number(newDownPayment) || 0,
      warrantyPeriod: newWarranty.trim(),
      startDate: new Date().toLocaleDateString("tr-TR"),
      status: "Yürürlükte",
      isSignedDigitally: true,
      notes: newNotes.trim() || "Standart klinik protokolüyle onaylandı.",
    };

    setContracts([newRecord, ...contracts]);
    setIsCreateModalOpen(false);
    showToast(`${newRecord.contractNo} numaralı sözleşme hazırlandı ve yürürlüğe girdi.`, "success");

    // Reset
    setNewPatientName("");
    setNewPatientTc("");
    setNewPatientPhone("");
    setNewScope("");
    setNewNotes("");
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] dark:bg-[#0D1410] p-6 lg:p-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* BannerHeader */}
        <BannerHeader
          title="Hizmet & Tedavi Sözleşmeleri"
          description="Klinik-hasta hizmet taahhütnameleri, taksitli tedavi anlaşmaları, implant garanti sertifikaları ve KVKK yasal metinleri yönetimi."
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Belgeler & Hukuk", href: "/belgeler" },
            { label: "Hizmet & Tedavi Sözleşmeleri" },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  showToast("KVKK Açık Rıza ve Aydınlatma Metinleri arşivi görüntülendi.", "info");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2A3E33] px-4 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
              >
                <Lock className="h-4 w-4 text-[#5F665F] dark:text-[#90A199]" />
                KVKK Metinleri
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" />
                Yeni Sözleşme Düzenle
              </button>
            </div>
          }
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Aktif Yürürlükteki Sözleşmeler</span>
              <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2">
                <ScrollText className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#1C211E] dark:text-[#F3F0EA]">{stats.active}</span>
              <span className="text-xs text-[#2C6A3B] font-medium">Hukuki korumalı</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">İmza süreci tamamlanmış</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Taksitli Tedavi Hacmi</span>
              <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-2">
                <CreditCard className="h-5 w-5 text-[#2C6A3B] dark:text-[#7CC9A6]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                ₺{formatCurrency(stats.totalVolume)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Taahhütlü mali planlama</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Garanti Kapsamındaki Tedaviler</span>
              <div className="rounded-xl bg-[#F3EADB] dark:bg-[#3D2C13] p-2">
                <Shield className="h-5 w-5 text-[#7A5320] dark:text-[#ECC089]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#7A5320] dark:text-[#ECC089]">
                {stats.warrantyCount} Vaka
              </span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">İmplant ve zirkonyum sertifikalı</p>
          </div>

          <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5F665F] dark:text-[#90A199]">Onay & İmza Bekleyen</span>
              <div className="rounded-xl bg-[#F3EADB] dark:bg-[#3D2C13] p-2">
                <Clock className="h-5 w-5 text-[#7A5320] dark:text-[#ECC089]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#7A5320] dark:text-[#ECC089]">{stats.pending}</span>
              <span className="text-xs text-[#7A5320] dark:text-[#ECC089] font-medium">SMS linki iletildi</span>
            </div>
            <p className="mt-1 text-xs text-[#5F665F] dark:text-[#90A199]">Hasta dijital onayı bekleniyor</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F89]" />
              <input
                type="text"
                placeholder="Sözleşme No, Hasta Adı, TC Kimlik veya Tedavi ara..."
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

            {/* Contract Type Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              >
                <option value="Tümü">Tüm Sözleşme Türleri</option>
                <option value="Tedavi Sözleşmesi">Tedavi Sözleşmesi</option>
                <option value="Taksitli Ödeme Anlaşması">Taksitli Ödeme Anlaşması</option>
                <option value="Garanti Sertifikası">Garanti Sertifikası</option>
                <option value="KVKK & Açık Rıza">KVKK & Açık Rıza</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="Yürürlükte">Yürürlükte (İmzalı)</option>
                <option value="Onay Bekliyor">Onay Bekliyor</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="Feshedildi">Feshedildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E1D8] dark:border-[#23352A] bg-[#EEEBE4]/60 dark:bg-[#14231C]/60 text-xs uppercase tracking-wider text-[#5F665F] dark:text-[#90A199]">
                  <th className="py-3.5 px-4 font-semibold">Sözleşme No & Tarih</th>
                  <th className="py-3.5 px-4 font-semibold">Hasta Bilgisi</th>
                  <th className="py-3.5 px-4 font-semibold">Sözleşme Türü</th>
                  <th className="py-3.5 px-4 font-semibold">Tedavi Kapsamı</th>
                  <th className="py-3.5 px-4 font-semibold">Mali Tutar / Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Durum</th>
                  <th className="py-3.5 px-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8]/70 dark:divide-[#23352A]/70 text-sm">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#5F665F] dark:text-[#90A199]">
                      <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      Aradığınız kriterlere uygun sözleşme veya garanti kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="hover:bg-[#EEEBE4]/30 dark:hover:bg-[#1A2820]/40 transition-colors"
                    >
                      {/* Contract No & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]">
                          {contract.contractNo}
                        </div>
                        <div className="text-xs text-[#5F665F] dark:text-[#90A199] mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {contract.startDate}
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#1C211E] dark:text-[#F3F0EA] flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#E2EEDD] dark:bg-[#1F3327] flex items-center justify-center text-xs font-bold text-[#1F3327] dark:text-[#E2EEDD]">
                            {contract.patientName.charAt(0)}
                          </div>
                          <div>
                            <div>{contract.patientName}</div>
                            <div className="text-xs text-[#5F665F] dark:text-[#90A199] font-mono">
                              TC: {contract.patientTc}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block rounded-md bg-[#EEEBE4] dark:bg-[#213027] px-2.5 py-1 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD]">
                          {contract.contractType}
                        </span>
                      </td>

                      {/* Scope & Warranty */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-[#1C211E] dark:text-[#F3F0EA] truncate" title={contract.treatmentScope}>
                          {contract.treatmentScope}
                        </div>
                        {contract.warrantyPeriod && (
                          <div className="text-xs text-[#7A5320] dark:text-[#ECC089] mt-0.5 flex items-center gap-1">
                            <Shield className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contract.warrantyPeriod}</span>
                          </div>
                        )}
                      </td>

                      {/* Financials */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {contract.totalAmount > 0 ? (
                          <div>
                            <div className="font-semibold text-[#1C211E] dark:text-[#F3F0EA]">
                              ₺{formatCurrency(contract.totalAmount)}
                            </div>
                            <div className="text-xs text-[#5F665F] dark:text-[#90A199]">
                              {contract.installmentCount > 1 ? `${contract.installmentCount} Taksit` : "Peşin / Havale"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#5F665F] dark:text-[#90A199] italic">
                            Yasal Rıza / Ücretsiz
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {contract.status === "Yürürlükte" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#1B3624] dark:text-[#7CC9A6]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Yürürlükte
                          </span>
                        ) : contract.status === "Onay Bekliyor" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3EADB] text-[#7A5320] dark:bg-[#3D2C13] dark:text-[#ECC089]">
                            <Clock className="h-3.5 w-3.5" />
                            İmza Bekliyor
                          </span>
                        ) : contract.status === "Tamamlandı" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ECEAE5] text-[#4F544F] dark:bg-[#202722] dark:text-[#A0ABA4]">
                            Tamamlandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FBE9E7] text-[#B3261E] dark:bg-[#431B1A] dark:text-[#FCA5A5]">
                            <XCircle className="h-3.5 w-3.5" />
                            Feshedildi
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Full PDF Preview */}
                          <button
                            onClick={() => setSelectedContractForPreview(contract)}
                            className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#1C211E] hover:bg-[#EEEBE4] dark:text-[#90A199] dark:hover:text-[#F3F0EA] dark:hover:bg-[#213027] transition-colors"
                            title="Sözleşmeyi Önizle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Print via system */}
                          <button
                            onClick={() => handlePrintContract(contract)}
                            className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#1C211E] hover:bg-[#EEEBE4] dark:text-[#90A199] dark:hover:text-[#F3F0EA] dark:hover:bg-[#213027] transition-colors"
                            title="Yazdır / PDF İndir"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {/* Request Digital Signature */}
                          {contract.status === "Onay Bekliyor" && (
                            <button
                              onClick={() => handleSendDigitalSignRequest(contract)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1F3327] hover:bg-[#2D3A32] text-white text-xs font-medium transition-colors"
                              title="İmza İsteği Gönder (SMS)"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>İmza İste</span>
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

        {/* Modal 1: Sözleşme PDF Önizleme Modalı */}
        {selectedContractForPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              {/* Header of Modal */}
              <div className="flex items-start justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-3 text-[#1F3327] dark:text-[#7CC9A6]">
                    <ScrollText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Resmi Tedavi & Hizmet Sözleşmesi
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Belge No: {selectedContractForPreview.contractNo} • Düzenleme Tarihi: {selectedContractForPreview.startDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContractForPreview(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Document Paper Simulation */}
              <div className="mt-5 rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-6 sm:p-8 space-y-6 text-sm text-[#3F4540] dark:text-[#C5D0C9]">
                {/* Clinic Letterhead */}
                <div className="flex items-center justify-between border-b border-[#EEEBE4] dark:border-[#1E2C23] pb-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1F3327] dark:text-[#7CC9A6]">
                      DENTASPHERE AĞIZ VE DİŞ SAĞLIĞI POLİKLİNİĞİ
                    </h4>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Sağlık Bakanlığı Ruhsat No: 34-DS-2026 • Levent / İstanbul
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-mono font-semibold text-[#1C211E] dark:text-[#F3F0EA]">
                      {selectedContractForPreview.contractNo}
                    </span>
                    <p className="text-[#5F665F] dark:text-[#90A199]">Durum: {selectedContractForPreview.status}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#EEEBE4]/50 dark:bg-[#14231C] p-4 text-xs">
                  <div>
                    <span className="font-bold uppercase text-[#5F665F] dark:text-[#90A199]">Klinik / Hekim (Hizmet Veren)</span>
                    <p className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mt-1">{selectedContractForPreview.doctorName}</p>
                    <p className="text-[#5F665F] dark:text-[#90A199]">DentaSphere Polikliniği</p>
                  </div>
                  <div>
                    <span className="font-bold uppercase text-[#5F665F] dark:text-[#90A199]">Hasta (Hizmet Alan)</span>
                    <p className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mt-1">{selectedContractForPreview.patientName}</p>
                    <p className="text-[#5F665F] dark:text-[#90A199]">T.C: {selectedContractForPreview.patientTc} • Tel: {selectedContractForPreview.patientPhone}</p>
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1C211E] dark:text-[#F3F0EA] mb-1.5">
                    1. Sözleşmenin Konusu ve Tedavi Kapsamı
                  </h5>
                  <p className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] p-3 text-xs leading-relaxed">
                    İşbu sözleşme kapsamında hastaya uygulanacak planlanmış klinik operasyon:{" "}
                    <strong>{selectedContractForPreview.treatmentScope}</strong>
                  </p>
                </div>

                {/* Financial and Warranty Terms */}
                {selectedContractForPreview.totalAmount > 0 && (
                  <div>
                    <h5 className="font-semibold text-xs uppercase tracking-wider text-[#1C211E] dark:text-[#F3F0EA] mb-1.5">
                      2. Mali Hükümler ve Ödeme Takvimi
                    </h5>
                    <div className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] p-3 text-xs space-y-1">
                      <p><strong>Toplam Tedavi Bedeli: </strong>₺{formatCurrency(selectedContractForPreview.totalAmount)}</p>
                      <p><strong>Peşinat: </strong>₺{formatCurrency(selectedContractForPreview.downPayment)}</p>
                      <p><strong>Taksit Sayısı: </strong>{selectedContractForPreview.installmentCount} Eşit Taksit</p>
                      {selectedContractForPreview.warrantyPeriod && (
                        <p className="text-[#2C6A3B] dark:text-[#7CC9A6]">
                          <strong>Garanti Şartları: </strong>{selectedContractForPreview.warrantyPeriod}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Stamp & Signature simulation box */}
                <div className="grid grid-cols-2 gap-6 border-t border-[#EEEBE4] dark:border-[#1E2C23] pt-6">
                  <div className="text-center rounded-xl border border-dashed border-[#E6E1D8] dark:border-[#23352A] p-4">
                    <span className="text-xs text-[#5F665F] dark:text-[#90A199]">DentaSphere Hekim Kaşe & İmza</span>
                    <div className="h-14 flex items-center justify-center font-serif text-xs italic text-[#1F3327] dark:text-[#7CC9A6]">
                      [Dr. Dt. Selin Vural — E-İmzalı]
                    </div>
                  </div>
                  <div className="text-center rounded-xl border border-dashed border-[#E6E1D8] dark:border-[#23352A] p-4">
                    <span className="text-xs text-[#5F665F] dark:text-[#90A199]">Hasta Onay ve Dijital İmza</span>
                    <div className="h-14 flex items-center justify-center font-serif text-xs italic text-[#2C6A3B] dark:text-[#7CC9A6]">
                      {selectedContractForPreview.isSignedDigitally ? "[Mobil Onaylı Dijital İmza ✓]" : "[İmza Bekleniyor]"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => handlePrintContract(selectedContractForPreview)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  <Printer className="h-4 w-4" />
                  Sözleşmeyi Yazdır (PDF)
                </button>
                <button
                  onClick={() => setSelectedContractForPreview(null)}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Yeni Sözleşme Düzenle Modalı */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Yeni Tedavi / Garanti Sözleşmesi
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Hastaya özel tedavi taahhütnamesi ve mali takvim oluşturun.
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

              <form onSubmit={handleCreateContract} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="11 Haneli TC"
                      value={newPatientTc}
                      onChange={(e) => setNewPatientTc(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      Sözleşme Türü
                    </label>
                    <select
                      value={newContractType}
                      onChange={(e) =>
                        setNewContractType(e.target.value as ContractRecord["contractType"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Tedavi Sözleşmesi">Tedavi Sözleşmesi</option>
                      <option value="Taksitli Ödeme Anlaşması">Taksitli Ödeme Anlaşması</option>
                      <option value="Garanti Sertifikası">Garanti Sertifikası</option>
                      <option value="KVKK & Açık Rıza">KVKK & Açık Rıza</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Tedavi Kapsamı & Planlanan İşlemler *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 4 Adet Titanyum İmplant + Zirkonyum Üst Yapı"
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Toplam Tutar (TL)
                    </label>
                    <input
                      type="number"
                      value={newTotalAmount}
                      onChange={(e) => setNewTotalAmount(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Peşinat (TL)
                    </label>
                    <input
                      type="number"
                      value={newDownPayment}
                      onChange={(e) => setNewDownPayment(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Taksit Sayısı
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={newInstallments}
                      onChange={(e) => setNewInstallments(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Garanti Şartı & Sertifika Notu
                  </label>
                  <input
                    type="text"
                    value={newWarranty}
                    onChange={(e) => setNewWarranty(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Özel Maddeler ve Hekim Şerhleri
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Sözleşmeye ilave edilecek özel şartlar..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
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
                    Sözleşmeyi Oluştur & İmzalat
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
