'use client';

import { FiBell, FiPlus, FiMenu } from 'react-icons/fi';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export const DashboardHeader = ({ onMenuClick, isSidebarOpen }: DashboardHeaderProps) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
    <div className="flex items-center gap-4 w-full sm:w-auto">
      {!isSidebarOpen && (
        <button 
          type="button" 
          onClick={onMenuClick} 
          aria-label="Open sidebar" 
          title="Open navigation menu"
          className="lg:hidden cursor-pointer p-2 bg-[#FFFFFF] border border-slate-200 rounded-lg text-slate-600"
        >
          <FiMenu size={20} />
        </button>
      )}
      <div>
        <h2 className="text-xl lg:text-2xl text-[#111827] font-medium">
          Welcome back, <span className="font-bold">Henry</span>
        </h2>
        <p className="text-[#111827] text-xs lg:text-[15px]">
          Here's what's happening with your courses today.
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <button 
        type="button" 
        aria-label="View notifications" 
        title="View notifications"
        className="p-3 bg-[#FFFFFF] border border-slate-100 rounded-2xl text-[#111827] relative cursor-pointer hover:bg-slate-50"
      >
        <FiBell size={22} />
        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <button 
        type="button" 
        title="Create a new course"
        aria-label="Create new course"
        className="grow sm:grow-0 bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200"
      >
        <FiPlus size={18} /> 
        <span className="whitespace-nowrap">Create New Course</span>
      </button>
    </div>
  </header>
);