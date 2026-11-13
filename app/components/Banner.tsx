"use client";
import React from 'react';
import { useThemeStore } from '@/store/theme.store';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimate } from '@/components/ScrollAnimate';

const Banner = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={elementRef}
      className={`w-full ${isDark ? "bg-slate-900" : "bg-[#0c1524]"} py-14 sm:py-24 px-4 sm:px-6 overflow-x-hidden overflow-y-hidden flex items-center justify-center transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-7">
        
        {/* Heading Section */}
        <div className="space-y-3">
          <ScrollAnimate delay={0}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to Start Earning?
            </h2>
          </ScrollAnimate>
          <ScrollAnimate delay={100}>
            <p className="text-slate-300/80 text-sm sm:text-lg max-w-xl mx-auto font-normal">
              Join thousands of affiliates who are already earning commissions
            </p>
          </ScrollAnimate>
        </div>

        {/* Main Action Button */}
        <ScrollAnimate delay={200}>
          <div className="pt-2 w-full sm:w-auto">
            <a href="/affiliate-dashboard" className="block w-full sm:w-auto">
              <button className={`w-full sm:w-auto ${isDark ? "bg-slate-800 hover:bg-slate-700 text-blue-400 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-sm transition-all cursor-pointer border border-blue-600" : "bg-white hover:bg-slate-50 text-blue-600 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm md:text-base shadow-sm transition-all cursor-pointer"}`}>
                Become an Affiliate
              </button>
            </a>
          </div>
        </ScrollAnimate>

        {/* Info Row Divider List */}
        <ScrollAnimate delay={300}>
          <div className="flex items-center justify-center gap-x-2 gap-y-1 pt-2 text-slate-400 text-[11px] sm:text-xs font-normal flex-wrap">
            <span>Free to join</span>
            <span>•</span>
            <span>No monthly fees</span>
            <span>•</span>
            <span>Start earning immediately</span>
          </div>
        </ScrollAnimate>

      </div>
    </section>
  );
};

export default Banner;