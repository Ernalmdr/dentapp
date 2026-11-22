/**
 * Figma Design Tokens — DentaSphere (Doctrack)
 * Doğrudan Figma tasarım sisteminden alınan kesin kodlar ve token'lar.
 */

// ═══════════════════════════════════════
// 1. ANA YEŞİLLER (Green Palette)
// ═══════════════════════════════════════
export const green = {
  /** "MA" profil simgesi */
  900: "#121815",
  /** Ana butonlar, seçili sekmeler, koyu kartlar */
  800: "#1F3327",
  /** Yan menüde seçili öğe */
  700: "#2D3A32",
  /** Koyu kart içindeki daireler, sayı rozetleri */
  600: "#34483B",
  /** Yeşil vurgulu etiketler (Faturayı Kesen, Dişhekimi) */
  500: "#2F5A3D",
  /** Bildirim noktası, "Aktif" noktası */
  400: "#3F8F55",
  /** Grafik çubukları */
  300: "#B7C4B9",
  /** Takvim butonu kenarlığı */
  200: "#C9DDC3",
  /** Takvim butonu zemini */
  100: "#DDEBD8",
  /** Simge kutucukları */
  50: "#E7EEE6",
} as const;

// ═══════════════════════════════════════
// 2. YAN PANEL (Sidebar)
// ═══════════════════════════════════════
export const sidebar = {
  /** Görselin altındaki zemin */
  background: "#1A1B1A",
  /** Görselin koyu kısmı */
  imageDark: "#0F110B",
  /** Görseldeki dalga */
  imageWave: "#465C43",
  /** Dalganın parlak kısmı */
  imageHighlight: "#9AB395",
  /** Normal menü yazısı */
  text: "#CDD5CF",
  /** Soluk metin */
  textMuted: "#C3CCC5",
  /** Kart kenarlığı */
  cardBorder: "#2E3832",
  /** Kart zemini */
  card: "rgba(28, 36, 31, 0.85)",
} as const;

// ═══════════════════════════════════════
// 3. NÖTRLER (Neutrals)
// ═══════════════════════════════════════
export const neutral = {
  /** Sayfa zemini */
  background: "#F3F0EA",
  /** Kartlar */
  surface: "#FBFAF7",
  /** Form alanları */
  white: "#FFFFFF",
  /** Gri butonlar */
  soft: "#EEEBE4",
  /** Çizgiler ve kenarlıklar */
  border: "#E6E1D8",
  /** Ayraçlar */
  borderStrong: "#CFCAC0",
  /** Grafik çubuk zemini */
  track: "#EDEAE4",
  /** Takvim çizgileri */
  grid: "#ECE8E1",
  /** Üst paneldeki yuvarlak butonlar */
  glass: "rgba(255, 255, 255, 0.75)",
} as const;

// ═══════════════════════════════════════
// 4. YAZI RENKLERİ (Typography)
// ═══════════════════════════════════════
export const text = {
  /** Başlıklar ve ana metin */
  primary: "#1C211E",
  /** Açıklamalar, tablo başlıkları */
  secondary: "#5F665F",
  /** Kart açıklamaları */
  body: "#3F4540",
  /** Placeholder */
  placeholder: "#8A8F89",
  /** Boş durum simgeleri */
  iconMuted: "#9AA29B",
} as const;

// ═══════════════════════════════════════
// 5. DURUM RENKLERİ (Status)
// ═══════════════════════════════════════
export const status = {
  /** "Aktif Tedavi" */
  success: {
    text: "#2C6A3B",
    bg: "#E2EEDD",
    dot: "#3F8F55",
  },
  /** "Takip", "Bekliyor" */
  warning: {
    text: "#7A5320",
    bg: "#F3EADB",
    dot: "#B07D47",
  },
  /** "Tamamlandı" */
  neutral: {
    text: "#4F544F",
    bg: "#ECEAE5",
    dot: "#7C817C",
  },
  /** "Devam Ediyor" */
  info: {
    text: "#2C5282",
    bg: "#E3ECF7",
    dot: "#4A78B5",
  },
  /** Sil butonu, zorunlu alanlar */
  danger: {
    text: "#B3261E",
    bg: "#FBE9E7",
    border: "#F3D0CC",
  },
} as const;

// ═══════════════════════════════════════
// 6. TAKVİM RANDEVU RENKLERİ (Event Badges)
// ═══════════════════════════════════════
export const eventColors = {
  yellow: {
    bg: "#F7E9C9",
    border: "#E9D3A0",
    text: "#7A5320",
  },
  purple: {
    bg: "#E6DFF1",
    border: "#D3C7E6",
    text: "#2C5282",
  },
  green: {
    bg: "#DDE7D9",
    border: "#C5D6C0",
    text: "#1F3327",
  },
  red: {
    bg: "#F4D9D6",
    border: "#E8BFBA",
    text: "#B3261E",
  },
} as const;

// ═══════════════════════════════════════
// 7. TEDAVİ DAĞILIMI RENKLERİ (Treatment Distribution)
// ═══════════════════════════════════════
export const treatmentColors = {
  dolgu: "#2B3A31",
  kanal: "#5E7363",
  cekimi: "#8FA393",
  protez: "#BCC8BE",
  diger: "#DCE2DC",
} as const;

// ═══════════════════════════════════════
// 8. DİĞER (Other)
// ═══════════════════════════════════════
export const otherColors = {
  /** Oral sayfasındaki fiyat listesi */
  priceRow: {
    bg: "#F6EEDC",
    border: "#EADFC8",
  },
  /** Sayfaların arasındaki zemin */
  canvas: "#D9D5CD",
} as const;

// ═══════════════════════════════════════
// TYPOGRAPHY FONTS
// ═══════════════════════════════════════
export const fonts = {
  heading: "var(--font-dm-serif, 'DM Serif Display', Georgia, serif)",
  body: "var(--font-inter, 'Inter', system-ui, sans-serif)",
} as const;

export default {
  green,
  sidebar,
  neutral,
  text,
  status,
  eventColors,
  treatmentColors,
  otherColors,
  fonts,
};
