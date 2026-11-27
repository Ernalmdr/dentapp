"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({
  title,
  description,
  action,
  children,
  className,
}: SettingsCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E6E1D8] dark:border-[#243B2F] bg-[#FBFAF7] dark:bg-[#15221B] p-5 sm:p-6 shadow-xs",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E6E1D8] dark:border-[#243B2F]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#1C211E] dark:text-[#ECF3EE]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8] mt-0.5">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export function SettingsToggle({
  checked,
  onChange,
  ariaLabel,
  disabled,
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F3327]/30 disabled:opacity-50",
        checked
          ? "bg-[#1F3327] dark:bg-[#3F8F55]"
          : "bg-[#D5D0C5] dark:bg-[#2A3F33]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-200",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

interface SettingsToggleRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  noBorder?: boolean;
}

export function SettingsToggleRow({
  title,
  description,
  checked,
  onChange,
  noBorder,
}: SettingsToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3.5",
        !noBorder && "border-b border-[#ECE8E1] dark:border-[#243B2F] last:border-b-0"
      )}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#1C211E] dark:text-[#ECF3EE]">
          {title}
        </p>
        {description && (
          <p className="text-xs text-[#5F665F] dark:text-[#A2B5A8] mt-0.5">
            {description}
          </p>
        )}
      </div>
      <SettingsToggle checked={checked} onChange={onChange} ariaLabel={title} />
    </div>
  );
}

interface SettingsFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsField({ label, children, className }: SettingsFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium text-[#3F4540] dark:text-[#C5D4CB]">
        {label}
      </label>
      {children}
    </div>
  );
}

export const settingsInputClass =
  "w-full h-10 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 text-xs text-[#1C211E] dark:text-[#ECF3EE] placeholder:text-[#8A8F89] outline-none focus:border-[#1F3327] dark:focus:border-[#3F8F55] focus:ring-1 focus:ring-[#1F3327]/20 transition-colors";

export const settingsSelectClass =
  "w-full h-10 rounded-xl border border-[#E6E1D8] dark:border-[#243B2F] bg-white dark:bg-[#1A2C23] px-3 text-xs text-[#1C211E] dark:text-[#ECF3EE] outline-none focus:border-[#1F3327] dark:focus:border-[#3F8F55] focus:ring-1 focus:ring-[#1F3327]/20 transition-colors cursor-pointer";
