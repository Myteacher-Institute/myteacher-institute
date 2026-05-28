'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { MyCoursesSection } from './MyCoursesSection';
import { RecentActivity } from './RecentActivity';
import { TopCourses } from './TopCourses';

export default function InstructorDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-poppins relative">
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
          title="Close sidebar"
          aria-label="Close sidebar overlay"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          isSidebarOpen={isSidebarOpen} 
        />

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MyCoursesSection />
          
          <div className="space-y-8">
            <RecentActivity />
            <TopCourses />
          </div>
        </div>
      </main>
    </div>
  );
}