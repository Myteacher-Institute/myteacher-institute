'use client';

const TestimonialCard = ({ image, name, role, quote, stars }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-sm transition-all flex-1 min-w-[260px] text-left flex flex-col justify-between">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
        <div>
          <h5 className="text-xs font-bold text-slate-900 leading-tight">{name}</h5>
          <p className="text-[11px] text-slate-400 font-medium">{role}</p>
        </div>
      </div>
      <p className="text-slate-600 text-xs leading-relaxed font-medium italic">"{quote}"</p>
    </div>
    <div className="flex gap-0.5 text-amber-400 mt-5 pt-4 border-t border-slate-50">
      {Array.from({ length: stars }).map((_, i) => (<span key={i} className="text-xs">★</span>))}
    </div>
  </div>
);

export const SuccessStories = () => (
  <>
    <section className="flex flex-col justify-center py-16 px-6 text-center max-w-full mx-auto border-t border-slate-50 bg-slate-50/50">
      <div className="mb-12 space-y-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Success Stories</h2>
        <p className="text-slate-400 text-xs font-semibold">Hear from our top-performing affiliates</p>
      </div>
      <div className="flex flex-wrap gap-6 max-w-5xl mx-auto">
        <TestimonialCard image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80" name="Stella Chika" role="Digital Marketer" quote="I've earned over N150,000 in just 2 months just by sharing courses with my network." stars={5} />
        <TestimonialCard image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" name="Ali Nwosu" role="Course Creator" quote="The affiliate dashboard data framework is solid! I am always conscious of my payouts." stars={5} />
        <TestimonialCard image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80" name="Luka Ekpo" role="Educator" quote="As an educator, I love recommending high-quality courses. Extra local cash on the side!" stars={5} />
      </div>
    </section>

    {/* CTA Section included here as part 6 */}
    <section className="bg-[#2563EB] text-white py-16 px-6 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <h2 className="text-2xl lg:text-3xl font-black tracking-tight">Ready to Start Earning?</h2>
        <p className="text-blue-100/90 text-xs sm:text-sm font-medium max-w-lg mx-auto">Join thousands of affiliates who are already earning commissions by sharing quality education tracks.</p>
        <button className="bg-white text-[#2563EB] px-8 py-3.5 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all shadow-md">
          Become an Affiliate
        </button>
        <p className="text-blue-200/70 text-[10.5px]">Free registration • No setup costs</p>
      </div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-700/30 rounded-full blur-2xl" />
    </section>
  </>
);