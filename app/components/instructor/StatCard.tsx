'use client';

import { FiArrowUpRight } from 'react-icons/fi';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}

export const StatCard = ({ label, value, trend, icon: Icon, iconColor, bgColor }: StatCardProps) => (
  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm shadow-slate-200/50">
    <div className={`p-2.5 w-fit mt-4 rounded-lg ${bgColor}`}>
      <Icon className={iconColor} size={20} />
    </div>
    <div className="grow">
      <p className="text-[#111827] text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-center justify-between mt-1">
        <h4 className="text-xl lg:text-2xl font-bold text-[#111827]">{value}</h4>
        <span className="text-[#166534] text-xs font-semibold flex items-center gap-0.5">
          <FiArrowUpRight size={14} /> {trend}
        </span>
      </div>
      <p className="text-[#111827] text-[11px] mt-1">vs last month</p>
    </div>
  </div>
);