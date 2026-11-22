import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  "Tamamlandı": {
    bg: "bg-[#ECEAE5]",
    text: "text-[#4F544F]",
    dot: "bg-[#7C817C]",
    border: "border-[#7C817C]/40",
  },
  "Devam Ediyor": {
    bg: "bg-[#E3ECF7]",
    text: "text-[#2C5282]",
    dot: "bg-[#4A78B5]",
    border: "border-[#4A78B5]/40",
  },
  "Bekliyor": {
    bg: "bg-[#F3EADB]",
    text: "text-[#7A5320]",
    dot: "bg-[#B07D47]",
    border: "border-[#B07D47]/40",
  },
  "Aktif Tedavi": {
    bg: "bg-[#E2EEDD]",
    text: "text-[#2C6A3B]",
    dot: "bg-[#3F8F55]",
    border: "border-[#3F8F55]/40",
  },
  "Aktif": {
    bg: "bg-[#E2EEDD]",
    text: "text-[#2C6A3B]",
    dot: "bg-[#3F8F55]",
    border: "border-[#3F8F55]/40",
  },
  "Takip": {
    bg: "bg-[#E3ECF7]",
    text: "text-[#2C5282]",
    dot: "bg-[#4A78B5]",
    border: "border-[#4A78B5]/40",
  },
  "İptal": {
    bg: "bg-[#FBE9E7]",
    text: "text-[#B3261E]",
    dot: "bg-[#B3261E]",
    border: "border-[#B3261E]/40",
  },
  "Sil": {
    bg: "bg-[#FBE9E7]",
    text: "text-[#B3261E]",
    dot: "bg-[#B3261E]",
    border: "border-[#B3261E]/40",
  },
  "Arşiv": {
    bg: "bg-[#ECEAE5]",
    text: "text-[#4F544F]",
    dot: "bg-[#7C817C]",
    border: "border-[#7C817C]/40",
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
