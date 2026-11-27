"use client";

import React, { useRef, useState } from "react";
import {
  Check,
  DatabaseBackup,
  Download,
  UploadCloud,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { BackupSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsToggleRow,
  SettingsField,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface YedeklemeVeriTabProps {
  value: BackupSettings;
  onChange: (val: BackupSettings) => void;
  onNotify?: (msg: string, type?: "success" | "info" | "error") => void;
}

const EXPORT_MODULES: {
  key: keyof BackupSettings["exportModules"];
  label: string;
}[] = [
  { key: "patients", label: "Hastalar" },
  { key: "appointments", label: "Randevular" },
  { key: "treatments", label: "Tedaviler ve fiyatlar" },
  { key: "billing", label: "Fatura ve ödemeler" },
  { key: "stock", label: "Stok" },
  { key: "documents", label: "Belgeler" },
];

export default function YedeklemeVeriTab({
  value,
  onChange,
  onNotify,
}: YedeklemeVeriTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBackupNow = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    onChange({
      ...value,
      lastBackupAt: `Bugün, ${hh}:${mm}`,
    });
    onNotify?.("Manuel yedekleme başarıyla tamamlandı.", "success");
  };

  const toggleExportModule = (key: keyof BackupSettings["exportModules"]) => {
    onChange({
      ...value,
      exportModules: {
        ...value.exportModules,
        [key]: !value.exportModules[key],
      },
    });
  };

  const handleExport = () => {
    const selectedCount = Object.values(value.exportModules).filter(Boolean).length;
    if (selectedCount === 0) {
      onNotify?.("Dışa aktarmak için en az bir veri modülü seçin.", "error");
      return;
    }
    onNotify?.(
      `${selectedCount} modül ${value.exportFormat} formatında dışa aktarılıyor.`,
      "success"
    );
  };

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    setSelectedFileName(file.name);
    onNotify?.(`"${file.name}" içe aktarma için seçildi.`, "info");
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Otomatik Yedekleme">
        <div className="mb-4">
          <SettingsToggleRow
            title="Otomatik yedekleme"
            description="Klinik verileri belirlenen aralıklarla şifreli olarak yedeklenir."
            checked={value.autoBackupEnabled}
            onChange={(checked) =>
              onChange({ ...value, autoBackupEnabled: checked })
            }
            noBorder
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#ECE8E1] dark:border-[#243B2F]">
          <SettingsField label="Sıklık">
            <select
              value={value.frequency}
              onChange={(e) =>
                onChange({ ...value, frequency: e.target.value })
              }
              disabled={!value.autoBackupEnabled}
              className={settingsSelectClass}
            >
              <option value="Her gün">Her gün</option>
              <option value="Haftalık">Haftalık</option>
              <option value="Aylık">Aylık</option>
            </select>
          </SettingsField>

          <SettingsField label="Saat">
            <input
              type="time"
              value={value.time}
              onChange={(e) => onChange({ ...value, time: e.target.value })}
              disabled={!value.autoBackupEnabled}
              className={settingsInputClass}
            />
          </SettingsField>

          <SettingsField label="Saklama Süresi">
            <select
              value={value.retention}
              onChange={(e) =>
                onChange({ ...value, retention: e.target.value })
              }
              disabled={!value.autoBackupEnabled}
              className={settingsSelectClass}
            >
              <option value="7 gün">7 gün</option>
              <option value="30 gün">30 gün</option>
              <option value="90 gün">90 gün</option>
              <option value="1 yıl">1 yıl</option>
            </select>
          </SettingsField>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#ECE8E1] dark:border-[#243B2F]">
          <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
            Son yedek:{" "}
            <span className="font-medium text-[#1C211E] dark:text-[#ECF3EE]">
              {value.lastBackupAt}
            </span>
          </p>
          <button
            type="button"
            onClick={handleBackupNow}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] px-4 py-2 text-xs font-medium text-white hover:bg-[#17261D] dark:hover:bg-[#357A48] transition-colors cursor-pointer"
          >
            <DatabaseBackup className="h-3.5 w-3.5" />
            Şimdi Yedekle
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Verileri Dışa Aktar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {EXPORT_MODULES.map((mod) => {
            const checked = value.exportModules[mod.key];
            return (
              <label
                key={mod.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-colors",
                  checked
                    ? "border-[#1F3327]/40 dark:border-[#3F8F55]/50 bg-[#F3F1EC] dark:bg-[#1A2C23]"
                    : "border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#17261E] hover:border-[#C9C2B5] dark:hover:border-[#355444]"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleExportModule(mod.key)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    checked
                      ? "border-[#1F3327] bg-[#1F3327] text-white dark:border-[#3F8F55] dark:bg-[#3F8F55]"
                      : "border-[#C7C1B5] dark:border-[#385245] bg-white dark:bg-[#15221B]"
                  )}
                >
                  {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                </span>
                <span className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                  {mod.label}
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 border-t border-[#ECE8E1] dark:border-[#243B2F]">
          <SettingsField label="Dosya Biçimi" className="w-full sm:w-64">
            <select
              value={value.exportFormat}
              onChange={(e) =>
                onChange({ ...value, exportFormat: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="Excel (.xlsx)">Excel (.xlsx)</option>
              <option value="CSV (.csv)">CSV (.csv)</option>
              <option value="JSON (.json)">JSON (.json)</option>
            </select>
          </SettingsField>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F3327] dark:border-[#3F8F55] bg-white dark:bg-[#1A2C23] px-4 py-2.5 text-xs font-medium text-[#1F3327] dark:text-[#7CD99A] hover:bg-[#F3F1EC] dark:hover:bg-[#21382C] transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Dışa Aktar
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Verileri İçe Aktar">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelected(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            isDragging
              ? "border-[#1F3327] dark:border-[#3F8F55] bg-[#F1F5F2] dark:bg-[#192B21]"
              : "border-[#D7D1C5] dark:border-[#2D4739] bg-white/60 dark:bg-[#132019]"
          )}
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1EEE7] dark:bg-[#1D3025] text-[#1F3327] dark:text-[#7CD99A]">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
            Dosyayı buraya sürükleyin veya seçin
          </p>
          <p className="mt-1 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
            Excel (.xlsx) veya CSV
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-4 py-2 text-xs font-medium text-[#1C211E] dark:text-[#ECF3EE] hover:bg-[#F3F0EA] dark:hover:bg-[#22382C] transition-colors cursor-pointer"
          >
            Dosya Seç
          </button>

          {selectedFileName && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#DCE5DE] dark:border-[#294435] bg-[#F1F5F2] dark:bg-[#182920] px-3 py-1.5 text-xs text-[#1F3327] dark:text-[#BCE3C8]">
              <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium">{selectedFileName}</span>
              <button
                type="button"
                aria-label="Seçili dosyayı temizle"
                onClick={() => {
                  setSelectedFileName(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="ml-1 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  );
}
