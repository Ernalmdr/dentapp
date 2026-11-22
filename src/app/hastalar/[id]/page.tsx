"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  Save,
  ChevronLeft,
  ChevronRight,
  Printer,
  Calendar,
  FileText,
  Receipt,
  Send,
  ClipboardList,
  CalendarDays,
  UserCheck,
  Phone,
  Info,
} from "lucide-react";
import { patients } from "@/lib/mock-data";
import { useModal } from "@/components/modals/ModalContext";
import { useRouter, useParams } from "next/navigation";

export default function PatientInfoPage() {
  const router = useRouter();
  const params = useParams();
  const currentId = Number(params?.id) || 2;
  const {
    openAppointmentModal,
    openSmsModal,
    openAnamnesisModal,
    openReportModal,
    openPrintPreview,
    showToast,
  } = useModal();

  const [isEditing, setIsEditing] = useState(false);
  const [gender, setGender] = useState<"Erkek" | "Kadın">("Kadın");

  // Form State initialized with Tuğçe Üngör data
  const [formData, setFormData] = useState({
    firstName: "Tuğçe",
    lastName: "Üngör",
    gender: "Kadın",
    birthDate: "01.01.1998",
    nationality: "TÜRKİYE",
    tcNo: "23456789012",
    registrationDate: "09.09.2026",
    dentist: "Dr. Selin Yılmaz",
    mobilePhone: "+90 505 321 45 67",
    phone2: "+90 212 321 45 67",
    landline: "",
    email: "tugce.ungor@mail.com",
    country: "TÜRKİYE",
    city: "İSTANBUL",
    postalCode: "34000",
    district: "Kadıköy",
    address: "Kadıköy, İstanbul",
    currency: "Türk Lirası (TRY)",
    nextAppointmentDate: "",
    tariff: "TDB 2021",
    lastTreatmentDate: "26.08.2026",
    institution: "Özel",
    lastPaymentDate: "26.08.2026",
    family: "Seçiniz",
    profession: "Mimar",
    group: "Seçiniz",
    bloodGroup: "A Rh(+)",
    relativeName: "Ayşe Üngör",
    controlPeriod: "6 Ay",
    relativePhone: "+90 532 456 78 90",
    specialCode1: "",
    referenceName: "Seçiniz",
    specialCode2: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const actionButtons = [
    { name: "Yazdır", icon: Printer, action: "print" },
    { name: "Randevu", icon: Calendar, action: "appointment" },
    { name: "Anamnez", icon: FileText, action: "anamnesis" },
    { name: "Fatura", icon: Receipt, action: "invoice" },
    { name: "SMS", icon: Send, action: "sms" },
    { name: "İstirahat Raporu", icon: ClipboardList, action: "report" },
  ];

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* Top Toolbar Row */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] px-4 py-2.5 shadow-2xs">
        {/* Left Toolbar actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            title="Geri Al"
            onClick={() => {
              setFormData({
                firstName: "Tuğçe",
                lastName: "Üngör",
                gender: "Kadın",
                birthDate: "01.01.1998",
                nationality: "TÜRKİYE",
                tcNo: "23456789012",
                registrationDate: "09.09.2026",
                dentist: "Dr. Selin Yılmaz",
                mobilePhone: "+90 505 321 45 67",
                phone2: "+90 212 321 45 67",
                landline: "",
                email: "tugce.ungor@mail.com",
                country: "TÜRKİYE",
                city: "İSTANBUL",
                postalCode: "34000",
                district: "Kadıköy",
                address: "Kadıköy, İstanbul",
                currency: "Türk Lirası (TRY)",
                nextAppointmentDate: "",
                tariff: "TDB 2021",
                lastTreatmentDate: "26.08.2026",
                institution: "Özel",
                lastPaymentDate: "26.08.2026",
                family: "Seçiniz",
                profession: "Mimar",
                group: "Seçiniz",
                bloodGroup: "A Rh(+)",
                relativeName: "Ayşe Üngör",
                controlPeriod: "6 Ay",
                relativePhone: "+90 532 456 78 90",
                specialCode1: "",
                referenceName: "Seçiniz",
                specialCode2: "",
              });
              showToast("Form orijinal değerlere sıfırlandı.", "info");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5F665F] transition-colors hover:bg-[#EEEBE4] hover:text-[#1C211E] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-[#E6E1D8]" />
          <button
            type="button"
            title="Ekle"
            onClick={() => showToast("Yeni hasta kayıt modu açıldı.", "info")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5F665F] transition-colors hover:bg-[#EEEBE4] hover:text-[#1C211E] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Sil"
            onClick={() => showToast("Hasta kartı silme işlemi için yetki onaylandı.", "error")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#B3261E] transition-colors hover:bg-[#FBE9E7] cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Düzenle"
            onClick={() => {
              setIsEditing(!isEditing);
              showToast(isEditing ? "Düzenleme modu kapatıldı." : "Düzenleme modu açıldı.", "info");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5F665F] transition-colors hover:bg-[#EEEBE4] hover:text-[#1C211E] cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-[#E6E1D8]" />
          <button
            type="button"
            title="Kaydet"
            onClick={() => showToast("✓ Hasta bilgileri başarıyla güncellendi.", "success")}
            className="flex items-center gap-1.5 rounded-lg bg-[#1F3327] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2D3A32] cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Kaydet</span>
          </button>
        </div>

        {/* Right Navigation Arrows */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#5F665F]">Hasta {currentId} / 5</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Önceki Hasta"
              onClick={() => {
                const prev = currentId > 1 ? currentId - 1 : 5;
                router.push(`/hastalar/${prev}`);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#3F4540] transition-colors hover:bg-[#EEEBE4] hover:text-[#1C211E] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Sonraki Hasta"
              onClick={() => {
                const next = currentId < 5 ? currentId + 1 : 1;
                router.push(`/hastalar/${next}`);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1D8] text-[#3F4540] transition-colors hover:bg-[#EEEBE4] hover:text-[#1C211E] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Main Layout: Form (Left) + Action Panel (Right) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: 3 Form Sections (9 columns on XL) */}
        <div className="space-y-6 xl:col-span-9">
          {/* ======================================================== */}
          {/* Section 1: Kişisel Bilgiler */}
          {/* ======================================================== */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-[#E6E1D8] pb-3">
              <UserCheck className="h-4 w-4 text-[#1F3327]" />
              <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider">
                Kişisel Bilgiler
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Ad */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Ad
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Soyad */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Cinsiyet: Radio (Erkek / Kadın) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Cinsiyet
                  </label>
                  <div className="flex h-10 items-center gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3F4540]">
                      <input
                        type="radio"
                        name="gender"
                        value="Erkek"
                        checked={gender === "Erkek"}
                        onChange={() => {
                          setGender("Erkek");
                          handleChange("gender", "Erkek");
                        }}
                        className="h-4 w-4 accent-[#1F3327]"
                      />
                      <span>Erkek</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3F4540]">
                      <input
                        type="radio"
                        name="gender"
                        value="Kadın"
                        checked={gender === "Kadın"}
                        onChange={() => {
                          setGender("Kadın");
                          handleChange("gender", "Kadın");
                        }}
                        className="h-4 w-4 accent-[#1F3327]"
                      />
                      <span>Kadın</span>
                    </label>
                  </div>
                </div>

                {/* Doğum Tarihi */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Doğum Tarihi
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={formData.birthDate}
                      onChange={(e) => handleChange("birthDate", e.target.value)}
                      placeholder="GG.AA.YYYY"
                      className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F]" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Uyruk (dropdown) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Uyruk
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => handleChange("nationality", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="TÜRKİYE">TÜRKİYE</option>
                    <option value="ALMANYA">ALMANYA</option>
                    <option value="İNGİLTERE">İNGİLTERE</option>
                    <option value="DİĞER">DİĞER</option>
                  </select>
                </div>

                {/* TC Kimlik No */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    TC Kimlik No
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={formData.tcNo}
                    onChange={(e) => handleChange("tcNo", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 font-mono text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Kayıt Tarihi (date picker style) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Kayıt Tarihi
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={formData.registrationDate}
                      onChange={(e) =>
                        handleChange("registrationDate", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F]" />
                  </div>
                </div>

                {/* Dişhekimi (dropdown) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Dişhekimi
                  </label>
                  <select
                    value={formData.dentist}
                    onChange={(e) => handleChange("dentist", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="Dr. Selin Yılmaz">Dr. Selin Yılmaz</option>
                    <option value="Dr. Mahir Açıkkalın">Dr. Mahir Açıkkalın</option>
                    <option value="Dr. Ahmet Kaya">Dr. Ahmet Kaya</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Section 2: İletişim Bilgileri */}
          {/* ======================================================== */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-[#E6E1D8] pb-3">
              <Phone className="h-4 w-4 text-[#1F3327]" />
              <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider">
                İletişim Bilgileri
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Cep Telefonu */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Cep Telefonu
                  </label>
                  <input
                    type="text"
                    value={formData.mobilePhone}
                    onChange={(e) => handleChange("mobilePhone", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Telefon */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={formData.phone2}
                    onChange={(e) => handleChange("phone2", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Ülke (dropdown) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Ülke
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="TÜRKİYE">TÜRKİYE</option>
                    <option value="ALMANYA">ALMANYA</option>
                    <option value="DİĞER">DİĞER</option>
                  </select>
                </div>

                {/* Posta Kodu */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Sabit Telefon */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Sabit Telefon
                  </label>
                  <input
                    type="text"
                    value={formData.landline}
                    onChange={(e) => handleChange("landline", e.target.value)}
                    placeholder="—"
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* E-posta */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Şehir (dropdown) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    Şehir
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="İSTANBUL">İSTANBUL</option>
                    <option value="ANKARA">ANKARA</option>
                    <option value="İZMİR">İZMİR</option>
                    <option value="BURSA">BURSA</option>
                    <option value="ANTALYA">ANTALYA</option>
                  </select>
                </div>

                {/* İlçe (dropdown) */}
                <div className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-xs font-medium text-[#5F665F]">
                    İlçe
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="Kadıköy">Kadıköy</option>
                    <option value="Beşiktaş">Beşiktaş</option>
                    <option value="Üsküdar">Üsküdar</option>
                    <option value="Şişli">Şişli</option>
                    <option value="Maltepe">Maltepe</option>
                  </select>
                </div>
              </div>

              {/* Full Width Row: Adres */}
              <div className="md:col-span-2 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <label className="w-28 shrink-0 pt-2 text-xs font-medium text-[#5F665F]">
                    Adres
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full rounded-lg border border-[#E6E1D8] bg-white p-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Section 3: Diğer Bilgiler */}
          {/* ======================================================== */}
          <div className="rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-[#E6E1D8] pb-3">
              <Info className="h-4 w-4 text-[#1F3327]" />
              <h2 className="text-sm font-serif font-bold text-[#1C211E] uppercase tracking-wider">
                Diğer Bilgiler
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Para Birimi */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Para Birimi
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Tarife */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Tarife
                  </label>
                  <select
                    value={formData.tariff}
                    onChange={(e) => handleChange("tariff", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="TDB 2021">TDB 2021</option>
                    <option value="TDB 2024">TDB 2024</option>
                    <option value="Özel Liste">Özel Liste</option>
                  </select>
                </div>

                {/* Kurum */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Kurum
                  </label>
                  <select
                    value={formData.institution}
                    onChange={(e) => handleChange("institution", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="Özel">Özel</option>
                    <option value="SGK">SGK</option>
                    <option value="Anlaşmalı Kurum">Anlaşmalı Kurum</option>
                  </select>
                </div>

                {/* Aile: Seçiniz (+) */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Aile
                  </label>
                  <div className="flex w-full items-center gap-2">
                    <select
                      value={formData.family}
                      onChange={(e) => handleChange("family", e.target.value)}
                      className="h-10 flex-1 rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    >
                      <option value="Seçiniz">Seçiniz</option>
                      <option value="Üngör Ailesi">Üngör Ailesi</option>
                    </select>
                    <button
                      type="button"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] text-[#3F4540] transition hover:bg-[#EADFC8] hover:text-[#1C211E] cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Grup: Seçiniz (+) */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Grup
                  </label>
                  <div className="flex w-full items-center gap-2">
                    <select
                      value={formData.group}
                      onChange={(e) => handleChange("group", e.target.value)}
                      className="h-10 flex-1 rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    >
                      <option value="Seçiniz">Seçiniz</option>
                      <option value="VIP">VIP</option>
                      <option value="Ortodonti Grubu">Ortodonti Grubu</option>
                    </select>
                    <button
                      type="button"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E6E1D8] bg-[#EEEBE4] text-[#3F4540] transition hover:bg-[#EADFC8] hover:text-[#1C211E] cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Yakınının Adı */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Yakınının Adı
                  </label>
                  <input
                    type="text"
                    value={formData.relativeName}
                    onChange={(e) =>
                      handleChange("relativeName", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Yakının Tel. */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Yakının Tel.
                  </label>
                  <input
                    type="text"
                    value={formData.relativePhone}
                    onChange={(e) =>
                      handleChange("relativePhone", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Referans Adı: Seçiniz */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Referans Adı
                  </label>
                  <select
                    value={formData.referenceName}
                    onChange={(e) =>
                      handleChange("referenceName", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="Seçiniz">Seçiniz</option>
                    <option value="Tavsiye / Tanıdık">Tavsiye / Tanıdık</option>
                    <option value="Sosyal Medya">Sosyal Medya</option>
                    <option value="Google Arama">Google Arama</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Gelecek Rand. Tar. */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Gelecek Rand. Tar.
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="GG.AA.YYYY"
                      value={formData.nextAppointmentDate}
                      onChange={(e) =>
                        handleChange("nextAppointmentDate", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F665F]" />
                  </div>
                </div>

                {/* Son Tedavi Tarihi */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Son Tedavi Tarihi
                  </label>
                  <input
                    type="text"
                    value={formData.lastTreatmentDate}
                    onChange={(e) =>
                      handleChange("lastTreatmentDate", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Son Ödeme Tarihi */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Son Ödeme Tarihi
                  </label>
                  <input
                    type="text"
                    value={formData.lastPaymentDate}
                    onChange={(e) =>
                      handleChange("lastPaymentDate", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Meslek */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Meslek
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => handleChange("profession", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Kan Grubu */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Kan Grubu
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="A Rh(+)">A Rh(+)</option>
                    <option value="A Rh(-)">A Rh(-)</option>
                    <option value="B Rh(+)">B Rh(+)</option>
                    <option value="B Rh(-)">B Rh(-)</option>
                    <option value="AB Rh(+)">AB Rh(+)</option>
                    <option value="AB Rh(-)">AB Rh(-)</option>
                    <option value="0 Rh(+)">0 Rh(+)</option>
                    <option value="0 Rh(-)">0 Rh(-)</option>
                  </select>
                </div>

                {/* Kontrol Periyodu */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Kontrol Periyodu
                  </label>
                  <select
                    value={formData.controlPeriod}
                    onChange={(e) =>
                      handleChange("controlPeriod", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  >
                    <option value="3 Ay">3 Ay</option>
                    <option value="6 Ay">6 Ay</option>
                    <option value="1 Yıl">1 Yıl</option>
                  </select>
                </div>

                {/* Özel Kod (1) */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Özel Kod
                  </label>
                  <input
                    type="text"
                    value={formData.specialCode1}
                    onChange={(e) =>
                      handleChange("specialCode1", e.target.value)
                    }
                    placeholder="—"
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Özel Kod (2) */}
                <div className="flex items-center gap-3">
                  <label className="w-32 shrink-0 text-xs font-medium text-[#5F665F]">
                    Özel Kod
                  </label>
                  <input
                    type="text"
                    value={formData.specialCode2}
                    onChange={(e) =>
                      handleChange("specialCode2", e.target.value)
                    }
                    placeholder="—"
                    className="h-10 w-full rounded-lg border border-[#E6E1D8] bg-white px-3 text-sm text-[#3F4540] outline-none transition focus:border-[#1F3327] focus:ring-1 focus:ring-[#1F3327]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Right Sidebar Panel: 2x3 Grid of Action Buttons */}
        {/* ======================================================== */}
        <div className="xl:col-span-3">
          <div className="sticky top-20 rounded-xl border border-[#E6E1D8] bg-[#FBFAF7] p-5 shadow-xs">
            <h3 className="mb-4 text-xs font-serif font-bold uppercase tracking-wider text-[#1C211E]">
              Hızlı İşlemler
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {actionButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.name}
                    type="button"
                    onClick={() => {
                      if (btn.action === "appointment") {
                        openAppointmentModal(`${formData.firstName} ${formData.lastName}`);
                      } else if (btn.action === "invoice") {
                        router.push(`/hastalar/${currentId}/fatura`);
                      } else if (btn.action === "print") {
                        openPrintPreview({
                          type: "patient_card",
                          title: "Hasta Klinik Takip ve Bilgi Kartı",
                          patientName: `${formData.firstName} ${formData.lastName}`,
                          date: new Date().toLocaleDateString("tr-TR"),
                          doctorName: formData.dentist,
                          extraInfo: {
                            "T.C. Kimlik No": formData.tcNo,
                            "Doğum Tarihi": formData.birthDate,
                            "Telefon": formData.mobilePhone,
                            "Kan Grubu": formData.bloodGroup,
                            "Adres": formData.address,
                            "Kontrol Periyodu": formData.controlPeriod,
                          },
                        });
                      } else if (btn.action === "sms") {
                        openSmsModal(`${formData.firstName} ${formData.lastName}`, formData.mobilePhone);
                      } else if (btn.action === "anamnesis") {
                        openAnamnesisModal(`${formData.firstName} ${formData.lastName}`, currentId.toString());
                      } else if (btn.action === "report") {
                        openReportModal(`${formData.firstName} ${formData.lastName}`, formData.dentist, formData.tcNo);
                      }
                    }}
                    className="group flex flex-col items-center justify-center rounded-xl border border-[#E6E1D8] bg-white p-4 text-center shadow-2xs transition-all duration-200 hover:border-[#1F3327] hover:bg-[#EEEBE4]/60 hover:shadow-xs cursor-pointer"
                  >
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEEBE4] text-[#1F3327] transition-colors group-hover:bg-[#1F3327] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-[#3F4540] group-hover:text-[#1C211E]">
                      {btn.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
