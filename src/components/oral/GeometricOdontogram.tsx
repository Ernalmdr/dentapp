'use client';

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Layers,
  Check,
  Zap,
} from 'lucide-react';

// ==========================================
// TİPLER VE SABİTLER
// ==========================================

export type ToothSurface = 'M' | 'D' | 'O' | 'B' | 'L';
export type SurfaceStatus = 'healthy' | 'decay_planned' | 'existing_filling';
export type ToothCondition = 'healthy' | 'root_canal' | 'crown' | 'implant' | 'missing';
export type ActiveTool =
  | 'inspect'
  | 'decay_planned'
  | 'existing_filling'
  | 'healthy'
  | 'root_canal'
  | 'crown'
  | 'implant'
  | 'missing';

export interface ToothState {
  id: number;
  surfaces: {
    M: SurfaceStatus;
    D: SurfaceStatus;
    O: SurfaceStatus;
    B: SurfaceStatus;
    L: SurfaceStatus;
  };
  condition?: ToothCondition;
  notes?: string;
}

export interface GeometricOdontogramProps {
  initialData?: Record<number, ToothState>;
  onChange?: (data: Record<number, ToothState>) => void;
  selectedTooth?: number | null;
  onSelectTooth?: (toothId: number | null) => void;
  readOnly?: boolean;
  className?: string;
}

// Diş İsimleri (FDI)
export const TOOTH_NAMES: Record<number, string> = {
  // Üst Çene (Maxilla) - Yetişkin
  18: 'Sağ Üst 3. Molar (20lik)',
  17: 'Sağ Üst 2. Molar',
  16: 'Sağ Üst 1. Molar',
  15: 'Sağ Üst 2. Premolar',
  14: 'Sağ Üst 1. Premolar',
  13: 'Sağ Üst Kanin',
  12: 'Sağ Üst Lateral Kesici',
  11: 'Sağ Üst Santral Kesici',
  21: 'Sol Üst Santral Kesici',
  22: 'Sol Üst Lateral Kesici',
  23: 'Sol Üst Kanin',
  24: 'Sol Üst 1. Premolar',
  25: 'Sol Üst 2. Premolar',
  26: 'Sol Üst 1. Molar',
  27: 'Sol Üst 2. Molar',
  28: 'Sol Üst 3. Molar (20lik)',
  // Alt Çene (Mandibula) - Yetişkin
  48: 'Sağ Alt 3. Molar (20lik)',
  47: 'Sağ Alt 2. Molar',
  46: 'Sağ Alt 1. Molar',
  45: 'Sağ Alt 2. Premolar',
  44: 'Sağ Alt 1. Premolar',
  43: 'Sağ Alt Kanin',
  42: 'Sağ Alt Lateral Kesici',
  41: 'Sağ Alt Santral Kesici',
  31: 'Sol Alt Santral Kesici',
  32: 'Sol Alt Lateral Kesici',
  33: 'Sol Alt Kanin',
  34: 'Sol Alt 1. Premolar',
  35: 'Sol Alt 2. Premolar',
  36: 'Sol Alt 1. Molar',
  37: 'Sol Alt 2. Molar',
  38: 'Sol Alt 3. Molar (20lik)',
  // Süt Dişleri (Deciduous)
  55: 'Sağ Üst 2. Süt Azı',
  54: 'Sağ Üst 1. Süt Azı',
  53: 'Sağ Üst Süt Kanin',
  52: 'Sağ Üst Lateral Süt Kesici',
  51: 'Sağ Üst Santral Süt Kesici',
  61: 'Sol Üst Santral Süt Kesici',
  62: 'Sol Üst Lateral Süt Kesici',
  63: 'Sol Üst Süt Kanin',
  64: 'Sol Üst 1. Süt Azı',
  65: 'Sol Üst 2. Süt Azı',
  85: 'Sağ Alt 2. Süt Azı',
  84: 'Sağ Alt 1. Süt Azı',
  83: 'Sağ Alt Süt Kanin',
  82: 'Sağ Alt Lateral Süt Kesici',
  81: 'Sağ Alt Santral Süt Kesici',
  71: 'Sol Alt Santral Süt Kesici',
  72: 'Sol Alt Lateral Süt Kesici',
  73: 'Sol Alt Süt Kanin',
  74: 'Sol Alt 1. Süt Azı',
  75: 'Sol Alt 2. Süt Azı',
};

// FDI Quadrant Grupları
const ADULT_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const ADULT_UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const ADULT_LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const ADULT_LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

const PRIMARY_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PRIMARY_UPPER_LEFT = [61, 62, 63, 64, 65];
const PRIMARY_LOWER_RIGHT = [85, 84, 83, 82, 81];
const PRIMARY_LOWER_LEFT = [71, 72, 73, 74, 75];

export const SURFACE_DESCRIPTIONS: Record<ToothSurface, { code: string; name: string; full: string }> = {
  M: { code: 'M', name: 'Mezial', full: 'Ön / Orta Hat Temas Yüzeyi' },
  D: { code: 'D', name: 'Distal', full: 'Arka / Dış Yan Yüzey' },
  O: { code: 'O', name: 'Oklüzal / İnsizal', full: 'Çiğneme Yüzeyi / Kesici Kenar' },
  B: { code: 'B', name: 'Bukkal / Vestibüler', full: 'Yanak / Dudak Yönü Dış Yüzey' },
  L: { code: 'L', name: 'Lingual / Palatinal', full: 'Dil / Damak Yönü İç Yüzey' },
};

function createDefaultToothState(id: number): ToothState {
  return {
    id,
    surfaces: {
      M: 'healthy',
      D: 'healthy',
      O: 'healthy',
      B: 'healthy',
      L: 'healthy',
    },
    condition: 'healthy',
  };
}

// Örnek klinik vaka verisi
export const SAMPLE_CASE_DATA: Record<number, ToothState> = {
  16: {
    id: 16,
    surfaces: { M: 'decay_planned', O: 'decay_planned', D: 'decay_planned', B: 'healthy', L: 'healthy' },
    condition: 'healthy',
    notes: 'MOD Çürük, Kompozit dolgu planlandı',
  },
  11: {
    id: 11,
    surfaces: { M: 'healthy', O: 'healthy', D: 'healthy', B: 'healthy', L: 'healthy' },
    condition: 'crown',
    notes: 'Zirkonyum Kron Restorasyonu',
  },
  25: {
    id: 25,
    surfaces: { M: 'existing_filling', O: 'existing_filling', D: 'healthy', B: 'healthy', L: 'healthy' },
    condition: 'healthy',
    notes: 'Mevcut MO Kompozit Dolgu',
  },
  36: {
    id: 36,
    surfaces: { M: 'healthy', O: 'healthy', D: 'healthy', B: 'healthy', L: 'healthy' },
    condition: 'implant',
    notes: 'Titanyum İmplant + Vidalı Kron',
  },
  46: {
    id: 46,
    surfaces: { M: 'existing_filling', O: 'existing_filling', D: 'existing_filling', B: 'healthy', L: 'healthy' },
    condition: 'root_canal',
    notes: 'Kanal Tedavisi Tamamlandı + MOD Amalgam',
  },
};

// ==========================================
// GEOMETRIC TOOTH SVG BİLEŞENİ (5 YÜZEYLİ)
// ==========================================

interface ToothNodeProps {
  toothId: number;
  state: ToothState;
  isSelected: boolean;
  onSelectTooth: (id: number) => void;
  onSurfaceClick: (toothId: number, surface: ToothSurface, e: React.MouseEvent) => void;
  readOnly?: boolean;
}

export const ToothNode: React.FC<ToothNodeProps> = ({
  toothId,
  state,
  isSelected,
  onSelectTooth,
  onSurfaceClick,
  readOnly = false,
}) => {
  // Dişin çene ve taraf konumunu belirle
  const isUpper =
    (toothId >= 11 && toothId <= 28) || (toothId >= 51 && toothId <= 65);
  const isRightSide =
    (toothId >= 11 && toothId <= 18) ||
    (toothId >= 41 && toothId <= 48) ||
    (toothId >= 51 && toothId <= 55) ||
    (toothId >= 81 && toothId <= 85);

  /**
   * Anatomik Yüzey Eşleşmesi:
   * 1. Üst Çenede:
   *    - Üst kenar = Bukkal/Vestibüler (B)
   *    - Alt kenar = Palatinal/Lingual (L)
   * 2. Alt Çenede:
   *    - Üst kenar = Lingual (L) (ağız içine bakan)
   *    - Alt kenar = Bukkal/Vestibüler (B) (dudak/yanağa bakan)
   * 3. Hasta Sağı (Diyagram Solu):
   *    - Sağ kenar (orta hatta bakan) = Mezial (M)
   *    - Sol kenar (arkaya bakan) = Distal (D)
   * 4. Hasta Solu (Diyagram Sağı):
   *    - Sol kenar (orta hatta bakan) = Mezial (M)
   *    - Sağ kenar (arkaya bakan) = Distal (D)
   * 5. Merkez daire/kutu = Oklüzal / İnsizal (O)
   */
  const topSurface: ToothSurface = isUpper ? 'B' : 'L';
  const bottomSurface: ToothSurface = isUpper ? 'L' : 'B';
  const leftSurface: ToothSurface = isRightSide ? 'D' : 'M';
  const rightSurface: ToothSurface = isRightSide ? 'M' : 'D';

  const getSurfaceColor = (surface: ToothSurface) => {
    const status = state.surfaces[surface];
    switch (status) {
      case 'decay_planned':
        return '#EF4444'; // Kırmızı (Planlanan/Çürük)
      case 'existing_filling':
        return '#3B82F6'; // Mavi (Mevcut Kompozit/Amalgam Dolgu)
      case 'healthy':
      default:
        return 'transparent'; // Sağlam (Temiz)
    }
  };

  const getSurfaceHoverClass = (surface: ToothSurface) => {
    if (readOnly) return '';
    const status = state.surfaces[surface];
    if (status === 'decay_planned') return 'hover:fill-red-400';
    if (status === 'existing_filling') return 'hover:fill-blue-400';
    return 'hover:fill-emerald-500/20 dark:hover:fill-emerald-400/25';
  };

  return (
    <div
      onClick={() => onSelectTooth(toothId)}
      className={`group relative flex flex-col items-center p-1 rounded-xl transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-emerald-500/15 dark:bg-emerald-400/20 ring-2 ring-emerald-500 shadow-md scale-105 z-10'
          : 'hover:bg-neutral-100 dark:hover:bg-[#1C2C23]'
      }`}
      title={`${toothId} - ${TOOTH_NAMES[toothId] || 'Diş'}`}
    >
      {/* Üstte Diş No (Üst Çene için) */}
      {isUpper && (
        <span
          className={`text-[11px] font-bold tracking-tight mb-1 transition-colors ${
            isSelected
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
          }`}
        >
          {toothId}
        </span>
      )}

      {/* SVG 5 Yüzeyli Geometrik Hedef Diyagramı */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
        <svg
          viewBox="0 0 50 50"
          className="w-full h-full drop-shadow-xs overflow-visible"
        >
          <defs>
            <filter id={`glow-${toothId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Dış Arka Plan Kutusu / Yuvarlatılmış Çerçeve */}
          <rect
            x="3"
            y="3"
            width="44"
            height="44"
            rx="8"
            className="fill-white dark:fill-[#121A15] stroke-neutral-300 dark:stroke-[#2B3F33]"
            strokeWidth="1.5"
          />

          {/* YÜZEY: ÜST (Top Trapezoid) */}
          <path
            d="M 6 6 L 44 6 L 33 17 L 17 17 Z"
            fill={getSurfaceColor(topSurface)}
            className={`transition-colors duration-150 stroke-neutral-400 dark:stroke-[#364C3E] ${getSurfaceHoverClass(
              topSurface
            )}`}
            strokeWidth="1"
            onClick={(e) => {
              e.stopPropagation();
              onSurfaceClick(toothId, topSurface, e);
            }}
          >
            <title>{`${topSurface}: ${SURFACE_DESCRIPTIONS[topSurface].name}`}</title>
          </path>

          {/* YÜZEY: ALT (Bottom Trapezoid) */}
          <path
            d="M 17 33 L 33 33 L 44 44 L 6 44 Z"
            fill={getSurfaceColor(bottomSurface)}
            className={`transition-colors duration-150 stroke-neutral-400 dark:stroke-[#364C3E] ${getSurfaceHoverClass(
              bottomSurface
            )}`}
            strokeWidth="1"
            onClick={(e) => {
              e.stopPropagation();
              onSurfaceClick(toothId, bottomSurface, e);
            }}
          >
            <title>{`${bottomSurface}: ${SURFACE_DESCRIPTIONS[bottomSurface].name}`}</title>
          </path>

          {/* YÜZEY: SOL (Left Trapezoid) */}
          <path
            d="M 6 6 L 17 17 L 17 33 L 6 44 Z"
            fill={getSurfaceColor(leftSurface)}
            className={`transition-colors duration-150 stroke-neutral-400 dark:stroke-[#364C3E] ${getSurfaceHoverClass(
              leftSurface
            )}`}
            strokeWidth="1"
            onClick={(e) => {
              e.stopPropagation();
              onSurfaceClick(toothId, leftSurface, e);
            }}
          >
            <title>{`${leftSurface}: ${SURFACE_DESCRIPTIONS[leftSurface].name}`}</title>
          </path>

          {/* YÜZEY: SAĞ (Right Trapezoid) */}
          <path
            d="M 44 6 L 44 44 L 33 33 L 33 17 Z"
            fill={getSurfaceColor(rightSurface)}
            className={`transition-colors duration-150 stroke-neutral-400 dark:stroke-[#364C3E] ${getSurfaceHoverClass(
              rightSurface
            )}`}
            strokeWidth="1"
            onClick={(e) => {
              e.stopPropagation();
              onSurfaceClick(toothId, rightSurface, e);
            }}
          >
            <title>{`${rightSurface}: ${SURFACE_DESCRIPTIONS[rightSurface].name}`}</title>
          </path>

          {/* YÜZEY: MERKEZ (Occlusal / Incisal) */}
          <rect
            x="17"
            y="17"
            width="16"
            height="16"
            rx="3"
            fill={getSurfaceColor('O')}
            className={`transition-colors duration-150 stroke-neutral-400 dark:stroke-[#364C3E] ${getSurfaceHoverClass(
              'O'
            )}`}
            strokeWidth="1.2"
            onClick={(e) => {
              e.stopPropagation();
              onSurfaceClick(toothId, 'O', e);
            }}
          >
            <title>O: Oklüzal / İnsizal Yüzey</title>
          </rect>

          {/* ÖZEL DURUM GÖSTERGELERİ */}
          {/* Kanal Tedavisi (Mor kanal çizgisi) */}
          {state.condition === 'root_canal' && (
            <g className="pointer-events-none">
              <line
                x1="25"
                y1="4"
                x2="25"
                y2="46"
                stroke="#9333EA"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="25" cy="25" r="4.5" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" />
            </g>
          )}

          {/* Kron (Altın Taç / Çerçeve) */}
          {state.condition === 'crown' && (
            <g className="pointer-events-none">
              <rect
                x="3"
                y="3"
                width="44"
                height="44"
                rx="8"
                fill="rgba(245, 158, 11, 0.28)"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />
              {/* Küçük Taç İkonu */}
              <path
                d="M 18 11 L 22 15 L 25 9 L 28 15 L 32 11 L 31 18 L 19 18 Z"
                fill="#D97706"
                stroke="#B45309"
                strokeWidth="0.8"
              />
            </g>
          )}

          {/* İmplant (Titanyum Gri Vida) */}
          {state.condition === 'implant' && (
            <g className="pointer-events-none">
              <rect
                x="3"
                y="3"
                width="44"
                height="44"
                rx="8"
                fill="rgba(100, 116, 139, 0.25)"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              {/* Vida Yivleri */}
              <line x1="20" y1="20" x2="30" y2="20" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <line x1="21" y1="25" x2="29" y2="25" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <line x1="22" y1="30" x2="28" y2="30" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <circle cx="25" cy="14" r="3.5" fill="#64748B" />
            </g>
          )}

          {/* Eksik Diş (X Çizgisi) */}
          {state.condition === 'missing' && (
            <g className="pointer-events-none">
              <line x1="8" y1="8" x2="42" y2="42" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="42" y1="8" x2="8" y2="42" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </svg>

        {/* Küçük Durum Rozeti (Varsa) */}
        {state.condition && state.condition !== 'healthy' && (
          <span
            className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-xs ${
              state.condition === 'root_canal'
                ? 'bg-purple-600'
                : state.condition === 'crown'
                ? 'bg-amber-500'
                : state.condition === 'implant'
                ? 'bg-slate-600'
                : 'bg-red-500'
            }`}
          >
            {state.condition === 'root_canal'
              ? 'K'
              : state.condition === 'crown'
              ? 'C'
              : state.condition === 'implant'
              ? 'I'
              : 'X'}
          </span>
        )}
      </div>

      {/* Altta Diş No (Alt Çene için) */}
      {!isUpper && (
        <span
          className={`text-[11px] font-bold tracking-tight mt-1 transition-colors ${
            isSelected
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
          }`}
        >
          {toothId}
        </span>
      )}
    </div>
  );
};

// ==========================================
// ANA GEOMETRIC ODONTOGRAM BİLEŞENİ
// ==========================================

export const GeometricOdontogram: React.FC<GeometricOdontogramProps> = ({
  initialData,
  onChange,
  selectedTooth: externalSelectedTooth,
  onSelectTooth: externalOnSelectTooth,
  readOnly = false,
  className = '',
}) => {
  // Diş durumları state'i
  const [teeth, setTeeth] = useState<Record<number, ToothState>>(() => {
    return initialData || SAMPLE_CASE_DATA;
  });

  // Seçili Diş
  const [internalSelectedTooth, setInternalSelectedTooth] = useState<number | null>(16);
  const selectedToothId = externalSelectedTooth !== undefined ? externalSelectedTooth : internalSelectedTooth;

  const handleSelectTooth = (id: number | null) => {
    if (externalOnSelectTooth) {
      externalOnSelectTooth(id);
    } else {
      setInternalSelectedTooth(id);
    }
  };

  // Dişlenme Tipi: Yetişkin (32 Diş) vs Süt (20 Diş)
  const [dentitionMode, setDentitionMode] = useState<'adult' | 'primary'>('adult');

  // Aktif Fırça / İşlem Aracı
  const [activeTool, setActiveTool] = useState<ActiveTool>('inspect');

  // Güncelleme Yardımcısı
  const updateTooth = (toothId: number, updater: (prev: ToothState) => ToothState) => {
    if (readOnly) return;
    setTeeth((prev) => {
      const current = prev[toothId] || createDefaultToothState(toothId);
      const updated = updater(current);
      const next = { ...prev, [toothId]: updated };
      onChange?.(next);
      return next;
    });
  };

  // Yüzey Tıklaması
  const handleSurfaceClick = (toothId: number, surface: ToothSurface, e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelectTooth(toothId);

    if (readOnly) return;

    // Aktif alete göre doğrudan yüzey boyama
    if (activeTool === 'decay_planned' || activeTool === 'existing_filling' || activeTool === 'healthy') {
      updateTooth(toothId, (prev) => ({
        ...prev,
        surfaces: {
          ...prev.surfaces,
          [surface]: activeTool,
        },
      }));
      return;
    }

    if (activeTool === 'root_canal' || activeTool === 'crown' || activeTool === 'implant' || activeTool === 'missing') {
      updateTooth(toothId, (prev) => ({
        ...prev,
        condition: prev.condition === activeTool ? 'healthy' : activeTool,
      }));
      return;
    }

    // 'inspect' modunda doğrudan toggle döngüsü:
    // healthy -> decay_planned (Kırmızı) -> existing_filling (Mavi) -> healthy
    updateTooth(toothId, (prev) => {
      const currentStatus = prev.surfaces[surface];
      let nextStatus: SurfaceStatus = 'decay_planned';
      if (currentStatus === 'decay_planned') nextStatus = 'existing_filling';
      else if (currentStatus === 'existing_filling') nextStatus = 'healthy';
      else nextStatus = 'decay_planned';

      return {
        ...prev,
        surfaces: {
          ...prev.surfaces,
          [surface]: nextStatus,
        },
      };
    });
  };

  // Hızlı Yüzey Preseti Uygulama (Örn. MOD, DO, vb.)
  const applySurfacePreset = (surfacesToSet: ToothSurface[], status: SurfaceStatus) => {
    if (!selectedToothId || readOnly) return;
    updateTooth(selectedToothId, (prev) => {
      const nextSurfaces = { ...prev.surfaces };
      surfacesToSet.forEach((s) => {
        nextSurfaces[s] = status;
      });
      return {
        ...prev,
        surfaces: nextSurfaces,
      };
    });
  };

  // Tüm yüzeyleri temizle (Seçili diş için)
  const clearSelectedToothSurfaces = () => {
    if (!selectedToothId || readOnly) return;
    updateTooth(selectedToothId, (prev) => ({
      ...prev,
      surfaces: {
        M: 'healthy',
        D: 'healthy',
        O: 'healthy',
        B: 'healthy',
        L: 'healthy',
      },
    }));
  };

  // Seçili Dişin Durumunu Ayarla
  const setSelectedToothCondition = (cond: ToothCondition) => {
    if (!selectedToothId || readOnly) return;
    updateTooth(selectedToothId, (prev) => ({
      ...prev,
      condition: prev.condition === cond ? 'healthy' : cond,
    }));
  };

  // Tüm odontogramı sıfırla
  const handleResetAll = () => {
    if (readOnly) return;
    if (confirm('Tüm odontogram verilerini sıfırlamak istediğinize emin misiniz?')) {
      const emptyState: Record<number, ToothState> = {};
      setTeeth(emptyState);
      onChange?.(emptyState);
    }
  };

  // Örnek Vakayı Geri Yükle
  const handleLoadSample = () => {
    if (readOnly) return;
    setTeeth(SAMPLE_CASE_DATA);
    onChange?.(SAMPLE_CASE_DATA);
  };

  // İstatistikler
  const stats = useMemo(() => {
    let decayCount = 0;
    let fillingCount = 0;
    let endoCount = 0;
    let crownCount = 0;
    let implantCount = 0;

    Object.values(teeth).forEach((tooth) => {
      let hasDecay = false;
      let hasFilling = false;
      Object.values(tooth.surfaces).forEach((status) => {
        if (status === 'decay_planned') hasDecay = true;
        if (status === 'existing_filling') hasFilling = true;
      });
      if (hasDecay) decayCount++;
      if (hasFilling) fillingCount++;
      if (tooth.condition === 'root_canal') endoCount++;
      if (tooth.condition === 'crown') crownCount++;
      if (tooth.condition === 'implant') implantCount++;
    });

    return { decayCount, fillingCount, endoCount, crownCount, implantCount };
  }, [teeth]);

  const activeToothState = selectedToothId
    ? teeth[selectedToothId] || createDefaultToothState(selectedToothId)
    : null;

  return (
    <div
      className={`flex flex-col bg-white dark:bg-[#15221B] border border-neutral-200 dark:border-[#243B2F] rounded-2xl shadow-sm overflow-hidden text-neutral-900 dark:text-[#ECF3EE] ${className}`}
    >
      {/* ── 1. ÜST BAŞLIK & DİŞLENME KONTROLLERİ ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-neutral-200 dark:border-[#243B2F] bg-neutral-50/70 dark:bg-[#121C16]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              FDI 5 Yüzeyli Geometrik Odontogram
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                ADA / ISO 3950
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Mezial, Distal, Oklüzal, Bukkal ve Lingual yüzey restorasyon haritası
            </p>
          </div>
        </div>

        {/* Dişlenme Tipi ve Sıfırlama Butonları */}
        <div className="flex items-center gap-2">
          {/* Yetişkin vs Süt Dişi Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 dark:bg-[#1E2E25] border border-neutral-300 dark:border-[#2B3F33]">
            <button
              type="button"
              onClick={() => setDentitionMode('adult')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                dentitionMode === 'adult'
                  ? 'bg-white dark:bg-[#15221B] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Yetişkin (32 Diş)
            </button>
            <button
              type="button"
              onClick={() => setDentitionMode('primary')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                dentitionMode === 'primary'
                  ? 'bg-white dark:bg-[#15221B] text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Süt Dişleri (20 Diş)
            </button>
          </div>

          {!readOnly && (
            <>
              <button
                type="button"
                onClick={handleLoadSample}
                className="p-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] border border-neutral-200 dark:border-[#2B3F33] rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Örnek klinik vakayı yükle"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Örnek Vaka</span>
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="p-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1E2E25] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200 dark:border-[#2B3F33] rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Tüm odontogramı sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sıfırla</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── 2. ARAÇ ÇUBUĞU (TOOL BRUSH) & RENK LEJANTI ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-neutral-200 dark:border-[#243B2F] bg-white dark:bg-[#15221B] text-xs">
        {/* İşlem Araçları (Brush) */}
        {!readOnly && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mr-1">
              Fırça Aracı:
            </span>

            <button
              type="button"
              onClick={() => setActiveTool('inspect')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                activeTool === 'inspect'
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-[#1B2921] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#2B3F33] hover:border-neutral-400'
              }`}
              title="Yüzeylere tıklayarak döngüsel değiştirin"
            >
              <Zap className="w-3.5 h-3.5" />
              Seç & Toggle
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('decay_planned')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                activeTool === 'decay_planned'
                  ? 'bg-red-500 text-white border-red-600 shadow-xs'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white dark:border-red-900 inline-block" />
              Çürük / Planlanan (Kırmızı)
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('existing_filling')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                activeTool === 'existing_filling'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50 hover:bg-blue-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white dark:border-blue-900 inline-block" />
              Mevcut Dolgu (Mavi)
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('healthy')}
              className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                activeTool === 'healthy'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-emerald-900 inline-block" />
              Sağlam / Temizle (Yeşil)
            </button>
          </div>
        )}

        {/* Canlı İstatistik Göstergeleri */}
        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 ml-auto">
          <div className="flex items-center gap-1.5" title="Planlanan Çürük / Tedaviler">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Çürük: <strong>{stats.decayCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5" title="Mevcut Dolgular">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Dolgu: <strong>{stats.fillingCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5" title="Kanal Tedavili Dişler">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>Kanal: <strong>{stats.endoCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5" title="Kron Kaplamalar">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Kron: <strong>{stats.crownCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5" title="İmplantlar">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>İmplant: <strong>{stats.implantCount}</strong></span>
          </div>
        </div>
      </div>

      {/* ── 3. ANA ODONTOGRAM HARİTASI (ÜST & ALT ÇENE) ── */}
      <div className="p-4 sm:p-6 overflow-x-auto bg-neutral-50/40 dark:bg-[#121A15]/50 flex flex-col items-center">
        {/* Üst Çene (Maxilla) */}
        <div className="w-full max-w-5xl flex flex-col items-center mb-6">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SAĞ (1. Çeyrek)
            </span>
            <span className="uppercase tracking-widest text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md">
              ÜST ÇENE (MAKSİLLA)
            </span>
            <span className="flex items-center gap-1.5">
              SOL (2. Çeyrek)
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="w-full flex items-center justify-center gap-1 sm:gap-2 p-3 bg-white dark:bg-[#16241C] rounded-2xl border border-neutral-200 dark:border-[#243B2F] shadow-xs">
            {/* 1. Çeyrek (Hasta Sağı) */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
              {(dentitionMode === 'adult' ? ADULT_UPPER_RIGHT : PRIMARY_UPPER_RIGHT).map((id) => (
                <ToothNode
                  key={id}
                  toothId={id}
                  state={teeth[id] || createDefaultToothState(id)}
                  isSelected={selectedToothId === id}
                  onSelectTooth={handleSelectTooth}
                  onSurfaceClick={handleSurfaceClick}
                  readOnly={readOnly}
                />
              ))}
            </div>

            {/* Orta Hat Çizgisi (Midline) */}
            <div className="flex flex-col items-center mx-1 sm:mx-2 text-neutral-400 dark:text-neutral-600">
              <div className="w-0.5 h-16 bg-emerald-500/30 dark:bg-emerald-400/30 rounded-full" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 my-0.5">|</span>
              <div className="w-0.5 h-16 bg-emerald-500/30 dark:bg-emerald-400/30 rounded-full" />
            </div>

            {/* 2. Çeyrek (Hasta Solu) */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-start">
              {(dentitionMode === 'adult' ? ADULT_UPPER_LEFT : PRIMARY_UPPER_LEFT).map((id) => (
                <ToothNode
                  key={id}
                  toothId={id}
                  state={teeth[id] || createDefaultToothState(id)}
                  isSelected={selectedToothId === id}
                  onSelectTooth={handleSelectTooth}
                  onSurfaceClick={handleSurfaceClick}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Çeneler Arası Ayırıcı & Yön Göstergesi */}
        <div className="w-full max-w-5xl flex items-center justify-center gap-4 py-1 mb-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-[#243B2F]" />
          <span className="flex items-center gap-2 font-medium">
            <span>Ön Dudak / Bukkal (Dış)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>Dil / Lingual (İç)</span>
          </span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-[#243B2F]" />
        </div>

        {/* Alt Çene (Mandibula) */}
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full flex items-center justify-center gap-1 sm:gap-2 p-3 bg-white dark:bg-[#16241C] rounded-2xl border border-neutral-200 dark:border-[#243B2F] shadow-xs">
            {/* 4. Çeyrek (Hasta Sağı) */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
              {(dentitionMode === 'adult' ? ADULT_LOWER_RIGHT : PRIMARY_LOWER_RIGHT).map((id) => (
                <ToothNode
                  key={id}
                  toothId={id}
                  state={teeth[id] || createDefaultToothState(id)}
                  isSelected={selectedToothId === id}
                  onSelectTooth={handleSelectTooth}
                  onSurfaceClick={handleSurfaceClick}
                  readOnly={readOnly}
                />
              ))}
            </div>

            {/* Orta Hat Çizgisi (Midline) */}
            <div className="flex flex-col items-center mx-1 sm:mx-2 text-neutral-400 dark:text-neutral-600">
              <div className="w-0.5 h-16 bg-emerald-500/30 dark:bg-emerald-400/30 rounded-full" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 my-0.5">|</span>
              <div className="w-0.5 h-16 bg-emerald-500/30 dark:bg-emerald-400/30 rounded-full" />
            </div>

            {/* 3. Çeyrek (Hasta Solu) */}
            <div className="flex items-center gap-1 sm:gap-1.5 justify-start">
              {(dentitionMode === 'adult' ? ADULT_LOWER_LEFT : PRIMARY_LOWER_LEFT).map((id) => (
                <ToothNode
                  key={id}
                  toothId={id}
                  state={teeth[id] || createDefaultToothState(id)}
                  isSelected={selectedToothId === id}
                  onSelectTooth={handleSelectTooth}
                  onSurfaceClick={handleSurfaceClick}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-2 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SAĞ (4. Çeyrek)
            </span>
            <span className="uppercase tracking-widest text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-0.5 rounded-md">
              ALT ÇENE (MANDİBULA)
            </span>
            <span className="flex items-center gap-1.5">
              SOL (3. Çeyrek)
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. DETAY PANELİ & HIZLI SEÇİM ARAÇLARI (SEÇİLİ DİŞ) ── */}
      {selectedToothId && activeToothState && (
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-[#243B2F] bg-neutral-50/80 dark:bg-[#121A15]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Sol Taraf: Diş Bilgisi & Büyük Hedef Görünümü */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <ToothNode
                  toothId={selectedToothId}
                  state={activeToothState}
                  isSelected={true}
                  onSelectTooth={() => {}}
                  onSurfaceClick={handleSurfaceClick}
                  readOnly={readOnly}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    Diş #{selectedToothId}
                  </span>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {TOOTH_NAMES[selectedToothId]}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                  <span>Yüzeyler:</span>
                  {(['M', 'D', 'O', 'B', 'L'] as ToothSurface[]).map((surf) => {
                    const status = activeToothState.surfaces[surf];
                    const isDecay = status === 'decay_planned';
                    const isFilling = status === 'existing_filling';
                    return (
                      <span
                        key={surf}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isDecay
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : isFilling
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-neutral-200 dark:bg-[#1E2E25] text-neutral-600 dark:text-neutral-400'
                        }`}
                        title={`${surf}: ${SURFACE_DESCRIPTIONS[surf].full}`}
                      >
                        {surf}: {isDecay ? 'Çürük' : isFilling ? 'Dolgu' : 'Sağlam'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Hızlı Restorasyon Seçimleri (MOD, DO, MO, vb.) */}
            {!readOnly && (
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mr-1">
                    Hızlı Seçim:
                  </span>

                  {/* MOD Butonu */}
                  <button
                    type="button"
                    onClick={() => applySurfacePreset(['M', 'O', 'D'], 'decay_planned')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                    title="Mezial-Oklüzal-Distal Çürük Ekle"
                  >
                    MOD Çürük
                  </button>

                  {/* MO Butonu */}
                  <button
                    type="button"
                    onClick={() => applySurfacePreset(['M', 'O'], 'decay_planned')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                  >
                    MO
                  </button>

                  {/* DO Butonu */}
                  <button
                    type="button"
                    onClick={() => applySurfacePreset(['D', 'O'], 'decay_planned')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                  >
                    DO
                  </button>

                  {/* O Butonu */}
                  <button
                    type="button"
                    onClick={() => applySurfacePreset(['O'], 'decay_planned')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                  >
                    Oklüzal (O)
                  </button>

                  {/* Tüm Yüzeyler */}
                  <button
                    type="button"
                    onClick={() => applySurfacePreset(['M', 'D', 'O', 'B', 'L'], 'decay_planned')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-neutral-100 dark:hover:bg-[#25392E] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                  >
                    Tüm Yüzeyler
                  </button>

                  {/* Temizle */}
                  <button
                    type="button"
                    onClick={clearSelectedToothSurfaces}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-[#1E2E25] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-neutral-300 dark:border-[#2B3F33] transition-colors shadow-2xs"
                  >
                    Yüzeyleri Temizle
                  </button>
                </div>

                {/* Özel Durumlar (Kanal, Kron, İmplant, Eksik) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mr-1">
                    Durum:
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedToothCondition('root_canal')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      activeToothState.condition === 'root_canal'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50 hover:bg-purple-100'
                    }`}
                  >
                    Kanal Tedavisi (Mor)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToothCondition('crown')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      activeToothState.condition === 'crown'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100'
                    }`}
                  >
                    Kron Kaplama (Altın)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToothCondition('implant')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      activeToothState.condition === 'implant'
                        ? 'bg-slate-600 text-white border-slate-700 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    İmplant (Gri)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToothCondition('missing')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      activeToothState.condition === 'missing'
                        ? 'bg-red-600 text-white border-red-700 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Eksik Diş (X)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5. ALT BİLGİ & YÜZEY LEJANTI ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-neutral-200 dark:border-[#243B2F] bg-white dark:bg-[#15221B] text-xs text-neutral-600 dark:text-neutral-400">
        {/* Yüzey Tanımları */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Yüzey Kodları:</span>
          {Object.entries(SURFACE_DESCRIPTIONS).map(([code, item]) => (
            <div key={code} className="flex items-center gap-1">
              <span className="font-bold text-neutral-900 dark:text-white px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#1E2E25] border border-neutral-200 dark:border-[#2B3F33]">
                {code}
              </span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Renk Lejantı */}
        <div className="flex items-center gap-3 flex-wrap ml-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Mevcut Dolgu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>Planlanan / Çürük</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <span>Kanal Tedavisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Kron</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-500" />
            <span>İmplant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometricOdontogram;
