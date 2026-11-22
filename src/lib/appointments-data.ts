export interface CalendarAppointment {
  id: string;
  patientName: string;
  dentist: string;
  treatment: string;
  time: string;
  day: string; // "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"
  status: "Bekliyor" | "Devam Ediyor" | "Tamamlandı" | "İptal";
  phone?: string;
  notes?: string;
}

export const initialAppointmentsList: CalendarAppointment[] = [
  {
    id: "apt-1",
    patientName: "Ayşe Demir",
    dentist: "Dr. Selin Yılmaz",
    treatment: "Kontrol & Muayene",
    time: "09:00",
    day: "Per",
    status: "Tamamlandı",
    phone: "+90 532 111 22 33",
    notes: "6 aylık periyodik kontrol tamamlandı.",
  },
  {
    id: "apt-2",
    patientName: "Mehmet Kaya",
    dentist: "Dr. Selin Yılmaz",
    treatment: "Kompozit Dolgu",
    time: "09:45",
    day: "Per",
    status: "Devam Ediyor",
    phone: "+90 533 222 33 44",
    notes: "16 nolu üst molar tek yüzlü dolgu yapılıyor.",
  },
  {
    id: "apt-3",
    patientName: "Zeynep Arslan",
    dentist: "Dr. Selin Yılmaz",
    treatment: "Kanal Tedavisi",
    time: "10:30",
    day: "Per",
    status: "Bekliyor",
    phone: "+90 534 333 44 55",
    notes: "24 nolu premolar kök kanalı pansumanı.",
  },
  {
    id: "apt-4",
    patientName: "Tuğçe Üngör",
    dentist: "Dr. Mahir Açıkkalın",
    treatment: "Ortodonti Seansı",
    time: "13:30",
    day: "Per",
    status: "Bekliyor",
    phone: "+90 505 321 45 67",
    notes: "Braket kontrolü ve ark teli değişimi.",
  },
  {
    id: "apt-5",
    patientName: "Emre Çelik",
    dentist: "Dr. Selin Yılmaz",
    treatment: "İmplant Kontrol",
    time: "15:45",
    day: "Per",
    status: "Bekliyor",
    phone: "+90 535 444 55 66",
    notes: "Osseointegrasyon kontrol filmi.",
  },
  {
    id: "apt-6",
    patientName: "Can Demir",
    dentist: "Dr. Selin Yılmaz",
    treatment: "İmplant Cerrahisi",
    time: "11:15",
    day: "Cum",
    status: "Bekliyor",
    phone: "+90 535 444 55 66",
    notes: "36 nolu bölge cerrahi yerleştirme.",
  },
  {
    id: "apt-7",
    patientName: "Elif Karaca",
    dentist: "Dr. Mahir Açıkkalın",
    treatment: "Zirkonyum Ölçü",
    time: "14:15",
    day: "Sal",
    status: "Bekliyor",
    phone: "+90 536 555 66 77",
    notes: "Hassas silikon ölçü alımı.",
  },
  {
    id: "apt-8",
    patientName: "Burak Şen",
    dentist: "Dr. Selin Yılmaz",
    treatment: "Diş Taşı Temizliği",
    time: "15:00",
    day: "Çar",
    status: "Bekliyor",
    phone: "+90 537 666 77 88",
    notes: "Subgingival küretaj ve polisaj.",
  },
];

export const STORAGE_KEY = "dentapp_calendar_appointments";

export function getStoredAppointments(): CalendarAppointment[] {
  if (typeof window === "undefined") return initialAppointmentsList;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return initialAppointmentsList;
}

export function saveStoredAppointments(list: CalendarAppointment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("dentapp_appointments_updated"));
  } catch {
    // ignore
  }
}
