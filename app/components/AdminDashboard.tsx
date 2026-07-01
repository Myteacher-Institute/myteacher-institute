"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  FiGrid, FiUsers, FiBook, FiDollarSign,
  FiSettings, FiBell, FiPlus, FiMoreHorizontal, FiArrowUpRight, FiMenu, FiX, FiCheckCircle, FiAlertCircle, FiTrendingUp
} from 'react-icons/fi';
import { DashboardHeader } from './constants/Admin/DashboardHeader';
import { SidebarNavContent } from './constants/Admin/SidebarNavContent';
import { StatCard } from './constants/Admin/statcards';
import { NotificationsContent } from './constants/Admin/NotificationsContent';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

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
            <FiX size={18} className="text-slate-600" />
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
          NotificationsContent={NotificationsContent}
        />

        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
            <StatCard
              label="Total Users"
              value="12,548"
              icon={<FiUsers size={20} strokeWidth={2.5} />}
              iconBgColor="bg-blue-500"
            />
            <StatCard
              label="Active Instructors"
              value="156"
              icon={<FiBook size={20} strokeWidth={2.5} />}
              iconBgColor="bg-green-500"
            />
            <StatCard
              label="Total Courses"
              value="324"
              icon={<FiGrid size={20} strokeWidth={2.5} />}
              iconBgColor="bg-purple-500"
            />
            <StatCard
              label="Monthly Revenue"
              value="₦45.2M"
              icon={<FiDollarSign size={20} strokeWidth={2.5} />}
              iconBgColor="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Pending Instructor Applications
                </h3>
                <button className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                  View All
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {[
                    { name: "John Doe", email: "john@example.com", specialization: "Web Development", status: "pending", applied: "2 hours ago" },
                    { name: "Jane Smith", email: "jane@example.com", specialization: "UI/UX Design", status: "pending", applied: "5 hours ago" },
                    { name: "Mike Johnson", email: "mike@example.com", specialization: "Data Science", status: "pending", applied: "1 day ago" },
                  ].map((application, i) => (
                    <div key={i} className="p-4 lg:p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-slate-600 font-bold">{application.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-800 text-sm lg:text-base truncate">{application.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{application.email}</p>
                          <p className="text-xs text-slate-400 mt-1">{application.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400">{application.applied}</span>
                        <div className="flex gap-2">
                          <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                            <FiCheckCircle size={18} />
                          </button>
                          <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer transition-colors">
                            <FiAlertCircle size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 mt-8">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Recent Activity
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 lg:p-6">
                <div className="space-y-4">
                  {[
                    { action: "New instructor application", detail: "John Doe applied for Web Development", time: "2 hours ago", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
                    { action: "Course approved", detail: "Advanced React Course by Jane Smith", time: "5 hours ago", icon: FiCheckCircle, color: "bg-green-100 text-green-600" },
                    { action: "Revenue milestone", detail: "Monthly target of ₦45M reached", time: "1 day ago", icon: FiTrendingUp, color: "bg-purple-100 text-purple-600" },
                    { action: "User registration spike", detail: "250 new users registered today", time: "2 days ago", icon: FiUsers, color: "bg-yellow-100 text-yellow-600" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${activity.color} shrink-0`}>
                        <activity.icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-800 text-sm">{activity.action}</h4>
                        <p className="text-xs text-slate-500 mt-1">{activity.detail}</p>
                        <span className="text-[10px] text-slate-400 mt-1">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-10">
              <div className="bg-blue-600 rounded-4xl p-8 shadow-xl shadow-blue-100">
                <h3 className="text-white font-black text-xl mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                    <FiPlus size={18} />
                    <span className="font-medium text-sm">Add New Admin</span>
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                    <FiBook size={18} />
                    <span className="font-medium text-sm">Review Courses</span>
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                    <FiDollarSign size={18} />
                    <span className="font-medium text-sm">View Revenue</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Notifications
                </h3>
                <NotificationsContent />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-12 pb-10">
            <h3 className="text-lg lg:text-xl font-black text-slate-800 mb-6 tracking-tight">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer">
                <FiPlus size={18} />
                <span className="font-medium text-sm">Add New Admin</span>
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer">
                <FiBook size={18} />
                <span className="font-medium text-sm">Review Courses</span>
              </button>
            </div>
          </div>
        </div>
      </main>

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
