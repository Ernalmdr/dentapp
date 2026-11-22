"use client";

import React, { useState, useEffect } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import {
  Settings,
  Building2,
  Clock,
  MessageSquare,
  Shield,
  Save,
  CheckCircle2,
  UserCheck,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useModal } from "@/components/modals/ModalContext";

interface DoctorStaff {
  id: string;
  name: string;
  specialty: string;
  diplomaNo: string;
  phone: string;
}

export default function AyarlarPage() {
  const { showToast } = useModal();

  const [clinicName, setClinicName] = useState("DentaSphere Ağız ve Diş Sağlığı Polikliniği");
  const [taxOffice, setTaxOffice] = useState("Kadıköy VD - 3491029412");
  const [iban, setIban] = useState("TR33 0006 1005 1928 3746 5000 01");
  const [phone, setPhone] = useState("+90 (216) 450 00 24");
  const [email, setEmail] = useState("info@dentasphere.com");
  const [address, setAddress] = useState("Bağdat Caddesi No: 244/4 Kadıköy, İstanbul");
  const [smsHeader, setSmsHeader] = useState("DENTASPHERE");
  const [autoSmsReminder, setAutoSmsReminder] = useState(true);
  const [autoSmsPayment, setAutoSmsPayment] = useState(true);

  // Doctors / Staff List
  const [doctors, setDoctors] = useState<DoctorStaff[]>([
    { id: "1", name: "Dr. Selin Yılmaz", specialty: "Protetik Diş Tedavisi (Mesul Müdür)", diplomaNo: "34-4821", phone: "+90 532 100 20 30" },
    { id: "2", name: "Dt. Mahir Açıkalın", specialty: "Ağız Diş ve Çene Cerrahisi", diplomaNo: "34-5192", phone: "+90 533 200 30 40" },
    { id: "3", name: "Dt. Kemal Aydın", specialty: "Endodonti & Restoratif", diplomaNo: "34-6014", phone: "+90 534 300 40 50" },
  ]);

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSpecialty, setNewDocSpecialty] = useState("Genel Diş Hekimi");
  const [newDocDiploma, setNewDocDiploma] = useState("34-");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dentapp_clinic_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.clinicName) setClinicName(parsed.clinicName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.taxOffice) setTaxOffice(parsed.taxOffice);
        if (parsed.iban) setIban(parsed.iban);
        if (parsed.smsHeader) setSmsHeader(parsed.smsHeader);
        if (parsed.doctors) setDoctors(parsed.doctors);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const settingsObj = {
      clinicName,
      taxOffice,
      iban,
      phone,
      email,
      address,
      smsHeader,
      autoSmsReminder,
      autoSmsPayment,
      doctors,
    };
    try {
      localStorage.setItem("dentapp_clinic_settings", JSON.stringify(settingsObj));
    } catch {
      // ignore
    }
    showToast("✓ Klinik profil ve personel ayarları başarıyla kaydedildi.", "success");
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc: DoctorStaff = {
      id: String(Date.now()),
      name: newDocName.trim(),
      specialty: newDocSpecialty,
      diplomaNo: newDocDiploma,
      phone: "+90 5xx xxx xx xx",
    };
    const updated = [...doctors, newDoc];
    setDoctors(updated);
    setIsDoctorModalOpen(false);
    setNewDocName("");
    showToast(`✓ Hekim listesine eklendi: ${newDoc.name}`, "success");
  };

  const handleRemoveDoctor = (id: string) => {
    if (doctors.length <= 1) {
      showToast("En az bir mesul müdür hekim bulunmalıdır.", "error");
      return;
    }
    const updated = doctors.filter((d) => d.id !== id);
    setDoctors(updated);
    showToast("✓ Hekim listeden çıkarıldı.", "info");
  };

  const handleResetDefaults = () => {
    setClinicName("DentaSphere Ağız ve Diş Sağlığı Polikliniği");
    setPhone("+90 (216) 450 00 24");
    setAddress("Bağdat Caddesi No: 244/4 Kadıköy, İstanbul");
    setTaxOffice("Kadıköy VD - 3491029412");
    setIban("TR33 0006 1005 1928 3746 5000 01");
    setSmsHeader("DENTASPHERE");
    localStorage.removeItem("dentapp_clinic_settings");
    showToast("✓ Klinik ayarları varsayılana sıfırlandı.", "info");
  };

  return (
    <div className="flex flex-col gap-6">
      <BannerHeader
        title="Klinik Ayarları & Personel Yönetimi"
        description="Klinik profili, resmi fatura/IBAN bilgileri, hekim kadrosu, çalışma saatleri ve SMS otomasyonu."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Ayarlar" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-[#233C30] text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Sıfırla
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Klinik Profili & Mali Bilgiler (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#122019] p-6 border border-stone-200/80 dark:border-[#1E332A] shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2]">Klinik Profil & Mali Parametreler</h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">Resmi Makbuz Başlığı</span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                Klinik Ticari Unvanı
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                  Klinik Santral Telefonu
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                  Vergi Dairesi & Vergi No
                </label>
                <input
                  type="text"
                  value={taxOffice}
                  onChange={(e) => setTaxOffice(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                  Tahsilat Banka IBAN
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                Klinik Açık Adresi
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] p-3 outline-none resize-none"
              />
            </div>
          </div>

          {/* Hekim Kadrosu Yönetimi */}
          <div className="rounded-2xl bg-white dark:bg-[#122019] p-6 border border-stone-200/80 dark:border-[#1E332A] shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2]">Aktif Hekim Kadrosu ({doctors.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1A2D23] text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> + Hekim Ekle
              </button>
            </div>

            <div className="space-y-2">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 dark:border-[#1A2D23] bg-stone-50/50 dark:bg-[#16261F]"
                >
                  <div>
                    <span className="block font-bold text-stone-900 dark:text-stone-100">{doc.name}</span>
                    <span className="text-[11px] text-stone-400">{doc.specialty} • Diploma: {doc.diplomaNo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoctor(doc.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2D4A3E] text-white text-xs font-bold hover:bg-[#3A5F50] transition-colors shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" /> Tüm Ayarları Kaydet
          </button>
        </div>

        {/* Mesai, SMS & Güvenlik (1 Col) */}
        <div className="space-y-6">
          {/* Çalışma Saatleri */}
          <div className="rounded-2xl bg-white dark:bg-[#122019] p-6 border border-stone-200/80 dark:border-[#1E332A] shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <Clock className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2]">Mesai & Randevu Saatleri</h3>
            </div>

            <div className="space-y-2 text-stone-600 dark:text-[#90A199]">
              <p className="flex justify-between py-1.5 border-b border-stone-100 dark:border-[#1A2D23]">
                <span>Pazartesi – Cuma:</span>
                <strong className="text-stone-900 dark:text-white font-mono">09:00 – 19:00</strong>
              </p>
              <p className="flex justify-between py-1.5 border-b border-stone-100 dark:border-[#1A2D23]">
                <span>Cumartesi:</span>
                <strong className="text-stone-900 dark:text-white font-mono">09:00 – 17:00</strong>
              </p>
              <p className="flex justify-between py-1.5">
                <span>Pazar:</span>
                <span className="text-red-500 font-bold">Kapalı</span>
              </p>
            </div>
          </div>

          {/* SMS & Bildirim Entegrasyonu */}
          <div className="rounded-2xl bg-white dark:bg-[#122019] p-6 border border-stone-200/80 dark:border-[#1E332A] shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-[#1E332A]">
              <MessageSquare className="h-4 w-4 text-[#2D4A3E] dark:text-[#7CC9A6]" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#F0F5F2]">SMS & Bildirim Başlığı</h3>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-[#D1DDD6]">
                BTK Onaylı Alfanumerik SMS Başlığı
              </label>
              <input
                type="text"
                value={smsHeader}
                onChange={(e) => setSmsHeader(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 dark:border-[#233C30] bg-stone-50 dark:bg-[#16261F] px-3 font-mono font-bold outline-none"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSmsReminder}
                  onChange={(e) => setAutoSmsReminder(e.target.checked)}
                  className="rounded accent-[#2D4A3E]"
                />
                <span className="font-semibold text-stone-700 dark:text-[#D1DDD6]">
                  Randevudan 24 saat önce otomatik SMS hatırlatıcı
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSmsPayment}
                  onChange={(e) => setAutoSmsPayment(e.target.checked)}
                  className="rounded accent-[#2D4A3E]"
                />
                <span className="font-semibold text-stone-700 dark:text-[#D1DDD6]">
                  Tahsilat sonrası hastaya dijital makbuz SMS linki
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Modal for adding doctor */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#122019] border border-stone-200 dark:border-[#1E332A] p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Yeni Diş Hekimi Kaydet
            </h3>
            <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hekim Adı Soyadı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Dt. Emre Koç..."
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Uzmanlık Alanı</label>
                <select
                  value={newDocSpecialty}
                  onChange={(e) => setNewDocSpecialty(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-2.5 outline-none"
                >
                  <option value="Genel Diş Hekimi">Genel Diş Hekimi</option>
                  <option value="Ağız Diş ve Çene Cerrahisi">Ağız Diş ve Çene Cerrahisi</option>
                  <option value="Ortodonti Uzmanı">Ortodonti Uzmanı</option>
                  <option value="Endodonti Uzmanı">Endodonti Uzmanı</option>
                  <option value="Periodontoloji Uzmanı">Periodontoloji Uzmanı</option>
                  <option value="Pedodonti (Çocuk Diş) Uzmanı">Pedodonti (Çocuk Diş) Uzmanı</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Diploma / Tescil No</label>
                <input
                  type="text"
                  placeholder="34-7120"
                  value={newDocDiploma}
                  onChange={(e) => setNewDocDiploma(e.target.value)}
                  className="w-full h-9 rounded-xl border border-stone-200 dark:border-[#1E332A] bg-stone-50 dark:bg-[#16261F] px-3 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-[#1E332A]">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-white font-bold hover:bg-[#3A5F50]"
                >
                  Hekimi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
