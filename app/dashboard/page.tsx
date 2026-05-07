"use client";

import React from 'react';
import {
  FiGrid, FiBook, FiUsers, FiDollarSign,
  FiStar, FiMessageSquare, FiTrendingUp,
  FiSettings, FiHelpCircle, FiBell, FiPlus, FiMoreHorizontal, FiArrowUpRight
} from 'react-icons/fi';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
    }`}>
    <Icon size={20} className={active ? "text-blue-600" : "text-slate-600"} />
    <span className="text-[15px]">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, icon: Icon, iconColor, bgColor }: any) => (
  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-start gap-3.5 shadow-sm shadow-slate-200/50">
    <div className={`p-2 w-fit rounded-lg ${bgColor} mt-5 mb-2`}>
      <Icon className={iconColor} size={18} />
    </div>
    <div className="space-y-2">
      <p className="text-slate-700 text-xs font-medium">{label}</p>
      <div className="flex items-center gap-6 pt-1">
        <h4 className="text-2xl font-bold text-slate-900 leading-none">{value}</h4>
        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
          <FiArrowUpRight size={14} /> {trend}
        </span>
      </div>
      <p className="text-slate-600 text-[11px]">vs last month</p>
    </div>
  </div>
);

export default function InstructorDashboard() {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-poppins">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <FiBook size={24} />
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight leading-tight">
            Myteacher <br /> <span className="font-semibold">Institute</span>
          </span>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format"
              className="w-20 h-20 rounded-full object-cover p-1 border border-slate-100"
              alt="Henry Madu"
            />
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-4 border-white" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Henry Madu</h3>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Instructor <span className="text-emerald-500 text-[10px]">●</span>
          </p>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={FiGrid} label="Dashboard" active />
          <SidebarItem icon={FiBook} label="My Courses" classname="text-slate-600" />
          <SidebarItem icon={FiUsers} label="Students" />
          <SidebarItem icon={FiDollarSign} label="Earnings" />
          <SidebarItem icon={FiStar} label="Reviews" />
          <SidebarItem icon={FiMessageSquare} label="Announcements" />
          <SidebarItem icon={FiTrendingUp} label="Analytics" />
          <SidebarItem icon={FiSettings} label="Settings" />
          <SidebarItem icon={FiHelpCircle} label="Help & Support" />
        </nav>

        {/* Sidebar Promo Box */}
        <div className="mt-10 bg-[#0A1629] p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white font-semibold text-sm mb-4">Create New Course</p>
            <p className="text-slate-200 text-xs mb-6 leading-relaxed">Share your knowledge and reach more students.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-xl cursor-pointer font-bold text-xs flex items-center justify-center gap-2 transition-colors">
              <FiPlus /> Create New Course
            </button>
          </div>
          <div
            className="absolute top-0 right-0 w-full h-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 85% 50%, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0) 50%)'
            }}
          />

          {/* Subtle secondary glow to blend the edge */}
          <div
            className="absolute -right-10 top-1/4 w-32 h-40 bg-purple-600/30 blur-[60px] pointer-events-none"
          />
        </div>

      </aside>

      {/* --- Main Content --- */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl text-slate-900 font-medium">
              Welcome back, <span className="font-bold">Henry</span>
            </h2>
            <p className="text-slate-600 text-[15px]">Here's what's happening with your courses today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              title="Notifications"
              aria-label="View notifications"
              className="p-3 bg-white border border-slate-100 rounded-2xl cursor-pointer text-blue-600 relative hover:bg-slate-50 transition-colors"
            >
              <FiBell size={22} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold cursor-pointer text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all">
              <FiPlus size={18} /> Create New Course
            </button>
          </div>
        </header>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Students" value="2,548" trend="12.5%" icon={FiUsers} iconColor="text-indigo-600" bgColor="bg-indigo-50" />
          <StatCard label="Total Courses" value="8" trend="2%" icon={FiBook} iconColor="text-emerald-600" bgColor="bg-emerald-50" />
          <StatCard label="Total Earnings" value="₦1,245,548" trend="12.5%" icon={FiDollarSign} iconColor="text-orange-500" bgColor="bg-orange-50" />
          <StatCard label="Average Rating" value="4.8%" trend="0.4" icon={FiStar} iconColor="text-blue-600" bgColor="bg-blue-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- My Courses Section --- */}
          <section className="lg:col-span-2 bg-white rounded-[32px] border border-slate-50 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-slate-900 text-xl">My Courses</h3>
              <button className="text-blue-600 cursor-pointer font-bold text-sm hover:underline">View all courses</button>
            </div>

            <div className="space-y-8">
              {[
                { title: "UI/UX Design Fundamentals", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
                { title: "Complete Web Development Bootcamp", students: "838", lessons: "52", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
                { title: "Digital Marketing Masterclass", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
                { title: "AI Fundamentals", students: "1,238", lessons: "38", status: "Draft", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
                { title: "Python for Beginners", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <img src={course.img} className="w-24 h-16 rounded-2xl object-cover shadow-sm" alt={course.title} />
                    <div>
                      <h4 className="font-bold text-slate-900 text-[16px] mb-1">{course.title}</h4>
                      <p className="text-slate-600 text-xs font-medium">{course.students} students <span className='font-bold text-[20px] rounded-full'>.</span> {course.lessons} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full ${course.status === 'Draft' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'
                      }`}>
                      {course.status}
                    </span>
                    <FiMoreHorizontal className="text-slate-600 hover:text-slate-600" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Sidebar Cards --- */}
          <div className="space-y-8">
            <section className="bg-white rounded-[32px] border border-slate-50 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900 text-xl">Recent Activity</h3>
                <button className="text-blue-600 cursor-pointer font-bold text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-6">
                {[
                  { user: "New student enrolled in", action: "UI/UX Design Fundamentals", time: "2 minutes ago", icon: FiUsers, color: "text-blue-600 bg-blue-50" },
                  { user: "New review on", action: "Complete Web Development Bootcamp", time: "1 hour ago", icon: FiStar, color: "text-orange-500 bg-orange-50" },
                  { user: "Payment of ₦120,000 initiated", action: "", time: "1 hour ago", icon: FiDollarSign, color: "text-emerald-500 bg-emerald-50" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`p-2.5 rounded-xl h-fit ${item.color}`}><item.icon size={18} /></div>
                    <div>
                      <p className="text-[14px] text-slate-500 leading-tight">
                        {item.user} <br />
                        <span className="font-bold text-slate-900">{item.action}</span>
                      </p>
                      <span className="text-[11px] text-slate-600 font-medium">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[32px] border border-slate-50 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-900 text-xl">Top Courses</h3>
                <button className="text-blue-600 cursor-pointer font-bold text-sm hover:underline">View full report</button>
              </div>
              <div className="space-y-5">
                {[
                  { id: 1, title: "UI/UX Design Fundamentals", price: "₦120,000", perc: "36%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
                  { id: 2, title: "Digital Marketing Masterclass", price: "₦100,000", perc: "26%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" }
                ].map((item, i) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm w-4">{item.id}</span>
                    <div className="w-24 h-10 bg-slate-100 rounded-lg overflow-hidden">
                      <img src={item.img} className="w-24 h-10 object-cover shadow-sm" alt={item.title} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[13px] font-bold text-slate-900 truncate w-32">{item.title}</p>
                    </div>
                    <div className="flex gap-1 text-right">
                      <p className="text-[13px] font-bold text-slate-900">{item.price}</p>
                      <p className="text-[10px] mt-1 text-slate-600 font-bold">({item.perc})</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}