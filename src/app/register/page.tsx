"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useModal } from "@/components/modals/ModalContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useModal();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("Diş Hekimi");
  const [specialty, setSpecialty] = useState("Genel Diş Hekimliği");
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+90 (5");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Lütfen ad ve soyadınızı girin.", "info");
      return;
    }
    if (!clinicName.trim()) {
      showToast("Lütfen klinik adını girin.", "info");
      return;
    }
    if (!terms) {
      showToast("Lütfen KVKK ve kullanıcı sözleşmesini onaylayın.", "info");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      register({
        name: name.trim(),
        title: title.trim(),
        specialty: specialty.trim(),
        clinicName: clinicName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "Klinik Sahibi & Hekim",
      });

      showToast(`✓ Hoş geldiniz ${name.trim()}! Hesabınız ve kliniğiniz başarıyla oluşturuldu.`, "success");
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column: Clinic Presentation & Trust */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-gradient-to-br from-[#1B3329] via-[#152820] to-[#0D1A14] p-12 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#4A7C68]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#7CC9A6]/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7CC9A6] to-[#4A7C68] text-white shadow-lg">
            <span className="font-serif text-2xl font-bold">D</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-serif text-[#F0F5F2]">
              DentaSphere
            </h1>
            <p className="text-[11px] text-[#8EA89C] tracking-wide uppercase font-medium">
              Klinik Yönetim Sistemi
            </p>
          </div>
        </div>

        {/* Center: What you get */}
        <div className="relative z-10 my-auto max-w-sm space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>14 Gün Ücretsiz Deneme</span>
          </div>

          <h2 className="text-3xl font-serif font-medium leading-tight text-white">
            Kliniğinizi dakikalar içinde kurun, hemen hasta kabul edin.
          </h2>

          <div className="space-y-3.5 text-xs text-[#A3B8AF]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#7CC9A6] shrink-0" />
              <span>Sınırsız hasta kartı, anamnez formu ve randevu takibi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#7CC9A6] shrink-0" />
              <span>Panoramik röntgen ve AI patoloji lezyon taraması</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#7CC9A6] shrink-0" />
              <span>E-Fatura, kasa tahsilatı ve hekim prim hesaplama</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#7CC9A6] shrink-0" />
              <span>SMS randevu hatırlatma ve hasta onam belgeleri</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs text-[#8EA89C] border-t border-white/10 pt-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#7CC9A6]" />
          <span>Kredi kartı gerekmez • İstediğiniz zaman iptal edebilirsiniz</span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-7/12 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#F5F0EB] dark:bg-[#0B130F] overflow-y-auto">
        {/* Top Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D4A3E] text-white">
              <span className="font-serif text-lg font-bold">D</span>
            </div>
            <span className="font-serif font-bold text-stone-900 dark:text-white">DentaSphere</span>
          </div>

          <Link
            href="/login"
            className="text-xs font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline ml-auto flex items-center gap-1"
          >
            Zaten hesabınız var mı? Giriş Yapın →
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto max-w-lg w-full mx-auto space-y-6 py-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-[#F0F5F2] font-serif">
              Kliniğiniz İçin Hesap Oluşturun
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-[#90A199] mt-1">
              Hekim ve klinik bilgilerinizi girerek yönetim panelinizi anında başlatın.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Doctor Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Ad Soyad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Dr. Selin Yılmaz"
                    className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Unvan
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                  >
                    <option value="Diş Hekimi">Diş Hekimi</option>
                    <option value="Uzm. Dt.">Uzm. Dt. (Uzman Diş Hekimi)</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Doç. Dr.">Doç. Dr.</option>
                    <option value="Klinik Yöneticisi">Klinik Yöneticisi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clinic Name & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Klinik / Poliklinik Adı <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Örn: DentArt Ağız & Diş Polikliniği"
                    className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Ana Uzmanlık Alanı
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                >
                  <option value="Genel Diş Hekimliği">Genel Diş Hekimliği</option>
                  <option value="Ortodonti">Ortodonti</option>
                  <option value="Ağız ve Çene Cerrahisi">Ağız ve Çene Cerrahisi</option>
                  <option value="Estetik Diş Hekimliği & İmplantoloji">Estetik & İmplantoloji</option>
                  <option value="Pedodonti (Çocuk Diş)">Pedodonti (Çocuk Diş)</option>
                  <option value="Endodonti (Kanal Tedavisi)">Endodonti</option>
                </select>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  E-posta <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doktor@kliniginiz.com"
                    className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  İletişim Telefonu
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 (5xx) xxx xx xx"
                    className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Şifre Oluşturun <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:border-[#2D4A3E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-[#2D4A3E] focus:ring-[#2D4A3E] mt-0.5"
              />
              <label htmlFor="terms" className="text-[11px] leading-tight text-stone-600 dark:text-[#90A199] cursor-pointer">
                DentaSphere Kullanım Koşulları ve Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni&apos;ni okudum, kabul ediyorum.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2D4A3E] py-3 text-sm font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-md disabled:opacity-60 cursor-pointer pt-2.5"
            >
              {loading ? (
                <span>Kliniğiniz oluşturuluyor...</span>
              ) : (
                <>
                  <span>Hesap Oluştur ve Kliniği Başlat</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="text-center pt-3 border-t border-stone-200/70 dark:border-[#1E332A]">
            <p className="text-xs text-stone-500 dark:text-[#90A199]">
              Zaten bir hesabınız var mı?{" "}
              <Link
                href="/login"
                className="font-bold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline"
              >
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-center text-stone-400 dark:text-stone-600">
          © 2026 DentaSphere Sistemleri. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
