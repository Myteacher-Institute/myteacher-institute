import React from 'react';
import { Rocket, MousePointerClick, Check, MessageSquare } from 'lucide-react';

const FooterCTA = () => {
  return (
    <section className="w-full bg-[#0b1629] py-16 px-6 overflow-hidden">
      <div className="max-w-[1080px] mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DBE8226] border border-[#2d3b55] text-[11px] font-semibold text-[#A8EDCF] uppercase tracking-[0.18em]">
          <Rocket size={14} className="fill-[#4ade80]" /> Start Today
        </div>

        {/* Heading Section */}
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
            your future career starts <br /> with one click.
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Join 12,000+ learners across Nigeria mastering skills that employers hire for. Start with our AI tutor today and build your career with confidence.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 w-full justify-center">
          <button className="w-full sm:w-auto bg-[#1E40AF] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_-18px_rgba(37,99,235,0.45)]">
            <MessageSquare size={18} className="fill-white" />
            Talk to AI — It's Free
          </button>
          
          <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0f172a] px-6 py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all border border-white/20">
            Browse All Courses
          </button>
        </div>

        {/* Feature List */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 pt-5 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-[#4ade80]" strokeWidth={3} /> No credit card required
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-[#4ade80]" strokeWidth={3} /> Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-[#4ade80]" strokeWidth={3} /> Certificate available
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;