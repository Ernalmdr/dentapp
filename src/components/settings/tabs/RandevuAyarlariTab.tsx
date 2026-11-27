"use client";

import React, { useState } from "react";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import type {
  AppointmentSettings,
  AppointmentTypeItem,
} from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  SettingsToggleRow,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface RandevuAyarlariTabProps {
  value: AppointmentSettings;
  onChange: (val: AppointmentSettings) => void;
}

const TEMPLATE_VARIABLES = [
  "{hasta_adi}",
  "{tarih}",
  "{saat}",
  "{hekim}",
] as const;

const PRESET_COLORS = [
  "#3F8F55",
  "#4A78B5",
  "#8B5CF6",
  "#D97706",
  "#B3261E",
  "#0D9488",
  "#EC4899",
  "#64748B",
];

export default function RandevuAyarlariTab({
  value,
  onChange,
}: RandevuAyarlariTabProps) {
  const [formMode, setFormMode] = useState<"closed" | "add" | "edit">("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftDuration, setDraftDuration] = useState("30");
  const [draftColor, setDraftColor] = useState("#3F8F55");

  const openAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setDraftName("");
    setDraftDuration("30");
    setDraftColor("#3F8F55");
  };

  const openEditForm = (item: AppointmentTypeItem) => {
    setFormMode("edit");
    setEditingId(item.id);
    setDraftName(item.name);
    setDraftDuration(String(item.duration));
    setDraftColor(item.color);
  };

  const closeForm = () => {
    setFormMode("closed");
    setEditingId(null);
  };

  const handleSaveType = () => {
    const trimmedName = draftName.trim();
    const parsedDuration = Math.max(5, parseInt(draftDuration, 10) || 30);
    if (!trimmedName) return;

    if (formMode === "add") {
      const newItem: AppointmentTypeItem = {
        id: `at-${Date.now()}`,
        name: trimmedName,
        duration: parsedDuration,
        color: draftColor,
      };
      onChange({
        ...value,
        appointmentTypes: [...value.appointmentTypes, newItem],
      });
    } else if (formMode === "edit" && editingId) {
      onChange({
        ...value,
        appointmentTypes: value.appointmentTypes.map((t) =>
          t.id === editingId
            ? {
                ...t,
                name: trimmedName,
                duration: parsedDuration,
                color: draftColor,
              }
            : t
        ),
      });
    }
    closeForm();
  };

  const handleDeleteType = (id: string) => {
    onChange({
      ...value,
      appointmentTypes: value.appointmentTypes.filter((t) => t.id !== id),
    });
    if (editingId === id) {
      closeForm();
    }
  };

  const appendTemplateVariable = (variable: string) => {
    const current = value.reminderTemplate;
    const needsSpace =
      current.length > 0 && !current.endsWith(" ") && !current.endsWith("\n");
    onChange({
      ...value,
      reminderTemplate: `${current}${needsSpace ? " " : ""}${variable}`,
    });
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Genel Ayarlar"
        description="Randevu süresi ve takvim görünümü."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Varsayılan Süre">
            <select
              value={value.defaultDuration}
              onChange={(e) =>
                onChange({ ...value, defaultDuration: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="15 dakika">15 dakika</option>
              <option value="30 dakika">30 dakika</option>
              <option value="45 dakika">45 dakika</option>
              <option value="60 dakika">60 dakika</option>
            </select>
          </SettingsField>

          <SettingsField label="Günün Başlangıcı">
            <input
              type="time"
              value={value.dayStart}
              onChange={(e) =>
                onChange({ ...value, dayStart: e.target.value })
              }
              className={settingsInputClass}
            />
          </SettingsField>

          <SettingsField label="Takvim Aralığı">
            <select
              value={value.calendarInterval}
              onChange={(e) =>
                onChange({ ...value, calendarInterval: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="10 dakika">10 dakika</option>
              <option value="15 dakika">15 dakika</option>
              <option value="30 dakika">30 dakika</option>
            </select>
          </SettingsField>

          <SettingsField label="Günün Bitişi">
            <input
              type="time"
              value={value.dayEnd}
              onChange={(e) => onChange({ ...value, dayEnd: e.target.value })}
              className={settingsInputClass}
            />
          </SettingsField>

          <SettingsField label="Takvim Görünümü">
            <select
              value={value.calendarView}
              onChange={(e) =>
                onChange({ ...value, calendarView: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="Gün">Gün</option>
              <option value="Hafta">Hafta</option>
              <option value="Ay">Ay</option>
            </select>
          </SettingsField>

          <SettingsField label="Varsayılan Ünit">
            <select
              value={value.defaultUnit}
              onChange={(e) =>
                onChange({ ...value, defaultUnit: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="Ünit 1">Ünit 1</option>
              <option value="Ünit 2">Ünit 2</option>
              <option value="Ünit 3">Ünit 3</option>
            </select>
          </SettingsField>
        </div>

        <div className="mt-5 pt-2 border-t border-[#ECE8E1] dark:border-[#243B2F]">
          <SettingsToggleRow
            title="Çakışan randevulara izin verme"
            description="Aynı hekim ve ünit için aynı saate ikinci randevu eklenemez."
            checked={value.preventOverlapping}
            onChange={(checked) =>
              onChange({ ...value, preventOverlapping: checked })
            }
          />
          <SettingsToggleRow
            title="Online randevu talebi"
            description="Hastalar web sitesinden randevu talebi oluşturabilir."
            checked={value.onlineBooking}
            onChange={(checked) =>
              onChange({ ...value, onlineBooking: checked })
            }
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Hatırlatmalar"
        description="Randevudan önce hastaya otomatik mesaj gönderin."
      >
        <SettingsToggleRow
          title="SMS ile randevu hatırlatma"
          checked={value.smsReminderEnabled}
          onChange={(checked) =>
            onChange({ ...value, smsReminderEnabled: checked })
          }
        />

        <div
          className={cn(
            "space-y-4 pt-4 transition-opacity",
            !value.smsReminderEnabled && "opacity-55"
          )}
        >
          <SettingsField label="Gönderim Zamanı">
            <select
              value={value.reminderTiming}
              onChange={(e) =>
                onChange({ ...value, reminderTiming: e.target.value })
              }
              className={cn(settingsSelectClass, "sm:max-w-xs")}
            >
              <option value="1 saat önce">1 saat önce</option>
              <option value="3 saat önce">3 saat önce</option>
              <option value="12 saat önce">12 saat önce</option>
              <option value="24 saat önce">24 saat önce</option>
              <option value="48 saat önce">48 saat önce</option>
            </select>
          </SettingsField>

          <SettingsField label="Mesaj Şablonu">
            <textarea
              rows={3}
              value={value.reminderTemplate}
              onChange={(e) =>
                onChange({ ...value, reminderTemplate: e.target.value })
              }
              placeholder="Hatırlatma mesajınızı yazın..."
              className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-3 text-xs text-[#1C211E] dark:text-[#ECF3EE] placeholder:text-[#8A8F89] outline-none focus:border-[#1F3327] dark:focus:border-[#3F8F55] focus:ring-1 focus:ring-[#1F3327]/20 transition-colors resize-y"
            />
          </SettingsField>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-[#5F665F] dark:text-[#A2B5A8]">
              Değişken ekle:
            </span>
            {TEMPLATE_VARIABLES.map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => appendTemplateVariable(variable)}
                className="rounded-lg border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-2.5 py-1 text-[11px] font-mono text-[#1F3327] dark:text-[#A8D5B5] hover:bg-[#F3EFE7] dark:hover:bg-[#22382C] transition-colors cursor-pointer"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Randevu Türleri"
        description="Takvimde görünen renkler ve varsayılan süreler."
        action={
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] px-3.5 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Yeni Tür
          </button>
        }
      >
        {formMode !== "closed" && (
          <div className="mb-5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                {formMode === "add"
                  ? "Yeni Randevu Türü Ekle"
                  : "Randevu Türünü Düzenle"}
              </p>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Formu kapat"
                className="text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SettingsField label="Tür Adı" className="sm:col-span-2">
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Örn: Ortodonti Kontrolü"
                  className={settingsInputClass}
                />
              </SettingsField>

              <SettingsField label="Süre (dk)">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={draftDuration}
                  onChange={(e) => setDraftDuration(e.target.value)}
                  className={settingsInputClass}
                />
              </SettingsField>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[#3F4540] dark:text-[#C5D4CB] mr-1">
                  Renk:
                </span>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDraftColor(color)}
                    aria-label={`Renk seç: ${color}`}
                    className={cn(
                      "h-6 w-6 rounded-full transition-transform cursor-pointer flex items-center justify-center",
                      draftColor === color
                        ? "ring-2 ring-offset-2 ring-[#1F3327] dark:ring-[#ECF3EE] dark:ring-offset-[#1A2C23] scale-110"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {draftColor === color && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                ))}
                <input
                  type="color"
                  aria-label="Özel renk seç"
                  value={draftColor}
                  onChange={(e) => setDraftColor(e.target.value)}
                  className="h-6 w-8 rounded border border-[#E6E1D8] dark:border-[#243B2F] bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] px-3 py-1.5 text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F5F2EC] dark:hover:bg-[#22382C] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleSaveType}
                  disabled={!draftName.trim()}
                  className="rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] px-3.5 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {formMode === "add" ? "Ekle" : "Güncelle"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E1D8] dark:border-[#243B2F] text-[11px] font-semibold uppercase tracking-wider text-[#5F665F] dark:text-[#A2B5A8]">
                <th className="py-2.5 pr-4">Tür</th>
                <th className="py-2.5 px-4 w-28">Süre</th>
                <th className="py-2.5 pl-4 text-right w-24">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
              {value.appointmentTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-xs text-[#5F665F] dark:text-[#A2B5A8]"
                  >
                    Henüz randevu türü eklenmemiş.
                  </td>
                </tr>
              ) : (
                value.appointmentTypes.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F5F2EC]/60 dark:hover:bg-[#1A2C23]/60 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                      {item.duration} dk
                    </td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          aria-label={`${item.name} düzenle`}
                          className="rounded-lg p-1.5 text-[#5F665F] hover:text-[#1C211E] hover:bg-[#ECE8E1] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteType(item.id)}
                          aria-label={`${item.name} sil`}
                          className="rounded-lg p-1.5 text-[#5F665F] hover:text-[#B3261E] hover:bg-[#FCE8E6] dark:text-[#A2B5A8] dark:hover:text-[#F2B8B5] dark:hover:bg-[#3B1E1E] transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}
