"use client";

import React, { useState, useEffect } from "react";
import { X, User, Check, Building2, Stethoscope, Mail, Phone, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useModal } from "@/components/modals/ModalContext";

export function DoctorProfileModal() {
  const { user, registeredUsers, isProfileModalOpen, closeProfileModal, updateDoctorProfile, switchUser } = useAuth();
  const { showToast } = useModal();

  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [role, setRole] = useState(user.role);
  const [specialty, setSpecialty] = useState(user.specialty || "");
  const [clinicName, setClinicName] = useState(user.clinicName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");

  // Active tab: 'edit' or 'switch'
  const [activeTab, setActiveTab] = useState<"edit" | "switch">("edit");

  useEffect(() => {
    if (isProfileModalOpen) {
      setName(user.name);
      setTitle(user.title);
      setRole(user.role);
      setSpecialty(user.specialty || "");
      setClinicName(user.clinicName);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [isProfileModalOpen, user]);

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Lütfen geçerli bir hekim adı girin.", "info");
      return;
    }

    updateDoctorProfile({
      name: name.trim(),
      title: title.trim(),
      role: role.trim(),
      specialty: specialty.trim(),
      clinicName: clinicName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    showToast(`✓ Hekim profili güncellendi: ${name.trim()}`, "success");
    closeProfileModal();
  };

  const handleSelectDoctor = (doc: typeof user) => {
    switchUser(doc);
    showToast(`✓ Aktif hekim değiştirildi: ${doc.name}`, "success");
    closeProfileModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeProfileModal}
    >
      <div
        className="w-[94%] max-h-[90vh] overflow-y-auto sm:max-w-lg md:max-w-xl mx-auto rounded-2xl bg-white dark:bg-[#15221B] border border-stone-200 dark:border-[#243B2F] p-4 sm:p-6 shadow-2xl space-y-5 text-stone-900 dark:text-[#ECF3EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#243B2F] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2D4A3E] to-[#1B3329] text-white shadow-xs">
              <span className="text-base font-bold">{user.avatarInitials}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-[#ECF3EE]">
                Hekim & Profil Yönetimi
              </h3>
              <p className="text-xs text-stone-400 dark:text-[#A2B5A8]">
                Sol menü ve anasayfada görünen doktor ismini güncelleyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeProfileModal}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1D3328] dark:hover:text-[#ECF3EE] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-[#1A2C23] p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === "edit"
                ? "bg-white dark:bg-[#243B2F] text-stone-900 dark:text-[#ECF3EE] shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            }`}
          >
            İsim & Bilgileri Düzenle
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("switch")}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === "switch"
                ? "bg-white dark:bg-[#243B2F] text-stone-900 dark:text-[#ECF3EE] shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]"
            }`}
          >
            Kayıtlı Hekimler ({registeredUsers.length})
          </button>
        </div>

        {activeTab === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Name Field (CRITICAL) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-[#C5D4CB] mb-1">
                Doktor / Hekim Adı Soyadı <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 dark:text-[#6C8578]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Dr. Selin Yılmaz"
                  className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] pl-9 pr-3.5 py-2 text-sm font-semibold text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E]"
                />
              </div>
              <p className="text-[11px] text-stone-400 dark:text-[#A2B5A8] mt-1">
                Bu isim sol alt köşede ve anasayfa karşılama ekranında görünecektir.
              </p>
            </div>

            {/* Title & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                  Unvan
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 dark:text-[#6C8578]" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Diş Hekimi / Uzm. Dt."
                    className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                  Klinik Rolü
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Örn: Başhekim / Kurucu Hekim"
                  className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] px-3 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                Uzmanlık Alanı
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Örn: Estetik Diş Hekimliği & İmplantoloji"
                className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] px-3.5 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
              />
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                Klinik Adı
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 dark:text-[#6C8578]" />
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Örn: DentaSphere Ağız ve Diş Sağlığı"
                  className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] pl-9 pr-3.5 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 dark:text-[#6C8578]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-[#C5D4CB] mb-1">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 dark:text-[#6C8578]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 dark:border-[#243B2F] bg-stone-50/50 dark:bg-[#1A2C23] pl-9 pr-3 py-2 text-xs text-stone-900 dark:text-[#ECF3EE] dark:placeholder-[#5E7569] focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-[#243B2F]">
              <button
                type="button"
                onClick={closeProfileModal}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#243B2F] text-xs font-semibold text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-50 dark:hover:bg-[#1D3328] transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2D4A3E] text-xs font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-xs"
              >
                <Check className="h-4 w-4" />
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        ) : (
          /* Switch doctor tab */
          <div className="space-y-3">
            <p className="text-xs text-stone-500 dark:text-[#A2B5A8]">
              Kliniğinizde kayıtlı hekimlerden birine 1 tıkla geçiş yapabilirsiniz:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {registeredUsers.map((doc) => {
                const isCurrent = doc.id === user.id || doc.name === user.name;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoctor(doc)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? "bg-[#2D4A3E]/10 dark:bg-[#1D3328] border-[#2D4A3E] dark:border-[#325040] shadow-xs"
                        : "bg-stone-50 dark:bg-[#1A2C23] border-stone-100 dark:border-[#243B2F] hover:bg-stone-100 dark:hover:bg-[#1D3328]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                          isCurrent
                            ? "bg-[#2D4A3E] text-white"
                            : "bg-stone-200 dark:bg-[#243B2F] text-stone-700 dark:text-[#ECF3EE]"
                        }`}
                      >
                        {doc.avatarInitials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 dark:text-[#ECF3EE]">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-stone-400 dark:text-[#A2B5A8]">
                          {doc.title} • {doc.role}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Check className="h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:text-[#A2B5A8] dark:hover:text-[#ECF3EE]">
                        Geçiş Yap →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-[#243B2F] flex justify-between items-center">
              <span className="text-[11px] text-stone-400 dark:text-[#A2B5A8]">Yeni hekim eklemek için Kayıt Ol sayfasını da kullanabilirsiniz.</span>
              <button
                type="button"
                onClick={closeProfileModal}
                className="px-4 py-1.5 rounded-lg border border-stone-200 dark:border-[#243B2F] text-xs font-semibold text-stone-600 dark:text-[#A2B5A8] hover:bg-stone-50 dark:hover:bg-[#1D3328]"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
