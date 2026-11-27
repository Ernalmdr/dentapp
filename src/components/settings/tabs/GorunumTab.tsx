"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Check, Sun, Moon, Monitor } from "lucide-react";
import { AppearanceSettings } from "@/lib/settings-types";
import { useSidebar } from "@/lib/sidebar-context";
import {
  SettingsCard,
  SettingsField,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface GorunumTabProps {
  value: AppearanceSettings;
  onChange: (val: AppearanceSettings) => void;
}

const THEME_OPTIONS: {
  id: AppearanceSettings["theme"];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "light", label: "Açık", icon: Sun },
  { id: "dark", label: "Koyu", icon: Moon },
  { id: "system", label: "Sistem", icon: Monitor },
];

const FONT_SIZES: AppearanceSettings["fontSize"][] = [
  "Küçük",
  "Normal",
  "Büyük",
];

const SIDEBAR_MODES: AppearanceSettings["sidebarMode"][] = ["Geniş", "Dar"];

export default function GorunumTab({ value, onChange }: GorunumTabProps) {
  const { theme: activeTheme, setTheme } = useTheme();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const currentTheme = (activeTheme as AppearanceSettings["theme"]) || value.theme;
  const currentSidebarMode: AppearanceSettings["sidebarMode"] = isCollapsed
    ? "Dar"
    : value.sidebarMode;

  const handleThemeSelect = (theme: AppearanceSettings["theme"]) => {
    setTheme(theme);
    onChange({ ...value, theme });
  };

  const handleSidebarModeSelect = (mode: AppearanceSettings["sidebarMode"]) => {
    const collapsed = mode === "Dar";
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem("dentapp_sidebar_collapsed", String(collapsed));
    } catch {
      // ignore storage errors
    }
    onChange({ ...value, sidebarMode: mode });
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Tema" description="Uygulamanın genel görünümü.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {THEME_OPTIONS.map((option) => {
            const selected = currentTheme === option.id;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleThemeSelect(option.id)}
                className={cn(
                  "group relative flex flex-col rounded-2xl border p-3 text-left transition-all cursor-pointer",
                  selected
                    ? "border-[#1F3327] dark:border-[#3F8F55] ring-2 ring-[#1F3327]/15 dark:ring-[#3F8F55]/25 bg-white dark:bg-[#192B21]"
                    : "border-[#E6E1D8] dark:border-[#243B2F] bg-white/70 dark:bg-[#16251D] hover:border-[#C9C2B5] dark:hover:border-[#355444]"
                )}
              >
                {/* Visual Mini Preview */}
                <div className="mb-3 h-20 w-full overflow-hidden rounded-xl border border-[#E6E1D8] dark:border-[#243B2F]">
                  {option.id === "light" && (
                    <div className="flex h-full w-full bg-[#F5F2EC] p-2 gap-1.5">
                      <div className="w-5 rounded-md bg-[#1F3327]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-2/3 rounded bg-white border border-[#E6E1D8]" />
                        <div className="h-8 w-full rounded bg-white border border-[#E6E1D8]" />
                      </div>
                    </div>
                  )}
                  {option.id === "dark" && (
                    <div className="flex h-full w-full bg-[#101C16] p-2 gap-1.5">
                      <div className="w-5 rounded-md bg-[#1D3227]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-2/3 rounded bg-[#182920] border border-[#243B2F]" />
                        <div className="h-8 w-full rounded bg-[#182920] border border-[#243B2F]" />
                      </div>
                    </div>
                  )}
                  {option.id === "system" && (
                    <div className="flex h-full w-full">
                      <div className="flex-1 bg-[#F5F2EC] p-2 pr-1">
                        <div className="h-full rounded bg-white border border-[#E6E1D8]" />
                      </div>
                      <div className="flex-1 bg-[#101C16] p-2 pl-1">
                        <div className="h-full rounded bg-[#182920] border border-[#243B2F]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
                    <span className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                      {option.label}
                    </span>
                  </div>
                  {selected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F3327] dark:bg-[#3F8F55] text-white">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Yazı ve Yerleşim"
        description="Okunabilirlik ve ekran düzeni."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#3F4540] dark:text-[#C5D4CB]">
              Yazı Boyutu
            </span>
            <div className="inline-flex w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#F3F0EA] dark:bg-[#111D17] p-1">
              {FONT_SIZES.map((size) => {
                const active = value.fontSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onChange({ ...value, fontSize: size })}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-medium transition-all cursor-pointer",
                      active
                        ? "bg-white dark:bg-[#1F3327] text-[#1C211E] dark:text-[#ECF3EE] shadow-xs"
                        : "text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-white"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#3F4540] dark:text-[#C5D4CB]">
              Yan Menü
            </span>
            <div className="inline-flex w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#F3F0EA] dark:bg-[#111D17] p-1">
              {SIDEBAR_MODES.map((mode) => {
                const active = currentSidebarMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSidebarModeSelect(mode)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-medium transition-all cursor-pointer",
                      active
                        ? "bg-white dark:bg-[#1F3327] text-[#1C211E] dark:text-[#ECF3EE] shadow-xs"
                        : "text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#1C211E] dark:hover:text-white"
                    )}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Dil ve Bölge"
        description="Tarih, saat ve para birimi biçimleri."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Dil">
            <select
              value={value.language}
              onChange={(e) => onChange({ ...value, language: e.target.value })}
              className={settingsSelectClass}
            >
              <option value="Türkçe">Türkçe</option>
              <option value="English">English</option>
            </select>
          </SettingsField>

          <SettingsField label="Tarih Biçimi">
            <select
              value={value.dateFormat}
              onChange={(e) =>
                onChange({ ...value, dateFormat: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="GG.AA.YYYY">GG.AA.YYYY</option>
              <option value="AA/GG/YYYY">AA/GG/YYYY</option>
              <option value="YYYY-AA-GG">YYYY-AA-GG</option>
            </select>
          </SettingsField>

          <SettingsField label="Para Birimi">
            <select
              value={value.currency}
              onChange={(e) => onChange({ ...value, currency: e.target.value })}
              className={settingsSelectClass}
            >
              <option value="Türk Lirası (TRY)">Türk Lirası (TRY)</option>
              <option value="Euro (EUR)">Euro (EUR)</option>
              <option value="ABD Doları (USD)">ABD Doları (USD)</option>
              <option value="İngiliz Sterlini (GBP)">İngiliz Sterlini (GBP)</option>
            </select>
          </SettingsField>

          <SettingsField label="Saat Dilimi">
            <select
              value={value.timezone}
              onChange={(e) => onChange({ ...value, timezone: e.target.value })}
              className={settingsSelectClass}
            >
              <option value="İstanbul (UTC+03:00)">İstanbul (UTC+03:00)</option>
              <option value="Londra (UTC+00:00)">Londra (UTC+00:00)</option>
              <option value="Berlin (UTC+01:00)">Berlin (UTC+01:00)</option>
              <option value="New York (UTC-05:00)">New York (UTC-05:00)</option>
            </select>
          </SettingsField>
        </div>
      </SettingsCard>
    </div>
  );
}
