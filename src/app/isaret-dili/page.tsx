"use client";

import React, { useState, useMemo } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import {
  Hand,
  Search,
  Eye,
  Volume2,
  Printer,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  AlertCircle,
  Maximize2,
  X,
  Play,
  RotateCcw,
  Check,
  Heart,
  Smile,
  ShieldAlert,
} from "lucide-react";

export interface SignLanguageTerm {
  id: string;
  term: string;
  category: "Muayene Talimatı" | "Ağrı & Duygu" | "Anestezi & İşlem" | "Karşılama & Zaman";
  handGestureDesc: string;
  physicianTip: string;
  illustrationType: "open_mouth" | "close_mouth" | "spit" | "pain" | "needle" | "dont_fear" | "rinse" | "bite" | "tongue" | "wait" | "done" | "welcome";
  patientDisplayPhrase: string;
  isFavorite?: boolean;
}

const signTerms: SignLanguageTerm[] = [
  {
    id: "sign-1",
    term: "Ağzınızı Açın (Aç)",
    category: "Muayene Talimatı",
    handGestureDesc: "Başparmak ve işaret parmağını çene hizasında birleştirip ağzı temsil edecek şekilde yukarı-aşağı doğru aralayarak açın.",
    physicianTip: "İşareti yaparken gülümseyin ve başınızla hafifçe onay verin; hasta rahatlayacaktır.",
    illustrationType: "open_mouth",
    patientDisplayPhrase: "LÜTFEN AĞZINIZI AÇINIZ",
  },
  {
    id: "sign-2",
    term: "Ağzınızı Kapatın / Dinlenin (Kapat)",
    category: "Muayene Talimatı",
    handGestureDesc: "Açık olan el parmaklarını yatay düzlemde birleştirip yumruk yapmadan avuç içini hafifçe aşağı indirin.",
    physicianTip: "İşlem aralarında hastanın çene kaslarını dinlendirmesi için düzenli olarak bu jesti yapın.",
    illustrationType: "close_mouth",
    patientDisplayPhrase: "AĞZINIZI KAPATIP DİNLENEBİLİRSİNİZ",
  },
  {
    id: "sign-3",
    term: "Tükürün / Çalkalayın",
    category: "Muayene Talimatı",
    handGestureDesc: "İşaret parmağınızı ağız kenarından kreşuar (lavabo) yönüne doğru yay şeklinde iki kez hareket ettirin.",
    physicianTip: "Kreşuar bardağını işaret ederek hastaya yön gösterin.",
    illustrationType: "spit",
    patientDisplayPhrase: "LÜTFEN KREŞUARA TÜKÜRÜNÜZ",
  },
  {
    id: "sign-4",
    term: "Ağrı / Acı Var mı?",
    category: "Ağrı & Duygu",
    handGestureDesc: "Elinizi yumruk yapıp işaret parmağınızı yanağınıza hafifçe dokundurun, ardından sorgular bir yüz ifadesiyle elinizi hafifçe sallayın.",
    physicianTip: "Kaşlarınızı hafifçe kaldırarak soru sorduğunuzu mimiklerinizle hissettirin.",
    illustrationType: "pain",
    patientDisplayPhrase: "AĞRI VEYA ACINIZ VAR MI?",
  },
  {
    id: "sign-5",
    term: "Korkmayın / Güvendesiniz",
    category: "Ağrı & Duygu",
    handGestureDesc: "Açık avucunuzu göğsünüzün üstüne koyun, ardından iki elinizi avuç içleri yere bakacak şekilde göğüs hizasından aşağı doğru sakinleştirici biçimde indirin.",
    physicianTip: "Endişeli ve gergin hastaların nabzını yatıştıran en temel güven jestidir.",
    illustrationType: "dont_fear",
    patientDisplayPhrase: "KORKMAYIN, HER ŞEY YOLUNDA",
  },
  {
    id: "sign-6",
    term: "Hafif Batma / İğne (Uyuşturma)",
    category: "Anestezi & İşlem",
    handGestureDesc: "Baş ve işaret parmağınızın uçlarını birleştirip 'küçük bir nokta' yapar gibi yanağınıza bir saniye dokundurup çekin.",
    physicianTip: "İğneyi hastaya göstermeden önce bu jesti yaparak sinek ısırığı gibi çok küçük bir batma olacağını belirtin.",
    illustrationType: "needle",
    patientDisplayPhrase: "KÜÇÜK BİR BATMA HİSSİ OLACAK, UYUŞACAK",
  },
  {
    id: "sign-7",
    term: "Su ile Çalkalayın",
    category: "Muayene Talimatı",
    handGestureDesc: "Elinizle bardak tutma şekli yapıp ağzınıza götürün, ardından yanağınızı hafifçe şişirerek çalkalama mimiği yapın.",
    physicianTip: "Özellikle diş taşı temizliği veya dolgu cilasından sonra kullanışlıdır.",
    illustrationType: "rinse",
    patientDisplayPhrase: "SU İLE AĞZINIZI ÇALKALAYINIZ",
  },
  {
    id: "sign-8",
    term: "Isırın / Kapanışa Bakın",
    category: "Muayene Talimatı",
    handGestureDesc: "İki elinizin parmaklarını karşılıklı birbirine geçirerek çenelerin üst üste oturmasını sembolize edin.",
    physicianTip: "Artikülasyon kağıdı (mavi boyalı kağıt) ile temas kontrolü yaparken bu jesti kullanın.",
    illustrationType: "bite",
    patientDisplayPhrase: "LÜTFEN DİŞLERİNİZİ ISIRINIZ",
  },
  {
    id: "sign-9",
    term: "Dilinizi Çekin / Geri Alın",
    category: "Muayene Talimatı",
    handGestureDesc: "İşaret parmağınızı ağzınızın içine doğru kıvırarak geri çekilme hareketi yapın.",
    physicianTip: "Alt azı dişi tedavilerinde dilin aynaya veya freze temasını engellemek için hayati bir işarettir.",
    illustrationType: "tongue",
    patientDisplayPhrase: "LÜTFEN DİLİNİZİ GERİYE DOĞRU ÇEKİNİZ",
  },
  {
    id: "sign-10",
    term: "5 Dakika Bekleyin",
    category: "Karşılama & Zaman",
    handGestureDesc: "5 parmağınızı açık tutarak elinizi öne uzatın, ardından diğer elinizin işaret parmağıyla bileğinizdeki saati işaret edin.",
    physicianTip: "Anestezi solüsyonunun tam uyuşmasını beklerken hastaya iletilir.",
    illustrationType: "wait",
    patientDisplayPhrase: "UYUŞMASI İÇİN 5 DAKİKA BEKLEYECEĞİZ",
  },
  {
    id: "sign-11",
    term: "Tedavi Bitti / Geçmiş Olsun",
    category: "Karşılama & Zaman",
    handGestureDesc: "İki elinizi göğüs hizasında avuç içleri yukarı bakacak şekilde açıp dışarı doğru hafifçe yayın; ardından başparmağınızla 'tamam/harika' onayı verin.",
    physicianTip: "Hastanın tedavi stresini sonlandırır ve kliniğe olan güvenini pekiştirir.",
    illustrationType: "done",
    patientDisplayPhrase: "TEBRİKLER, TEDAVİNİZ BAŞARIYLA BİTTİ!",
  },
  {
    id: "sign-12",
    term: "Hoş Geldiniz",
    category: "Karşılama & Zaman",
    handGestureDesc: "Sağ elinizi kalbinizin üzerine koyup hafifçe başınızı eğin, ardından iki elinizi avuçlar açık şekilde hastaya doğru davetkar açın.",
    physicianTip: "Kliniğe ilk adım atan işitme engelli bireye gösterilecek ilk saygı ve kapsayıcılık adımıdır.",
    illustrationType: "welcome",
    patientDisplayPhrase: "HOŞ GELDİNİZ, DENTASPHERE'E SEFA GELDİNİZ",
  },
];

export default function IsaretDiliPage() {
  const { showToast, openPrintPreview } = useModal();
  const [terms, setTerms] = useState<SignLanguageTerm[]>(signTerms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  // Patient Flashcard Fullscreen Modal
  const [activeFlashcard, setActiveFlashcard] = useState<SignLanguageTerm | null>(null);

  // Detail Modal
  const [detailTerm, setDetailTerm] = useState<SignLanguageTerm | null>(null);

  // Filtering
  const filteredTerms = useMemo(() => {
    return terms.filter((item) => {
      const matchSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handGestureDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patientDisplayPhrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.physicianTip.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "Tümü" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [terms, searchQuery, selectedCategory]);

  const handlePrintDictionary = () => {
    openPrintPreview({
      type: "consent",
      title: "Klinik İçi Hasta İşaret Dili Tablosu",
      patientName: "Tüm Hekim & Asistan Personeli",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "DentaSphere Erişilebilir Sağlık İnisiyatifi",
      extraInfo: {
        "Kapsam": "İşitme Engelli Hasta İletişim Standartları",
        "Terim Sayısı": `${terms.length} Temel Klinik Jesti`,
      },
      items: terms.map((t) => ({
        name: t.term,
        detail: `Jest: ${t.handGestureDesc} | Hekim İpucu: ${t.physicianTip}`,
      })),
    });
  };

  const handleSimulateVoice = (termText: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(termText);
      utterance.lang = "tr-TR";
      window.speechSynthesis.speak(utterance);
    }
    showToast(`"${termText}" sesli okundu.`, "info");
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] dark:bg-[#0D1410] p-6 lg:p-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* BannerHeader */}
        <BannerHeader
          title="Hasta İşaret Dili Sözlüğü"
          description="İşitme engelli ve konuşma güçlüğü çeken hastalarımızla klinikte engelsiz iletişim sağlayan temel diş hekimliği işaret ve jest rehberi."
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hasta İşaret Dili Sözlüğü" },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrintDictionary}
                className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2A3E33] px-4 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
              >
                <Printer className="h-4 w-4 text-[#5F665F] dark:text-[#90A199]" />
                Rehber Tablosu Yazdır (PDF)
              </button>
              <button
                onClick={() => setActiveFlashcard(terms[0])}
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
                Hızlı İletişim Kartı Modu (Hastaya Göster)
              </button>
            </div>
          }
        />

        {/* Informational Banner */}
        <div className="mb-8 rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E2EEDD] dark:bg-[#1B3624] p-3 shrink-0">
              <Hand className="h-6 w-6 text-[#2C6A3B] dark:text-[#7CC9A6]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                Engelsiz Klinik İletişim Prensibi
              </h3>
              <p className="text-xs text-[#5F665F] dark:text-[#90A199] mt-0.5">
                Hastanın yüzüne bakarak konuşun, maskenizi jesti yaparken hafifçe indirip mimiklerinizi gösterin veya tableti hastaya çevirerek büyük kartı açın.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-[#E2EEDD] text-[#2C6A3B] dark:bg-[#1B3624] dark:text-[#7CC9A6] px-3 py-1 text-xs font-bold">
              12 Temel Terim Aktif
            </span>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F89]" />
              <input
                type="text"
                placeholder="İşaret terimi, jest tarifi veya talimat ara (örn: Ağrı, İğne, Tükür, Aç)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] pl-10 pr-4 py-2.5 text-sm text-[#1C211E] dark:text-[#F3F0EA] placeholder-[#8A8F89] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {["Tümü", "Muayene Talimatı", "Ağrı & Duygu", "Anestezi & İşlem", "Karşılama & Zaman"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#1F3327] text-white"
                      : "bg-[#EEEBE4] hover:bg-[#E3DFD6] text-[#1C211E] dark:bg-[#213027] dark:text-[#E2EEDD]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dictionary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-12 text-center text-[#5F665F] dark:text-[#90A199]">
              <Hand className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-base font-semibold text-[#1C211E] dark:text-[#F3F0EA]">Eşleşen işaret terimi bulunamadı</p>
              <p className="text-sm mt-1">Arama sorgunuzu değiştirebilir veya tüm kategorileri listeleyebilirsiniz.</p>
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top Badge & Voice button */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleSimulateVoice(item.term)}
                      className="p-1.5 rounded-lg text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027] transition-colors"
                      title="Sesli Telaffuz Et"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Term Title */}
                  <h3 className="font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                    {item.term}
                  </h3>

                  {/* Hand Gesture Box */}
                  <div className="mt-3.5 rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-lg bg-[#EEEBE4] dark:bg-[#213027] p-2 text-[#1F3327] dark:text-[#7CC9A6] shrink-0">
                        <Hand className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5320] dark:text-[#ECC089]">
                          El Hareketi & Jest Tarifi
                        </span>
                        <p className="mt-1 text-xs text-[#3F4540] dark:text-[#D1D9D4] leading-relaxed">
                          {item.handGestureDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Physician Tip */}
                  <div className="mt-3 rounded-xl bg-[#EEEBE4]/60 dark:bg-[#1E2C23] p-3 text-xs text-[#5F665F] dark:text-[#90A199]">
                    <strong className="text-[#1C211E] dark:text-[#F3F0EA]">Hekim İpucu: </strong>
                    {item.physicianTip}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDetailTerm(item)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2D3A32] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Detay & İpuçları
                    </button>

                    <button
                      onClick={() => setActiveFlashcard(item)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Hastaya Göster
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal 1: Hastaya Göster (Canlı İletişim / Flashcard Modu) */}
        {activeFlashcard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-[#FBFAF7] dark:bg-[#14231C] border-2 border-[#1F3327] dark:border-[#7CC9A6] p-8 shadow-2xl text-center">
              {/* Close Button */}
              <button
                onClick={() => setActiveFlashcard(null)}
                className="absolute top-4 right-4 rounded-full bg-[#EEEBE4] dark:bg-[#213027] p-2 text-gray-700 dark:text-gray-200 hover:scale-105 transition-transform"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col items-center justify-center py-6">
                {/* Big Visual Icon */}
                <div className="h-28 w-28 rounded-full bg-[#E2EEDD] dark:bg-[#1B3624] flex items-center justify-center text-[#1F3327] dark:text-[#7CC9A6] mb-6 shadow-inner">
                  <Hand className="h-14 w-14 animate-pulse" />
                </div>

                {/* Subtitle / Category */}
                <span className="rounded-full bg-[#1F3327] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-3">
                  {activeFlashcard.category}
                </span>

                {/* Big Patient Headline */}
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C211E] dark:text-[#F3F0EA] tracking-tight leading-tight max-w-lg mb-4">
                  {activeFlashcard.patientDisplayPhrase}
                </h2>

                {/* Clear Instruction for Patient */}
                <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-4 max-w-lg shadow-xs">
                  <p className="text-sm sm:text-base font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                    "{activeFlashcard.term}"
                  </p>
                  <p className="text-xs text-[#5F665F] dark:text-[#90A199] mt-1">
                    {activeFlashcard.handGestureDesc}
                  </p>
                </div>
              </div>

              {/* Navigation Bar between flashcards */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => {
                    const currentIndex = terms.findIndex((t) => t.id === activeFlashcard.id);
                    const prevIndex = (currentIndex - 1 + terms.length) % terms.length;
                    setActiveFlashcard(terms[prevIndex]);
                  }}
                  className="rounded-xl bg-[#EEEBE4] dark:bg-[#213027] px-4 py-2 text-xs font-bold text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  ← Önceki İşaret
                </button>

                <button
                  onClick={() => handleSimulateVoice(activeFlashcard.patientDisplayPhrase)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Volume2 className="h-4 w-4" />
                  Seslendir
                </button>

                <button
                  onClick={() => {
                    const currentIndex = terms.findIndex((t) => t.id === activeFlashcard.id);
                    const nextIndex = (currentIndex + 1) % terms.length;
                    setActiveFlashcard(terms[nextIndex]);
                  }}
                  className="rounded-xl bg-[#EEEBE4] dark:bg-[#213027] px-4 py-2 text-xs font-bold text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  Sonraki İşaret →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Terim Detay Modalı */}
        {detailTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div>
                  <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                    {detailTerm.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                    {detailTerm.term}
                  </h3>
                </div>
                <button
                  onClick={() => setDetailTerm(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Nasıl Uygulanır?</h4>
                  <p className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-3 text-xs leading-relaxed text-[#3F4540] dark:text-[#D1D9D4]">
                    {detailTerm.handGestureDesc}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Hastaya Gösterilecek Cümle</h4>
                  <div className="rounded-xl bg-[#E2EEDD]/50 dark:bg-[#1B3624]/40 p-3 text-xs font-bold text-[#2C6A3B] dark:text-[#7CC9A6]">
                    "{detailTerm.patientDisplayPhrase}"
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Hekim & Asistan Klinik Tavsiyesi</h4>
                  <p className="rounded-xl bg-[#EEEBE4]/60 dark:bg-[#1E2C23] p-3 text-xs text-[#5F665F] dark:text-[#90A199] leading-relaxed">
                    {detailTerm.physicianTip}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => {
                    const t = detailTerm;
                    setDetailTerm(null);
                    setActiveFlashcard(t);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2 text-xs font-semibold text-white shadow-xs"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Hastaya Göster
                </button>
                <button
                  onClick={() => setDetailTerm(null)}
                  className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
