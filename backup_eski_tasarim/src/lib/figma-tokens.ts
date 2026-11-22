/**
 * Figma Design Tokens — DentaSphere (Doctrack)
 * Extracted from Figma file: ruyDsv13vGSFc0ovaj9tGy
 *
 * These tokens define the shared color palette, typography,
 * spacing, border-radius and shadow system used across all
 * Figma-faithful pages.
 */

// ═══════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════

/** Primary brand / sidebar / dark surfaces */
export const colors = {
  // Sidebar & Dark Surfaces
  sidebarBg: "#1a2b23",        // Sidebar gradient start
  sidebarBgEnd: "#0f1a14",     // Sidebar gradient end
  sidebarActive: "#2e4436",    // Active menu item bg
  sidebarHover: "#243d33",     // Menu item hover
  sidebarText: "#9bb8a8",      // Inactive menu text
  sidebarTextActive: "#ffffff", // Active menu text
  sidebarAccent: "#7cc9a6",    // Logo accent / highlight

  // Card Dark (stat cards with dark bg)
  cardDark: "#1f3327",         // Dark stat card bg
  cardDarkBorder: "#1f3327",   // Dark stat card border
  cardDarkIcon: "#2e4436",     // Icon circle bg on dark card

  // Card Light (stat cards with light bg)
  cardLight: "#fbfaf7",        // Light stat card bg
  cardLightBorder: "#e6e1d8",  // Light stat card border
  cardLightIcon: "#eeebe4",    // Icon circle bg on light card

  // Page Background
  pageBg: "#f3f0ea",           // Main content area bg (warm beige)
  pageBgDark: "#0b130f",       // Dark mode page bg

  // Typography Colors
  textPrimary: "#1c211e",      // Headings, primary text
  textSecondary: "#5f665f",    // Descriptions, secondary text
  textMuted: "#8a918a",        // Muted / placeholder text
  textOnDark: "#ffffff",       // Text on dark surfaces
  textSubOnDark: "#c9d6cc",    // Subtitle text on dark surfaces

  // Status / Semantic
  statusCompleted: "#22c55e",  // Tamamlandı dot
  statusCompletedBg: "#dcfce7",
  statusInProgress: "#3b82f6", // Devam Ediyor dot
  statusInProgressBg: "#dbeafe",
  statusWaiting: "#f59e0b",    // Bekliyor dot
  statusWaitingBg: "#fef3c7",

  // Accent & Interactive
  accentGreen: "#7cc9a6",      // CTA accents, sparklines
  btnPrimary: "#1f3327",       // Primary button bg
  btnPrimaryHover: "#2a4538",  // Primary button hover
  btnSecondary: "#eeebe4",     // Secondary / outline button bg
  btnSecondaryBorder: "#e6e1d8",

  // Borders & Dividers
  borderLight: "#e6e1d8",      // Card borders, table dividers
  borderDark: "#2e4436",       // Dark mode borders
  divider: "#f0ede7",          // Subtle row dividers

  // Chart colors
  chartGreen: "#1f3327",
  chartBeige: "#c9b99a",
  chartMuted: "#e6e1d8",

  // Donut chart segments
  donutPrimary: "#1f3327",
  donutSecondary: "#c9b99a",
  donutTertiary: "#e6e1d8",
  donutQuaternary: "#f3f0ea",
} as const;

// ═══════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════

export const fonts = {
  heading: "'DM Serif Display', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

export const fontSizes = {
  /** Page title / welcome heading */
  h1: "44px",
  /** Section headings (Bugünkü Randevular, Hızlı İşlemler) */
  h2: "22px",
  /** Card stat label (Bugünkü Randevular label) */
  h3: "15px",
  /** Big stat number (12, 4, 8, %68) */
  statLarge: "44px",
  /** Medium stat */
  statMedium: "28px",
  /** Body / table text */
  body: "14px",
  /** Small labels, captions */
  caption: "13px",
  /** Tiny badges, breadcrumbs */
  tiny: "12px",
} as const;

// ═══════════════════════════════════════
// SPACING & LAYOUT
// ═══════════════════════════════════════

export const layout = {
  sidebarWidth: 249,          // px — Figma Aside width
  topBarHeight: 72,           // px — approximate top bar area
  contentPadding: 36,         // px — main content left/right padding
  cardBorderRadius: 20,       // px — stat card radius
  buttonBorderRadius: 12,     // px — button radius
  inputBorderRadius: 12,      // px — input / search radius
  badgeBorderRadius: 999,     // px — full round badge
  cardGap: 16,                // px — gap between stat cards
  sectionGap: 22,             // px — gap between dashboard sections
} as const;

// ═══════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════

export const shadows = {
  card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  cardHover: "0 4px 12px rgba(0,0,0,0.08)",
  button: "0 1px 2px rgba(0,0,0,0.05)",
  modal: "0 20px 60px rgba(0,0,0,0.15)",
} as const;

// ═══════════════════════════════════════
// TAILWIND HELPER CLASSES
// ═══════════════════════════════════════
// Use these as quick references when writing Tailwind:
//
// bg-[#f3f0ea]        → pageBg
// bg-[#1f3327]        → cardDark / btnPrimary
// bg-[#fbfaf7]        → cardLight
// border-[#e6e1d8]    → borderLight
// text-[#1c211e]      → textPrimary
// text-[#5f665f]      → textSecondary
// text-[#7cc9a6]      → accentGreen
// rounded-[20px]      → cardBorderRadius
// font-serif          → DM Serif Display (headings)
// font-sans           → Inter (body)
