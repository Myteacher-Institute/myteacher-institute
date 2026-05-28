'use client';

import Image from 'next/image';
import { FiStar, FiClock, FiUser } from 'react-icons/fi';
import { FaStarHalfAlt } from 'react-icons/fa';
import { Course } from './Courses';

interface CourseCardProps {
  course: Course;
}

const TAG_CONFIG: Record<string, string> = {
  bestseller: "bg-emerald-50 text-emerald-600 border-emerald-100",
  popular: "bg-orange-50 text-orange-600 border-orange-100",
  new: "bg-blue-50 text-blue-600 border-blue-100",
  creative: "bg-purple-50 text-purple-600 border-purple-100",
};

const renderStars = (rating: number) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5 text-orange-500">
      {[...Array(totalStars)].map((_, i) => {
        if (i < fullStars) {
          return <FiStar key={i} fill="currentColor" size={14} />;
        } else if (i === fullStars && hasHalfStar) {
          return <FaStarHalfAlt key={i} fill="currentColor" size={14} />;
        }
        return <FiStar key={i} size={14} className="text-slate-300" />;
      })}
      <span className="ml-1 text-slate-400 text-xs">{rating}</span>
    </div>
  );
};

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          width={512}
          height={176}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${TAG_CONFIG[course.tagType]}`}>
            {course.tag}
          </span>
          {renderStars(course.rating)}
        </div>

        <div className="flex justify-between items-start gap-2 mb-5 cursor-pointer">
          <h3 className="font-bold text-[17px] text-[#0F1C2E] leading-tight group-hover:text-blue-700 transition-colors">
            {course.title}
          </h3>
        </div>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex justify-between items-center gap-3 text-slate-400 text-[11px] font-medium mb-6">
          <div className="flex items-center gap-1">
            <FiUser size={13} /> {course.instructor}
          </div>
          <div className="flex items-center gap-1">
            <FiClock size={13} /> {course.duration}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
          <span className="text-xl font-black text-[#0F1C2E]">${course.price}</span>
          <button 
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md cursor-pointer"
            title={`Enroll in ${course.title}`}
            aria-label={`Enroll in ${course.title}`}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};