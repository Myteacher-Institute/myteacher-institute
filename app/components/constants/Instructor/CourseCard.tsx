"use client";

import { FiPlay as Play, FiClock as Clock, FiUsers as Users } from "react-icons/fi";
import { useThemeStore } from '@/store/theme.store';

export const CourseCard = ({ title, students, progress, revenue, thumbnail }: any) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? "bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" : "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"}>
      <div className="relative h-32 bg-slate-100">
        <img
          src={thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play size={20} className="text-slate-800" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className={isDark ? "font-bold text-white text-sm mb-3 line-clamp-2" : "font-bold text-slate-800 text-sm mb-3 line-clamp-2"}>{title}</h4>
        <div className={isDark ? "flex items-center justify-between text-xs text-slate-400" : "flex items-center justify-between text-xs text-slate-500"}>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{students} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{progress}% complete</span>
          </div>
        </div>
        <div className={isDark ? "mt-3 pt-3 border-t border-slate-700" : "mt-3 pt-3 border-t border-slate-100"}>
          <p className="text-xs font-bold text-green-600">${revenue} revenue</p>
        </div>
      </div>
    </div>
  );
};
