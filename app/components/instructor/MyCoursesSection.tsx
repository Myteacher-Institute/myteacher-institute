'use client';

import Image from 'next/image';
import { FiMoreHorizontal } from 'react-icons/fi';
import { myCourses } from './data';

export const MyCoursesSection = () => (
  <section className="lg:col-span-2 bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-[#111827] text-lg lg:text-xl">My Courses</h3>
      <button 
        className="text-[#2563EB] cursor-pointer font-bold text-sm"
        title="View all courses"
        aria-label="View all courses"
      >
        View all courses
      </button>
    </div>
    <div className="space-y-6 lg:space-y-8">
      {myCourses.map((course, i) => (
        <div key={i} className="flex items-center justify-between group overflow-hidden">
          <div className="flex items-center gap-3 lg:gap-5 min-w-0">
            <Image 
              src={course.img} 
              width={96} 
              height={64} 
              className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl object-cover shadow-sm shrink-0" 
              alt={course.title} 
            />
            <div className="min-w-0">
              <h4 className="font-bold text-[#111827] text-sm lg:text-[16px] mb-0.5 truncate">
                {course.title}
              </h4>
              <p className="text-[#111827] text-[10px] lg:text-xs font-medium truncate">
                {course.students} students ● {course.lessons} lessons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0">
            <span className={`hidden sm:inline-block px-4 py-1.5 text-[11px] font-bold rounded-full ${
              course.status === 'Draft' 
                ? 'bg-[#E7F9F1] text-[#FEB00A]' 
                : 'bg-[#E7F9F1] text-[#5CC68C]'
            }`}>
              {course.status}
            </span>
            <FiMoreHorizontal className="text-[#111827] cursor-pointer" size={20} />
          </div>
        </div>
      ))}
    </div>
  </section>
);