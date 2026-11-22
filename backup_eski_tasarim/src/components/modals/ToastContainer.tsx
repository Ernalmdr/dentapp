"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useModal } from "./ModalContext";

export function ToastContainer() {
  const { toasts, removeToast } = useModal();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-[#1B3329] text-white border-emerald-600/40 shadow-emerald-950/20"
              : toast.type === "error"
              ? "bg-red-950 text-red-100 border-red-800 shadow-red-950/20"
              : "bg-stone-900 text-stone-100 border-stone-700 shadow-black/20"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="h-4 w-4 text-[#7CC9A6] shrink-0 mt-0.5" />}
          {toast.type === "error" && <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}

          <div className="flex-1 leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
