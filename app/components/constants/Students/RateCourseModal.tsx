"use client";

import React, { useState } from "react";
import { FiX, FiStar, FiSend } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { StarRating } from "./StarRating";

interface RateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  courseId: string;
  onSubmit: (rating: number, comment: string) => void;
}

export const RateCourseModal = ({ isOpen, onClose, courseName, courseId, onSubmit }: RateCourseModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-slate-900/80' : 'bg-black/50'}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200 ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
          }`}>
            <FiStar size={24} />
          </div>
          <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Rate Your Experience
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            How would you rate "{courseName}"?
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center mb-6">
          <StarRating rating={rating} onRatingChange={setRating} size={32} />
        </div>

        {/* Rating feedback */}
        {rating > 0 && (
          <div className={`text-center mb-4 text-sm font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </div>
        )}

        {/* Comment input */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Additional comments (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this course..."
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            isDark
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FiSend size={16} />
              Submit Rating
            </>
          )}
        </button>
      </div>
    </div>
  );
};