'use client';

import { FiCheck, FiStar } from 'react-icons/fi';

const MetricCard = ({ iconBg, iconColor, metric, label, points }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex-1 min-w-[280px]">
    <div className={`w-8 h-8 rounded-md ${iconBg} ${iconColor} flex items-center justify-center mb-4`}>
      <FiStar size={16} />
    </div>
    <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{metric}</h4>
    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-5">{label}</p>
    <ul className="space-y-2.5 text-left border-t border-slate-50 pt-5">
      {points.map((point: string, idx: number) => (
        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
          <FiCheck size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const EarningPotential = () => (
  <section className="bg-gradient-to-b from-blue-50/20 via-transparent to-transparent border-y border-slate-100 py-16 px-6 text-center">
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 space-y-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Earning Potential</h2>
        <p className="text-slate-400 text-xs font-semibold">See how much you can earn with our competitive commission structure</p>
      </div>
      <div className="flex flex-wrap gap-6 max-w-4xl mx-auto">
        <MetricCard 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-500" 
          metric="N5,000 / $5" 
          label="Per Base Course Referral" 
          points={["Earn on your local currency", "$5 conversion rate equivalent"]} 
        />
        <MetricCard 
          iconBg="bg-purple-50" 
          iconColor="text-purple-500" 
          metric="above N10,000" 
          label="Per Certification Program" 
          points={["Higher revenue validation keys", "$10 minimum base tier payout"]} 
        />
      </div>
    </div>
  </section>
);