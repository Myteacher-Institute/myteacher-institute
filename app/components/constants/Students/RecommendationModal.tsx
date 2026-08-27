"use client";

import React, { useState } from "react";
import { FiX, FiTarget, FiBook, FiTrendingUp, FiAward } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recommendations: string[]) => void;
}

const RECOMMENDATION_OPTIONS = [
  { id: 'web-development', label: 'Web Development', icon: <FiBook size={20} /> },
  { id: 'mobile-development', label: 'Mobile Development', icon: <FiBook size={20} /> },
  { id: 'data-science', label: 'Data Science', icon: <FiTrendingUp size={20} /> },
  { id: 'machine-learning', label: 'Machine Learning', icon: <FiAward size={20} /> },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: <FiTarget size={20} /> },
  { id: 'cloud-computing', label: 'Cloud Computing', icon: <FiBook size={20} /> },
  { id: 'devops', label: 'DevOps', icon: <FiTrendingUp size={20} /> },
  { id: 'ui-ux-design', label: 'UI/UX Design', icon: <FiAward size={20} /> },
];

export const RecommendationModal = ({ isOpen, onClose, onSubmit }: RecommendationModalProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        return prev; // Limit to 3 recommendations
      }
      return [...prev, id];
    });
  };

  const handleSubmit = () => {
    if (selectedRecommendations.length > 0) {
      onSubmit(selectedRecommendations);
      setSelectedRecommendations([]);
      onClose();
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
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200 ${
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
            isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <FiTarget size={24} />
          </div>
          <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Personalize Your Learning
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select up to 3 areas you're interested in to get personalized course recommendations
          </p>
        </div>

        {/* Recommendations grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {RECOMMENDATION_OPTIONS.map((option) => {
            const isSelected = selectedRecommendations.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleRecommendation(option.id)}
                disabled={!isSelected && selectedRecommendations.length >= 3}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? isDark
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-blue-500 bg-blue-50 text-blue-600'
                    : isDark
                      ? 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                } ${!isSelected && selectedRecommendations.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`shrink-0 ${isSelected ? 'text-current' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {option.icon}
                </div>
                <span className="text-sm font-semibold text-left">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selection count */}
        <div className={`text-sm font-medium mb-4 text-center ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {selectedRecommendations.length}/3 selected
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={selectedRecommendations.length === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {selectedRecommendations.length === 0 
            ? 'Select at least 1 interest' 
            : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};