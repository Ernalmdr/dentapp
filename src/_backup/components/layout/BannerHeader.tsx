"use client";

import { ReactNode } from "react";

interface BannerHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
}

export default function BannerHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: BannerHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#F5F0EB] to-[#E8E0D6] px-8 py-8 transition-colors dark:from-[#14231C] dark:to-[#0F1713] dark:border dark:border-[#1E332A]">
      {/* Background Tooth Image */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 dark:opacity-10 pointer-events-none">
        <svg
          viewBox="0 0 200 250"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 10 C60 10 30 50 30 90 C30 120 45 140 55 170 C60 185 65 210 70 230 C75 240 80 240 85 230 C90 215 95 200 100 200 C105 200 110 215 115 230 C120 240 125 240 130 230 C135 210 140 185 145 170 C155 140 170 120 170 90 C170 50 140 10 100 10Z"
            fill="#2D4A3E"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="relative mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-[#90A199]">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-[#4A7C68] hover:underline dark:text-[#7CC9A6]"
                >
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Title & Description */}
      <div className="relative flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight dark:text-[#F0F5F2]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-lg text-sm text-gray-500 dark:text-[#90A199]">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
