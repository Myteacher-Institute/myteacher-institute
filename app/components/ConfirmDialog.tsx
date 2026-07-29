"use client";

import { useState } from 'react';
import { useThemeStore } from "@/store/theme.store";

interface ConfirmDialogProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialogProps | null>(null);

  const confirm = (props: ConfirmDialogProps) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        ...props,
        onConfirm: () => {
          props.onConfirm();
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          props.onCancel?.();
          setDialog(null);
          resolve(false);
        },
      });
    });
  };

  const ConfirmDialogComponent = dialog ? (
    <ConfirmDialog
      title={dialog.title}
      message={dialog.message}
      onConfirm={dialog.onConfirm}
      onCancel={dialog.onCancel}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
    />
  ) : null;

  return { confirm, ConfirmDialogComponent };
};

const ConfirmDialog = ({
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={isDark ? "bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200" : "bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200"}>
        <h3 className={isDark ? "text-lg font-semibold text-white mb-2" : "text-lg font-semibold text-gray-900 mb-2"}>{title}</h3>
        <p className={isDark ? "text-slate-300 mb-6" : "text-gray-600 mb-6"}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={isDark ? "px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors" : "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
