"use client";
// app/page.tsx
import { CoursesGrid } from "./components/CoursesGrid";
import { MentorshipSection } from "./components/MentorshipSection";

import React, { useState } from 'react';
import StudentStories from './components/CareerTransform';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';
import Link from 'next/dist/client/link';


const ProfessionalHero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>

      <div className="h-screen w-full bg-gradient-to-b from-[#FDFCF8] via-[#FDFCF8] to-[#E6F9F0] text-[#0f172a] font-sans selection:bg-emerald-100 overflow-hidden flex flex-col">

        {/* --- Navigation (Sticky) --- */}
        <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-16 h-20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
              <a href="/courses" className="hover:text-blue-600 transition-colors">Courses</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Learning Paths</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Mentorship</a>
              <a href="#" className="hover:text-blue-600 transition-colors">AI Tutor</a>
            </div>
            <button className="bg-[#0f172a] text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all font-bold text-sm inline-flex">
              Get Started
            </button>

             {/* <Link href="/dashboard">
              <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
                Go to Dashboard
              </button>
            </Link> */}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 lg:hidden">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 lg:hidden z-50">
              <div className="flex flex-col items-center gap-4 py-4">
                <a href="/courses" className="text-slate-600 hover:text-blue-600 font-semibold">Courses</a>
                <a href="#" className="text-slate-600 hover:text-blue-600 font-semibold">Learning Paths</a>
                <a href="#" className="text-slate-600 hover:text-blue-600 font-semibold">Mentorship</a>
                <a href="#" className="text-slate-600 hover:text-blue-600 font-semibold">AI Tutor</a>

              </div>
            </div>
          )}
        </nav>

        {/* --- Main Content: Tightened Gap --- */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 lg:px-8 pt-24 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-4">

          {/* Left Side: Content tightened with space-y-3 */}
          <div className="w-full lg:w-[52%] space-y-4 order-1 lg:order-1">
            {/* Update bg to #FFFFFF and tweak the border/text for better contrast */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] text-[#10b981] text-[11px] font-bold border border-slate-200 uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              AI-Powered Platform
            </div>

            <div className="space-y-3"> {/* Reduced vertical spacing for a tighter look */}
              <h1 className="text-4xl lg:text-[48px] font-black leading-[1.1] tracking-tight text-[#0F1C2E]">
                Learn Digital Skills <br /> Faster and Get <br /> Certified
              </h1>

              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
                <span className="text-[#2DBE82]">AI Assistant + </span>
                <span className="text-[#8B7CF8]">Mentorship</span>
              </h2>

              <p className="text-slate-500 text-base lg:text-[17px] max-w-lg leading-relaxed font-medium">
                Your personal AI tutor guides you step-by-step, adapts to
                your pace, and connects you with expert mentors—master
                in-demand skills in weeks, not years.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button className="bg-[#00c984] hover:bg-[#00b274] text-white px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2.5 transition-all shadow-md active:scale-95">
                <i className="fas fa-robot"></i>
                Talk to AI
              </button>
              <button className="bg-white border border-slate-200 hover:border-slate-300 px-6 py-3 rounded-xl font-bold text-slate-700 text-base transition-all active:scale-95">
                Browse Courses <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>

          {/* Right Side: Chat Interface moved closer */}
          <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start order-2 lg:order-2">
            <div className="lg:hidden fixed top-24 z-20 w-full max-w-sm mb-4 flex justify-end">
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-[#00c984] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm hover:bg-[#00b274] transition-all"
                aria-label="Chat with AI"
              >
                <i className="fas fa-robot"></i>
              </button>
            </div>
            <div className="hidden lg:block w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col">

              {/* Chat Header */}
              <div className="bg-[#0f172a] p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm">
                  <i className="fas fa-robot"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">myteacherai - your AI Teacher</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-50/20">
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

                {/* Typing indicator placeholder */}
                <div className="flex gap-2 px-2">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-50">
                <div className="flex items-center bg-slate-100 rounded-xl p-1.5">
                  <input
                    type="text"
                    placeholder="Ask Aida anything..."
                    className="bg-transparent border-none w-full px-3 outline-none text-slate-700 text-[13px] font-medium"
                  />
                  <button className="bg-[#00c984] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#00b274] transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:hidden">
            <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-full max-w-md mx-4 max-h-[80vh]">
              {/* Modal Header */}
              <div className="bg-[#0f172a] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">myteacherai - your AI Teacher</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Online</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="p-5 h-[320px] overflow-y-auto space-y-5 bg-slate-50/20">
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

                {/* Typing indicator placeholder */}
                <div className="flex gap-2 px-2">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-50">
                <div className="flex items-center bg-slate-100 rounded-xl p-1.5">
                  <input
                    type="text"
                    placeholder="Ask Aida anything..."
                    className="bg-transparent border-none w-full px-3 outline-none text-slate-700 text-[13px] font-medium"
                  />
                  <button className="bg-[#00c984] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#00b274] transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Glow remains subtle */}
        <div className="fixed bottom-0 right-0 w-[30%] h-[30%] bg-emerald-50/20 rounded-full blur-[60px] -z-10 pointer-events-none"></div>
      </div>

      {/* Student Stories Section*/}
      <StudentStories />

      {/* Footer CTA Section */}
      <FooterCTA />

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default ProfessionalHero;
    <main className="min-h-screen bg-white">
      {/* Popular Courses Section (Contains data and internal Card component) */}
      <CoursesGrid />

      {/* Decorative Divider */}
      <div className="h-px bg-slate-100 max-w-7xl mx-auto opacity-50" />

      {/* Mentorship Section (Contains data and internal MentorMiniCard) */}
      <MentorshipSection />
      
      {/* Footer padding */}
      <div className="py-10" />
    </main>
  );
}
