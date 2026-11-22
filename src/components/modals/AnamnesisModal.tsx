"use client";

import React, { useState } from "react";
import { FileText, X, AlertTriangle, ShieldCheck, CheckCircle2, HeartPulse } from "lucide-react";
import { useModal } from "./ModalContext";

export function AnamnesisModal() {
  const { anamnesisData, closeAnamnesisModal, showToast } = useModal();

  // Anamnesis Checkbox States
  const [diseases, setDiseases] = useState({
    diabetes: false,
    hypertension: true, // example hypertension for Tuğçe
    heartDisease: false,
    asthma: false,
    hepatitis: false,
    epilepsy: false,
  });

  const [allergies, setAllergies] = useState({
    penicillin: true, // penicillin allergy example
    localAnesthesia: false,
    aspirin: false,
    latex: false,
  });

  const [bloodThinner, setBloodThinner] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [currentMedications, setCurrentMedications] = useState("Coraspin 100mg (düzensiz)");
  const [doctorNotes, setDoctorNotes] = useState("Penisilin alerjisi mevcut; antibiyotik olarak Klindamisin veya Makrolid grubu tercih edilmelidir.");

  if (!anamnesisData.isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✓ ${anamnesisData.patientName} Anamnez & Tıbbi Geçmiş kaydı güncellendi.`, "success");
    closeAnamnesisModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={closeAnamnesisModal}
    >
      <div
        className="w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-2xl mx-auto rounded-2xl bg-white dark:bg-[#15221B] p-4 sm:p-6 shadow-2xl border border-stone-200 dark:border-[#243B2F] text-stone-900 dark:text-[#ECF3EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#243B2F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Tıbbi Anamnez & Sağlık Geçmişi</h2>
              <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">{anamnesisData.patientName} (HS-10248)</p>
            </div>
          </div>
          <button
            onClick={closeAnamnesisModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-[#ECF3EE]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
          {/* Critical Alerts Banner */}
          {(allergies.penicillin || allergies.localAnesthesia || bloodThinner) && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Kritik Tıbbi Uyarı:</strong>
                <span className="text-[11px] leading-tight opacity-90">
                  Hastada penisilin/anestezi hassasiyeti veya kanama riski işaretlenmiştir. Cerrahi ve enjeksiyon öncesi protokolleri kontrol ediniz.
                </span>
              </div>
            </div>
          )}

          {/* 1. Sistemik Hastalıklar */}
          <div>
            <h4 className="font-bold text-stone-800 dark:text-[#ECF3EE] uppercase tracking-wider text-[11px] mb-2.5">
              1. Sistemik Rahatsızlıklar
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: "diabetes", label: "Diyabet (Şeker)" },
                { key: "hypertension", label: "Hipertansiyon (Tansiyon)" },
                { key: "heartDisease", label: "Kalp / Damar Hastalığı" },
                { key: "asthma", label: "Astım / Solunum" },
                { key: "hepatitis", label: "Hepatit / Karaciğer" },
                { key: "epilepsy", label: "Epilepsi / Nörolojik" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                    diseases[item.key as keyof typeof diseases]
                      ? "bg-emerald-50 dark:bg-[#1D3328] border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold"
                      : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={diseases[item.key as keyof typeof diseases]}
                    onChange={(e) =>
                      setDiseases({ ...diseases, [item.key]: e.target.checked })
                    }
                    className="rounded accent-[#2D4A3E]"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. İlaç ve Madde Alerjileri */}
          <div>
            <h4 className="font-bold text-stone-800 dark:text-[#ECF3EE] uppercase tracking-wider text-[11px] mb-2.5">
              2. İlaç & Madde Alerjileri
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: "penicillin", label: "Penisilin Alerjisi" },
                { key: "localAnesthesia", label: "Lokal Anestezi" },
                { key: "aspirin", label: "Aspirin / NSAİİ" },
                { key: "latex", label: "Lateks Eldiven" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                    allergies[item.key as keyof typeof allergies]
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold"
                      : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={allergies[item.key as keyof typeof allergies]}
                    onChange={(e) =>
                      setAllergies({ ...allergies, [item.key]: e.target.checked })
                    }
                    className="rounded accent-rose-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Özel Durumlar (Kan sulandırıcı & Hamilelik) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none ${
              bloodThinner
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 font-semibold"
                : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23]"
            }`}>
              <input
                type="checkbox"
                checked={bloodThinner}
                onChange={(e) => setBloodThinner(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span>Kan Sulandırıcı Kullanıyor (Kanama Riski)</span>
            </label>

            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none ${
              isPregnant
                ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 font-semibold"
                : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23]"
            }`}>
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={(e) => setIsPregnant(e.target.checked)}
                className="rounded accent-purple-600"
              />
              <span>Hamilelik / Emzirme Döneminde</span>
            </label>
          </div>

          {/* 4. Düzenli Kullanılan İlaçlar */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-[#C5D4CB]">
              Düzenli Kullanılan İlaçlar
            </label>
            <input
              type="text"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Örn: Tansiyon ilacı, insülin, vitamin..."
              className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50 dark:bg-[#1A2C23] dark:text-[#ECF3EE] dark:placeholder-[#5E7569] px-3 outline-none"
            />
          </div>

          {/* 5. Hekim Tıbbi Notu */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-[#C5D4CB]">
              Hekim Klinik Uyarı Notu
            </label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50 dark:bg-[#1A2C23] dark:text-[#ECF3EE] dark:placeholder-[#5E7569] p-2.5 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-[#243B2F]">
            <button
              type="button"
              onClick={closeAnamnesisModal}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-[#243B2F] text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2D4A3E] hover:bg-[#3A5F50] text-white font-bold transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              Anamnez Formunu Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
