"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Eye, EyeOff, LogOut, ShieldCheck } from "lucide-react";
import { SecuritySettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsToggleRow,
  SettingsField,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";

interface GuvenlikTabProps {
  value: SecuritySettings;
  onChange: (val: SecuritySettings) => void;
  onNotify?: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function GuvenlikTab({
  value,
  onChange,
  onNotify,
}: GuvenlikTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      const msg = "Lütfen tüm şifre alanlarını doldurun.";
      setPasswordError(msg);
      onNotify?.(msg, "error");
      return;
    }

    if (
      newPassword.length < 8 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      const msg = "Yeni şifre en az 8 karakter olmalı, harf ve rakam içermelidir.";
      setPasswordError(msg);
      onNotify?.(msg, "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Yeni şifreler birbiriyle eşleşmiyor.";
      setPasswordError(msg);
      onNotify?.(msg, "error");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onNotify?.("Şifreniz başarıyla güncellendi.", "success");
  };

  const handleTerminateSession = (sessionId: string) => {
    const target = value.sessions.find((s) => s.id === sessionId);
    onChange({
      ...value,
      sessions: value.sessions.filter((s) => s.id !== sessionId),
    });
    if (target) {
      onNotify?.(
        `${target.device} (${target.browser}) oturumu kapatıldı.`,
        "info"
      );
    }
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Giriş Güvenliği">
        <div className="mb-4">
          <SettingsToggleRow
            title="İki adımlı doğrulama"
            description="Hesaba giriş yaparken ek doğrulama kodu istenir."
            checked={value.twoFactorAuth}
            onChange={(checked) =>
              onChange({ ...value, twoFactorAuth: checked })
            }
          />
          <SettingsToggleRow
            title="Hasta verilerini maskele"
            description="Liste ve paylaşılan ekranlarda kimlik ve iletişim bilgilerini kısmen gizler."
            checked={value.maskPatientData}
            onChange={(checked) =>
              onChange({ ...value, maskPatientData: checked })
            }
            noBorder
          />
        </div>

        <div className="pt-3 border-t border-[#ECE8E1] dark:border-[#243B2F] max-w-xs">
          <SettingsField label="Oturum Zaman Aşımı">
            <select
              value={value.sessionTimeout}
              onChange={(e) =>
                onChange({ ...value, sessionTimeout: e.target.value })
              }
              className={settingsSelectClass}
            >
              <option value="15 dakika">15 dakika</option>
              <option value="30 dakika">30 dakika</option>
              <option value="1 saat">1 saat</option>
              <option value="4 saat">4 saat</option>
            </select>
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Şifre Değiştir"
        description="En az 8 karakter; harf ve rakam içermeli."
        action={
          <button
            type="button"
            onClick={() => setShowPasswords((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-1.5 text-xs font-medium text-[#3F4540] dark:text-[#C5D4CB] hover:bg-[#F3F0EA] dark:hover:bg-[#22382C] transition-colors cursor-pointer"
          >
            {showPasswords ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Gizle
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Göster
              </>
            )}
          </button>
        }
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SettingsField label="Mevcut Şifre">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={settingsInputClass}
              />
            </SettingsField>
            <SettingsField label="Yeni Şifre">
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 8 karakter"
                autoComplete="new-password"
                className={settingsInputClass}
              />
            </SettingsField>
            <SettingsField label="Yeni Şifre (Tekrar)">
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi doğrulayın"
                autoComplete="new-password"
                className={settingsInputClass}
              />
            </SettingsField>
          </div>

          {passwordError && (
            <p className="text-xs font-medium text-[#B3261E] dark:text-[#F28B82]">
              {passwordError}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] px-4 py-2 text-xs font-medium text-white hover:bg-[#17261D] dark:hover:bg-[#357A48] transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Şifreyi Güncelle
            </button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title="Aktif Oturumlar">
        <div className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
          {value.sessions.map((session) => {
            const isMobile =
              session.device.toLowerCase().includes("telefon") ||
              session.device.toLowerCase().includes("mobil");
            const DeviceIcon = isMobile ? Smartphone : Monitor;

            return (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1EEE7] dark:bg-[#1D3025] text-[#1F3327] dark:text-[#A2B5A8]">
                    <DeviceIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                      {session.device} · {session.browser}
                    </p>
                    <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                      Son etkinlik: {session.lastActive}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.isCurrent ? (
                    <span className="inline-flex items-center rounded-full bg-[#E6F4EA] dark:bg-[#1D3B28] px-2.5 py-1 text-[11px] font-medium text-[#1E6F3D] dark:text-[#7CD99A]">
                      Şu an aktif
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTerminateSession(session.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 py-1.5 text-xs font-medium text-[#B3261E] dark:text-[#F28B82] hover:bg-[#FDF2F2] dark:hover:bg-[#2F1B1A] transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Oturumu Kapat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
