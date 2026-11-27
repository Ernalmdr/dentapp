"use client";

import React from "react";
import type { NotificationSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsToggleRow,
  settingsInputClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface BildirimlerTabProps {
  value: NotificationSettings;
  onChange: (val: NotificationSettings) => void;
}

export default function BildirimlerTab({
  value,
  onChange,
}: BildirimlerTabProps) {
  const updateChannel = (
    key: keyof NotificationSettings["channels"],
    checked: boolean
  ) => {
    onChange({
      ...value,
      channels: {
        ...value.channels,
        [key]: checked,
      },
    });
  };

  const updatePreference = (
    id: string,
    channel: "inApp" | "email" | "sms",
    checked: boolean
  ) => {
    onChange({
      ...value,
      preferences: value.preferences.map((row) =>
        row.id === id ? { ...row, [channel]: checked } : row
      ),
    });
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Bildirim Kanalları"
        description="Bildirimleri hangi yollarla almak istediğinizi seçin."
      >
        <div className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
          <SettingsToggleRow
            title="Uygulama içi bildirimler"
            description="Sağ üstteki zil simgesinde görünür."
            checked={value.channels.inApp}
            onChange={(checked) => updateChannel("inApp", checked)}
            noBorder
          />
          <SettingsToggleRow
            title="E-posta bildirimleri"
            description="Hesabınıza kayıtlı e-posta adresine gönderilir."
            checked={value.channels.email}
            onChange={(checked) => updateChannel("email", checked)}
            noBorder
          />
          <SettingsToggleRow
            title="SMS bildirimleri"
            description="Kayıtlı cep telefonunuza gönderilir."
            checked={value.channels.sms}
            onChange={(checked) => updateChannel("sms", checked)}
            noBorder
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Bildirim Tercihleri"
        description="Hangi olayda hangi kanaldan bildirim alacağınızı seçin."
      >
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E1D8] dark:border-[#243B2F] text-[11px] font-semibold uppercase tracking-wider text-[#5F665F] dark:text-[#A2B5A8]">
                <th className="py-2.5 pr-4">Olay</th>
                <th className="py-2.5 px-3 text-center w-24">Uygulama</th>
                <th className="py-2.5 px-3 text-center w-24">E-posta</th>
                <th className="py-2.5 pl-3 text-center w-20">SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
              {value.preferences.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F5F2EC]/60 dark:hover:bg-[#1A2C23]/60 transition-colors"
                >
                  <td className="py-3 pr-4 text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                    {row.event}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.inApp}
                      onChange={(e) =>
                        updatePreference(row.id, "inApp", e.target.checked)
                      }
                      aria-label={`${row.event} - Uygulama`}
                      className="h-4 w-4 rounded border-[#D5D0C5] dark:border-[#2A3F33] text-[#1F3327] accent-[#1F3327] dark:accent-[#3F8F55] cursor-pointer focus:ring-2 focus:ring-[#1F3327]/30"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.email}
                      onChange={(e) =>
                        updatePreference(row.id, "email", e.target.checked)
                      }
                      aria-label={`${row.event} - E-posta`}
                      className="h-4 w-4 rounded border-[#D5D0C5] dark:border-[#2A3F33] text-[#1F3327] accent-[#1F3327] dark:accent-[#3F8F55] cursor-pointer focus:ring-2 focus:ring-[#1F3327]/30"
                    />
                  </td>
                  <td className="py-3 pl-3 text-center">
                    <input
                      type="checkbox"
                      checked={row.sms}
                      onChange={(e) =>
                        updatePreference(row.id, "sms", e.target.checked)
                      }
                      aria-label={`${row.event} - SMS`}
                      className="h-4 w-4 rounded border-[#D5D0C5] dark:border-[#2A3F33] text-[#1F3327] accent-[#1F3327] dark:accent-[#3F8F55] cursor-pointer focus:ring-2 focus:ring-[#1F3327]/30"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Sessiz Saatler"
        description="Bu saatler arasında SMS ve e-posta bildirimi gönderilmez."
      >
        <SettingsToggleRow
          title="Sessiz saatleri kullan"
          checked={value.quietHoursEnabled}
          onChange={(checked) =>
            onChange({ ...value, quietHoursEnabled: checked })
          }
        />

        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 transition-opacity",
            !value.quietHoursEnabled && "opacity-50 pointer-events-none"
          )}
        >
          <span className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
            Saat aralığı
          </span>
          <div className="flex items-center gap-2.5">
            <input
              type="time"
              aria-label="Sessiz saat başlangıcı"
              value={value.quietStart}
              disabled={!value.quietHoursEnabled}
              onChange={(e) =>
                onChange({ ...value, quietStart: e.target.value })
              }
              className={cn(settingsInputClass, "w-32")}
            />
            <span className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">-</span>
            <input
              type="time"
              aria-label="Sessiz saat bitişi"
              value={value.quietEnd}
              disabled={!value.quietHoursEnabled}
              onChange={(e) => onChange({ ...value, quietEnd: e.target.value })}
              className={cn(settingsInputClass, "w-32")}
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
