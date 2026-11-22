"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useModal } from "./ModalContext";

export function SmsModal() {
  const { smsData, closeSmsModal, showToast } = useModal();
  const [template, setTemplate] = useState("appointment");
  const [messageText, setMessageText] = useState("");
  const [phone, setPhone] = useState("");

  const templates: Record<string, string> = {
    appointment: `Sayın ${smsData.patientName}, 22 Kasım saat 10:30'da DentaSphere kliniğimizde randevunuz bulunmaktadır. Değişiklik için lütfen bize ulaşın. Sağlıklı günler dileriz.`,
    reminder: `Sayın ${smsData.patientName}, 6 aylık periyodik diş hekimi kontrol zamanınız gelmiştir. Randevu oluşturmak için bizi arayabilirsiniz.`,
    pastCare: `Sayın ${smsData.patientName}, bugün yapılan tedaviniz sonrası ilk 2 saat sıcak gıda tüketmeyiniz. Ağrı veya kanama durumunda lütfen kliniğimize ulaşın. Geçmiş olsun.`,
    balance: `Sayın ${smsData.patientName}, kliniğimizdeki tamamlanan tedavilerinize ait bakiye özetiniz hazırlanmıştır. Detaylı bilgi için kliniğimiz ile iletişime geçebilirsiniz.`,
    custom: "",
  };

  useEffect(() => {
    if (smsData.isOpen) {
      setPhone(smsData.phone || "+90 505 321 45 67");
      setMessageText(templates.appointment);
      setTemplate("appointment");
    }
  }, [smsData.isOpen, smsData.patientName, smsData.phone]);

  if (!smsData.isOpen) return null;

  const handleTemplateChange = (key: string) => {
    setTemplate(key);
    setMessageText(templates[key] || "");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    showToast(`✓ SMS başarıyla iletildi (${phone}): "${messageText.slice(0, 40)}..."`, "success");
    closeSmsModal();
  };

  const charCount = messageText.length;
  const smsUnits = Math.ceil(charCount / 160) || 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={closeSmsModal}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#15221B] p-6 shadow-2xl border border-stone-200 dark:border-[#243B2F] text-stone-900 dark:text-[#ECF3EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#243B2F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-[#7CC9A6]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Hastaya SMS Gönder</h2>
              <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">{smsData.patientName}</p>
            </div>
          </div>
          <button
            onClick={closeSmsModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-[#ECF3EE]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="mt-4 space-y-4 text-xs">
          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-[#C5D4CB]">Alıcı Telefon Numarası</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] px-3 font-mono font-bold outline-none"
              required
            />
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block font-semibold mb-1.5 text-stone-700 dark:text-[#C5D4CB]">Hazır SMS Şablonları</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { key: "appointment", label: "Randevu Onayı" },
                { key: "reminder", label: "Periyodik Kontrol" },
                { key: "pastCare", label: "Tedavi Sonrası" },
                { key: "balance", label: "Bakiye Bilgisi" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => handleTemplateChange(t.key)}
                  className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                    template === t.key
                      ? "bg-[#2D4A3E] text-white border-[#2D4A3E]"
                      : "border-stone-200 dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] text-stone-700 dark:text-[#C5D4CB] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-stone-700 dark:text-[#C5D4CB]">SMS Metni</label>
              <span className="text-[11px] font-mono text-stone-400 dark:text-[#A2B5A8]">
                {charCount} karakter ({smsUnits} SMS)
              </span>
            </div>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50 dark:bg-[#1A2C23] text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] p-3 outline-none resize-none leading-relaxed"
              required
            />
          </div>

          {/* SMS Header notice */}
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-[#1A2C23] flex items-center justify-between text-[11px] text-stone-500 dark:text-[#A2B5A8]">
            <span>Gönderen Başlığı: <strong className="text-stone-800 dark:text-[#ECF3EE]">DENTASPHERE</strong></span>
            <span>NetGSM API Entegre</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-[#243B2F]">
            <button
              type="button"
              onClick={closeSmsModal}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-[#243B2F] text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2D4A3E] hover:bg-[#3A5F50] text-white font-bold transition-colors shadow-sm"
            >
              <Send className="h-4 w-4" />
              SMS'i Şimdi Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
