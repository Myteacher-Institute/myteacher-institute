"use client";
import React from 'react';
import { useThemeStore } from '@/store/theme.store';

const Banner = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <section className={isDark ? "w-full bg-slate-900 py-24 px-6 overflow-hidden flex items-center justify-center" : "w-full bg-[#0c1524] py-24 px-6 overflow-hidden flex items-center justify-center"}>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-7">
        
        {/* Heading Section */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Ready to Start Earning?
          </h2>
          <p className="text-slate-300/80 text-sm md:text-base max-w-xl mx-auto font-normal">
            Join thousands of affiliates who are already earning commissions
          </p>
        </div>

        {/* Main Action Button */}
        <div className="pt-2">
          <a href="/affiliate-dashboard">
            <button className={isDark ? "bg-slate-800 hover:bg-slate-700 text-blue-400 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-sm transition-all cursor-pointer border border-blue-600" : "bg-white hover:bg-slate-50 text-blue-600 px-8 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-sm transition-all cursor-pointer"}>
              Become an Affiliate
            </button>
          </a>
        </div>

        {/* Info Row Divider List */}
        <div className="flex items-center justify-center gap-2 pt-2 text-slate-400 text-xs font-normal">
          <span>Free to join</span>
          <span>•</span>
          <span>No monthly fees</span>
          <span>•</span>
          <span>Start earning immediately</span>
        </div>

      </div>
    </section>
  );
};

export default Banner;