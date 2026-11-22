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
    <div className="relative mb-6 pb-2">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="relative mb-2 flex items-center gap-2 text-sm" style={{ color: "#5F665F" }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-60">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:underline transition-colors font-medium"
                  style={{ color: "#2F5A3D" }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="font-semibold" style={{ color: "#1C211E" }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Title & Description */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-[44px] lg:text-[48px] font-normal tracking-tight font-serif leading-[1.1]" style={{ color: "#1C211E" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[14px] leading-relaxed max-w-2xl font-normal" style={{ color: "#5F665F" }}>
              {description}
            </p>
          )}
        </div>

        {actions && <div className="relative z-10 flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
