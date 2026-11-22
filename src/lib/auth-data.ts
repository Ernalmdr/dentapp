export interface AuthUser {
  id: string;
  name: string;
  title: string;
  role: string;
  specialty?: string;
  email: string;
  phone?: string;
  avatarInitials: string;
  clinicName: string;
}

export const defaultDoctors: AuthUser[] = [
  {
    id: "dr_selin",
    name: "Dr. Selin Yılmaz",
    title: "Diş Hekimi",
    role: "Klinik Sahibi & Başhekim",
    specialty: "Estetik Diş Hekimliği & İmplantoloji",
    email: "selin.yilmaz@dentasphere.com",
    phone: "+90 (532) 412 88 90",
    avatarInitials: "SY",
    clinicName: "DentaSphere Ağız ve Diş Sağlığı Polikliniği",
  },
  {
    id: "dr_mahir",
    name: "Dr. Mahir Koç",
    title: "Uzm. Dt. Ortodontist",
    role: "Ortodonti Uzmanı",
    specialty: "Şeffaf Plak & Tel Tedavisi",
    email: "mahir.koc@dentasphere.com",
    phone: "+90 (542) 221 45 10",
    avatarInitials: "MK",
    clinicName: "DentaSphere Ağız ve Diş Sağlığı Polikliniği",
  },
  {
    id: "dr_ece",
    name: "Dr. Ece Kaya",
    title: "Pedodontist",
    role: "Çocuk Diş Hekimi",
    specialty: "Pedodonti & Koruyucu Hekimlik",
    email: "ece.kaya@dentasphere.com",
    phone: "+90 (505) 991 33 20",
    avatarInitials: "EK",
    clinicName: "DentaSphere Ağız ve Diş Sağlığı Polikliniği",
  },
  {
    id: "dr_ahmet",
    name: "Dr. Ahmet Kurt",
    title: "Çene Cerrahı",
    role: "Ağız, Diş ve Çene Cerrahisi Uzmanı",
    specialty: "Gömülü Diş & Çene Cerrahisi",
    email: "ahmet.kurt@dentasphere.com",
    phone: "+90 (533) 110 90 40",
    avatarInitials: "AK",
    clinicName: "DentaSphere Ağız ve Diş Sağlığı Polikliniği",
  },
];

const STORAGE_KEY = "dentapp_current_user";
const REGISTERED_USERS_KEY = "dentapp_registered_users";

export function getInitials(name: string): string {
  if (!name) return "DR";
  const parts = name.replace(/^((Dr|Dt|Uzm\.?\s*Dt|Prof|Doç)\.?\s*)/i, "").trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStoredUser(): AuthUser {
  if (typeof window === "undefined") return defaultDoctors[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDoctors[0]));
      return defaultDoctors[0];
    }
    return JSON.parse(raw);
  } catch {
    return defaultDoctors[0];
  }
}

export function saveStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("dentapp_auth_updated"));
  } catch (e) {
    console.error("Auth save error:", e);
  }
}

export function getRegisteredUsers(): AuthUser[] {
  if (typeof window === "undefined") return defaultDoctors;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultDoctors));
      return defaultDoctors;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : defaultDoctors;
  } catch {
    return defaultDoctors;
  }
}

export function saveRegisteredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    const current = getRegisteredUsers();
    const exists = current.find((u) => u.id === user.id || u.email === user.email);
    const updated = exists
      ? current.map((u) => (u.id === user.id || u.email === user.email ? user : u))
      : [user, ...current];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Registered user save error:", e);
  }
}
