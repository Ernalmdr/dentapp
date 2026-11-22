"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, Sparkles } from "lucide-react";
import { recentImages } from "@/lib/mock-data";
import { useModal } from "@/components/modals/ModalContext";

const imageSrcMap: Record<string, string> = {
  "1": "/images/dashboard/xray-1.png",
  "2": "/images/dashboard/xray-2.png",
  "3": "/images/dashboard/xray-3.png",
  "4": "/images/dashboard/xray-4.png",
};

export default function RecentImages() {
  const { openLightbox } = useModal();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-stone-200/60 dark:border-[#1E332A] dark:bg-[#122019]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-[#F0F5F2] tracking-tight">
            Son Görüntüler
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-[#182C22] px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-[#7CC9A6]">
            <Sparkles className="h-3 w-3" />
            AI Destekli
          </span>
        </div>
        <Link
          href="/goruntuler"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-[#233C30] px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-[#90A199] hover:bg-stone-50 dark:hover:bg-[#1A2D23] hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          Tümünü Gör
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recentImages.map((img) => {
          const src = imageSrcMap[img.id] || "/images/dashboard/xray-1.png";

          return (
            <div
              key={img.id}
              onClick={() =>
                openLightbox({
                  imageSrc: src,
                  title: `${img.patientName} - ${img.type}`,
                  patientName: img.patientName,
                  date: img.date,
                  type: img.type,
                })
              }
              className="flex flex-col group cursor-pointer"
            >
              {/* Image Container with Expand Icon */}
              <div className="relative aspect-[15/10] w-full overflow-hidden rounded-xl bg-black border border-stone-900/40 shadow-xs">
                <Image
                  src={src}
                  alt={`${img.patientName} - ${img.type}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Maximize Icon */}
                <div className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 backdrop-blur-xs text-white/80 group-hover:text-white group-hover:bg-emerald-600 transition-all shadow-sm">
                  <Maximize2 className="h-3 w-3" />
                </div>
              </div>

              {/* Patient Info */}
              <div className="mt-2">
                <p className="text-xs font-bold text-stone-900 dark:text-[#F0F5F2] truncate group-hover:text-emerald-700 dark:group-hover:text-[#7CC9A6] transition-colors">
                  {img.patientName}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-[#90A199] font-medium truncate">
                  {img.type} • {img.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
