"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LightboxData {
  isOpen: boolean;
  imageSrc: string;
  title: string;
  patientName: string;
  date: string;
  type: string;
}

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

export interface PrintDocumentData {
  isOpen: boolean;
  type: "prescription" | "invoice" | "receipt" | "patient_card" | "consent";
  title: string;
  patientName: string;
  date: string;
  doctorName?: string;
  items?: Array<{ name: string; detail?: string; price?: number | string }>;
  total?: number | string;
  extraInfo?: Record<string, string>;
}

export interface SmsData {
  isOpen: boolean;
  patientName: string;
  phone: string;
}

export interface AnamnesisData {
  isOpen: boolean;
  patientName: string;
  patientId: string;
}

export interface ReportData {
  isOpen: boolean;
  patientName: string;
  doctorName: string;
  tcNo?: string;
  protocolNo?: string;
}

export interface StockOrderData {
  isOpen: boolean;
  itemName: string;
  currentQuantity: number;
  unit: string;
}

interface ModalContextType {
  // Appointment Modal
  isAppointmentModalOpen: boolean;
  appointmentPatientName: string | null;
  openAppointmentModal: (patientName?: string) => void;
  closeAppointmentModal: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Notifications
  isNotificationsOpen: boolean;
  toggleNotifications: () => void;
  closeNotifications: () => void;

  // Shortcuts App Grid
  isShortcutsOpen: boolean;
  toggleShortcuts: () => void;
  closeShortcuts: () => void;

  // Lightbox
  lightboxData: LightboxData;
  openLightbox: (data: Omit<LightboxData, "isOpen">) => void;
  closeLightbox: () => void;

  // SMS Modal
  smsData: SmsData;
  openSmsModal: (patientName: string, phone: string) => void;
  closeSmsModal: () => void;

  // Anamnesis Modal
  anamnesisData: AnamnesisData;
  openAnamnesisModal: (patientName: string, patientId?: string) => void;
  closeAnamnesisModal: () => void;

  // Medical Report Modal
  reportData: ReportData;
  openReportModal: (patientName: string, doctorName?: string, tcNo?: string) => void;
  closeReportModal: () => void;

  // Print Preview Modal
  printData: PrintDocumentData;
  openPrintPreview: (data: Omit<PrintDocumentData, "isOpen">) => void;
  closePrintPreview: () => void;

  // Stock Order Modal
  stockOrderData: StockOrderData;
  openStockOrderModal: (itemName: string, currentQuantity: number, unit: string) => void;
  closeStockOrderModal: () => void;

  // Toast
  toasts: ToastData[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentPatientName, setAppointmentPatientName] = useState<string | null>(null);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const [lightboxData, setLightboxData] = useState<LightboxData>({
    isOpen: false,
    imageSrc: "",
    title: "",
    patientName: "",
    date: "",
    type: "",
  });

  const [smsData, setSmsData] = useState<SmsData>({
    isOpen: false,
    patientName: "",
    phone: "",
  });

  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData>({
    isOpen: false,
    patientName: "",
    patientId: "2",
  });

  const [reportData, setReportData] = useState<ReportData>({
    isOpen: false,
    patientName: "",
    doctorName: "Dr. Selin Yılmaz",
  });

  const [printData, setPrintData] = useState<PrintDocumentData>({
    isOpen: false,
    type: "prescription",
    title: "",
    patientName: "",
    date: "",
  });

  const [stockOrderData, setStockOrderData] = useState<StockOrderData>({
    isOpen: false,
    itemName: "",
    currentQuantity: 0,
    unit: "",
  });

  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setIsAppointmentModalOpen(false);
        setIsNotificationsOpen(false);
        setIsShortcutsOpen(false);
        setLightboxData((prev) => ({ ...prev, isOpen: false }));
        setSmsData((prev) => ({ ...prev, isOpen: false }));
        setAnamnesisData((prev) => ({ ...prev, isOpen: false }));
        setReportData((prev) => ({ ...prev, isOpen: false }));
        setPrintData((prev) => ({ ...prev, isOpen: false }));
        setStockOrderData((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openAppointmentModal = (patientName?: string) => {
    setAppointmentPatientName(patientName || null);
    setIsAppointmentModalOpen(true);
    setIsNotificationsOpen(false);
    setIsShortcutsOpen(false);
  };
  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setAppointmentPatientName(null);
  };

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsShortcutsOpen(false);
  };
  const closeNotifications = () => setIsNotificationsOpen(false);

  const toggleShortcuts = () => {
    setIsShortcutsOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  };
  const closeShortcuts = () => setIsShortcutsOpen(false);

  const openLightbox = (data: Omit<LightboxData, "isOpen">) => {
    setLightboxData({ ...data, isOpen: true });
  };
  const closeLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
  };

  const openSmsModal = (patientName: string, phone: string) => {
    setSmsData({ isOpen: true, patientName, phone });
  };
  const closeSmsModal = () => {
    setSmsData((prev) => ({ ...prev, isOpen: false }));
  };

  const openAnamnesisModal = (patientName: string, patientId?: string) => {
    setAnamnesisData({ isOpen: true, patientName, patientId: patientId || "2" });
  };
  const closeAnamnesisModal = () => {
    setAnamnesisData((prev) => ({ ...prev, isOpen: false }));
  };

  const openReportModal = (patientName: string, doctorName?: string, tcNo?: string) => {
    setReportData({
      isOpen: true,
      patientName,
      doctorName: doctorName || "Dr. Selin Yılmaz",
      tcNo: tcNo || "23456789012",
      protocolNo: `RAP-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };
  const closeReportModal = () => {
    setReportData((prev) => ({ ...prev, isOpen: false }));
  };

  const openPrintPreview = (data: Omit<PrintDocumentData, "isOpen">) => {
    setPrintData({ ...data, isOpen: true });
  };
  const closePrintPreview = () => {
    setPrintData((prev) => ({ ...prev, isOpen: false }));
  };

  const openStockOrderModal = (itemName: string, currentQuantity: number, unit: string) => {
    setStockOrderData({ isOpen: true, itemName, currentQuantity, unit });
  };
  const closeStockOrderModal = () => {
    setStockOrderData((prev) => ({ ...prev, isOpen: false }));
  };

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ModalContext.Provider
      value={{
        isAppointmentModalOpen,
        appointmentPatientName,
        openAppointmentModal,
        closeAppointmentModal,
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        isNotificationsOpen,
        toggleNotifications,
        closeNotifications,
        isShortcutsOpen,
        toggleShortcuts,
        closeShortcuts,
        lightboxData,
        openLightbox,
        closeLightbox,
        smsData,
        openSmsModal,
        closeSmsModal,
        anamnesisData,
        openAnamnesisModal,
        closeAnamnesisModal,
        reportData,
        openReportModal,
        closeReportModal,
        printData,
        openPrintPreview,
        closePrintPreview,
        stockOrderData,
        openStockOrderModal,
        closeStockOrderModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
