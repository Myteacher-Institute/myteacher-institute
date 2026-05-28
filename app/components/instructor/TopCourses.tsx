'use client';

import Image from 'next/image';
import { topCourses } from './data';

export const TopCourses = () => (
  <section className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-6 lg:p-8 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-[#111827] text-lg lg:text-xl">Top Courses</h3>
      <button 
        className="text-[#2563EB] font-bold text-sm cursor-pointer"
        title="View full report"
        aria-label="View full courses report"
      >
        View full report
      </button>
    </div>
    <div className="space-y-5">
      {topCourses.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="font-bold text-[#111827] text-sm w-4">{item.id}</span>
          <div className="w-24 h-10 bg-slate-100 rounded-lg overflow-hidden">
            <Image 
              src={item.img} 
              width={96} 
              height={40} 
              className="w-24 h-10 object-cover shadow-sm" 
              alt={item.title} 
            />
          </div>
          <div className="grow min-w-0">
            <p className="text-[13px] font-bold text-[#111827] truncate">{item.title}</p>
          </div>
          <div className="flex gap-1 text-right shrink-0">
            <p className="text-[13px] font-bold text-[#111827]">{item.price}</p>
            <p className="text-[10px] mt-1 text-slate-600 font-bold">({item.perc})</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);