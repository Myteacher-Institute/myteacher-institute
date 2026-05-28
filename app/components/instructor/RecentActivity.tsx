'use client';

import { recentActivities } from './data';

export const RecentActivity = () => (
  <section className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-6 lg:p-8 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-[#111827] text-lg lg:text-xl">Recent Activity</h3>
      <button 
        className="text-[#2563EB] cursor-pointer font-bold text-sm"
        title="View all activities"
        aria-label="View all recent activities"
      >
        View all
      </button>
    </div>
    <div className="space-y-6">
      {recentActivities.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className={`p-2.5 rounded-xl h-fit ${item.color}`}>
            <item.icon size={18} />
          </div>
          <div>
            <p className="text-[14px] text-[#111827] leading-tight">
              {item.user} <br />
              <span className="font-bold text-[#111827]">{item.action}</span>
            </p>
            <span className="text-[11px] text-slate-600 font-medium">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);