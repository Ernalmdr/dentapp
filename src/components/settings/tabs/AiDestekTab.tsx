"use client";

import React from "react";
import { Info, Check } from "lucide-react";
import { AiSupportSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsToggleRow,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface AiDestekTabProps {
  value: AiSupportSettings;
  onChange: (val: AiSupportSettings) => void;
}

const IMAGE_TYPE_OPTIONS: {
  key: keyof AiSupportSettings["imageTypes"];
  label: string;
}[] = [
  { key: "panoramic", label: "Panoramik" },
  { key: "bitewing", label: "Bitewing" },
  { key: "periapical", label: "Periapikal" },
  { key: "cephalometric", label: "Sefalometrik" },
  { key: "cbct", label: "CBCT" },
  { key: "intraoral", label: "Ağız içi fotoğraf" },
];

export default function AiDestekTab({ value, onChange }: AiDestekTabProps) {
  const toggleImageType = (key: keyof AiSupportSettings["imageTypes"]) => {
    onChange({
      ...value,
      imageTypes: {
        ...value.imageTypes,
        [key]: !value.imageTypes[key],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SettingsCard
        title="AI Destek"
        description="Yapay zeka özelliklerini kliniğinize göre açıp kapatın."
      >
        <div>
          <SettingsToggleRow
            title="Röntgen ve film analizi"
            description="Panoramik ve periapikal görüntülerde çürük, lezyon ve kök ucu ön değerlendirmesi yapar."
            checked={value.xrayAnalysis}
            onChange={(checked) => onChange({ ...value, xrayAnalysis: checked })}
          />
          <SettingsToggleRow
            title="Not özetleme"
            description="Muayene ve tedavi notlarını yapılandırılmış klinik özetlere dönüştürür."
            checked={value.noteSummarization}
            onChange={(checked) =>
              onChange({ ...value, noteSummarization: checked })
            }
          />
          <SettingsToggleRow
            title="Randevu önerileri"
            description="Tedavi planına göre ideal kontrol ve işlem randevu aralıkları önerir."
            checked={value.appointmentSuggestions}
            onChange={(checked) =>
              onChange({ ...value, appointmentSuggestions: checked })
            }
          />
          <SettingsToggleRow
            title="Hasta bilgilendirme metni"
            description="Tedavi sonrası bakım ve bilgilendirme metinlerini otomatik hazırlar."
            checked={value.patientInfoText}
            onChange={(checked) =>
              onChange({ ...value, patientInfoText: checked })
            }
            noBorder
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Analiz Edilecek Görüntüler"
        description="Yapay zeka analizine açık görüntü türleri."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMAGE_TYPE_OPTIONS.map((item) => {
            const checked = value.imageTypes[item.key];
            return (
              <label
                key={item.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-colors",
                  checked
                    ? "border-[#1F3327]/40 dark:border-[#3F8F55]/50 bg-[#F3F1EC] dark:bg-[#1A2C23]"
                    : "border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#17261E] hover:border-[#C9C2B5] dark:hover:border-[#355444]"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleImageType(item.key)}
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
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Veri ve Gizlilik"
        description="Analiz için gönderilen verilerin işlenme şekli."
      >
        <div>
          <SettingsToggleRow
            title="Hasta kimlik bilgilerini gizle"
            description="Görüntü ve klinik metinler analiz öncesinde otomatik olarak anonimleştirilir."
            checked={value.anonymizePatientData}
            onChange={(checked) =>
              onChange({ ...value, anonymizePatientData: checked })
            }
          />
          <SettingsToggleRow
            title="Sonuçları hekim onayından sonra kaydet"
            description="Yapay zeka çıktıları hekim tarafından onaylanmadan hasta kartına işlenmez."
            checked={value.requireDoctorApproval}
            onChange={(checked) =>
              onChange({ ...value, requireDoctorApproval: checked })
            }
            noBorder
          />
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#DCE5DE] dark:border-[#294435] bg-[#F1F5F2] dark:bg-[#182920] px-3.5 py-3">
          <Info className="h-4 w-4 shrink-0 text-[#1F3327] dark:text-[#78C28E] mt-0.5" />
          <p className="text-xs leading-relaxed text-[#3F4A42] dark:text-[#B9CCC0]">
            AI sonuçları yardımcı bilgidir; teşhis ve tedavi kararı her zaman hekime aittir.
          </p>
        </div>
      </SettingsCard>
    </div>
  );
}
