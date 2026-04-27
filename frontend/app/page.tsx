import React from 'react';
import StudentStories from './components/CareerTransform';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';

const ProfessionalHero = () => {
  return (
    <>
  
    <div className="h-screen w-full bg-[#f8fafb] text-[#0f172a] font-sans selection:bg-emerald-100 overflow-hidden flex flex-col">

      {/* --- Navigation (Fixed Height) --- */}
      <nav className="w-full bg-white border-b border-gray-100 px-8 lg:px-16 h-20 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563eb] rounded-lg flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">Myteacher Institute</span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Courses</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Learning Paths</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Mentorship</a>
          <a href="#" className="hover:text-blue-600 transition-colors">AI Tutor</a>
          <button className="bg-[#0f172a] text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-all font-bold">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- Main Content: Tightened Gap --- */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-8 flex items-center justify-center gap-10">

        {/* Left Side: Content tightened with space-y-3 */}
        <div className="w-[52%] space-y-4">
  {/* Update bg to #FFFFFF and tweak the border/text for better contrast */}
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] text-[#10b981] text-[11px] font-bold border border-slate-200 uppercase tracking-wider shadow-sm">
    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
    AI-Powered Platform
  </div>

          <div className="space-y-3"> {/* Reduced vertical spacing for a tighter look */}
            <h1 className="text-4xl lg:text-[48px] font-black leading-[1.1] tracking-tight text-[#0f172a]">
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
        <div className="w-[48%] flex justify-start pl-4"> {/* Pulls the chat closer to the text */}
          <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col">

            {/* Chat Header */}
            <div className="bg-[#0f172a] p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">myteacherai</h4>
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
                <div className="bg-[#0f172a] p-3.5 rounded-2xl rounded-tr-none text-[13px] text-white leading-relaxed max-w-[80%] shadow-md">
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