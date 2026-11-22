import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  "Tamamlandı": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
  },
  "Devam Ediyor": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    border: "border-blue-200/80 dark:border-blue-800/50",
  },
  "Bekliyor": {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200/80 dark:border-amber-800/50",
  },
  "Aktif Tedavi": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
  },
  "Takip": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
    border: "border-sky-200/80 dark:border-sky-800/50",
  },
  "İptal": {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    border: "border-rose-200/80 dark:border-rose-800/50",
  },
  "Arşiv": {
    bg: "bg-stone-50 dark:bg-stone-900/40",
    text: "text-stone-600 dark:text-stone-400",
    dot: "bg-stone-400",
    border: "border-stone-200 dark:border-stone-800",
  },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["Arşiv"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold border shadow-2xs",
        config.bg,
        config.text,
        config.border,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {status}
    </span>
  );
}
