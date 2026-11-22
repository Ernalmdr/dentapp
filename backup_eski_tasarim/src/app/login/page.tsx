"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Building2,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useModal } from "@/components/modals/ModalContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser, registeredUsers } = useAuth();
  const { showToast } = useModal();

  const [email, setEmail] = useState("selin.yilmaz@dentasphere.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email);
      showToast("✓ Giriş başarılı. DentaSphere Paneline hoş geldiniz!", "success");
      router.push("/");
    }, 450);
  };

  const handleQuickDoctorLogin = (doc: (typeof registeredUsers)[0]) => {
    switchUser(doc);
    showToast(`✓ ${doc.name} olarak hızlı giriş yapıldı.`, "success");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column: Clinic Brand & Feature Hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[#1B3329] via-[#152820] to-[#0D1A14] p-12 text-white relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#4A7C68]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#7CC9A6]/10 blur-3xl pointer-events-none" />

        {/* Brand Logo & Name */}
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

        {/* Center: Hero Graphic & Value Proposition */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-md border border-white/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Yeni Nesil Akıllı Diş Hekimliği Platformu</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-serif font-medium leading-tight text-white">
            Kliniğinizi modern, hızlı ve kesintisiz dijitalleştirin.
          </h2>

          <p className="text-sm leading-relaxed text-[#A3B8AF]">
            Randevu planlama, hasta anamnez kartları, yapay zeka destekli panoramik röntgen analizi, 
            e-reçete ve kasa finans yönetimini tek bir çatı altında yönetin.
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-white font-mono">1.250+</p>
              <p className="text-xs text-[#8EA89C] mt-0.5">Aktif Hasta Takibi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#7CC9A6] font-mono">%99.4</p>
              <p className="text-xs text-[#8EA89C] mt-0.5">Hasta Memnuniyeti</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">0 sn</p>
              <p className="text-xs text-[#8EA89C] mt-0.5">Bulut Senkronizasyonu</p>
            </div>
          </div>
        </div>

        {/* Bottom Security / Compliance Badge */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-[#8EA89C] border-t border-white/10 pt-4">
          <ShieldCheck className="h-4 w-4 text-[#7CC9A6]" />
          <span>256-Bit SSL Şifreleme • KVKK & Sağlık Bakanlığı Standartlarına Uygun</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#F5F0EB] dark:bg-[#0B130F] overflow-y-auto">
        {/* Top Header bar with quick link to home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D4A3E] text-white">
              <span className="font-serif text-lg font-bold">D</span>
            </div>
            <span className="font-serif font-bold text-stone-900 dark:text-white">DentaSphere</span>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline ml-auto flex items-center gap-1"
          >
            Giriş yapmadan panele dön →
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto space-y-6 py-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-[#F0F5F2] font-serif">
              Kliniğinize Giriş Yapın
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-[#90A199] mt-1.5">
              Hekim veya yönetici hesabınızla panelinize erişin.
            </p>
          </div>

          {/* Quick Doctor Profiles (1-Click Login for Demo) */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-[#1E332A] bg-white dark:bg-[#122019] p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#7A8E83] flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#2D4A3E] dark:text-[#7CC9A6]" />
                Hızlı Hekim Girişi (Demo):
              </span>
              <span className="text-[10px] text-stone-400">Tek tıkla giriş</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {registeredUsers.slice(0, 4).map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleQuickDoctorLogin(doc)}
                  className="flex items-center gap-2 p-2 rounded-xl border border-stone-100 dark:border-[#1E332A] bg-stone-50/70 dark:bg-[#16261F] hover:border-[#2D4A3E] dark:hover:border-[#7CC9A6] hover:bg-stone-100 dark:hover:bg-[#1B2F26] text-left transition-all group cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D4A3E] text-white text-[10px] font-bold shrink-0">
                    {doc.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate group-hover:text-[#2D4A3E] dark:group-hover:text-[#7CC9A6]">
                      {doc.name}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">{doc.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Traditional Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                E-posta veya Kullanıcı Adı
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hekim@dentasphere.com"
                  className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-3.5 py-2.5 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:border-[#2D4A3E] focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Şifre
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Şifre sıfırlama bağlantısı e-postanıza iletildi.", "info");
                  }}
                  className="text-xs font-semibold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline"
                >
                  Şifremi unuttum?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-white dark:bg-[#16261F] pl-10 pr-10 py-2.5 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:border-[#2D4A3E] focus:outline-hidden focus:ring-1 focus:ring-[#2D4A3E] shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#2D4A3E] focus:ring-[#2D4A3E]"
                />
                <span className="text-xs text-stone-600 dark:text-[#90A199] font-medium">
                  30 gün boyunca beni hatırla
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2D4A3E] py-3 text-sm font-semibold text-white hover:bg-[#3A5F50] transition-colors shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Giriş yapılıyor...</span>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to register */}
          <div className="text-center pt-4 border-t border-stone-200/70 dark:border-[#1E332A]">
            <p className="text-xs text-stone-500 dark:text-[#90A199]">
              Kliniğiniz henüz kayıtlı değil mi?{" "}
              <Link
                href="/register"
                className="font-bold text-[#2D4A3E] dark:text-[#7CC9A6] hover:underline"
              >
                Yeni Hesap Oluşturun
              </Link>
            </p>
          </div>
        </div>

        {/* Legal Footer */}
        <p className="text-[11px] text-center text-stone-400 dark:text-stone-600">
          © 2026 DentaSphere Sistemleri. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
