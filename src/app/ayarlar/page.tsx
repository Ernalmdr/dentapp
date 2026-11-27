"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Bell,
  CalendarClock,
  Receipt,
  ListChecks,
  Sparkles,
  Palette,
  ShieldCheck,
  DatabaseBackup,
  Plug,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  AllClinicSettings,
  DEFAULT_SETTINGS,
  SettingsTabId,
} from "@/lib/settings-types";

import KlinikBilgileriTab from "@/components/settings/tabs/KlinikBilgileriTab";
import KullanicilarTab from "@/components/settings/tabs/KullanicilarTab";
import BildirimlerTab from "@/components/settings/tabs/BildirimlerTab";
import RandevuAyarlariTab from "@/components/settings/tabs/RandevuAyarlariTab";
import FaturaOdemeTab from "@/components/settings/tabs/FaturaOdemeTab";
import TedaviFiyatTab from "@/components/settings/tabs/TedaviFiyatTab";
import AiDestekTab from "@/components/settings/tabs/AiDestekTab";
import GorunumTab from "@/components/settings/tabs/GorunumTab";
import GuvenlikTab from "@/components/settings/tabs/GuvenlikTab";
import YedeklemeVeriTab from "@/components/settings/tabs/YedeklemeVeriTab";
import EntegrasyonlarTab from "@/components/settings/tabs/EntegrasyonlarTab";

const STORAGE_KEY = "dentapp_clinic_settings_v2";

interface NavTabItem {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SETTINGS_TABS: NavTabItem[] = [
  { id: "klinik", label: "Klinik Bilgileri", icon: Building2 },
  { id: "kullanicilar", label: "Kullanıcılar ve Yetkiler", icon: Users },
  { id: "bildirimler", label: "Bildirimler", icon: Bell },
  { id: "randevu", label: "Randevu Ayarları", icon: CalendarClock },
  { id: "fatura", label: "Fatura ve Ödeme", icon: Receipt },
  { id: "tedavi", label: "Tedavi ve Fiyat Listesi", icon: ListChecks },
  { id: "ai", label: "AI Destek", icon: Sparkles },
  { id: "gorunum", label: "Görünüm", icon: Palette },
  { id: "guvenlik", label: "Güvenlik", icon: ShieldCheck },
  { id: "yedekleme", label: "Yedekleme ve Veri", icon: DatabaseBackup },
  { id: "entegrasyonlar", label: "Entegrasyonlar", icon: Plug },
];

function AyarlarContent() {
  const { showToast } = useModal();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as SettingsTabId | null;
  const isValidTab = SETTINGS_TABS.some((t) => t.id === tabParam);
  const [activeTab, setActiveTab] = useState<SettingsTabId>(
    isValidTab && tabParam ? tabParam : "klinik"
  );

  const [settings, setSettings] = useState<AllClinicSettings>(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState<AllClinicSettings>(DEFAULT_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);

  // Sync URL ?tab= changes
  useEffect(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Load persisted settings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AllClinicSettings>;
        const merged: AllClinicSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          clinic: { ...DEFAULT_SETTINGS.clinic, ...parsed.clinic },
          usersAndRoles: { ...DEFAULT_SETTINGS.usersAndRoles, ...parsed.usersAndRoles },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
          appointments: { ...DEFAULT_SETTINGS.appointments, ...parsed.appointments },
          billing: { ...DEFAULT_SETTINGS.billing, ...parsed.billing },
          treatments: { ...DEFAULT_SETTINGS.treatments, ...parsed.treatments },
          ai: { ...DEFAULT_SETTINGS.ai, ...parsed.ai },
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
          security: { ...DEFAULT_SETTINGS.security, ...parsed.security },
          backup: { ...DEFAULT_SETTINGS.backup, ...parsed.backup },
          integrations: parsed.integrations ?? DEFAULT_SETTINGS.integrations,
        };
        setSettings(merged);
        setSavedSnapshot(merged);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  const handleTabChange = useCallback(
    (tabId: SettingsTabId) => {
      setActiveTab(tabId);
      router.replace(`/ayarlar?tab=${tabId}`, { scroll: false });
    },
    [router]
  );

  const updateSettings = useCallback(
    <K extends keyof AllClinicSettings>(key: K, val: AllClinicSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: val }));
      setIsDirty(true);
    },
    []
  );

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSnapshot(settings);
      setIsDirty(false);
      showToast("✓ Ayarlar başarıyla kaydedildi.", "success");
    } catch {
      showToast("Ayarlar kaydedilirken bir hata oluştu.", "error");
    }
  };

  const handleDiscard = () => {
    setSettings(savedSnapshot);
    setIsDirty(false);
    showToast("Kaydedilmemiş değişiklikler geri alındı.", "info");
  };

  const activeTabMeta =
    SETTINGS_TABS.find((t) => t.id === activeTab) ?? SETTINGS_TABS[0];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <BannerHeader
        title="Ayarlar"
        description="Klinik, kullanıcı ve sistem tercihlerinizi yönetin."
        breadcrumbs={[
          { label: "Doctrack", href: "/" },
          { label: "Ayarlar", href: "/ayarlar" },
          { label: activeTabMeta.label },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#15221B] hover:bg-[#EEEBE4] dark:hover:bg-[#1D3328] text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] dark:bg-[#3F8F55] dark:hover:bg-[#2F5A3D] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Değişiklikleri Kaydet
            </button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Settings Sub-Navigation */}
        <aside className="w-full lg:w-[248px] shrink-0 lg:sticky lg:top-24">
          <nav
            aria-label="Ayarlar menüsü"
            className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible rounded-2xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#15221B] p-2 shadow-xs"
          >
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-left",
                    isActive
                      ? "bg-[#1F3327] dark:bg-[#3F8F55] text-white shadow-xs"
                      : "text-[#3F4540] dark:text-[#C5D4CB] hover:bg-[#EEEBE4] dark:hover:bg-[#1D3328] hover:text-[#1C211E] dark:hover:text-[#ECF3EE]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-white"
                        : "text-[#5F665F] dark:text-[#A2B5A8]"
                    )}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Active Tab Content */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {activeTab === "klinik" && (
            <KlinikBilgileriTab
              value={settings.clinic}
              onChange={(val) => updateSettings("clinic", val)}
            />
          )}
          {activeTab === "kullanicilar" && (
            <KullanicilarTab
              value={settings.usersAndRoles}
              onChange={(val) => updateSettings("usersAndRoles", val)}
            />
          )}
          {activeTab === "bildirimler" && (
            <BildirimlerTab
              value={settings.notifications}
              onChange={(val) => updateSettings("notifications", val)}
            />
          )}
          {activeTab === "randevu" && (
            <RandevuAyarlariTab
              value={settings.appointments}
              onChange={(val) => updateSettings("appointments", val)}
            />
          )}
          {activeTab === "fatura" && (
            <FaturaOdemeTab
              value={settings.billing}
              onChange={(val) => updateSettings("billing", val)}
            />
          )}
          {activeTab === "tedavi" && (
            <TedaviFiyatTab
              value={settings.treatments}
              onChange={(val) => updateSettings("treatments", val)}
            />
          )}
          {activeTab === "ai" && (
            <AiDestekTab
              value={settings.ai}
              onChange={(val) => updateSettings("ai", val)}
            />
          )}
          {activeTab === "gorunum" && (
            <GorunumTab
              value={settings.appearance}
              onChange={(val) => updateSettings("appearance", val)}
            />
          )}
          {activeTab === "guvenlik" && (
            <GuvenlikTab
              value={settings.security}
              onChange={(val) => updateSettings("security", val)}
              onNotify={showToast}
            />
          )}
          {activeTab === "yedekleme" && (
            <YedeklemeVeriTab
              value={settings.backup}
              onChange={(val) => updateSettings("backup", val)}
              onNotify={showToast}
            />
          )}
          {activeTab === "entegrasyonlar" && (
            <EntegrasyonlarTab
              value={settings.integrations}
              onChange={(val) => updateSettings("integrations", val)}
              onNotify={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AyarlarPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
          Ayarlar yükleniyor...
        </div>
      }
    >
      <AyarlarContent />
    </Suspense>
  );
}
