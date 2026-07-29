"use client";

import { FiX, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";

type Variant = "confirm" | "danger";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmActionModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "confirm",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  const iconBg = isDark ? (isDanger ? "bg-red-900/30" : "bg-green-900/30") : (isDanger ? "bg-red-50" : "bg-green-50");
  const iconColor = isDanger ? "text-red-500" : "text-green-600";
  const confirmBg = isDanger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-green-600 hover:bg-green-700";

  const Icon = isDanger ? FiAlertTriangle : FiCheckCircle;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className={isDark ? "bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden" : "bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={isDark ? "flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-700" : "flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100"}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className={iconColor} />
            </div>
            <h2 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-800"}>{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className={isDark ? "text-sm text-slate-300 leading-relaxed" : "text-sm text-slate-600 leading-relaxed"}>{message}</p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={isDark ? "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 cursor-pointer" : "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white ${confirmBg} transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
