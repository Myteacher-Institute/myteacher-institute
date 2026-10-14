"use client";

import React from "react";
import Image from "next/image";
import { FiX, FiClock, FiCheckCircle, FiAlertTriangle, FiMessageCircle, FiDollarSign as DollarSign } from "react-icons/fi";
import { StudentMentorship } from "@/services/mentor.service";

interface MentorshipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorship: StudentMentorship | null;
  isDark: boolean;
}

export const MentorshipDetailsModal: React.FC<MentorshipDetailsModalProps> = ({
  isOpen,
  onClose,
  mentorship,
  isDark,
}) => {
  if (!isOpen || !mentorship) return null;

  const isEnded = mentorship.status === 'ended';

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (!mentorship.programEndDate) return null;
    const msLeft = new Date(mentorship.programEndDate).getTime() - Date.now();
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Mentorship Details
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mentor Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              {mentorship.mentor.profilePicture ? (
                <Image
                  width={64}
                  height={64}
                  alt={mentorship.mentor.name}
                  src={mentorship.mentor.profilePicture}
                  className={`w-16 h-16 rounded-full object-cover border-2 ${isEnded ? 'border-gray-300 grayscale' : 'border-blue-50'}`}
                />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${isEnded ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-[#0F1C2E]'}`}>
                  {mentorship.mentor.name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mentorship.mentor.name}
              </h3>
              <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                {mentorship.mentor.specialization}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${isEnded ? (isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500 border border-gray-200') : (isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700 border border-green-200')}`}>
            {isEnded ? (
              <>
                <FiCheckCircle size={18} />
                <span className="font-semibold">Program Ended</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                <span className="font-semibold">Active Program</span>
              </>
            )}
          </div>

          {/* Program Details */}
          <div className={`rounded-xl p-4 space-y-3 ${isDark ? 'bg-slate-700/60' : 'bg-blue-50'}`}>
            <h4 className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Program Information</h4>
            
            {mentorship.skillCategory && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>Focus Area:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorship.skillCategory}</span>
              </div>
            )}
            
            {mentorship.mentorshipType && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>Type:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorship.mentorshipType}</span>
              </div>
            )}
            
            {mentorship.availableTime && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>Available Time:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorship.availableTime}</span>
              </div>
            )}
            
            {mentorship.programDuration && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>Duration:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorship.programDuration}</span>
              </div>
            )}
            
            {mentorship.programEndDate && (
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>End Date:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(mentorship.programEndDate)}</span>
              </div>
            )}
          </div>

          {/* Expiry Warning */}
          {!isEnded && daysRemaining !== null && daysRemaining > 0 && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 ${daysRemaining <= 7 ? (isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700 border border-amber-200') : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-50 text-gray-500 border border-gray-100')}`}>
              <FiAlertTriangle size={18} />
              <span className="font-semibold">
                {daysRemaining <= 1 ? 'Program expires today' : `Program expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`}
              </span>
            </div>
          )}

          {/* Mentor Bio */}
          {mentorship.mentor.mentorshipBio && (
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>About Mentor</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                {mentorship.mentor.mentorshipBio}
              </p>
            </div>
          )}

          {/* Payment Info */}
          {mentorship.amountPaid && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              <DollarSign size={20} />
              <div>
                <div className="font-semibold">Amount Paid</div>
                <div className="text-lg font-bold">₦{mentorship.amountPaid.toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* WhatsApp Info */}
          {mentorship.mentor.whatsappNumber && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              <FiMessageCircle size={20} />
              <div>
                <div className="font-semibold">WhatsApp Contact</div>
                <div className="text-sm">{mentorship.mentor.whatsappNumber}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};