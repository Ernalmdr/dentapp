"use client";

import React from "react";
import { Check } from "lucide-react";
import type { BillingSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  SettingsToggleRow,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface FaturaOdemeTabProps {
  value: BillingSettings;
  onChange: (val: BillingSettings) => void;
}

const INVOICE_TYPES = ["Eski Tip / Basılı", "e-Fatura", "e-Arşiv"];
const VAT_OPTIONS = ["%0", "%1", "%10", "%20"];
const WITHHOLDING_OPTIONS = ["%0", "%10", "%15", "%20"];
const CURRENCY_OPTIONS = [
  "Türk Lirası (TRY)",
  "Euro (EUR)",
  "ABD Doları (USD)",
];

const PAYMENT_METHOD_ITEMS: Array<{
  key: keyof BillingSettings["paymentMethods"];
  title: string;
}> = [
  { key: "cash", title: "Nakit" },
  { key: "card", title: "Kredi / Banka Kartı" },
  { key: "bankTransfer", title: "Havale / EFT" },
  { key: "installment", title: "Taksitli Ödeme" },
];

const CURRENCY_ITEMS: Array<{
  key: keyof BillingSettings["currencies"];
  label: string;
}> = [
  { key: "TRY", label: "Türk Lirası (TRY)" },
  { key: "EUR", label: "Euro (EUR)" },
  { key: "USD", label: "ABD Doları (USD)" },
  { key: "GBP", label: "İngiliz Sterlini (GBP)" },
];

export default function FaturaOdemeTab({ value, onChange }: FaturaOdemeTabProps) {
  const updateField = <K extends keyof BillingSettings>(
    key: K,
    fieldValue: BillingSettings[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const updatePaymentMethod = (
    key: keyof BillingSettings["paymentMethods"],
    checked: boolean
  ) => {
    onChange({
      ...value,
      paymentMethods: {
        ...value.paymentMethods,
        [key]: checked,
      },
    });
  };

  const toggleCurrency = (key: keyof BillingSettings["currencies"]) => {
    onChange({
      ...value,
      currencies: {
        ...value.currencies,
        [key]: !value.currencies[key],
      },
    });
  };

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Fatura Ayarları"
        description="Yeni faturalar için varsayılan değerler."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Fatura Türü">
            <select
              value={value.invoiceType}
              onChange={(e) => updateField("invoiceType", e.target.value)}
              className={settingsSelectClass}
            >
              {INVOICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </SettingsField>

          <SettingsField label="Varsayılan KDV">
            <select
              value={value.defaultVat}
              onChange={(e) => updateField("defaultVat", e.target.value)}
              className={settingsSelectClass}
            >
              {VAT_OPTIONS.map((vat) => (
                <option key={vat} value={vat}>
                  {vat}
                </option>
              ))}
            </select>
          </SettingsField>

          <SettingsField label="Fatura Serisi">
            <input
              type="text"
              value={value.invoiceSeries}
              onChange={(e) => updateField("invoiceSeries", e.target.value)}
              placeholder="Örn: DS"
              className={settingsInputClass}
            />
          </SettingsField>

          <SettingsField label="Stopaj">
            <select
              value={value.withholdingTax}
              onChange={(e) => updateField("withholdingTax", e.target.value)}
              className={settingsSelectClass}
            >
              {WITHHOLDING_OPTIONS.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </SettingsField>

          <SettingsField label="Sıradaki No">
            <input
              type="text"
              value={value.nextNumber}
              onChange={(e) => updateField("nextNumber", e.target.value)}
              placeholder="000001"
              className={settingsInputClass}
            />
          </SettingsField>

          <SettingsField label="Para Birimi">
            <select
              value={value.defaultCurrency}
              onChange={(e) => updateField("defaultCurrency", e.target.value)}
              className={settingsSelectClass}
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </SettingsField>
        </div>

        <div className="mt-5 pt-2 border-t border-[#ECE8E1] dark:border-[#243B2F]">
          <SettingsToggleRow
            title="e-Fatura / e-Arşiv kullan"
            description="Faturalar entegratör üzerinden elektronik olarak kesilir."
            checked={value.useEInvoice}
            onChange={(checked) => updateField("useEInvoice", checked)}
          />
          <SettingsToggleRow
            title="Fatura e-postayla gönderilsin"
            description="Fatura oluşturulunca hastanın e-posta adresine PDF olarak gider."
            checked={value.sendInvoiceByEmail}
            onChange={(checked) => updateField("sendInvoiceByEmail", checked)}
            noBorder
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Ödeme Yöntemleri"
        description="Alınan Paralar ekranında seçilebilecek ödeme tipleri."
      >
        <div>
          {PAYMENT_METHOD_ITEMS.map((item, idx) => (
            <SettingsToggleRow
              key={item.key}
              title={item.title}
              checked={value.paymentMethods[item.key]}
              onChange={(checked) => updatePaymentMethod(item.key, checked)}
              noBorder={idx === PAYMENT_METHOD_ITEMS.length - 1}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Para Birimleri"
        description="Hasta hesaplarında kullanılabilecek para birimleri."
      >
        <div className="flex flex-wrap gap-3">
          {CURRENCY_ITEMS.map((item) => {
            const checked = value.currencies[item.key];
            return (
              <label
                key={item.key}
                className={cn(
                  "inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium cursor-pointer select-none transition-colors",
                  checked
                    ? "border-[#1F3327] dark:border-[#3F8F55] bg-[#1F3327]/5 dark:bg-[#3F8F55]/15 text-[#1C211E] dark:text-[#ECF3EE]"
                    : "border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] text-[#5F665F] dark:text-[#A2B5A8] hover:border-[#C9C2B6] dark:hover:border-[#345443]"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCurrency(item.key)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    checked
                      ? "border-[#1F3327] dark:border-[#3F8F55] bg-[#1F3327] dark:bg-[#3F8F55] text-white"
                      : "border-[#C9C2B6] dark:border-[#3A5948] bg-white dark:bg-[#15221B]"
                  )}
                >
                  {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                </span>
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
