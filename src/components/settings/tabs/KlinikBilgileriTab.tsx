"use client";

import React, { useRef } from "react";
import { Building2, Trash2, Upload } from "lucide-react";
import type { ClinicInfoSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  SettingsToggle,
  settingsInputClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface KlinikBilgileriTabProps {
  value: ClinicInfoSettings;
  onChange: (val: ClinicInfoSettings) => void;
}

export default function KlinikBilgileriTab({
  value,
  onChange,
}: KlinikBilgileriTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof ClinicInfoSettings>(
    key: K,
    fieldValue: ClinicInfoSettings[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({ ...value, logoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const updateWorkingDay = (
    index: number,
    patch: Partial<ClinicInfoSettings["workingHours"][number]>
  ) => {
    const nextHours = value.workingHours.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    onChange({ ...value, workingHours: nextHours });
  };

  const timeInputClass =
    "h-9 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-2.5 text-xs text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] dark:focus:border-[#3F8F55] focus:ring-1 focus:ring-[#1F3327]/20 transition-colors";

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Klinik Bilgileri"
        description="Faturalarda, reçetelerde ve hasta bilgilendirmelerinde görünecek bilgiler."
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#ECE8E1] dark:border-[#243B2F]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] flex items-center justify-center overflow-hidden shrink-0">
              {value.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value.logoUrl}
                  alt="Klinik logosu"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-7 w-7 text-[#5F665F] dark:text-[#A2B5A8]" />
              )}
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                Klinik Logosu
              </p>
              <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8] mt-0.5">
                PNG veya JPG, en az 256×256 px
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoChange}
              className="hidden"
              aria-label="Klinik logosu yükle"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] text-xs font-medium text-[#1C211E] dark:text-[#ECF3EE] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Değiştir
            </button>
            <button
              type="button"
              disabled={!value.logoUrl}
              onClick={() => updateField("logoUrl", null)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-transparent text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#B3261E] dark:hover:text-[#F28B82] hover:border-[#B3261E]/30 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Kaldır
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Klinik Adı">
            <input
              type="text"
              value={value.clinicName}
              onChange={(e) => updateField("clinicName", e.target.value)}
              className={settingsInputClass}
              placeholder="Örn. Açıkkalın Diş Kliniği"
            />
          </SettingsField>

          <SettingsField label="Telefon">
            <input
              type="tel"
              value={value.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={settingsInputClass}
              placeholder="+90 232 000 00 00"
            />
          </SettingsField>

          <SettingsField label="Yetkili Kişi">
            <input
              type="text"
              value={value.authorizedPerson}
              onChange={(e) => updateField("authorizedPerson", e.target.value)}
              className={settingsInputClass}
              placeholder="Ad Soyad"
            />
          </SettingsField>

          <SettingsField label="E-posta">
            <input
              type="email"
              value={value.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={settingsInputClass}
              placeholder="klinik@ornek.com"
            />
          </SettingsField>

          <SettingsField label="Vergi Dairesi">
            <input
              type="text"
              value={value.taxOffice}
              onChange={(e) => updateField("taxOffice", e.target.value)}
              className={settingsInputClass}
              placeholder="Vergi Dairesi"
            />
          </SettingsField>

          <SettingsField label="Web Sitesi">
            <input
              type="text"
              value={value.website}
              onChange={(e) => updateField("website", e.target.value)}
              className={settingsInputClass}
              placeholder="www.ornek.com"
            />
          </SettingsField>

          <SettingsField label="Vergi No">
            <input
              type="text"
              value={value.taxNumber}
              onChange={(e) => updateField("taxNumber", e.target.value)}
              className={settingsInputClass}
              placeholder="10 haneli vergi numarası"
            />
          </SettingsField>

          <SettingsField label="Şehir / İlçe">
            <input
              type="text"
              value={value.cityDistrict}
              onChange={(e) => updateField("cityDistrict", e.target.value)}
              className={settingsInputClass}
              placeholder="İZMİR / KARŞIYAKA"
            />
          </SettingsField>

          <SettingsField label="Adres" className="sm:col-span-2">
            <textarea
              rows={2}
              value={value.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={cn(settingsInputClass, "h-auto py-2.5 resize-none")}
              placeholder="Açık klinik adresi"
            />
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Çalışma Saatleri"
        description="Randevu takviminde açık görünecek gün ve saatler."
      >
        <div className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
          {value.workingHours.map((item, idx) => (
            <div
              key={item.day}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-[140px]">
                <SettingsToggle
                  checked={item.enabled}
                  onChange={(enabled) => updateWorkingDay(idx, { enabled })}
                  ariaLabel={`${item.day} çalışma durumu`}
                />
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    item.enabled
                      ? "text-[#1C211E] dark:text-[#ECF3EE]"
                      : "text-[#5F665F] dark:text-[#A2B5A8]"
                  )}
                >
                  {item.day}
                </span>
              </div>

              {item.enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={item.start}
                    onChange={(e) =>
                      updateWorkingDay(idx, { start: e.target.value })
                    }
                    aria-label={`${item.day} başlangıç saati`}
                    className={timeInputClass}
                  />
                  <span className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                    —
                  </span>
                  <input
                    type="time"
                    value={item.end}
                    onChange={(e) =>
                      updateWorkingDay(idx, { end: e.target.value })
                    }
                    aria-label={`${item.day} bitiş saati`}
                    className={timeInputClass}
                  />
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#ECE8E1] dark:bg-[#243B2F] text-[#5F665F] dark:text-[#A2B5A8]">
                  Kapalı
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[#E6E1D8] dark:border-[#243B2F] flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
              Öğle arası
            </p>
            <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
              Randevu takviminde mola olarak işaretlenir.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={value.lunchStart}
              onChange={(e) => updateField("lunchStart", e.target.value)}
              aria-label="Öğle arası başlangıç saati"
              className={timeInputClass}
            />
            <span className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
              —
            </span>
            <input
              type="time"
              value={value.lunchEnd}
              onChange={(e) => updateField("lunchEnd", e.target.value)}
              aria-label="Öğle arası bitiş saati"
              className={timeInputClass}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
