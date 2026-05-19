import React from 'react';
import { Star, ArrowUpRight, GraduationCap } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      name: "Amara M.",
      location: "Lagos · UI/UX Design Path",
      initials: "AM",
      color: "bg-[#eff6ff] text-[#3b82f6]",
      text: "The AI tutor explained things 5 different ways until I actually got it. I never felt judged for asking basic questions. It's like having a genius friend available at 3am.",
      achievement: "Landed job at Flutterwave · 4 months after enrolling"
    },
    {
      name: "Chukwuemeka E.",
      location: "Enugu · Data Analysis Path",
      initials: "CE",
      color: "bg-[#ecfdf5] text-[#10b981]",
      text: "I went from knowing nothing about data to building dashboards for an NGO in 3 months. My mentor Kelechi reviewed every project personally and pushed me beyond my comfort zone.",
      achievement: "Freelancing at ₦180k/month · Started from zero"
    },
    {
      name: "Sadia A.",
      location: "Abuja · Web Development Path",
      initials: "SA",
      color: "bg-[#f5f3ff] text-[#8b5cf6]",
      text: "I tried YouTube tutorials for 6 months and got nowhere. MyTeacher's structured path + AI feedback changed everything. The AI noticed I kept making the same CSS mistake and fixed it.",
      achievement: "Junior Dev role at a fintech startup"
    }
  ];

  return (
    <section className="w-full bg-[#FDFCF8] py-12 px-8 lg:px-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff9ea] border border-[#fef3c7] text-[10px] font-bold text-[#d97706] uppercase tracking-[0.2em]">
            <Star size={12} fill="#d97706" /> Student Stories
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
            Careers transformed. Lives changed.
          </h2>
          <p className="text-slate-500 text-base font-medium max-w-xl mx-auto">
            Don't take our word for it — here's what our students achieved.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow flex-shrink-0 w-full lg:w-auto"
            >
              <div className="space-y-4">
                {/* Professional Star Rating */}
                <div className="flex gap-0.5 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" strokeWidth={0} />
                  ))}
                </div>

                <p className="text-[#0f172a] text-sm font-medium leading-relaxed italic">
                  "{item.text}"
                </p>

                {/* Profile Section */}
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center font-bold text-[10px]`}>
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">{item.name}</h4>
                    <p className="text-slate-400 text-xs font-medium">{item.location}</p>
                  </div>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[#10b981] font-bold text-xs">
                  <ArrowUpRight size={14} strokeWidth={3} />
                  {item.achievement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;