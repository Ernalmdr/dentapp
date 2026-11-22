import {
  Patient,
  Appointment,
  StatCardData,
  TreatmentRecord,
  Note,
  DentalImage,
  TreatmentPrice,
  MonthlyData,
  TreatmentDistribution,
} from "./types";

// ── Dashboard Stats ──────────────────────────────────────────
export const dashboardStats: StatCardData[] = [
  {
    title: "Bugünkü Randevular",
    value: 12,
    change: "+%20",
    changeType: "positive",
    icon: "calendar",
  },
  {
    title: "Bekleyen Onaylar",
    value: 4,
    change: "-%25",
    changeType: "negative",
    icon: "clock",
  },
  {
    title: "Tamamlanan İşlemler",
    value: 8,
    change: "+%33",
    changeType: "positive",
    icon: "check-circle",
  },
  {
    title: "Depolama Kullanımı",
    value: "68%",
    change: "10.2 GB / 15 GB",
    changeType: "positive",
    icon: "cloud",
    subtitle: "10.2 GB / 15 GB",
  },
];

// ── Today's Appointments ─────────────────────────────────────
export const todayAppointments: Appointment[] = [
  { id: "1", time: "09:00", patientName: "Ayşe Demir", treatment: "Kontrol", status: "Tamamlandı" },
  { id: "2", time: "09:45", patientName: "Mehmet Kaya", treatment: "Dolgu", status: "Devam Ediyor" },
  { id: "3", time: "10:30", patientName: "Zeynep Arslan", treatment: "Kanal Tedavisi", status: "Bekliyor" },
  { id: "4", time: "11:15", patientName: "Emre Çelik", treatment: "Muayene", status: "Bekliyor" },
  { id: "5", time: "12:00", patientName: "Elif Karaca", treatment: "Diş Çekimi", status: "Bekliyor" },
];

// ── Patients ─────────────────────────────────────────────────
export const patients: Patient[] = [
  {
    id: "1", hsNo: "HS-10248", firstName: "Mahir", lastName: "Açıkkalın",
    gender: "Erkek", age: 38, birthDate: "1988-05-15", tcNo: "12345678901",
    phone: "+905324567890", email: "mahir@email.com",
    status: "Aktif Tedavi", lastTreatment: "İmplant", registrationDate: "2026-09-09",
    dentist: "Dr. Selin Yılmaz", bloodGroup: "A Rh(+)", profession: "Mühendis",
    city: "İstanbul", district: "Kadıköy", country: "Türkiye", postalCode: "34000",
  },
  {
    id: "2", hsNo: "HS-10249", firstName: "Tuğçe", lastName: "Üngör",
    gender: "Kadın", age: 29, birthDate: "1998-01-01", tcNo: "23456789012",
    phone: "+905053214567", email: "tugce.ungor@mail.com",
    status: "Aktif Tedavi", lastTreatment: "Ortodonti", registrationDate: "2026-09-05",
    dentist: "Dr. Selin Yılmaz", bloodGroup: "A Rh(+)", profession: "Mimar",
    city: "İstanbul", district: "Kadıköy", country: "Türkiye", postalCode: "34000",
  },
  {
    id: "3", hsNo: "HS-10250", firstName: "Deniz", lastName: "Yılmaz",
    gender: "Erkek", age: 45, birthDate: "1981-07-20", tcNo: "34567890123",
    phone: "+905339876543", email: "deniz@email.com",
    status: "Takip", lastTreatment: "Kanal Tedavisi", registrationDate: "2026-08-28",
    dentist: "Dr. Selin Yılmaz", city: "İstanbul", district: "Beşiktaş", country: "Türkiye",
  },
  {
    id: "4", hsNo: "HS-10251", firstName: "Elif", lastName: "Karaca",
    gender: "Kadın", age: 34, birthDate: "1992-03-12", tcNo: "45678901234",
    phone: "+905426789012", email: "elif@email.com",
    status: "Tamamlandı", lastTreatment: "Dolgu", registrationDate: "2026-08-20",
    dentist: "Dr. Selin Yılmaz", city: "İstanbul", district: "Üsküdar", country: "Türkiye",
  },
  {
    id: "5", hsNo: "HS-10252", firstName: "Can", lastName: "Demeir",
    gender: "Erkek", age: 41, birthDate: "1985-11-08", tcNo: "56789012345",
    phone: "+905363456789", email: "can@email.com",
    status: "Takip", lastTreatment: "Diş Çekimi", registrationDate: "2026-08-18",
    dentist: "Dr. Selin Yılmaz", city: "İzmir", district: "Karşıyaka", country: "Türkiye",
  },
];

// ── Recent Images ────────────────────────────────────────────
export const recentImages: DentalImage[] = [
  { id: "1", patientName: "Ayşe Demir", type: "Panoramik", date: "Bugün" },
  { id: "2", patientName: "Mehmet Kaya", type: "Periapikal", date: "Dün" },
  { id: "3", patientName: "Zeynep Arslan", type: "CBCT", date: "27 Ekim" },
  { id: "4", patientName: "Emre Çelik", type: "Bitewing", date: "26 Ekim" },
];

// ── Monthly Clinic Summary ───────────────────────────────────
export const monthlyData: MonthlyData[] = [
  { month: "Oca", randevu: 180, tedavi: 140, yeniHasta: 30 },
  { month: "Şub", randevu: 195, tedavi: 150, yeniHasta: 35 },
  { month: "Mar", randevu: 210, tedavi: 160, yeniHasta: 38 },
  { month: "Nis", randevu: 200, tedavi: 155, yeniHasta: 32 },
  { month: "May", randevu: 220, tedavi: 170, yeniHasta: 40 },
  { month: "Haz", randevu: 215, tedavi: 165, yeniHasta: 36 },
  { month: "Tem", randevu: 190, tedavi: 145, yeniHasta: 28 },
  { month: "Ağu", randevu: 205, tedavi: 158, yeniHasta: 33 },
  { month: "Eyl", randevu: 225, tedavi: 175, yeniHasta: 42 },
  { month: "Eki", randevu: 236, tedavi: 182, yeniHasta: 46 },
];

// ── Treatment Distribution ───────────────────────────────────
export const treatmentDistribution: TreatmentDistribution[] = [
  { name: "Dolgu", value: 58, percentage: 32 },
  { name: "Kanal Tedavisi", value: 44, percentage: 24 },
  { name: "Diş Çekimi", value: 33, percentage: 18 },
  { name: "Protez", value: 25, percentage: 14 },
  { name: "Diğer", value: 22, percentage: 12 },
];

// ── Treatment Records ────────────────────────────────────────
export const treatmentRecords: TreatmentRecord[] = [
  { id: "1", date: "12.09.2026", toothNo: 36, treatment: "Kanal Tedavisi", dentist: "Dr. Selin Yılmaz", total: 4500, currency: "TRY" },
  { id: "2", date: "26.08.2026", toothNo: 16, treatment: "Dolgu", dentist: "Dr. Selin Yılmaz", total: 1200, currency: "TRY" },
  { id: "3", date: "14.08.2026", toothNo: 25, treatment: "İmplant", dentist: "Dr. Selin Yılmaz", total: 18000, currency: "TRY" },
];

// ── Treatment Prices ─────────────────────────────────────────
export const treatmentPrices: TreatmentPrice[] = [
  { name: "Diş Çekimi", price: 230, currency: "TRY" },
  { name: "Komplikasyonlu Diş Çekimi", price: 395, currency: "TRY" },
  { name: "Gömülü Diş Operasyonu", price: 740, currency: "TRY" },
  { name: "Gömülü Diş Operasyonnu (Kemik Retansesyonlu)", price: 1120, currency: "TRY" },
];

// ── Notes ────────────────────────────────────────────────────
export const patientNotes: Note[] = [
  { id: "1", date: "09.09.2026", content: "5 üye kaplama toplam 40.000TL 5000TL" },
  { id: "2", date: "06.11.2025", content: "11 NOLU DİŞ KANALA GİDEBİLİR 24.10.25" },
  { id: "3", date: "07.04.2021", content: "11/21 black 5 dolgu" },
];

// ── Medicines ────────────────────────────────────────────────
export const medicines: string[] = [
  "Advil Liquigel 200 mg 20 kapsül",
  "Atofel 5 gr jel",
  "Aklovir %5 Krem 10 gr.",
  "Aksef 500 mg 14 tb.",
  "Aksef 500 mg 20 tb.",
  "Aksef 750 mg İm enj. toz içeren 1 flakon",
  "Allerset 10 mg film kaplı tablet (20 tablet)",
  "Amoksina 1000 mg 14 tablet",
  "Augmentin BID 1000 mg 14 tablet",
  "Cataflam 50 mg 20 draje",
  "Dikloron 75 mg 2 ml 3 ampül",
  "Dolorex 400 mg 20 tablet",
  "Flagyl 500 mg 20 film tablet",
  "İbufen 400 mg 30 tablet",
  "Majezik 100 mg 30 film tablet",
  "Metpamid 10 mg 30 tablet",
  "Nurofen 400 mg 20 kapsül",
  "Oki 100 mg granül",
  "Parol 500 mg 20 tablet",
  "Voltaren 75 mg 3 ml 5 ampül",
];
