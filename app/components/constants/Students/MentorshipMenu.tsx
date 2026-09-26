"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiFlag, FiMessageCircle, FiRefreshCw, FiEye } from "react-icons/fi";
import Link from "next/link";

interface MentorshipMenuProps {
  mentorshipId: string;
  mentorId: string;
  mentorName: string;
  onDelete: (mentorshipId: string) => void;
  onReport: (mentorId: string, mentorName: string) => void;
  whatsappLink?: string;
  chatHref?: string;
  isEnded?: boolean;
  onRenew?: () => void;
  mentorship?: any;
  onViewDetails?: (mentorship: any) => void;
}

export const MentorshipMenu: React.FC<MentorshipMenuProps> = ({
  mentorshipId,
  mentorId,
  mentorName,
  onDelete,
  onReport,
  whatsappLink,
  chatHref,
  isEnded = false,
  onRenew,
  mentorship,
  onViewDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = () => {
    onDelete(mentorshipId);
    setIsOpen(false);
  };

  const handleReport = () => {
    onReport(mentorId, mentorName);
    setIsOpen(false);
  };

  const handleRenew = () => {
    onRenew?.();
    setIsOpen(false);
  };

  const handleViewDetails = () => {
    onViewDetails?.(mentorship);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
        aria-label="More options"
      >
        <FiMoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <div className="py-2">
            {/* View Details option */}
            {mentorship && onViewDetails && (
              <button
                onClick={handleViewDetails}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <FiEye size={18} />
                <div className="flex-1">
                  <div className="font-medium text-sm">View Details</div>
                  <div className="text-xs opacity-75">See full information</div>
                </div>
              </button>
            )}

            {/* Chat option - only for mobile and when not ended */}
            {!isEnded && chatHref && (
              <Link
                href={chatHref}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiMessageCircle size={18} />
                <div className="flex-1">
                  <div className="font-medium text-sm">Chat</div>
                  <div className="text-xs opacity-75">Start conversation</div>
                </div>
              </Link>
            )}

            {/* WhatsApp option - only for mobile and when available */}
            {!isEnded && whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiMessageCircle size={18} />
                <div className="flex-1">
                  <div className="font-medium text-sm">WhatsApp</div>
                  <div className="text-xs opacity-75">Chat on WhatsApp</div>
                </div>
              </a>
            )}

            {/* Renew option - only for ended mentorships */}
            {isEnded && onRenew && (
              <button
                onClick={handleRenew}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
              >
                <FiRefreshCw size={18} />
                <div className="flex-1">
                  <div className="font-medium text-sm">Renew Mentorship</div>
                  <div className="text-xs opacity-75">Extend program</div>
                </div>
              </button>
            )}

            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <FiTrash2 size={18} />
              <div className="flex-1">
                <div className="font-medium text-sm">End Mentorship</div>
                <div className="text-xs opacity-75">Remove this mentorship</div>
              </div>
            </button>

            <button
              onClick={handleReport}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 transition-colors"
            >
              <FiFlag size={18} />
              <div className="flex-1">
                <div className="font-medium text-sm">Report Instructor</div>
                <div className="text-xs opacity-75">Report to admin</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};