"use client";

import { FiLoader } from 'react-icons/fi';
import { useThemeStore } from "@/store/theme.store";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
  deletePassword: string;
  setDeletePassword: (password: string) => void;
  isDeleting: boolean;
  deletionErrors: string[];
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  deletePassword,
  setDeletePassword,
  isDeleting,
  deletionErrors,
}: DeleteModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className={isDark ? "bg-slate-800 rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-xl" : "bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-xl"}>
        <h3 className={isDark ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-[#111827] mb-2"}>Delete Course</h3>
        <p className={isDark ? "text-sm text-slate-300 mb-6" : "text-sm text-slate-600 mb-6"}>
          Are you sure you want to delete <span className={isDark ? "font-semibold text-white" : "font-semibold text-[#111827]"}>{courseName}</span>? This action cannot be undone.
        </p>
        
        <div className="mb-6">
          <label className={isDark ? "block text-sm font-medium text-white mb-2" : "block text-sm font-medium text-[#111827] mb-2"}>Enter your password to confirm</label>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Password"
            className={isDark ? "w-full px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-slate-700 text-white" : "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"}
          />
        </div>

        {deletionErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm font-medium text-red-800 mb-2">Deletion errors:</p>
            <ul className="text-xs text-red-600 space-y-1">
              {deletionErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={isDark ? "flex-1 px-4 py-3 rounded-xl border border-slate-700 text-white font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" : "flex-1 px-4 py-3 rounded-xl border border-slate-200 text-[#111827] font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting || !deletePassword}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <FiLoader size={16} className="animate-spin" /> Deleting...
              </>
            ) : (
              'Delete Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
