import React, { ReactNode } from "react";
import { FileX, ClipboardList, Wallet, Receipt, Pill } from "lucide-react";

export type EmptyStateIconType =
  | "table"
  | "image"
  | "clipboard"
  | "wallet"
  | "receipt"
  | "pill"
  | "default";

interface EmptyStateProps {
  message?: string;
  icon?: EmptyStateIconType;
  iconNode?: ReactNode;
  subMessage?: ReactNode;
  className?: string;
}

export default function EmptyState({
  message = "Eşleşen Kayıt Bulunmadı",
  icon = "default",
  iconNode,
  subMessage,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (iconNode) return iconNode;

    switch (icon) {
      case "image":
        return (
          <div className="mb-4 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );

      case "clipboard":
        return (
          <div className="mb-4 flex items-center justify-center">
            <div className="relative rounded-2xl border-2 border-gray-300/80 p-5 bg-white shadow-sm">
              <svg
                className="h-12 w-12 text-gray-400"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Clipboard board */}
                <rect x="8" y="10" width="32" height="34" rx="4" strokeWidth="2.5" />
                {/* Clip */}
                <path d="M18 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" strokeWidth="2.5" />
                {/* Tooth outline inside */}
                <path
                  d="M20 23c-2.5 0-4 2-4 4.5 0 2 1 3.5 1.5 5.5.5 1.8 1 4 2 4.5 1 .5 1.5 0 2-2 .5-1.5 1.5-1.5 2.5 0 .5 2 1 2.5 2 2 1-.5 1.5-2.7 2-4.5.5-2 1.5-3.5 1.5-5.5 0-2.5-1.5-4.5-4-4.5-1.5 0-2.5.8-3 1.5-.5-.7-1.5-1.5-3-1.5z"
                  strokeWidth="1.75"
                />
              </svg>
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="mb-4 flex items-center justify-center">
            <div className="relative rounded-2xl border-2 border-gray-300/80 p-5 bg-white shadow-sm">
              <svg
                className="h-12 w-12 text-gray-400"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Wallet body */}
                <rect x="6" y="12" width="36" height="26" rx="5" strokeWidth="2.5" />
                {/* Wallet flap */}
                <path d="M6 18h36" strokeWidth="2" />
                {/* Clasp / coin pocket */}
                <rect x="30" y="21" width="10" height="8" rx="2" strokeWidth="2" />
                <circle cx="34" cy="25" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        );

      case "receipt":
        return (
          <div className="mb-4 flex items-center justify-center">
            <div className="relative rounded-2xl border-2 border-gray-300/80 p-5 bg-white shadow-sm">
              <svg
                className="h-12 w-12 text-gray-400"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M10 8a2 2 0 0 1 2-2h20l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8z"
                  strokeWidth="2.5"
                />
                <path d="M30 6v8h8" strokeWidth="2" />
                <line x1="18" y1="22" x2="30" y2="22" strokeWidth="2" />
                <line x1="18" y1="28" x2="26" y2="28" strokeWidth="2" />
                <line x1="18" y1="34" x2="24" y2="34" strokeWidth="2" />
              </svg>
            </div>
          </div>
        );

      case "pill":
        return (
          <div className="mb-4 flex items-center justify-center">
            <div className="relative p-2">
              <svg
                className="h-16 w-16 text-[#4A7C68]/60 transform -rotate-45"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Pill capsule */}
                <rect x="14" y="6" width="20" height="36" rx="10" />
                <line x1="14" y1="24" x2="34" y2="24" strokeWidth="2" />
              </svg>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="mb-4">
            <ClipboardList className="h-12 w-12 text-gray-300" />
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <FileX className="h-12 w-12 text-gray-300" />
          </div>
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center text-gray-400 ${
        className || ""
      }`}
    >
      {renderIcon()}
      <p className="text-sm font-medium text-gray-500">{message}</p>
      {subMessage && (
        <div className="mt-2 text-xs text-gray-400 max-w-md">{subMessage}</div>
      )}
    </div>
  );
}
