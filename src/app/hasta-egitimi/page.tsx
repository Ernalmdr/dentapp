"use client";

import React, { useState, useMemo } from "react";
import BannerHeader from "@/components/layout/BannerHeader";
import { useModal } from "@/components/modals/ModalContext";
import {
  GraduationCap,
  Search,
  Share2,
  MessageSquare,
  Printer,
  Eye,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  HeartHandshake,
  ShieldAlert,
  ThumbsUp,
  X,
  Copy,
  ExternalLink,
  Smile,
  AlertTriangle,
} from "lucide-react";

export interface EducationGuide {
  id: string;
  title: string;
  category: "Cerrahi Sonrası" | "Ağız Bakımı" | "Ortodonti" | "Pedodonti" | "Estetik";
  readTime: string;
  targetAudience: string;
  summary: string;
  importantRules: string[];
  steps: { title: string; desc: string }[];
  warningNote?: string;
  sharesCount: number;
  badgeColor?: string;
  iconName: string;
}

const initialGuides: EducationGuide[] = [
  {
    id: "g-1",
    title: "Dental İmplant Sonrası İlk 48 Saat Bakım Rehberi",
    category: "Cerrahi Sonrası",
    readTime: "3 dk",
    targetAudience: "İmplant Cerrahisi Olan Hastalar",
    summary: "Cerrahi bölgenin pıhtı stabilitesini korumak, ödemi kontrol altına almak ve enfeksiyon riskini önlemek için kritik ilk 48 saat yönergeleri.",
    importantRules: [
      "İlk 24 saat kesinlikle tükürmeyin ve ağzınızı çalkalamayın.",
      "Operasyon bölgesine 15 dk aralıklarla dışarıdan soğuk buz kompresi yapın.",
      "İlk 3 gün çok sıcak, sert veya taneli gıdalardan uzak durun.",
    ],
    steps: [
      { title: "1. Tampon ve Pıhtılaşma", desc: "Cerrahi sonrası yerleştirilen steril gazlı bezi 30-45 dakika sıkıca ısırın. Sızıntı şeklindeki pembe kanama normaldir." },
      { title: "2. Beslenme ve Sıvı Tüketimi", desc: "Anestezi etkisi tamamen geçene kadar çiğneme yapmayın. Ilık ve yumuşak çorba, püre, yoğurt tüketin. Pipet kullanmayın." },
      { title: "3. İlaç ve Ağrı Yönetimi", desc: "Hekiminizin reçete ettiği antibiyotik ve anti-enflamatuar ağrı kesicileri saatine uygun eksiksiz kullanın." },
      { title: "4. Hijyen ve Fırçalama", desc: "Operasyon bölgesi hariç diğer dişlerinizi yumuşak fırça ile temizleyin. 24 saat sonra hekimin önerdiği gargara ile pasif çalkalama yapın." }
    ],
    warningNote: "Aşırı zonklayıcı ağrı, durmayan kanama veya 38°C üstü ateş durumunda derhal kliniğimizi arayınız.",
    sharesCount: 428,
    iconName: "ShieldAlert",
  },
  {
    id: "g-2",
    title: "Doğru Diş Fırçalama ve Arayüz Temizliği Standardı",
    category: "Ağız Bakımı",
    readTime: "4 dk",
    targetAudience: "Tüm Yetişkin ve Genç Hastalar",
    summary: "Plak ve tartar oluşumunu engelleyen 45 derecelik modifiye Bass fırçalama tekniği, diş ipi ve arayüz fırçası kullanım prensipleri.",
    importantRules: [
      "Günde en az 2 kez, minimum 2 dakika süreyle fırçalayın.",
      "Fırçayı diş etine 45 derece açıyla yerleştirip süpürme hareketi yapın.",
      "Diş ipi veya arayüz fırçasını fırçalamadan önce mutlaka uygulayın.",
    ],
    steps: [
      { title: "1. Açı ve Tutuş", desc: "Yumuşak veya orta kıllı fırçanızı diş ile diş etinin birleştiği hatta 45° eğimle yerleştirin." },
      { title: "2. Dairesel ve Süpürme Hareketi", desc: "Kırmızıdan beyaza (diş etinden dişe doğru) dairesel ve süpürme vibrasyonlarıyla her bölgeye 10 saniye ayırın." },
      { title: "3. Çiğneme Yüzeyleri", desc: "Azı dişlerinin çiğneyici girintilerini ileri-geri hareketlerle fırçalayarak gıda artıklarını uzaklaştırın." },
      { title: "4. Dil Temizliği", desc: "Ağız kokusunu önlemek için dil yüzeyini arkadan öne doğru özel dil sıyırıcı veya fırça yardımıyla nazikçe temizleyin." }
    ],
    warningNote: "Sert fırçalamak diş minesini aşındırır ve diş eti çekilmesine yol açar; basınç uygulamayın.",
    sharesCount: 890,
    iconName: "Sparkles",
  },
  {
    id: "g-3",
    title: "Ortodontik Braket ve Şeffaf Plak (Aligner) Kullanım Kuralları",
    category: "Ortodonti",
    readTime: "3 dk",
    targetAudience: "Braket veya Şeffaf Plak Kullananlar",
    summary: "Braket kopmalarını önleme, şeffaf plakların günde 20-22 saat kesintisiz kullanımı ve aparey hijyeni kılavuzu.",
    importantRules: [
      "Şeffaf plakları sadece yemek yerken ve sıcak içecek içerken çıkarın.",
      "Sert kabuklu fındık, zeytin çekirdeği ve yapışkan sakız kesinlikle yasaktır.",
      "Her yemek sonrası plakları takmadan önce dişlerinizi mutlaka fırçalayın.",
    ],
    steps: [
      { title: "1. Plak Takma & Çıkarma", desc: "Plakları önce ön dişlerden oturtup parmaklarınızla azılara doğru bastırın. Asla ısırarak yerine oturtmayın." },
      { title: "2. Günlük Süre Disiplini", desc: "Tedavinin planlanan sürede bitmesi için günde minimum 21-22 saat ağızda kalmalıdır." },
      { title: "3. Braket Acil Durumları", desc: "Tel batması veya braket batmasında hekiminizin verdiği ortodontik koruyucu mumu ilgili bölgeye yapıştırın." },
      { title: "4. Plak Temizliği", desc: "Plakları ılık su ve sıvı sabunla fırçalayarak temizleyin. Sıcak su plakların formunu bozar." }
    ],
    warningNote: "Kopan braketler diş hareketini durdurur ve tedavi süresini uzatır, kopma anında kliniğe haber verin.",
    sharesCount: 315,
    iconName: "Smile",
  },
  {
    id: "g-4",
    title: "20 Yaş (Gömülü Diş) Çekimi Sonrası Beslenme ve İyileşme",
    category: "Cerrahi Sonrası",
    readTime: "2 dk",
    targetAudience: "Çene Cerrahisi & Çekim Hastaları",
    summary: "Çekim boşluğunda alveolar osteit (kuru soket) oluşmasını engelleyen pıhtı koruma stratejileri ve menü önerileri.",
    importantRules: [
      "İlk 48 saat sigara ve alkol tüketimi kesinlikle yasaktır.",
      "Tükürme refleksi çekim yuvasındaki pıhtıyı söker, pıhtı yoksa kuru soket olur.",
      "Yemekleri operasyonun yapılmadığı karşı çene tarafıyla çiğneyin.",
    ],
    steps: [
      { title: "1. İlk Gün Beslenme", desc: "Oda sıcaklığında yoğurt, puding, blenderize çorba, muz püresi ve bol su tüketin." },
      { title: "2. Çene Egzersizi", desc: "Kas spazmını (trismus) önlemek için ertesi günden itibaren hafif ağız açma-kapama egzersizleri yapın." },
      { title: "3. Dikişlerin Alınması", desc: "Emilmeyen dikişler cerrahiden 7-10 gün sonra randevunuzda alınacaktır." }
    ],
    warningNote: "Çekimden 3-4 gün sonra aniden başlayan şiddetli kulak/baş ağrısı kuru soket belirtisi olabilir, hekime başvurun.",
    sharesCount: 512,
    iconName: "HeartHandshake",
  },
  {
    id: "g-5",
    title: "Ofis Tipi Diş Beyazlatma (Bleaching) Sonrası Beyaz Diyet",
    category: "Estetik",
    readTime: "3 dk",
    targetAudience: "Bleaching & Estetik Gülüş Hastaları",
    summary: "Beyazlatma sonrasında açık kalan mine prizmalarını renklendirici gıdalardan korumak için 7 günlük kritik 'Beyaz Diyet' rehberi.",
    importantRules: [
      "İlk 72 saat çay, kahve, kırmızı şarap, kola, salçalı yemekler yasaktır.",
      "Sigara dumanı beyazlayan mine yüzeyini hızla sarartır; en az 1 hafta ara verin.",
      "Aşırı soğuk veya aşırı sıcak içeceklerden hassasiyet nedeniyle kaçının.",
    ],
    steps: [
      { title: "1. İzin Verilen Beyaz Besinler", desc: "Süt, beyaz peynir, tavuk göğsü, pirinç pilavı, karnabahar, muz, sade makarna tüketebilirsiniz." },
      { title: "2. Hassasiyet Tedbiri", desc: "İşlem sonrası ilk 2 gün hafif sızlama doğaldır; hekiminizin önerdiği hassasiyet giderici macun kullanın." },
      { title: "3. Parlaklığın Korunması", desc: "Düzenli 6 aylık profesyonel temizlik beyazlığın kalıcılığını 2-3 yıl boyunca destekler." }
    ],
    warningNote: "Renkli meyveler (vişne, nar, böğürtlen) ve köri/zerdeçal gibi baharatlar beyazlatmayı nötrler.",
    sharesCount: 360,
    iconName: "Sparkles",
  },
  {
    id: "g-6",
    title: "Çocuklarda İlk Diş Hekimi Muayenesi ve Flor Koruma",
    category: "Pedodonti",
    readTime: "3 dk",
    targetAudience: "0-12 Yaş Çocuk Anneleri ve Babaları",
    summary: "Biberon çürüklerinin önlenmesi, parmak emme alışkanlığının bırakılması ve koruyucu fissür örtücü / flor vernik uygulamaları.",
    importantRules: [
      "İlk süt dişi sürdükten sonra (6-12 ay) ilk dental kontrol yapılmalıdır.",
      "Gece biberonla süt veya şekerli su verilerek uyutulmamalıdır.",
      "6 yaşına kadar çocukların diş fırçalaması ebeveyn gözetiminde olmalıdır.",
    ],
    steps: [
      { title: "1. Fırça ve Macun Seçimi", desc: "Yaşa uygun florürlü çocuk diş macunundan pirinç tanesi (0-3 yaş) veya bezelye tanesi (3+ yaş) kadar sürün." },
      { title: "2. Fissür Örtücü Uygulaması", desc: "6 yaşında çıkan 1. azı dişlerinin girintileri çürükten koruyucu şeffaf vernikle ağrısız olarak kapatılır." },
      { title: "3. Travma Önlemleri", desc: "Oyun sırasında diş darbe alır veya yerinden çıkarsa dişi süt veya serum içinde saklayıp 1 saatte kliniğe ulaştırın." }
    ],
    warningNote: "Süt dişleri 'nasılsa değişecek' denilerek ihmal edilmemelidir; alttaki daimi dişin kılavuzudur.",
    sharesCount: 294,
    iconName: "Smile",
  },
];

export default function HastaEgitimiPage() {
  const { showToast, openSmsModal, openPrintPreview } = useModal();
  const [guides, setGuides] = useState<EducationGuide[]>(initialGuides);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  // Detail Modal State
  const [selectedGuideForDetail, setSelectedGuideForDetail] = useState<EducationGuide | null>(null);

  // Direct Share Modal State
  const [sharingGuide, setSharingGuide] = useState<EducationGuide | null>(null);
  const [sharePatientName, setSharePatientName] = useState("");
  const [sharePatientPhone, setSharePatientPhone] = useState("");
  const [shareChannel, setShareChannel] = useState<"whatsapp" | "sms">("whatsapp");

  // New Guide Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<EducationGuide["category"]>("Cerrahi Sonrası");
  const [newAudience, setNewAudience] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newRule1, setNewRule1] = useState("");
  const [newRule2, setNewRule2] = useState("");

  // Filtering
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "Tümü" || g.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [guides, searchQuery, selectedCategory]);

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharePatientName.trim() || !sharePatientPhone.trim()) {
      showToast("Lütfen hasta adı ve telefonunu giriniz.", "error");
      return;
    }

    if (!sharingGuide) return;

    if (shareChannel === "whatsapp") {
      // Create WhatsApp message link simulation
      const text = encodeURIComponent(
        `Sayın ${sharePatientName},\n\nDentaSphere Diş Kliniği hekiminiz tarafından sizin için hazırlanan "${sharingGuide.title}" rehberini iletiyoruz:\n\n` +
        `Önemli Kurallar:\n` +
        sharingGuide.importantRules.map((r, i) => `${i + 1}. ${r}`).join("\n") +
        `\n\nDetaylı rehber ve hekim uyarıları için lütfen tıklayınız: https://dentapp.clinic/rehber/${sharingGuide.id}\n\nGeçmiş olsun dileklerimizle,\nDentaSphere Ekibi`
      );
      const cleanPhone = sharePatientPhone.replace(/\D/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${text}`;
      window.open(waUrl, "_blank");

      showToast(`WhatsApp mesajı ${sharePatientName} için hazırlandı.`, "success");
    } else {
      // Trigger SMS Modal
      openSmsModal(sharePatientName, sharePatientPhone);
      showToast(`SMS onay penceresi açıldı.`, "info");
    }

    // Increment share counter
    setGuides((prev) =>
      prev.map((g) => (g.id === sharingGuide.id ? { ...g, sharesCount: g.sharesCount + 1 } : g))
    );

    setSharingGuide(null);
    setSharePatientName("");
    setSharePatientPhone("");
  };

  const handlePrintGuide = (guide: EducationGuide) => {
    openPrintPreview({
      type: "consent",
      title: `${guide.title} — Hasta Bilgilendirme Broşürü`,
      patientName: "Klinik Hasta Nüshası",
      date: new Date().toLocaleDateString("tr-TR"),
      doctorName: "DentaSphere Hekim Heyeti",
      extraInfo: {
        "Kategori": guide.category,
        "Hedef Kitle": guide.targetAudience,
        "Tahmini Okuma": guide.readTime,
      },
      items: [
        { name: "Rehber Özeti", detail: guide.summary },
        { name: "Temel Sağlık Kuralları", detail: guide.importantRules.join(" | ") },
        { name: "Acil Uyarı Notu", detail: guide.warningNote || "Herhangi bir acil durumda kliniğimize ulaşınız." },
      ],
    });
  };

  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      showToast("Lütfen başlık ve özet alanlarını doldurunuz.", "error");
      return;
    }

    const nextGuide: EducationGuide = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      readTime: "3 dk",
      targetAudience: newAudience.trim() || "Genel Hasta Grubu",
      summary: newSummary.trim(),
      importantRules: [
        newRule1.trim() || "Hekim tavsiyelerine harfiyen uyunuz.",
        newRule2.trim() || "Düzenli kontrollerinizi aksatmayınız.",
      ],
      steps: [
        { title: "1. İlk Uygulama", desc: "Tedavi sonrası ilk adımları dikkatle izleyiniz." },
        { title: "2. Takip ve Kontrol", desc: "Herhangi bir sorunda kliniğe danışınız." },
      ],
      warningNote: "Belirtilerde beklenmedik artış olursa hekiminize haber veriniz.",
      sharesCount: 1,
      iconName: "BookOpen",
    };

    setGuides([nextGuide, ...guides]);
    setIsCreateModalOpen(false);
    showToast(`"${nextGuide.title}" rehberi başarıyla oluşturuldu.`, "success");

    // Reset
    setNewTitle("");
    setNewAudience("");
    setNewSummary("");
    setNewRule1("");
    setNewRule2("");
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] dark:bg-[#0D1410] p-6 lg:p-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* BannerHeader */}
        <BannerHeader
          title="Hasta Eğitimi & Rehberler"
          description="Tedavi öncesi ve sonrası ağız sağlığı rehberleri, görsel bakım kartları ve hastaya doğrudan WhatsApp / SMS ile iletilebilen talimatlar."
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hasta Eğitimi & Rehberler" },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  showToast("Tüm rehberler PDF kitapçığı olarak derlendi.", "info");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2A3E33] px-4 py-2.5 text-sm font-medium text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
              >
                <BookOpen className="h-4 w-4 text-[#5F665F] dark:text-[#90A199]" />
                Katalog Olarak Yazdır
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors"
              >
                <Plus className="h-4 w-4" />
                Yeni Rehber Kartı Ekle
              </button>
            </div>
          }
        />

        {/* Filter and Category Pills */}
        <div className="rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F89]" />
              <input
                type="text"
                placeholder="Rehber başlığı, tedavi, anahtar kelime veya hasta grubu ara..."
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

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                "Tümü",
                "Cerrahi Sonrası",
                "Ağız Bakımı",
                "Ortodonti",
                "Pedodonti",
                "Estetik",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === category
                      ? "bg-[#1F3327] text-white"
                      : "bg-[#EEEBE4] hover:bg-[#E3DFD6] text-[#1C211E] dark:bg-[#213027] dark:text-[#E2EEDD] dark:hover:bg-[#2D3A32]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-12 text-center text-[#5F665F] dark:text-[#90A199]">
              <BookOpen className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-base font-semibold text-[#1C211E] dark:text-[#F3F0EA]">Eşleşen eğitim rehberi bulunamadı</p>
              <p className="text-sm mt-1">Farklı bir arama terimi deneyebilir veya yeni bir rehber kartı oluşturabilirsiniz.</p>
            </div>
          ) : (
            filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E6E1D8] dark:border-[#23352A] bg-[#FBFAF7] dark:bg-[#16211B] p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#5F665F] dark:text-[#90A199]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{guide.readTime} okuma</span>
                    </div>
                  </div>

                  {/* Title & Target */}
                  <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA] leading-snug line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#7A5320] dark:text-[#ECC089]">
                    Kitle: {guide.targetAudience}
                  </p>

                  {/* Summary */}
                  <p className="mt-2.5 text-xs text-[#5F665F] dark:text-[#90A199] line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>

                  {/* Important 3 rules preview box */}
                  <div className="mt-4 rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3327] dark:text-[#7CC9A6] flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-3 w-3" />
                      Kritik Hasta Kuralları
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#3F4540] dark:text-[#C5D0C9]">
                      {guide.importantRules.slice(0, 3).map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#2C6A3B] dark:text-[#7CC9A6] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: Metrics & Action Buttons */}
                <div className="mt-6 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <div className="flex items-center justify-between text-xs text-[#5F665F] dark:text-[#90A199] mb-3">
                    <span>{guide.sharesCount} kez paylaşıldı</span>
                    <button
                      onClick={() => handlePrintGuide(guide)}
                      className="hover:text-[#1C211E] dark:hover:text-[#F3F0EA] flex items-center gap-1"
                      title="Broşür Yazdır"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Yazdır
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedGuideForDetail(guide)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] dark:hover:bg-[#2D3A32] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      İncele & Adımlar
                    </button>

                    <button
                      onClick={() => {
                        setSharingGuide(guide);
                        setShareChannel("whatsapp");
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Hastayla Paylaş
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal 1: Rehber Detay ve Adım Adım İnceleme Modalı */}
        {selectedGuideForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div>
                  <span className="rounded-md bg-[#E2EEDD] dark:bg-[#1B3624] px-2.5 py-1 text-xs font-semibold text-[#2C6A3B] dark:text-[#7CC9A6]">
                    {selectedGuideForDetail.category}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                    {selectedGuideForDetail.title}
                  </h3>
                  <p className="text-xs text-[#5F665F] dark:text-[#90A199] mt-0.5">
                    Kitle: {selectedGuideForDetail.targetAudience} • {selectedGuideForDetail.readTime} okuma süresi
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuideForDetail(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5 text-sm">
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Rehber Amacı & Genel Bilgi</h4>
                  <p className="text-xs text-[#5F665F] dark:text-[#90A199] leading-relaxed">
                    {selectedGuideForDetail.summary}
                  </p>
                </div>

                {/* Important Rules */}
                <div className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-4">
                  <h4 className="font-semibold text-xs uppercase tracking-wide text-[#1F3327] dark:text-[#7CC9A6] mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Asla İhmal Edilmemesi Gereken Kurallar
                  </h4>
                  <ul className="space-y-2 text-xs text-[#3F4540] dark:text-[#C5D0C9]">
                    {selectedGuideForDetail.importantRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#2C6A3B] dark:text-[#7CC9A6] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step by step */}
                <div>
                  <h4 className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-3">
                    Adım Adım Bakım ve İyileşme Süreci
                  </h4>
                  <div className="space-y-3">
                    {selectedGuideForDetail.steps.map((st, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-[#EEEBE4]/60 dark:bg-[#1E2C23] p-3.5 text-xs"
                      >
                        <p className="font-bold text-[#1C211E] dark:text-[#F3F0EA] mb-1">{st.title}</p>
                        <p className="text-[#5F665F] dark:text-[#90A199] leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warning note */}
                {selectedGuideForDetail.warningNote && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#FBE9E7] dark:bg-[#431B1A] p-3.5 text-xs text-[#B3261E] dark:text-[#FCA5A5]">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Hekim Uyarısı: </strong>
                      {selectedGuideForDetail.warningNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                <button
                  onClick={() => handlePrintGuide(selectedGuideForDetail)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#EEEBE4] hover:bg-[#E3DFD6] dark:bg-[#213027] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#E2EEDD]"
                >
                  <Printer className="h-4 w-4" />
                  Yazdır (PDF)
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const g = selectedGuideForDetail;
                      setSelectedGuideForDetail(null);
                      setSharingGuide(g);
                      setShareChannel("whatsapp");
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-4 py-2 text-xs font-semibold text-white shadow-xs"
                  >
                    <Share2 className="h-4 w-4" />
                    Hastaya İlet (WhatsApp/SMS)
                  </button>
                  <button
                    onClick={() => setSelectedGuideForDetail(null)}
                    className="rounded-xl border border-[#E6E1D8] dark:border-[#23352A] px-4 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA]"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Hastayla Paylaş Modalı (WhatsApp / SMS) */}
        {sharingGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Rehberi Hastaya İlet
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199] truncate max-w-[240px]">
                      {sharingGuide.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSharingGuide(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleShareSubmit} className="mt-4 space-y-4">
                {/* Channel Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1.5">
                    Gönderim Kanalı
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShareChannel("whatsapp")}
                      className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-colors ${
                        shareChannel === "whatsapp"
                          ? "bg-[#25D366] text-white shadow-xs"
                          : "bg-[#EEEBE4] dark:bg-[#213027] text-[#1C211E] dark:text-[#E2EEDD]"
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp Mesajı
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareChannel("sms")}
                      className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-colors ${
                        shareChannel === "sms"
                          ? "bg-[#1F3327] text-white shadow-xs"
                          : "bg-[#EEEBE4] dark:bg-[#213027] text-[#1C211E] dark:text-[#E2EEDD]"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      Klinik SMS
                    </button>
                  </div>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Hasta Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={sharePatientName}
                    onChange={(e) => setSharePatientName(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Patient Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Telefon Numarası (WhatsApp / SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 532 XXX XX XX"
                    value={sharePatientPhone}
                    onChange={(e) => setSharePatientPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                {/* Message Preview */}
                <div className="rounded-xl bg-[#EEEBE4]/60 dark:bg-[#121A15] p-3 text-xs text-[#5F665F] dark:text-[#90A199]">
                  <p className="font-semibold text-[#1C211E] dark:text-[#F3F0EA] mb-1">Mesaj Önizleme:</p>
                  <p className="italic">
                    "Sayın {sharePatientName || "Hasta Adı"}, DentaSphere hekiminiz tarafından sizin için hazırlanan '{sharingGuide.title}' bakım rehberini ekte iletiyoruz..."
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <button
                    type="button"
                    onClick={() => setSharingGuide(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-xs font-semibold text-white shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Gönderimi Başlat
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Yeni Rehber Kartı Ekle Modalı */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#FBFAF7] dark:bg-[#16211B] border border-[#E6E1D8] dark:border-[#23352A] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E6E1D8] dark:border-[#23352A] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-[#1F3327] p-2 text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C211E] dark:text-[#F3F0EA]">
                      Yeni Hasta Eğitim Rehberi
                    </h3>
                    <p className="text-xs text-[#5F665F] dark:text-[#90A199]">
                      Kliniğe yeni bir tedavi sonrası veya ağız bakım yönergesi ekleyin.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGuide} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Rehber Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Zirkonyum Kaplama Sonrası Bakım"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-sm text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Kategori
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as EducationGuide["category"])
                      }
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3 py-2 text-xs font-semibold text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    >
                      <option value="Cerrahi Sonrası">Cerrahi Sonrası</option>
                      <option value="Ağız Bakımı">Ağız Bakımı</option>
                      <option value="Ortodonti">Ortodonti</option>
                      <option value="Pedodonti">Pedodonti</option>
                      <option value="Estetik">Estetik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                      Hedef Hasta Grubu
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Kron/Köprü Hastaları"
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Özet Açıklama *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Rehberin amacını özetleyen kısa paragraf..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] p-2.5 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Önemli Kural 1
                  </label>
                  <input
                    type="text"
                    placeholder="İlk 24 saat dikkat edilmesi gereken kural"
                    value={newRule1}
                    onChange={(e) => setNewRule1(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5F665F] dark:text-[#90A199] mb-1">
                    Önemli Kural 2
                  </label>
                  <input
                    type="text"
                    placeholder="Beslenme veya hijyen kuralı"
                    value={newRule2}
                    onChange={(e) => setNewRule2(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D8] dark:border-[#23352A] bg-white dark:bg-[#0F1713] px-3.5 py-2 text-xs text-[#1C211E] dark:text-[#F3F0EA] focus:outline-hidden focus:ring-2 focus:ring-[#1F3327]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#E6E1D8] dark:border-[#23352A] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F665F] hover:bg-[#EEEBE4] dark:hover:bg-[#213027]"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-[#1F3327] hover:bg-[#2D3A32] px-5 py-2 text-xs font-semibold text-white shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    Rehberi Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
