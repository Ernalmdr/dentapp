// ============================================================
// DentaSphere — Shared Type Definitions
// ============================================================

export interface Patient {
  id: string;
  hsNo: string;
  firstName: string;
  lastName: string;
  gender: "Erkek" | "Kadın";
  age: number;
  birthDate: string;
  tcNo: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: PatientStatus;
  lastTreatment?: string;
  registrationDate: string;
  dentist?: string;
  bloodGroup?: string;
  profession?: string;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  postalCode?: string;
}

export type PatientStatus = "Aktif Tedavi" | "Takip" | "Tamamlandı" | "Arşiv";

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  treatment: string;
  status: AppointmentStatus;
}

export type AppointmentStatus =
  | "Tamamlandı"
  | "Devam Ediyor"
  | "Bekliyor";

export interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: string;
  subtitle?: string;
}

export interface TreatmentRecord {
  id: string;
  date: string;
  toothNo: number;
  treatment: string;
  dentist: string;
  total: number;
  currency: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  toothNo: number;
  treatment: string;
  dentist: string;
  amount: number;
  discountPercent: number;
  discount: number;
  withholdingPercent: number;
  withholding: number;
  vatPercent: number;
  vat: number;
  total: number;
  currency: string;
}

export interface Payment {
  id: string;
  date: string;
  paymentType: string;
  dentist: string;
  amount: number;
  currency: string;
}

export interface PrescriptionItem {
  id: string;
  medicine: string;
  dosage: string;
  usage: string;
  description: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
}

export interface DentalImage {
  id: string;
  patientName: string;
  type: string;
  date: string;
  thumbnail?: string;
}

export interface TreatmentPrice {
  name: string;
  price: number;
  currency: string;
}

export interface MonthlyData {
  month: string;
  randevu: number;
  tedavi: number;
  yeniHasta: number;
}

export interface TreatmentDistribution {
  name: string;
  value: number;
  percentage: number;
}

export interface SidebarItem {
  name: string;
  href: string;
  icon: string;
}
