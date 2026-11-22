import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ModalProvider } from "@/components/modals/ModalContext";
import { AppointmentModal } from "@/components/modals/AppointmentModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { ImageLightboxModal } from "@/components/modals/ImageLightboxModal";
import { ToastContainer } from "@/components/modals/ToastContainer";
import { SmsModal } from "@/components/modals/SmsModal";
import { AnamnesisModal } from "@/components/modals/AnamnesisModal";
import { MedicalReportModal } from "@/components/modals/MedicalReportModal";
import { PrintPreviewModal } from "@/components/modals/PrintPreviewModal";
import { StockOrderModal } from "@/components/modals/StockOrderModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DentaSphere — Klinik Yönetim Platformu",
  description: "Diş kliniği yönetim sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-screen transition-colors duration-150 font-sans">
        <ThemeProvider>
          <ModalProvider>
            {/* AppShell handles auth pages vs dashboard layout */}
            <AppShell>{children}</AppShell>

            {/* Global Modals & Notifications */}
            <AppointmentModal />
            <CommandPalette />
            <ImageLightboxModal />
            <SmsModal />
            <AnamnesisModal />
            <MedicalReportModal />
            <PrintPreviewModal />
            <StockOrderModal />
            <ToastContainer />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
