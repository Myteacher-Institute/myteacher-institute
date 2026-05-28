'use client';

import { FiSearch } from 'react-icons/fi';

export const SearchBar = () => (
  <div className="relative max-w-2xl mx-auto mb-10 group">
    <FiSearch 
      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
      size={20} 
    />
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-600 font-medium"
      title="Search for courses"
      aria-label="Search courses by title, instructor, or topic"
    />
  </div>
);