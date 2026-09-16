"use client";

import React from "react";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";

interface DeleteMentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteMentorshipModal: React.FC<DeleteMentorshipModalProps> = ({
  isOpen,
  onClose,
  mentorName,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiAlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                End Mentorship
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              Are you sure you want to end your mentorship with <strong>{mentorName}</strong>?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              You will lose access to all mentorship benefits and ongoing support.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>What happens when you end a mentorship:</strong>
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li>Access to mentor chat will be removed</li>
              <li>Ongoing sessions will be cancelled</li>
              <li>You can always request a new mentorship later</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ending...
              </>
            ) : (
              <>
                <FiTrash2 size={18} />
                End Mentorship
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};