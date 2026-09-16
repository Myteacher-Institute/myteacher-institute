"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiFlag } from "react-icons/fi";

interface MentorshipMenuProps {
  mentorshipId: string;
  mentorId: string;
  mentorName: string;
  onDelete: (mentorshipId: string) => void;
  onReport: (mentorId: string, mentorName: string) => void;
}

export const MentorshipMenu: React.FC<MentorshipMenuProps> = ({
  mentorshipId,
  mentorId,
  mentorName,
  onDelete,
  onReport,
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