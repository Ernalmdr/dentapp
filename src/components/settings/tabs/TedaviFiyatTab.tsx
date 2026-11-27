"use client";

import React, { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Check, X } from "lucide-react";
import type {
  TariffItem,
  TreatmentPriceItem,
  TreatmentPricingSettings,
} from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface TedaviFiyatTabProps {
  value: TreatmentPricingSettings;
  onChange: (val: TreatmentPricingSettings) => void;
}

interface TreatmentFormState {
  name: string;
  category: string;
  price: string;
  currency: string;
  vat: string;
}

const CURRENCY_CODES = ["TRY", "EUR", "USD", "GBP"];
const VAT_RATES = [0, 1, 10, 20];

const emptyTreatmentForm: TreatmentFormState = {
  name: "",
  category: "",
  price: "",
  currency: "TRY",
  vat: "10",
};

function formatTurkishPrice(price: number): string {
  return price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getBadgeClass(badge: TariffItem["badge"]): string {
  switch (badge) {
    case "Varsayılan":
      return "bg-[#1F3327]/10 text-[#1F3327] dark:bg-[#3F8F55]/20 dark:text-[#7CD494]";
    case "Aktif":
      return "bg-[#3F8F55]/15 text-[#2B6B3D] dark:bg-[#3F8F55]/20 dark:text-[#7CD494]";
    case "Pasif":
      return "bg-[#E6E1D8]/70 text-[#5F665F] dark:bg-[#243B2F] dark:text-[#A2B5A8]";
  }
}

export default function TedaviFiyatTab({
  value,
  onChange,
}: TedaviFiyatTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Treatment add/edit state
  const [isTreatmentFormOpen, setIsTreatmentFormOpen] = useState(false);
  const [editingTreatmentId, setEditingTreatmentId] = useState<string | null>(
    null
  );
  const [treatmentForm, setTreatmentForm] =
    useState<TreatmentFormState>(emptyTreatmentForm);

  // Tariff add/edit state
  const [isAddingTariff, setIsAddingTariff] = useState(false);
  const [newTariffName, setNewTariffName] = useState("");
  const [newTariffBadge, setNewTariffBadge] =
    useState<TariffItem["badge"]>("Aktif");

  const [editingTariffId, setEditingTariffId] = useState<string | null>(null);
  const [editingTariffName, setEditingTariffName] = useState("");
  const [editingTariffBadge, setEditingTariffBadge] =
    useState<TariffItem["badge"]>("Aktif");

  const categories = useMemo(() => {
    const set = new Set<string>();
    value.treatments.forEach((item) => {
      if (item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [value.treatments]);

  const filteredTreatments = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr");
    return value.treatments.filter((item) => {
      if (item.tariffId !== value.activeTariffId) return false;
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      if (!query) return true;
      return (
        item.name.toLocaleLowerCase("tr").includes(query) ||
        item.category.toLocaleLowerCase("tr").includes(query)
      );
    });
  }, [value.treatments, value.activeTariffId, selectedCategory, searchQuery]);

  const openNewTreatmentForm = () => {
    setEditingTreatmentId(null);
    setTreatmentForm(emptyTreatmentForm);
    setIsTreatmentFormOpen(true);
  };

  const openEditTreatmentForm = (item: TreatmentPriceItem) => {
    setEditingTreatmentId(item.id);
    setTreatmentForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      currency: item.currency,
      vat: String(item.vat),
    });
    setIsTreatmentFormOpen(true);
  };

  const closeTreatmentForm = () => {
    setIsTreatmentFormOpen(false);
    setEditingTreatmentId(null);
    setTreatmentForm(emptyTreatmentForm);
  };

  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = treatmentForm.name.trim();
    const trimmedCategory = treatmentForm.category.trim() || "Genel";
    const parsedPrice = Number(treatmentForm.price.replace(",", "."));
    const parsedVat = Number(treatmentForm.vat);

    if (!trimmedName || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return;
    }

    if (editingTreatmentId) {
      const updated = value.treatments.map((item) =>
        item.id === editingTreatmentId
          ? {
              ...item,
              name: trimmedName,
              category: trimmedCategory,
              price: parsedPrice,
              currency: treatmentForm.currency,
              vat: Number.isNaN(parsedVat) ? 10 : parsedVat,
            }
          : item
      );
      onChange({ ...value, treatments: updated });
    } else {
      const newItem: TreatmentPriceItem = {
        id: `tr-${Date.now()}`,
        name: trimmedName,
        category: trimmedCategory,
        tariffId: value.activeTariffId,
        price: parsedPrice,
        currency: treatmentForm.currency,
        vat: Number.isNaN(parsedVat) ? 10 : parsedVat,
      };
      onChange({
        ...value,
        treatments: [newItem, ...value.treatments],
      });
    }

    closeTreatmentForm();
  };

  const handleDeleteTreatment = (id: string) => {
    onChange({
      ...value,
      treatments: value.treatments.filter((item) => item.id !== id),
    });
    if (editingTreatmentId === id) {
      closeTreatmentForm();
    }
  };

  const handleAddTariff = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTariffName.trim();
    if (!trimmed) return;

    const id = `tariff-${Date.now()}`;
    const nextTariffs: TariffItem[] = value.tariffs.map((t) =>
      newTariffBadge === "Varsayılan" && t.badge === "Varsayılan"
        ? { ...t, badge: "Aktif" }
        : t
    );

    nextTariffs.push({
      id,
      name: trimmed,
      badge: newTariffBadge,
    });

    onChange({
      ...value,
      tariffs: nextTariffs,
    });
    setNewTariffName("");
    setNewTariffBadge("Aktif");
    setIsAddingTariff(false);
  };

  const startEditTariff = (tariff: TariffItem) => {
    setEditingTariffId(tariff.id);
    setEditingTariffName(tariff.name);
    setEditingTariffBadge(tariff.badge);
  };

  const saveEditTariff = (id: string) => {
    const trimmed = editingTariffName.trim();
    if (!trimmed) return;

    const nextTariffs = value.tariffs.map((t) => {
      if (t.id === id) {
        return { ...t, name: trimmed, badge: editingTariffBadge };
      }
      if (editingTariffBadge === "Varsayılan" && t.badge === "Varsayılan") {
        return { ...t, badge: "Aktif" as const };
      }
      return t;
    });

    onChange({ ...value, tariffs: nextTariffs });
    setEditingTariffId(null);
  };

  const toggleTariffStatus = (tariff: TariffItem) => {
    if (tariff.badge === "Varsayılan") return;
    const nextBadge: TariffItem["badge"] =
      tariff.badge === "Aktif" ? "Pasif" : "Aktif";
    onChange({
      ...value,
      tariffs: value.tariffs.map((t) =>
        t.id === tariff.id ? { ...t, badge: nextBadge } : t
      ),
    });
  };

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Tedavi ve Fiyat Listesi"
        description="Oral ekranında seçilen tedavilerin fiyatları buradan gelir."
        action={
          <button
            type="button"
            onClick={openNewTreatmentForm}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#1F3327] hover:bg-[#294233] dark:bg-[#3F8F55] dark:hover:bg-[#357B48] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Yeni Tedavi</span>
          </button>
        }
      >
        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
          <div className="relative sm:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A8F89]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tedavi ara..."
              className={cn(settingsInputClass, "pl-9")}
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={value.activeTariffId}
              onChange={(e) =>
                onChange({ ...value, activeTariffId: e.target.value })
              }
              aria-label="Tarife seçimi"
              className={settingsSelectClass}
            >
              {value.tariffs.map((tariff) => (
                <option key={tariff.id} value={tariff.id}>
                  Tarife: {tariff.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Kategori filtresi"
              className={settingsSelectClass}
            >
              <option value="ALL">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inline Add / Edit Treatment Form */}
        {isTreatmentFormOpen && (
          <form
            onSubmit={handleSaveTreatment}
            className="mb-4 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
                {editingTreatmentId ? "Tedaviyi Düzenle" : "Yeni Tedavi Ekle"}
              </h3>
              <button
                type="button"
                onClick={closeTreatmentForm}
                aria-label="Formu kapat"
                className="text-[#5F665F] hover:text-[#1C211E] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <SettingsField label="Tedavi Adı" className="sm:col-span-4">
                <input
                  type="text"
                  required
                  value={treatmentForm.name}
                  onChange={(e) =>
                    setTreatmentForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Örn: Kompozit Dolgu"
                  className={settingsInputClass}
                />
              </SettingsField>

              <SettingsField label="Kategori" className="sm:col-span-3">
                <input
                  type="text"
                  value={treatmentForm.category}
                  onChange={(e) =>
                    setTreatmentForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Örn: Restoratif"
                  className={settingsInputClass}
                />
              </SettingsField>

              <SettingsField label="Fiyat" className="sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={treatmentForm.price}
                  onChange={(e) =>
                    setTreatmentForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className={settingsInputClass}
                />
              </SettingsField>

              <SettingsField label="P.Br." className="sm:col-span-1">
                <select
                  value={treatmentForm.currency}
                  onChange={(e) =>
                    setTreatmentForm((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  className={settingsSelectClass}
                >
                  {CURRENCY_CODES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </SettingsField>

              <SettingsField label="KDV" className="sm:col-span-2">
                <select
                  value={treatmentForm.vat}
                  onChange={(e) =>
                    setTreatmentForm((prev) => ({
                      ...prev,
                      vat: e.target.value,
                    }))
                  }
                  className={settingsSelectClass}
                >
                  {VAT_RATES.map((rate) => (
                    <option key={rate} value={String(rate)}>
                      %{rate}
                    </option>
                  ))}
                </select>
              </SettingsField>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeTreatmentForm}
                className="h-8 px-3 rounded-lg border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="h-8 px-3.5 rounded-lg bg-[#1F3327] hover:bg-[#294233] dark:bg-[#3F8F55] dark:hover:bg-[#357B48] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {editingTreatmentId ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        )}

        {/* Treatments Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E1D8] dark:border-[#243B2F] bg-[#F7F4EE] dark:bg-[#15221B] text-[11px] font-semibold uppercase tracking-wide text-[#5F665F] dark:text-[#A2B5A8]">
                <th className="py-2.5 px-3.5">Tedavi</th>
                <th className="py-2.5 px-3.5 text-right">Fiyat</th>
                <th className="py-2.5 px-3.5">P.Br.</th>
                <th className="py-2.5 px-3.5">KDV</th>
                <th className="py-2.5 px-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F] text-xs">
              {filteredTreatments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-xs text-[#5F665F] dark:text-[#A2B5A8]"
                  >
                    Seçili tarife ve filtrelere uygun tedavi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredTreatments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FBFAF7] dark:hover:bg-[#1E3328] transition-colors"
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#5F665F] dark:text-[#A2B5A8]">
                        {item.category}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-medium tabular-nums text-[#1C211E] dark:text-[#ECF3EE]">
                      {formatTurkishPrice(item.price)}
                    </td>
                    <td className="py-3 px-3.5 text-[#5F665F] dark:text-[#A2B5A8]">
                      {item.currency}
                    </td>
                    <td className="py-3 px-3.5 text-[#5F665F] dark:text-[#A2B5A8]">
                      %{item.vat}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditTreatmentForm(item)}
                          aria-label={`${item.name} düzenle`}
                          className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#1C211E] hover:bg-[#F3EFE8] dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTreatment(item.id)}
                          aria-label={`${item.name} sil`}
                          className="p-1.5 rounded-lg text-[#5F665F] hover:text-[#B3261E] hover:bg-[#B3261E]/10 dark:text-[#A2B5A8] dark:hover:text-[#F28B82] dark:hover:bg-[#B3261E]/20 transition-colors cursor-pointer"
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

      <SettingsCard
        title="Tarifeler"
        description="Kurum veya anlaşmalara göre farklı fiyat listeleri."
        action={
          <button
            type="button"
            onClick={() => setIsAddingTariff((prev) => !prev)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] text-xs font-medium text-[#1C211E] dark:text-[#ECF3EE] transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tarife Ekle</span>
          </button>
        }
      >
        {isAddingTariff && (
          <form
            onSubmit={handleAddTariff}
            className="mb-4 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] p-3.5 flex flex-col sm:flex-row sm:items-end gap-3"
          >
            <SettingsField label="Tarife Adı" className="flex-1">
              <input
                type="text"
                required
                value={newTariffName}
                onChange={(e) => setNewTariffName(e.target.value)}
                placeholder="Örn: TDB 2025 veya SGK Anlaşmalı"
                className={settingsInputClass}
              />
            </SettingsField>

            <SettingsField label="Durum" className="sm:w-36">
              <select
                value={newTariffBadge}
                onChange={(e) =>
                  setNewTariffBadge(e.target.value as TariffItem["badge"])
                }
                className={settingsSelectClass}
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
                <option value="Varsayılan">Varsayılan</option>
              </select>
            </SettingsField>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTariff(false);
                  setNewTariffName("");
                }}
                className="h-10 px-3 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-[#1F3327] hover:bg-[#294233] dark:bg-[#3F8F55] dark:hover:bg-[#357B48] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Ekle
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
          {value.tariffs.map((tariff) => {
            const isEditing = editingTariffId === tariff.id;

            return (
              <div
                key={tariff.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                {isEditing ? (
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={editingTariffName}
                      onChange={(e) => setEditingTariffName(e.target.value)}
                      className={cn(settingsInputClass, "sm:max-w-xs")}
                    />
                    <select
                      value={editingTariffBadge}
                      onChange={(e) =>
                        setEditingTariffBadge(
                          e.target.value as TariffItem["badge"]
                        )
                      }
                      className={cn(settingsSelectClass, "sm:w-36")}
                    >
                      <option value="Varsayılan">Varsayılan</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Pasif">Pasif</option>
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => saveEditTariff(tariff.id)}
                        aria-label="Tarifeyi kaydet"
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] text-white text-xs font-medium cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Kaydet</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTariffId(null)}
                        aria-label="Düzenlemeyi iptal et"
                        className="h-9 px-2.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] text-xs text-[#5F665F] dark:text-[#A2B5A8] cursor-pointer"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                        {tariff.name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                          getBadgeClass(tariff.badge)
                        )}
                      >
                        {tariff.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tariff.badge !== "Varsayılan" && (
                        <button
                          type="button"
                          onClick={() => toggleTariffStatus(tariff)}
                          className="h-8 px-3 rounded-lg border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
                        >
                          {tariff.badge === "Aktif" ? "Pasife Al" : "Aktif Et"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEditTariff(tariff)}
                        className="h-8 px-3 rounded-lg border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#1C211E] dark:text-[#ECF3EE] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
                      >
                        Düzenle
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
