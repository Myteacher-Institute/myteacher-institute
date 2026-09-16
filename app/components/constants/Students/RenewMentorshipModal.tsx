"use client";

import React, { useState } from "react";
import { FiX, FiClock, FiCreditCard } from "react-icons/fi";

interface RenewMentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorship: {
    requestId: string;
    mentor: {
      _id: string;
      name: string;
      mentorshipPrice?: number;
    };
    originalAmount?: number;
    originalDuration?: string;
  };
  onRenew: (duration: string) => Promise<void>;
}

const DURATION_OPTIONS = [
  { value: "1 month", label: "1 Month", discountMultiplier: 1 },
  { value: "3 months", label: "3 Months", discountMultiplier: 1 },
  { value: "6 months", label: "6 Months", discountMultiplier: 1 },
  { value: "1 year", label: "1 Year", discountMultiplier: 1 },
];

export const RenewMentorshipModal: React.FC<RenewMentorshipModalProps> = ({
  isOpen,
  onClose,
  mentorship,
  onRenew,
}) => {
  const [selectedDuration, setSelectedDuration] = useState("1 month");
  const [isRenewing, setIsRenewing] = useState(false);

  if (!isOpen) return null;

  const originalAmount = mentorship.originalAmount || mentorship.mentor.mentorshipPrice || 0;
  const originalDuration = mentorship.originalDuration || '1 month';

  // Calculate monthly rate from original payment
  const getDurationInMonths = (duration: string): number => {
    const lower = duration.toLowerCase();
    if (lower.includes('month')) {
      const months = parseInt(lower) || 1;
      return months;
    } else if (lower.includes('year')) {
      const years = parseInt(lower) || 1;
      return years * 12;
    } else if (lower.includes('week')) {
      const weeks = parseInt(lower) || 1;
      return weeks / 4; // Approximate weeks to months
    }
    return 1; // Default to 1 month
  };

  const originalMonths = getDurationInMonths(originalDuration);
  const monthlyRate = originalAmount / originalMonths;

  // Calculate price based on selected duration
  const selectedMonths = getDurationInMonths(selectedDuration);
  const calculatedPrice = Math.round(monthlyRate * selectedMonths);
  const discountedAmount = Math.round(calculatedPrice * 0.9); // 10% discount
  const savings = calculatedPrice - discountedAmount;

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      await onRenew(selectedDuration);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Renew Mentorship
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              with {mentorship.mentor.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <FiClock className="inline mr-2" size={16} />
              Select Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDuration(option.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedDuration === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Monthly Rate</span>
              <span className="font-medium text-slate-900 dark:text-white">
                ₦{Math.round(monthlyRate).toLocaleString()}/month
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {selectedDuration} × ₦{Math.round(monthlyRate).toLocaleString()}
              </span>
              <span className="font-medium text-slate-900 dark:text-white line-through">
                ₦{calculatedPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                10% Renewal Discount
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                -₦{savings.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  Total to Pay
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₦{discountedAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> You will pay the discounted rate even if you renew multiple times. 
              The new duration will be applied to your mentorship program.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRenew}
            disabled={isRenewing}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isRenewing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard size={18} />
                Pay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};