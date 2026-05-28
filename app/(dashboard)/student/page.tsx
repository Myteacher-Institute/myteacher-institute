"use client";

import React, { useState } from "react";
import {
  FiCheckCircle as CheckCircle2,
  FiPlayCircle as PlayCircle,
  FiClock as Clock,
  FiAward as Award,
  FiX as X,
} from "react-icons/fi";
import { COURSES } from "@/app/components/constants/Students/courses";
import { recommended } from "@/app/components/constants/Students/recommended";
import { notification } from "@/app/components/constants/Students/notification";
import { StatCard } from "@/app/components/constants/Students/statcards";
import { CourseCard } from "@/app/components/constants/Students/CourseCard";
import { MentorWidget } from "@/app/components/constants/Students/MentorWidget";
import { RecommendedSection } from "@/app/components/constants/Students/RecommendedSection";
import { NotificationsContent } from "@/app/components/constants/Students/NotificationsContent";
import { SidebarNavContent } from "@/app/components/constants/Students/SidebarNavContent";
import { SIDEBAR_ITEMS } from "@/app/components/constants/Students/SidebarItems";
import { DashboardHeader } from "@/app/components/constants/Students/DashboardHeader";
import { FloatingActionButton } from "@/app/components/constants/Students/FloatingActionButton";

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-60 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-slate-200 fixed h-full z-70 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>
          <button
            className="lg:hidden p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNavContent />
        </div>
      </aside>

      <main className="lg:ml-64 flex-1 flex flex-col min-w-0 z-10 relative">
        <DashboardHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifyOpen={notifyOpen}
          setNotifyOpen={setNotifyOpen}
          NotificationsContent={NotificationsContent}  // Fixed: Changed from notification to NotificationsContent
        />

        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
            <StatCard
              label="Completed Courses"
              value="12"
              icon={<CheckCircle2 size={20} strokeWidth={2.5} />}
              iconBgColor="bg-green-500"
            />
            <StatCard
              label="Active Learning"
              value="4"
              icon={<PlayCircle size={20} strokeWidth={2.5} />}
              iconBgColor="bg-blue-500"
            />
            <StatCard
              label="Hours Studied"
              value="124"
              icon={<Clock size={20} strokeWidth={2.5} />}
              iconBgColor="bg-purple-500"
            />
            <StatCard
              label="Badges & Awards"
              value="8"
              icon={<Award size={20} strokeWidth={2.5} />}
              iconBgColor="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Continue Learning Omeke Charles
                </h3>
                <button className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-6">
                {COURSES.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-10">
              <div className="space-y-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Recommended For You
                </h3>
                <RecommendedSection />  {/* Fixed: Using RecommendedSection component */}
              </div>

              <div className="bg-blue-600 rounded-4xl p-8 shadow-xl shadow-blue-100">
                <MentorWidget />
              </div>

              <div className="space-y-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight uppercase">
                  Notifications
                </h3>
                <NotificationsContent />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-12 pb-10">
            <h3 className="text-lg lg:text-xl font-black text-slate-800 mb-6 tracking-tight">
              Recommended for you Omeke Charles
            </h3>
            <RecommendedSection />  {/* Fixed: Using RecommendedSection component */}
          </div>
        </div>
      </main>

      <FloatingActionButton mentorOpen={mentorOpen} setMentorOpen={setMentorOpen} />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}