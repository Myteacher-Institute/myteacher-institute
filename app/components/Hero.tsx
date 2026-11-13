"use client";

import { useState } from 'react';
import Image from 'next/image';
import { BiBot as BiRobot, BiRightArrowAlt as BiRightArrow, BiX as BiX, BiSend as BiSend } from 'react-icons/bi';
import { useThemeStore } from '@/store/theme.store';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimate } from '@/components/ScrollAnimate';

const Hero = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      ref={elementRef}
      className={`flex-1 w-full px-4 sm:px-6 lg:px-16 pt-20 sm:pt-24 flex flex-col lg:flex-row items-center justify-around gap-4 lg:gap-4 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* --- Main Content: Tightened Gap --- */}
      {/* Left Side: Content tightened with space-y-3 */}
      <div className="space-y-4 order-1 lg:order-1 w-full lg:w-auto">
        {/* Update bg to #FFFFFF and tweak the border/text for better contrast */}
        <ScrollAnimate delay={0}>
          <div className={isDark ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-[#10b981] text-[11px] font-bold border border-slate-700 uppercase tracking-wider shadow-sm" : "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] text-[#10b981] text-[11px] font-bold border border-slate-200 uppercase tracking-wider shadow-sm"}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            AI-Powered Platform
          </div>
        </ScrollAnimate>

        <div className="space-y-3"> {/* Reduced vertical spacing for a tighter look */}
          <ScrollAnimate delay={100}>
            <h1 className={isDark ? "text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.1] tracking-tight text-white" : "text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.1] tracking-tight text-[#0F1C2E]"}>
              Learn Digital Skills <br className="hidden sm:block" /> Faster and Get <br className="hidden sm:block" /> Certified
            </h1>
          </ScrollAnimate>

          <ScrollAnimate delay={200}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              <span className="text-[#2DBE82]">AI Assistant + </span>
              <span className="text-[#8B7CF8]">Mentorship</span>
            </h2>
          </ScrollAnimate>

          <ScrollAnimate delay={300}>
            <p className={isDark ? "text-slate-400 text-base sm:text-lg lg:text-[19px] max-w-lg leading-relaxed font-medium" : "text-slate-500 text-base sm:text-lg lg:text-[19px] max-w-lg leading-relaxed font-medium"}>
              Your personal AI tutor guides you step-by-step, adapts to
              your pace, and connects you with expert mentors—master
              in-demand skills in weeks, not years.
            </p>
          </ScrollAnimate>
        </div>

        <ScrollAnimate delay={400}>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <button className="bg-[#00c984] hover:bg-[#00b274] text-white px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer w-full sm:w-auto justify-center">
              <BiRobot className="text-xl" />
              Talk to AI
            </button>
            <button className={isDark ? "bg-slate-800 border border-slate-700 hover:border-slate-600 px-6 py-3 rounded-xl font-bold flex items-center text-white text-base transition-all active:scale-95 cursor-pointer w-full sm:w-auto justify-center" : "bg-white border border-slate-200 hover:border-slate-300 px-6 py-3 rounded-xl font-bold flex items-center text-slate-700 text-base transition-all active:scale-95 cursor-pointer w-full sm:w-auto justify-center"}>
              Browse Courses <BiRightArrow className="ml-2" />
            </button>
          </div>
        </ScrollAnimate>
      </div>

      {/* Right Side: Chat Interface moved closer */}
      <div className="hidden lg:flex flex-col items-center lg:items-start order-2 lg:order-2 w-full lg:w-auto mt-8 lg:mt-0">
        {/* Placeholder GIF for courses - replace with actual loading GIF */}
        <ScrollAnimate delay={500}>
          <div className="w-full max-w-[400px] lg:max-w-[550px] flex items-center justify-center">
            <Image
              src="/Learning.gif"
              alt="Learning platform"
              width={550}
              height={550}
              className="w-full h-auto max-h-[420px] lg:max-h-[550px] object-cover rounded-3xl"
              unoptimized
            />
          </div>
        </ScrollAnimate>
      </div>

      {/* Decorative Gradient */}
      <div className={isDark ? "absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 -z-10" : "absolute inset-0 bg-gradient-to-b from-[#FDFCF8] via-[#FDFCF8] to-[#E6F9F0] -z-10"} />

      {/* Decorative Glow remains subtle */}
      <div className="fixed bottom-0 right-0 w-[30%] h-[30%] bg-emerald-50/20 rounded-full blur-[60px] -z-10 pointer-events-none" />
    </section>
  );
};

export default Hero;