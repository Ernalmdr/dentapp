"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs bg-[#FBFAF7] border border-[#E6E1D8] text-[#3F4540] hover:bg-[#EEEBE4] hover:text-[#1C211E] dark:bg-[#16221B] dark:border-[#263D30] dark:text-[#A2B5A8] dark:hover:bg-[#1E3026] dark:hover:text-[#ECF3EE] active:scale-95"
      title={isDark ? "Aydınlık Temaya Geç" : "Koyu Temaya Geç"}
      aria-label="Temayı Değiştir"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#E5B374] transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#2F5A3D] transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
