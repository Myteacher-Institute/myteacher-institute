'use client';

import { FiZap } from 'react-icons/fi';

export const AIBanner = () => (
  <div className="flex items-center justify-center gap-4 mb-12">
    <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-3">
      <div className="bg-blue-500 p-1 rounded-full">
        <FiZap size={14} className="text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-600">Not sure what to learn?</span>
      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
        title="Get AI-powered course recommendations"
        aria-label="Get personalized AI course recommendations"
      >
        Get AI Recommendation
      </button>
    </div>
  </div>
);