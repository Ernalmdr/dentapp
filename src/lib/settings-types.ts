export type SettingsTabId =
  | "klinik"
  | "kullanicilar"
  | "bildirimler"
  | "randevu"
  | "fatura"
  | "tedavi"
  | "ai"
  | "gorunum"
  | "guvenlik"
  | "yedekleme"
  | "entegrasyonlar";

export interface WorkingDayHours {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export interface ClinicInfoSettings {
  logoUrl: string | null;
  clinicName: string;
  phone: string;
  authorizedPerson: string;
  email: string;
  taxOffice: string;
  website: string;
  taxNumber: string;
  cityDistrict: string;
  address: string;
  workingHours: WorkingDayHours[];
  lunchStart: string;
  lunchEnd: string;
}

export interface UserMember {
  id: string;
  initials: string;
  name: string;
  title: string;
  email?: string;
  role: string;
  status: "Aktif" | "Bekliyor" | "Pasif";
  lastLogin: string;
}

export interface RolePermissionRow {
  id: string;
  label: string;
  permissions: Record<string, boolean>;
}

export interface UsersAndRolesSettings {
  users: UserMember[];
  roles: string[];
  matrix: RolePermissionRow[];
}

export interface NotificationPreferenceRow {
  id: string;
  event: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
}

export interface NotificationSettings {
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  preferences: NotificationPreferenceRow[];
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

export interface AppointmentTypeItem {
  id: string;
  name: string;
  duration: number;
  color: string;
}

export interface AppointmentSettings {
  defaultDuration: string;
  dayStart: string;
  calendarInterval: string;
  dayEnd: string;
  calendarView: string;
  defaultUnit: string;
  preventOverlapping: boolean;
  onlineBooking: boolean;
  smsReminderEnabled: boolean;
  reminderTiming: string;
  reminderTemplate: string;
  appointmentTypes: AppointmentTypeItem[];
}

export interface BillingSettings {
  invoiceType: string;
  defaultVat: string;
  invoiceSeries: string;
  withholdingTax: string;
  nextNumber: string;
  defaultCurrency: string;
  useEInvoice: boolean;
  sendInvoiceByEmail: boolean;
  paymentMethods: {
    cash: boolean;
    card: boolean;
    bankTransfer: boolean;
    installment: boolean;
  };
  currencies: {
    TRY: boolean;
    EUR: boolean;
    USD: boolean;
    GBP: boolean;
  };
}

export interface TreatmentPriceItem {
  id: string;
  name: string;
  category: string;
  tariffId: string;
  price: number;
  currency: string;
  vat: number;
}

export interface TariffItem {
  id: string;
  name: string;
  badge: "Varsayılan" | "Aktif" | "Pasif";
}

export interface TreatmentPricingSettings {
  activeTariffId: string;
  treatments: TreatmentPriceItem[];
  tariffs: TariffItem[];
}

export interface AiSupportSettings {
  xrayAnalysis: boolean;
  noteSummarization: boolean;
  appointmentSuggestions: boolean;
  patientInfoText: boolean;
  imageTypes: {
    panoramic: boolean;
    bitewing: boolean;
    periapical: boolean;
    cephalometric: boolean;
    cbct: boolean;
    intraoral: boolean;
  };
  anonymizePatientData: boolean;
  requireDoctorApproval: boolean;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: "Küçük" | "Normal" | "Büyük";
  sidebarMode: "Geniş" | "Dar";
  language: string;
  dateFormat: string;
  currency: string;
  timezone: string;
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  maskPatientData: boolean;
  sessionTimeout: string;
  sessions: ActiveSessionItem[];
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: string;
  time: string;
  retention: string;
  lastBackupAt: string;
  exportModules: {
    patients: boolean;
    appointments: boolean;
    treatments: boolean;
    billing: boolean;
    stock: boolean;
    documents: boolean;
  };
  exportFormat: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  configSummary?: string;
}

export interface AllClinicSettings {
  clinic: ClinicInfoSettings;
  usersAndRoles: UsersAndRolesSettings;
  notifications: NotificationSettings;
  appointments: AppointmentSettings;
  billing: BillingSettings;
  treatments: TreatmentPricingSettings;
  ai: AiSupportSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  backup: BackupSettings;
  integrations: IntegrationItem[];
}

export const DEFAULT_SETTINGS: AllClinicSettings = {
  clinic: {
    logoUrl: null,
    clinicName: "Açıkkalın Diş Kliniği",
    phone: "+90 232 369 00 24",
    authorizedPerson: "Mahir AÇIKALIN",
    email: "klinik@ornek.com",
    taxOffice: "Karşıyaka Vergi Dairesi",
    website: "www.ornek.com",
    taxNumber: "3491029412",
    cityDistrict: "İZMİR / KARŞIYAKA",
    address: "Cemal Gürsel Cad. No: 142/3 Karşıyaka, İzmir",
    workingHours: [
      { day: "Pazartesi", enabled: true, start: "09:00", end: "18:00" },
      { day: "Salı", enabled: true, start: "09:00", end: "18:00" },
      { day: "Çarşamba", enabled: true, start: "09:00", end: "18:00" },
      { day: "Perşembe", enabled: true, start: "09:00", end: "18:00" },
      { day: "Cuma", enabled: true, start: "09:00", end: "18:00" },
      { day: "Cumartesi", enabled: true, start: "10:00", end: "14:00" },
      { day: "Pazar", enabled: false, start: "09:00", end: "18:00" },
    ],
    lunchStart: "12:30",
    lunchEnd: "13:30",
  },
  usersAndRoles: {
    users: [
      {
        id: "u1",
        initials: "SY",
        name: "Dr. Selin Yılmaz",
        title: "Yönetici Diş Hekimi",
        role: "Hekim",
        status: "Aktif",
        lastLogin: "Bugün",
      },
      {
        id: "u2",
        initials: "MA",
        name: "Mahir Açıkalın",
        title: "Diş Hekimi",
        role: "Hekim",
        status: "Aktif",
        lastLogin: "Dün",
      },
      {
        id: "u3",
        initials: "AS",
        name: "asistan@ornek.com",
        title: "Davet gönderildi",
        email: "asistan@ornek.com",
        role: "Asistan",
        status: "Bekliyor",
        lastLogin: "-",
      },
    ],
    roles: ["Yönetici", "Hekim", "Asistan", "Sekreter"],
    matrix: [
      {
        id: "p1",
        label: "Hasta kartı",
        permissions: { Yönetici: true, Hekim: true, Asistan: true, Sekreter: true },
      },
      {
        id: "p2",
        label: "Oral ve tedavi kaydı",
        permissions: { Yönetici: true, Hekim: true, Asistan: true, Sekreter: false },
      },
      {
        id: "p3",
        label: "Randevular",
        permissions: { Yönetici: true, Hekim: true, Asistan: true, Sekreter: true },
      },
      {
        id: "p4",
        label: "Fatura ve hesap",
        permissions: { Yönetici: true, Hekim: true, Asistan: false, Sekreter: true },
      },
      {
        id: "p5",
        label: "Reçete yazma",
        permissions: { Yönetici: true, Hekim: true, Asistan: false, Sekreter: false },
      },
      {
        id: "p6",
        label: "Stok",
        permissions: { Yönetici: true, Hekim: false, Asistan: true, Sekreter: false },
      },
      {
        id: "p7",
        label: "Raporlar",
        permissions: { Yönetici: true, Hekim: true, Asistan: false, Sekreter: false },
      },
      {
        id: "p8",
        label: "Ayarlar",
        permissions: { Yönetici: true, Hekim: false, Asistan: false, Sekreter: false },
      },
    ],
  },
  notifications: {
    channels: {
      inApp: true,
      email: true,
      sms: false,
    },
    preferences: [
      { id: "n1", event: "Yeni randevu talebi", inApp: true, email: true, sms: false },
      { id: "n2", event: "Randevu iptali veya değişikliği", inApp: true, email: true, sms: true },
      { id: "n3", event: "Ödeme alındı", inApp: true, email: false, sms: false },
      { id: "n4", event: "Vadesi geçen ödeme", inApp: true, email: true, sms: false },
      { id: "n5", event: "Kritik stok uyarısı", inApp: true, email: true, sms: false },
      { id: "n6", event: "Yeni görüntü / röntgen yüklendi", inApp: true, email: false, sms: false },
      { id: "n7", event: "Günlük randevu özeti", inApp: false, email: true, sms: false },
    ],
    quietHoursEnabled: true,
    quietStart: "22:00",
    quietEnd: "08:00",
  },
  appointments: {
    defaultDuration: "30 dakika",
    dayStart: "09:00",
    calendarInterval: "15 dakika",
    dayEnd: "18:00",
    calendarView: "Hafta",
    defaultUnit: "Ünit 1",
    preventOverlapping: true,
    onlineBooking: true,
    smsReminderEnabled: true,
    reminderTiming: "24 saat önce",
    reminderTemplate:
      "Sayın {hasta_adi}, {tarih} {saat} tarihli randevunuzu hatırlatırız. Açıkkalın Diş Kliniği",
    appointmentTypes: [
      { id: "at1", name: "Kontrol", duration: 30, color: "#3F8F55" },
      { id: "at2", name: "Dolgu", duration: 60, color: "#4A78B5" },
      { id: "at3", name: "Kanal Tedavisi", duration: 90, color: "#8B5CF6" },
      { id: "at4", name: "Diş Çekimi", duration: 30, color: "#D97706" },
      { id: "at5", name: "İmplant", duration: 60, color: "#B3261E" },
    ],
  },
  billing: {
    invoiceType: "Eski Tip / Basılı",
    defaultVat: "%10",
    invoiceSeries: "DS",
    withholdingTax: "%0",
    nextNumber: "000001",
    defaultCurrency: "Türk Lirası (TRY)",
    useEInvoice: false,
    sendInvoiceByEmail: true,
    paymentMethods: {
      cash: true,
      card: true,
      bankTransfer: true,
      installment: false,
    },
    currencies: {
      TRY: true,
      EUR: true,
      USD: true,
      GBP: false,
    },
  },
  treatments: {
    activeTariffId: "tdb-2021",
    treatments: [
      { id: "tr1", name: "Diş Çekimi", category: "Cerrahi", tariffId: "tdb-2021", price: 230, currency: "TRY", vat: 10 },
      { id: "tr2", name: "Komplikasyonlu Diş Çekimi", category: "Cerrahi", tariffId: "tdb-2021", price: 395, currency: "TRY", vat: 10 },
      { id: "tr3", name: "Gömülü Diş Operasyonu", category: "Cerrahi", tariffId: "tdb-2021", price: 740, currency: "TRY", vat: 10 },
      { id: "tr4", name: "Gömülü Diş Operasyonu (Kemik Retansiyonlu)", category: "Cerrahi", tariffId: "tdb-2021", price: 1120, currency: "TRY", vat: 10 },
      { id: "tr5", name: "Dolgu", category: "Restoratif", tariffId: "tdb-2021", price: 1200, currency: "TRY", vat: 10 },
      { id: "tr6", name: "Kanal Tedavisi", category: "Endodonti", tariffId: "tdb-2021", price: 4500, currency: "TRY", vat: 10 },
      { id: "tr7", name: "İmplant", category: "İmplantoloji", tariffId: "tdb-2021", price: 18000, currency: "TRY", vat: 10 },
    ],
    tariffs: [
      { id: "tdb-2021", name: "TDB 2021", badge: "Varsayılan" },
      { id: "ozel", name: "Özel", badge: "Aktif" },
    ],
  },
  ai: {
    xrayAnalysis: true,
    noteSummarization: true,
    appointmentSuggestions: true,
    patientInfoText: false,
    imageTypes: {
      panoramic: true,
      bitewing: true,
      periapical: true,
      cephalometric: false,
      cbct: true,
      intraoral: false,
    },
    anonymizePatientData: true,
    requireDoctorApproval: true,
  },
  appearance: {
    theme: "light",
    fontSize: "Normal",
    sidebarMode: "Geniş",
    language: "Türkçe",
    dateFormat: "GG.AA.YYYY",
    currency: "Türk Lirası (TRY)",
    timezone: "İstanbul (UTC+03:00)",
  },
  security: {
    twoFactorAuth: false,
    maskPatientData: true,
    sessionTimeout: "30 dakika",
    sessions: [
      {
        id: "s1",
        device: "Bu cihaz",
        browser: "Chrome",
        lastActive: "Şu an aktif",
        isCurrent: true,
      },
      {
        id: "s2",
        device: "Telefon",
        browser: "Safari",
        lastActive: "Dün",
        isCurrent: false,
      },
    ],
  },
  backup: {
    autoBackupEnabled: true,
    frequency: "Her gün",
    time: "03:00",
    retention: "30 gün",
    lastBackupAt: "Bugün, 03:00",
    exportModules: {
      patients: true,
      appointments: true,
      treatments: false,
      billing: true,
      stock: false,
      documents: false,
    },
    exportFormat: "Excel (.xlsx)",
  },
  integrations: [
    {
      id: "sms",
      name: "SMS Sağlayıcı",
      description: "Randevu hatırlatma ve bilgilendirme SMS'leri.",
      connected: true,
      configSummary: "NetGSM · Başlık: ACIKKALIN",
    },
    {
      id: "efatura",
      name: "e-Fatura / e-Arşiv",
      description: "Faturaları entegratör üzerinden elektronik kesin.",
      connected: false,
    },
    {
      id: "erecete",
      name: "e-Reçete",
      description: "Reçeteleri elektronik olarak düzenleyin.",
      connected: false,
    },
    {
      id: "gcal",
      name: "Google Takvim",
      description: "Randevuları hekimlerin takvimleriyle eşleyin.",
      connected: false,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Hatırlatmaları WhatsApp üzerinden gönderin.",
      connected: false,
    },
    {
      id: "smtp",
      name: "E-posta (SMTP)",
      description: "Bildirim e-postalarını kendi adresinizden gönderin.",
      connected: true,
      configSummary: "smtp.ornek.com:587",
    },
  ],
};
