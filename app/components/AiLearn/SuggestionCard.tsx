'use client';

import { IconType } from 'react-icons';

interface Props {
  icon: IconType;
  title: string;
  description: string;
}

export const SuggestionCard = ({ icon: Icon, title, description }: Props) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
    <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] w-fit">
      <Icon size={18} />
    </div>
    <div className="text-left space-y-1.5">
      <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#2563EB] transition-colors">
        {title}
      </h4>
      <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);