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
  Plus,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
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

  const initials = `${patient.firstName?.[0] || "T"}${
    patient.lastName?.[0] || "Ü"
  }`;

  const currentTab = tabs.find((t) =>
    t.exact
      ? pathname === t.href || pathname === `${t.href}/`
      : pathname.startsWith(t.href)
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/hastalar" className="hover:text-[#2D4A3E] transition-colors">
          Hastalar
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-medium text-gray-900">
          {currentTab?.name || "Hasta Kartı"}
        </span>
      </div>

      {/* ============================================================ */}
      {/* Patient Header Card */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
        {/* Background: decorative 3D tooth illustration faded on the right */}
        <div className="pointer-events-none absolute -bottom-8 -right-4 top-0 flex w-72 select-none items-center justify-end overflow-hidden pr-6 opacity-[0.07]">
          <svg
            viewBox="0 0 200 220"
            className="h-56 w-56 fill-current text-[#2D4A3E]"
          >
            <path d="M50,15 C25,15 10,38 10,70 C10,95 20,125 35,160 C42,178 52,195 62,205 C70,212 78,206 82,192 C88,172 92,152 98,135 C100,130 104,130 106,135 C112,152 116,172 122,192 C126,206 134,212 142,205 C152,195 162,178 169,160 C184,125 194,95 194,70 C194,38 179,15 154,15 C132,15 116,28 102,28 C88,28 72,15 50,15 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {/* Left: Avatar + Name + Info */}
          <div className="flex items-center gap-4">
            {/* Avatar Circle */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D4A3E] to-[#4A7C68] text-xl font-bold text-white shadow-md">
              {initials}
            </div>

            {/* Patient Name & Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <StatusBadge status={patient.status || "Aktif Tedavi"} size="sm" />
              </div>

              {/* Info Row: HS-10248 | 28 Yaş | Kadın | +90 505 321 45 67 */}
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-gray-500">
                <span className="font-semibold text-gray-700">
                  {patient.hsNo || "HS-10248"}
                </span>
                <span className="text-gray-300">|</span>
                <span>{patient.age || 28} Yaş</span>
                <span className="text-gray-300">|</span>
                <span>{patient.gender || "Kadın"}</span>
                <span className="text-gray-300">|</span>
                <span>
                  {patient.phone ? formatPhone(patient.phone) : "+90 505 321 45 67"}
                </span>
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {/* Düzenle (outline) */}
            <button
              type="button"
              onClick={() => showToast(`✓ ${patient.firstName} ${patient.lastName} bilgileri düzenleme moduna alındı.`, "info")}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-gray-500" />
              <span>Düzenle</span>
            </button>

            {/* + Yeni Randevu (dark green #2D4A3E) */}
            <button
              type="button"
              onClick={() => openAppointmentModal(`${patient.firstName} ${patient.lastName}`)}
              className="flex items-center gap-1.5 rounded-lg bg-[#2D4A3E] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3A5F50] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Randevu</span>
            </button>

            {/* ... Menu */}
            <button
              type="button"
              onClick={() => showToast(`Hasta No: ${patient.hsNo || "HS-10248"} kopyalandı.`, "info")}
              aria-label="Diğer İşlemler"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Tab Navigation (6 tabs, pill-style with icons) */}
      {/* ============================================================ */}
      <div className="flex overflow-x-auto pb-1 scrollbar-none">
        <div className="flex gap-2">
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
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-[#4A7C68] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200/70"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-white" : "text-gray-500"
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
