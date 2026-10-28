"use client";

import { useState } from 'react';
import Image from 'next/image';
import { BiBot as BiRobot, BiRightArrowAlt as BiRightArrow, BiX as BiX, BiSend as BiSend } from 'react-icons/bi';
import { useThemeStore } from '@/store/theme.store';

const Hero = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="flex-1 w-full px-4 lg:px-16 pt-24 flex flex-col lg:flex-row items-center justify-around gap-4 lg:gap-4">

      {/* --- Main Content: Tightened Gap --- */}

      {/* Left Side: Content tightened with space-y-3 */}
      <div className="space-y-4 order-1 lg:order-1">
        {/* Update bg to #FFFFFF and tweak the border/text for better contrast */}
        <div className={isDark ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-[#10b981] text-[11px] font-bold border border-slate-700 uppercase tracking-wider shadow-sm" : "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] text-[#10b981] text-[11px] font-bold border border-slate-200 uppercase tracking-wider shadow-sm"}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          AI-Powered Platform
        </div>

        <div className="space-y-3"> {/* Reduced vertical spacing for a tighter look */}
          <h1 className={isDark ? "text-5xl lg:text-[56px] font-black leading-[1.1] tracking-tight text-white" : "text-5xl lg:text-[56px] font-black leading-[1.1] tracking-tight text-[#0F1C2E]"}>
            Learn Digital Skills <br /> Faster and Get <br /> Certified
          </h1>

          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            <span className="text-[#2DBE82]">AI Assistant + </span>
            <span className="text-[#8B7CF8]">Mentorship</span>
          </h2>

          <p className={isDark ? "text-slate-400 text-lg lg:text-[19px] max-w-lg leading-relaxed font-medium" : "text-slate-500 text-lg lg:text-[19px] max-w-lg leading-relaxed font-medium"}>
            Your personal AI tutor guides you step-by-step, adapts to
            your pace, and connects you with expert mentors—master
            in-demand skills in weeks, not years.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button className="bg-[#00c984] hover:bg-[#00b274] text-white px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer">
            <BiRobot className="text-xl" />
            Talk to AI
          </button>
          <button className={isDark ? "bg-slate-800 border border-slate-700 hover:border-slate-600 px-6 py-3 rounded-xl font-bold flex items-center text-white text-base transition-all active:scale-95 cursor-pointer" : "bg-white border border-slate-200 hover:border-slate-300 px-6 py-3 rounded-xl font-bold flex items-center text-slate-700 text-base transition-all active:scale-95 cursor-pointer"}>
            Browse Courses <BiRightArrow className="ml-2" />
          </button>
        </div>
      </div>

      {/* Right Side: Chat Interface moved closer */}
      <div className="flex flex-col items-center lg:items-start order-2 lg:order-2">
        {/* TODO: Uncomment when AI Teacher feature is ready */}
        {/* <div className="lg:hidden fixed top-24 z-20 w-full max-w-sm mb-4 flex justify-end">
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#00c984] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm hover:bg-[#00b274] transition-all cursor-pointer"
            aria-label="Chat with AI"
          >
            <BiRobot className="text-xl" />
          </button>
        </div>
        <div className={isDark ? "hidden lg:block w-full max-w-[420px] bg-slate-800 rounded-[24px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-700 overflow-hidden flex flex-col" : "hidden lg:block w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col"}>

          <div className="bg-[#0f172a] p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm">
              <BiRobot className="text-lg" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm leading-tight">myteacherai - your AI Teacher</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Online</span>
              </div>
            </div>
          </div>

          <div className={isDark ? "p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-900/50" : "p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-50/20"}>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black">A</div>
              <div className="bg-[#fffbeb] border border-[#fef3c7] p-3.5 rounded-2xl rounded-tl-none text-[13px] text-slate-700 leading-relaxed shadow-sm">
                Hi! I'm myteacherai. Ready to continue your Python path?
              </div>
            </div>

            <div className="flex flex-row-reverse gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black">U</div>
              <div className="bg-[#0F1C2E] p-3.5 rounded-2xl rounded-tr-none text-[13px] text-white leading-relaxed max-w-[80%] shadow-md">
                Yes! Explain loops.
              </div>
            </div>

            <div className="flex gap-2 px-2">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>

          <div className={isDark ? "p-4 bg-slate-800 border-t border-slate-700" : "p-4 bg-white border-t border-slate-50"}>
            <div className={isDark ? "flex items-center bg-slate-700 rounded-xl p-1.5" : "flex items-center bg-slate-100 rounded-xl p-1.5"}>
              <input
                type="text"
                placeholder="Ask Aida anything..."
                className={isDark ? "bg-transparent border-none w-full px-3 outline-none text-white text-[13px] font-medium" : "bg-transparent border-none w-full px-3 outline-none text-slate-700 text-[13px] font-medium"}
              />
              <button className="bg-[#00c984] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#00b274] transition-all cursor-pointer">
                <BiSend className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      */}

        {/* Placeholder GIF for courses - replace with actual loading GIF */}
        <div className="w-full max-w-[420px] flex items-center justify-center">
          <Image
            src="/Learning.gif"
            alt="Learning platform"
            width={420}
            height={420}
            className="w-full h-[420px] object-cover rounded-3xl"
          />
        </div>
      </div>

      {/* Mobile Chat Modal */}
      {/* TODO: Uncomment when AI Teacher feature is ready */}
      {/* {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:hidden">
          <div className={isDark ? "bg-slate-800 rounded-[24px] shadow-2xl border border-slate-700 overflow-hidden flex flex-col w-full max-w-md mx-4 max-h-[80vh]" : "bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-full max-w-md mx-4 max-h-[80vh]"}>
            <div className="bg-[#0f172a] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm">
                  <BiRobot className="text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">myteacherai - your AI Teacher</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <BiX className="text-lg" />
              </button>
            </div>

            <div className={isDark ? "p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-900/50" : "p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-50/20"}>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black">A</div>
                <div className="bg-[#fffbeb] border border-[#fef3c7] p-3.5 rounded-2xl rounded-tl-none text-[13px] text-slate-700 leading-relaxed shadow-sm">
                  Hi! I'm myteacherai. Ready to continue your Python path?
                </div>
              </div>

              <div className="flex flex-row-reverse gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black">U</div>
                <div className="bg-[#0F1C2E] p-3.5 rounded-2xl rounded-tr-none text-[13px] text-white leading-relaxed max-w-[80%] shadow-md">
                  Yes! Explain loops.
                </div>
              </div>

              <div className="flex gap-2 px-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-50">
              <div className="flex items-center bg-slate-100 rounded-xl p-1.5">
                <input
                  type="text"
                  placeholder="Ask Aida anything..."
                  className={isDark ? "bg-transparent border-none w-full px-3 outline-none text-white text-[13px] font-medium" : "bg-transparent border-none w-full px-3 outline-none text-slate-700 text-[13px] font-medium"}
                />
                <button className="bg-[#00c984] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#00b274] transition-all cursor-pointer">
                  <BiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Decorative Gradient */}
      <div className={isDark ? "absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 -z-10" : "absolute inset-0 bg-gradient-to-b from-[#FDFCF8] via-[#FDFCF8] to-[#E6F9F0] -z-10"} />

      {/* Decorative Glow remains subtle */}
      <div className="fixed bottom-0 right-0 w-[30%] h-[30%] bg-emerald-50/20 rounded-full blur-[60px] -z-10 pointer-events-none" />
    </section>
  );
};

export default Hero;