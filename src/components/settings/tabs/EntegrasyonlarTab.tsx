"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  FileText,
  FileCheck2,
  Calendar,
  MessageCircle,
  Mail,
  Plug,
  Settings2,
  Link2,
  Unlink,
  X,
} from "lucide-react";
import { IntegrationItem } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  settingsInputClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface EntegrasyonlarTabProps {
  value: IntegrationItem[];
  onChange: (val: IntegrationItem[]) => void;
  onNotify?: (msg: string, type?: "success" | "info" | "error") => void;
}

const INTEGRATION_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  sms: MessageSquare,
  efatura: FileText,
  erecete: FileCheck2,
  gcal: Calendar,
  whatsapp: MessageCircle,
  smtp: Mail,
};

const DEFAULT_CONFIG_PLACEHOLDER: Record<string, string> = {
  sms: "Örn: NetGSM · Başlık: KLINIK",
  efatura: "Örn: Uyumsoft / Paraşüt API Anahtarı",
  erecete: "Örn: Sağlık Bakanlığı MEDULA Kullanıcı Kodu",
  gcal: "Örn: klinik@gmail.com",
  whatsapp: "Örn: +90 5XX XXX XX XX (Meta Business ID)",
  smtp: "Örn: smtp.klinik.com:587",
};

export default function EntegrasyonlarTab({
  value,
  onChange,
  onNotify,
}: EntegrasyonlarTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [configInput, setConfigInput] = useState("");

  const activeItem = value.find((item) => item.id === editingId) || null;

  const openConfig = (item: IntegrationItem) => {
    setEditingId(item.id);
    setConfigInput(item.configSummary || "");
  };

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    const trimmed = configInput.trim();
    const updated = value.map((item) =>
      item.id === activeItem.id
        ? {
            ...item,
            connected: true,
            configSummary: trimmed || "Bağlantı yapılandırıldı",
          }
        : item
    );

    onChange(updated);
    onNotify?.(
      `${activeItem.name} entegrasyonu ${
        activeItem.connected ? "güncellendi" : "bağlandı"
      }.`,
      "success"
    );
    setEditingId(null);
  };

  const handleDisconnect = () => {
    if (!activeItem) return;
    const updated = value.map((item) =>
      item.id === activeItem.id
        ? { ...item, connected: false, configSummary: undefined }
        : item
    );
    onChange(updated);
    onNotify?.(`${activeItem.name} bağlantısı kesildi.`, "info");
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Entegrasyonlar"
        description="Kliniğinizi kullandığınız diğer servislerle bağlayın."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((item) => {
            const Icon = INTEGRATION_ICONS[item.id] || Plug;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col justify-between rounded-2xl border p-4 transition-colors",
                  isEditing
                    ? "border-[#1F3327] dark:border-[#3F8F55] bg-[#F6F4EF] dark:bg-[#192B21]"
                    : "border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#17261E]"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          item.connected
                            ? "bg-[#E6F4EA] dark:bg-[#1D3B28] text-[#1E6F3D] dark:text-[#7CD99A]"
                            : "bg-[#F1EEE7] dark:bg-[#1E3026] text-[#5F665F] dark:text-[#A2B5A8]"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#1C211E] dark:text-[#ECF3EE] truncate">
                          {item.name}
                        </h3>
                        <span
                          className={cn(
                            "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                            item.connected
                              ? "bg-[#E6F4EA] dark:bg-[#1D3B28] text-[#1E6F3D] dark:text-[#7CD99A]"
                              : "bg-[#EFECE6] dark:bg-[#22352A] text-[#5F665F] dark:text-[#A2B5A8]"
                          )}
                        >
                          {item.connected ? "Bağlı" : "Bağlı değil"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        isEditing ? setEditingId(null) : openConfig(item)
                      }
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                        item.connected
                          ? "border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#1A2C23] text-[#1C211E] dark:text-[#ECF3EE] hover:bg-[#F1EEE7] dark:hover:bg-[#23392D]"
                          : "bg-[#1F3327] dark:bg-[#3F8F55] text-white hover:bg-[#17261D] dark:hover:bg-[#357A48]"
                      )}
                    >
                      {item.connected ? (
                        <>
                          <Settings2 className="h-3.5 w-3.5" />
                          Ayarlar
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3.5 w-3.5" />
                          Bağla
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#5F665F] dark:text-[#A2B5A8]">
                    {item.description}
                  </p>

                  {item.connected && item.configSummary && !isEditing && (
                    <p className="mt-2 rounded-lg bg-[#F5F2EC] dark:bg-[#14221B] px-2.5 py-1.5 text-[11px] font-medium text-[#3F4540] dark:text-[#B9CCC0] truncate">
                      {item.configSummary}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <form
                    onSubmit={handleSaveConnection}
                    className="mt-4 pt-3.5 border-t border-[#E6E1D8] dark:border-[#243B2F] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5F665F] dark:text-[#A2B5A8]">
                        Bağlantı Yapılandırması
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Paneli kapat"
                        className="rounded-lg p-1 text-[#5F665F] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <SettingsField label="Hesap / Sunucu Bilgisi">
                      <input
                        type="text"
                        value={configInput}
                        onChange={(e) => setConfigInput(e.target.value)}
                        placeholder={
                          DEFAULT_CONFIG_PLACEHOLDER[item.id] ||
                          "Bağlantı bilgisini girin"
                        }
                        className={settingsInputClass}
                      />
                    </SettingsField>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {item.connected ? (
                        <button
                          type="button"
                          onClick={handleDisconnect}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#F0D3D1] dark:border-[#4B2523] px-3 py-1.5 text-xs font-medium text-[#B3261E] dark:text-[#F28B82] hover:bg-[#FDF2F2] dark:hover:bg-[#2F1B1A] transition-colors cursor-pointer"
                        >
                          <Unlink className="h-3.5 w-3.5" />
                          Bağlantıyı Kes
                        </button>
                      ) : (
                        <span />
                      )}

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#17261D] dark:hover:bg-[#357A48] transition-colors cursor-pointer"
                      >
                        {item.connected ? "Ayarları Kaydet" : "Kaydet ve Bağla"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
