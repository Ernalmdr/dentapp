"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Users,
  FileText,
  Wallet,
  Receipt,
  Pill,
  MoreHorizontal,
  Pencil,
  Calendar,
} from "lucide-react";
import { patients } from "@/lib/mock-data";
import { cn, formatPhone } from "@/lib/utils";
import { useModal } from "@/components/modals/ModalContext";

// Simple custom tooth icon for the Oral tab
function ToothIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3C4.5 3 3 5 3 8c0 3.5 1.5 6.5 2.5 10.5.5 2 1.5 3.5 3 3.5 1.2 0 1.8-.8 2.5-2.5.5-1.2 1-1.5 2-1.5s1.5.3 2 1.5c.7 1.7 1.3 2.5 2.5 2.5 1.5 0 2.5-1.5 3-3.5 1-4 2.5-7 2.5-10.5 0-3-1.5-5-4-5-2 0-3.5 1.2-4.5 1.2C10.5 4.2 9 3 7 3z" />
    </svg>
  );
}

// Figma neutral female silhouette icon
function FemaleAvatarIcon({ className = "w-10 h-10 text-[#8A8F89]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 5C14.75 5 10.5 9.25 10.5 14.5c0 3.15 1.55 5.95 3.92 7.68C9.8 24.3 6.5 28.52 6.5 33.5a1 1 0 0 0 1 1h25a1 1 0 0 0 1-1c0-4.98-3.3-9.2-7.92-11.32 2.37-1.73 3.92-4.53 3.92-7.68C29.5 9.25 25.25 5 20 5zm0 2.5c4 0 7.25 3.25 7.25 7s-3.25 7-7.25 7-7.25-3.25-7.25-7 3.25-7 7.25-7zm-10.9 25c.66-4.52 4.39-8 9.07-8.52 1.21.45 2.52.69 3.83.69s2.62-.24 3.83-.69c4.68.52 8.41 4 9.07 8.52H9.1z" />
    </svg>
  );
}

function PatientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const patientId = (params?.id as string) || "2";

  // Use patient id "2" (Tuğçe Üngör) as primary/fallback from mock data
  const patient =
    patients.find((p) => p.id === patientId) ||
    patients.find((p) => p.id === "2") ||
    patients[0];

  const { openAppointmentModal, showToast } = useModal();

  const tabs = [
    {
      name: "Hasta Bilgileri",
      href: `/hastalar/${patientId}`,
      exact: true,
      icon: Users,
    },
    {
      name: "Oral (Ağız)",
      href: `/hastalar/${patientId}/oral`,
      exact: false,
      icon: ToothIcon,
    },
    {
      name: "Not ve Görüntü",
      href: `/hastalar/${patientId}/not-goruntu`,
      exact: false,
      icon: FileText,
    },
    {
      name: "Hesap",
      href: `/hastalar/${patientId}/hesap`,
      exact: false,
      icon: Wallet,
    },
    {
      name: "Fatura",
      href: `/hastalar/${patientId}/fatura`,
      exact: false,
      icon: Receipt,
    },
    {
      name: "Reçete",
      href: `/hastalar/${patientId}/recete`,
      exact: false,
      icon: Pill,
    },
  ];

  const currentTab = tabs.find((t) =>
    t.exact
      ? pathname === t.href || pathname === `${t.href}/`
      : pathname.startsWith(t.href)
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#5F665F]">
        <Link href="/hastalar" className="hover:text-[#1F3327] transition-colors">
          Hastalar
        </Link>
        <span className="text-[#E6E1D8]">/</span>
        <span className="font-medium text-[#1C211E] font-serif">
          {currentTab?.name || "Hasta Kartı"}
        </span>
      </div>

      {/* ============================================================ */}
      {/* Patient Header Card */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#E6E1D8] bg-[#FBFAF7] p-6 shadow-xs">
        {/* Subtle decorative tooth outline in background */}
        <div className="pointer-events-none absolute -bottom-8 -right-4 top-0 flex w-72 select-none items-center justify-end overflow-hidden pr-6 opacity-[0.04]">
          <svg
            viewBox="0 0 200 220"
            className="h-56 w-56 fill-current text-[#1F3327]"
          >
            <path d="M50,15 C25,15 10,38 10,70 C10,95 20,125 35,160 C42,178 52,195 62,205 C70,212 78,206 82,192 C88,172 92,152 98,135 C100,130 104,130 106,135 C112,152 116,172 122,192 C126,206 134,212 142,205 C152,195 162,178 169,160 C184,125 194,95 194,70 C194,38 179,15 154,15 C132,15 116,28 102,28 C88,28 72,15 50,15 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          {/* Left: Avatar + Name + Info Bar */}
          <div className="flex items-center gap-5">
            {/* 76x76px Neutral Circle Avatar with Female Silhouette */}
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#E4E0D8] border border-[#D5D0C6] shadow-2xs">
              <FemaleAvatarIcon className="h-10 w-10 text-[#8A8F89]" />
            </div>

            {/* Patient Name & Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[40px] font-serif leading-[44px] text-[#1C211E] tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#E2EEDD] border border-[#C5D6C0] px-3 py-1 text-[13px] font-medium text-[#2C6A3B]">
                  {patient.status || "Aktif Tedavi"}
                </span>
              </div>

              {/* Info Bar: HS-10248 | 28 Yaş | Kadın | +90 505 321 45 67 */}
              <div className="flex flex-wrap items-center gap-2.5 text-sm font-medium text-[#5F665F]">
                <span className="text-[#3F4540]">
                  {patient.hsNo || "HS-10248"}
                </span>
                <span className="text-[#CFCAC0]">|</span>
                <span>{patient.age || 28} Yaş</span>
                <span className="text-[#CFCAC0]">|</span>
                <span>{patient.gender || "Kadın"}</span>
                <span className="text-[#CFCAC0]">|</span>
                <span>
                  {patient.phone ? formatPhone(patient.phone) : "+90 505 321 45 67"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* Düzenle (Beyaz zemin, #E6E1D8 border, kurşun kalem ikonu) */}
            <button
              type="button"
              onClick={() => showToast(`✓ ${patient.firstName} ${patient.lastName} bilgileri düzenleme moduna alındı.`, "info")}
              className="flex items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-4 py-2.5 text-sm font-medium text-[#1C211E] shadow-2xs transition-colors hover:bg-[#F3F0EA] cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-[#5F665F]" />
              <span>Düzenle</span>
            </button>

            {/* + Yeni Randevu (#1F3327 zemin, beyaz yazı, takvim ikonu) */}
            <button
              type="button"
              onClick={() => openAppointmentModal(`${patient.firstName} ${patient.lastName}`)}
              className="flex items-center gap-2 rounded-xl bg-[#1F3327] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#2D3A32] cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-white" />
              <span>Yeni Randevu</span>
            </button>

            {/* ... (Üç nokta menü butonu) */}
            <button
              type="button"
              onClick={() => showToast(`Hasta No: ${patient.hsNo || "HS-10248"} panoya kopyalandı.`, "info")}
              aria-label="Diğer İşlemler"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E1D8] bg-white text-[#5F665F] shadow-2xs transition-colors hover:bg-[#F3F0EA] hover:text-[#1C211E] cursor-pointer"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6 Alt Sekme (Tabs) */}
      {/* ============================================================ */}
      <div className="flex overflow-x-auto pb-1 scrollbar-none">
        <div className="flex gap-2.5">
          {tabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href || pathname === `${tab.href}/`
              : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex h-[48px] items-center gap-2.5 rounded-[14px] px-5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-[#1F3327] border border-[#1F3327] text-white shadow-xs"
                    : "bg-white/70 hover:bg-white text-[#1C211E] border border-[#E6E1D8]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-white" : "text-[#5F665F]"
                  )}
                />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Tab Content */}
      {/* ============================================================ */}
      <div>{children}</div>
    </div>
  );
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="p-6 text-gray-500">Yükleniyor...</div>}>
      <PatientLayoutContent>{children}</PatientLayoutContent>
    </React.Suspense>
  );
}
