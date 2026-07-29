"use client";

import { FiLogOut, FiX } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

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
            <div className={isDark ? "w-9 h-9 bg-red-900/30 rounded-xl flex items-center justify-center" : "w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center"}>
              <FiLogOut size={18} className="text-red-500" />
            </div>
            <h2 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-800"}>Sign Out</h2>
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
          <p className={isDark ? "text-sm text-slate-300 leading-relaxed" : "text-sm text-slate-600 leading-relaxed"}>
            Are you sure you want to sign out? You'll need to log back in to
            access your dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={isDark ? "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 cursor-pointer" : "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"}
          >
           <FiX size={15} />
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </>
            ) : (
              <>
                <FiLogOut size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
