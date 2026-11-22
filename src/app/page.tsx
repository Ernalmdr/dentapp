"use client";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import AppointmentsList from "@/components/dashboard/AppointmentsList";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentImages from "@/components/dashboard/RecentImages";
import MonthlyClinicChart from "@/components/dashboard/MonthlyClinicChart";
import TreatmentDistributionChart from "@/components/dashboard/TreatmentDistributionChart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* 1. Welcome Section */}
      <WelcomeBanner />

      {/* 2. Stat Cards Row */}
      <StatCards />

      {/* 3. Middle Section: Appointments (Left) + Quick Actions & Recent Images (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Bugünkü Randevular (7 cols) */}
        <div className="lg:col-span-7">
          <AppointmentsList />
        </div>

        {/* Right Column: Hızlı İşlemler & Son Görüntüler (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          <QuickActions />
          <RecentImages />
        </div>
      </div>

      {/* 4. Bottom Row: Monthly Summary (Left 7 cols) + Treatment Distribution (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Aylık Klinik Özeti (7 cols) */}
        <div className="lg:col-span-7">
          <MonthlyClinicChart />
        </div>

        {/* Right Column: Tedavi Dağılımı (5 cols) */}
        <div className="lg:col-span-5">
          <TreatmentDistributionChart />
        </div>
      </div>
    </div>
  );
}
