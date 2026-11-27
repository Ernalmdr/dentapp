"use client";

import React, { useState } from "react";
import { Check, Plus, Trash2, UserPlus } from "lucide-react";
import type { UserMember, UsersAndRolesSettings } from "@/lib/settings-types";
import {
  SettingsCard,
  SettingsField,
  settingsInputClass,
  settingsSelectClass,
} from "@/components/settings/SettingsUI";
import { cn } from "@/lib/utils";

interface KullanicilarTabProps {
  value: UsersAndRolesSettings;
  onChange: (val: UsersAndRolesSettings) => void;
}

function getInitials(input: string): string {
  const cleaned = input.trim();
  if (!cleaned) return "??";
  if (cleaned.includes("@")) {
    const localPart = cleaned.split("@")[0].replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "");
    return (localPart.slice(0, 2) || "KL").toUpperCase();
  }
  const parts = cleaned
    .split(/\s+/)
    .filter((p) => p.length > 0 && !p.endsWith("."));
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

const STATUS_BADGE_MAP: Record<UserMember["status"], string> = {
  Aktif:
    "bg-[#E7F4EC] text-[#1F5E34] dark:bg-[#1E3A2A] dark:text-[#7CD99A]",
  Bekliyor:
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[#3B2E14] dark:text-[#FCD34D]",
  Pasif:
    "bg-[#ECE8E1] text-[#5F665F] dark:bg-[#243B2F] dark:text-[#A2B5A8]",
};

export default function KullanicilarTab({
  value,
  onChange,
}: KullanicilarTabProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteIdentity, setInviteIdentity] = useState("");
  const [inviteRole, setInviteRole] = useState(value.roles[0] ?? "Hekim");

  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteIdentity.trim();
    if (!trimmed) return;

    const isEmail = trimmed.includes("@");
    const newUser: UserMember = {
      id: `u-${Date.now()}`,
      initials: getInitials(trimmed),
      name: trimmed,
      title: "Davet gönderildi",
      email: isEmail ? trimmed : undefined,
      role: inviteRole || value.roles[0] || "Hekim",
      status: "Bekliyor",
      lastLogin: "-",
    };

    onChange({
      ...value,
      users: [...value.users, newUser],
    });
    setInviteIdentity("");
    setInviteRole(value.roles[0] ?? "Hekim");
    setInviteOpen(false);
  };

  const handleUserRoleChange = (userId: string, role: string) => {
    onChange({
      ...value,
      users: value.users.map((u) => (u.id === userId ? { ...u, role } : u)),
    });
  };

  const handleDeleteUser = (userId: string) => {
    onChange({
      ...value,
      users: value.users.filter((u) => u.id !== userId),
    });
  };

  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    if (
      value.roles.some(
        (r) => r.toLocaleLowerCase("tr-TR") === trimmed.toLocaleLowerCase("tr-TR")
      )
    ) {
      return;
    }

    onChange({
      ...value,
      roles: [...value.roles, trimmed],
      matrix: value.matrix.map((row) => ({
        ...row,
        permissions: {
          ...row.permissions,
          [trimmed]: false,
        },
      })),
    });
    setNewRoleName("");
    setAddRoleOpen(false);
  };

  const handleTogglePermission = (rowId: string, role: string) => {
    onChange({
      ...value,
      matrix: value.matrix.map((row) =>
        row.id === rowId
          ? {
              ...row,
              permissions: {
                ...row.permissions,
                [role]: !row.permissions[role],
              },
            }
          : row
      ),
    });
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Kullanıcılar"
        description="Klinik ekibini yönetin ve yeni kullanıcı davet edin."
        action={
          <button
            type="button"
            onClick={() => setInviteOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            + Kullanıcı Davet Et
          </button>
        }
      >
        {inviteOpen && (
          <form
            onSubmit={handleInviteSubmit}
            className="mb-5 p-4 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SettingsField label="Ad veya E-posta">
                <input
                  type="text"
                  value={inviteIdentity}
                  onChange={(e) => setInviteIdentity(e.target.value)}
                  placeholder="ornek@klinik.com"
                  className={settingsInputClass}
                  autoFocus
                />
              </SettingsField>

              <SettingsField label="Rol">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className={settingsSelectClass}
                >
                  {value.roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </SettingsField>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false);
                  setInviteIdentity("");
                }}
                className="h-9 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={!inviteIdentity.trim()}
                className="h-9 px-4 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] text-white text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-opacity cursor-pointer"
              >
                Davet Gönder
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E6E1D8] dark:border-[#243B2F] text-[11px] font-semibold uppercase tracking-wider text-[#5F665F] dark:text-[#A2B5A8]">
                <th className="py-2.5 pr-4">Kullanıcı</th>
                <th className="py-2.5 px-3">Rol</th>
                <th className="py-2.5 px-3">Durum</th>
                <th className="py-2.5 px-3">Son Giriş</th>
                <th className="py-2.5 pl-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
              {value.users.map((user) => (
                <tr key={user.id} className="group">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#ECE8E1] dark:bg-[#243B2F] text-[#1F3327] dark:text-[#ECF3EE] text-xs font-semibold flex items-center justify-center shrink-0">
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE] truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8] truncate">
                          {user.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleUserRoleChange(user.id, e.target.value)
                      }
                      aria-label={`${user.name} rolü`}
                      className="h-8 rounded-lg border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-2.5 text-xs text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] dark:focus:border-[#3F8F55] cursor-pointer"
                    >
                      {value.roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        STATUS_BADGE_MAP[user.status]
                      )}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-xs text-[#5F665F] dark:text-[#A2B5A8]">
                    {user.lastLogin}
                  </td>

                  <td className="py-3 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      aria-label={`${user.name} kullanıcısını sil`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-[#5F665F] dark:text-[#A2B5A8] hover:text-[#B3261E] dark:hover:text-[#F28B82] hover:bg-[#B3261E]/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {value.users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-xs text-[#5F665F] dark:text-[#A2B5A8]"
                  >
                    Henüz kayıtlı kullanıcı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Roller ve Yetkiler"
        description="Her rolün hangi bölümlere erişebileceğini belirleyin."
        action={
          <button
            type="button"
            onClick={() => setAddRoleOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] text-xs font-medium text-[#1C211E] dark:text-[#ECF3EE] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            + Yeni Rol
          </button>
        }
      >
        {addRoleOpen && (
          <form
            onSubmit={handleAddRoleSubmit}
            className="mb-5 p-4 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] flex flex-col sm:flex-row sm:items-end gap-3"
          >
            <SettingsField label="Yeni Rol Adı" className="flex-1">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Örn. Hijyenist"
                className={settingsInputClass}
                autoFocus
              />
            </SettingsField>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddRoleOpen(false);
                  setNewRoleName("");
                }}
                className="h-10 px-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] text-xs font-medium text-[#5F665F] dark:text-[#A2B5A8] hover:bg-[#F3EFE8] dark:hover:bg-[#243B2F] transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={!newRoleName.trim()}
                className="h-10 px-4 rounded-xl bg-[#1F3327] dark:bg-[#3F8F55] text-white text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-opacity cursor-pointer"
              >
                Ekle
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b border-[#E6E1D8] dark:border-[#243B2F] text-[11px] font-semibold uppercase tracking-wider text-[#5F665F] dark:text-[#A2B5A8]">
                <th className="py-2.5 pr-4">Yetki</th>
                {value.roles.map((role) => (
                  <th key={role} className="py-2.5 px-3 text-center">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1] dark:divide-[#243B2F]">
              {value.matrix.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 pr-4 text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
                    {row.label}
                  </td>
                  {value.roles.map((role) => {
                    const checked = Boolean(row.permissions[role]);
                    return (
                      <td key={role} className="py-3 px-3 text-center">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          aria-label={`${row.label} - ${role}`}
                          onClick={() => handleTogglePermission(row.id, role)}
                          className={cn(
                            "inline-flex items-center justify-center h-5 w-5 rounded-md border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F3327]/30",
                            checked
                              ? "bg-[#1F3327] dark:bg-[#3F8F55] border-[#1F3327] dark:border-[#3F8F55] text-white"
                              : "bg-white dark:bg-[#1A2C23] border-[#D5D0C5] dark:border-[#2A3F33] hover:border-[#1F3327] dark:hover:border-[#3F8F55]"
                          )}
                        >
                          {checked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}
