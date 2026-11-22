"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";
import { recentImages } from "@/lib/mock-data";
import { useModal } from "@/components/modals/ModalContext";

const imageSrcMap: Record<string, string> = {
  "1": "/images/figma/xray1.png",
  "2": "/images/figma/xray2.png",
  "3": "/images/figma/xray3.png",
  "4": "/images/figma/xray4.png",
};

export default function RecentImages() {
  const { openLightbox } = useModal();

  return (
    <div
      className="rounded-[20px] p-6 shadow-xs bg-[#FBFAF7] border border-[#E6E1D8] dark:bg-[#15221B] dark:border-[#243B2F]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl md:text-[22px] font-normal tracking-tight font-serif text-[#1C211E] dark:text-[#ECF3EE]"
        >
          Son Görüntüler
        </h2>
        <Link
          href="/goruntuler"
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-xs cursor-pointer bg-[#FBFAF7] border border-[#E6E1D8] text-[#1C211E] hover:bg-[#EEEBE4] dark:bg-[#1A2B21] dark:border-[#243B2F] dark:text-[#ECF3EE] dark:hover:bg-[#243B2F]"
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#5F665F] dark:text-[#A2B5A8]" />
        </Link>
      </div>

      {/* Thumbnails Grid (3 on top row, 1 on bottom as in Figma screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {recentImages.map((img) => {
          const src = imageSrcMap[img.id] || "/images/figma/xray1.png";

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
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] shadow-2xs transition-transform duration-200 bg-[#121815] border border-[rgba(230,225,216,0.7)] dark:border-[#243B2F]"
              >
                <Image
                  src={src}
                  alt={`${img.patientName} - ${img.type}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Maximize Icon */}
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 backdrop-blur-xs text-white/80 group-hover:text-white group-hover:bg-[#1F3327] dark:group-hover:bg-[#2D4C3C] transition-all shadow-xs">
                  <Maximize2 className="h-3 w-3" />
                </div>
              </div>

              {/* Patient Info */}
              <div className="mt-2.5">
                <p
                  className="text-xs font-bold truncate transition-colors group-hover:text-[#2F5A3D] dark:group-hover:text-[#4ADE80] text-[#1C211E] dark:text-[#ECF3EE]"
                >
                  {img.patientName}
                </p>
                <p
                  className="text-[11px] font-medium truncate mt-0.5 text-[#5F665F] dark:text-[#A2B5A8]"
                >
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
