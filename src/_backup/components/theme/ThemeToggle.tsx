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

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95 dark:border-[#284236] dark:bg-[#16261F] dark:text-[#E2ECE7] dark:hover:bg-[#1E352B] dark:hover:text-white cursor-pointer"
      title={isDark ? "Aydınlık Temaya Geç (Orijinal Tasarım)" : "Koyu Temaya Geç"}
      aria-label="Temayı Değiştir"
    >
      {mounted && isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" />
          <span>Aydınlık Mod</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-[#2D4A3E]" />
          <span>Koyu Mod</span>
        </>
      )}
    </button>
  );
}
