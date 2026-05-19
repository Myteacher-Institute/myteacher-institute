"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  FiGrid, FiBook, FiUsers, FiDollarSign,
  FiStar, FiMessageSquare, FiTrendingUp,
  FiSettings, FiHelpCircle, FiBell, FiPlus, FiMoreHorizontal, FiArrowUpRight, FiMenu, FiX
} from 'react-icons/fi';

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#111827] font-semibold' : 'text-[#111827] hover:bg-slate-50'
    }`}>
    <Icon size={20} className={active ? "text-blue-600" : "text-blue-600"} />
    <span className="text-[15px] text-[#111827]">{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, icon: Icon, iconColor, bgColor }: any) => (
  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm shadow-slate-200/50">
    <div className={`p-2.5 w-fit mt-4 rounded-lg ${bgColor}`}>
      <Icon className={iconColor} size={20} />
    </div>
    <div className="grow">
      <p className="text-[#111827] text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-center justify-between mt-1">
        <h4 className="text-xl lg:text-2xl font-bold text-[#111827]">{value}</h4>
        <span className="text-[#166534] text-xs font-semibold flex items-center gap-0.5">
          <FiArrowUpRight size={14} /> {trend}
        </span>
      </div>
      <p className="text-[#111827] text-[11px] mt-1">vs last month</p>
    </div>
  </div>
);

export default function InstructorDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-poppins relative">

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- Sidebar --- */}
      {/* Changed lg:fixed to lg:sticky to prevent content overlap */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FFFFFF] border-r border-slate-100 p-8 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-[#111827]" aria-label="Close sidebar"><FiX size={24} /></button>

        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white"><FiBook size={24} /></div>
          <span className="font-bold text-[#111827] text-xl tracking-tight leading-tight">Myteacher <br /> <span className="font-semibold text-[#111827]">Institute</span></span>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <Image src={`https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400`} width={80} height={80} className="w-20 h-20 rounded-full object-cover p-1 border border-slate-100" alt="Henry Madu" />
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-4 border-white" />
          </div>
          <h3 className="font-bold text-[#111827] text-lg">Henry Madu</h3>
          <p className="text-[#111827] text-sm flex items-center gap-1 font-medium">Instructor <span className="text-emerald-500 text-[10px]">●</span></p>
        </div>

        <nav className="space-y-1 overflow-y-auto grow pr-2">
          <SidebarItem icon={FiGrid} label="Dashboard" active />
          <SidebarItem icon={FiBook} label="My Courses" />
          <SidebarItem icon={FiUsers} label="Students" />
          <SidebarItem icon={FiDollarSign} label="Earnings" />
          <SidebarItem icon={FiStar} label="Reviews" />
          <SidebarItem icon={FiMessageSquare} label="Announcements" />
          <SidebarItem icon={FiTrendingUp} label="Analytics" />
          <SidebarItem icon={FiSettings} label="Settings" />
          <SidebarItem icon={FiHelpCircle} label="Help & Support" />
        </nav>

        {/* Sidebar Promo Box */}
        {/* <div className="mt-6 bg-[#0A1629] p-6 rounded-3xl relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <p className="text-white font-semibold text-sm mb-4">Create New Course</p>
            <p className="text-[#FFFFFF] text-[11px] mb-5 leading-relaxed">Share your knowledge and reach more students.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 px-1.4 rounded-xl cursor-pointer font-bold text-xs flex items-center justify-center gap-1 transition-colors">
              <FiPlus /> Create New Course
            </button>
          </div>
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_85%_50%,rgba(124,58,237,0.6)_0%,rgba(124,58,237,0)_50%)]" />
        </div> */}
      </aside>

      {/* --- Main Content --- */}
      <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="lg:hidden cursor-pointer p-2 bg-[#FFFFFF] border border-slate-200 rounded-lg text-slate-600"><FiMenu size={20} /></button>
            <div>
              <h2 className="text-xl lg:text-2xl text-[#111827] font-medium">Welcome back, <span className="font-bold">Henry</span></h2>
              <p className="text-[#111827] text-xs lg:text-[15px]">Here&#39;s what&#39;s happening with your courses today.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" aria-label="View notifications" className="p-3 bg-[#FFFFFF] border border-slate-100 rounded-2xl text-[#111827] relative cursor-pointer hover:bg-slate-50"><FiBell size={22} /><span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" /></button>
            <button type="button" className="grow sm:grow-0 bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200"><FiPlus size={18} /> <span className="whitespace-nowrap">Create New Course</span></button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          <StatCard label="Total Students" value="2,548" trend="12.5%" icon={FiUsers} iconColor="text-[#0A66C2]" bgColor="bg-[#703BF521]" />
          <StatCard label="Total Courses" value="8" trend="2%" icon={FiBook} iconColor="text-[#166534]" bgColor="bg-[#E7F9F1]" />
          <StatCard label="Total Earnings" value="₦1,245,548" trend="12.5%" icon={FiDollarSign} iconColor="text-[#FEB00A]" bgColor="bg-[#FEFCD5]" />
          <StatCard label="Average Rating" value="4.8" trend="0.4" icon={FiStar} iconColor="text-[#2563EB]" bgColor="bg-[#703BF521]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-[#111827] text-lg lg:text-xl">My Courses</h3>
              <button className="text-[#2563EB] cursor-pointer font-bold text-sm">View all courses</button>
            </div>
            <div className="space-y-6 lg:space-y-8">
              {[
                { title: "UI/UX Design Fundamentals", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
                { title: "Complete Web Development Bootcamp", students: "838", lessons: "52", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
                { title: "Digital Marketing Masterclass", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
                { title: "AI Fundamentals", students: "1,238", lessons: "38", status: "Draft", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
                { title: "Python for Beginners", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between group overflow-hidden">
                  <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                    <Image src={course.img} width={96} height={64} className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl object-cover shadow-sm shrink-0" alt={course.title} />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#111827] text-sm lg:text-[16px] mb-0.5 truncate">{course.title}</h4>
                      <p className="text-[#111827] text-[10px] lg:text-xs font-medium truncate">{course.students} students ● {course.lessons} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0">
                    <span className={`hidden sm:inline-block px-4 py-1.5 text-[11px] font-bold rounded-full ${course.status === 'Draft' ? 'bg-[#E7F9F1] text-[#FEB00A]' : 'bg-[#E7F9F1] text-[#5CC68C]'}`}>{course.status}</span>
                    <FiMoreHorizontal className="text-[#111827] cursor-pointer" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-8">
            <section className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-6 lg:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-[#111827] text-lg lg:text-xl">Recent Activity</h3>
                <button className="text-[#2563EB] cursor-pointer font-bold text-sm">View all</button>
              </div>
              <div className="space-y-6">
                {[
                  { user: "New student enrolled in", action: "UI/UX Design Fundamentals", time: "2 minutes ago", icon: FiUsers, color: "text-blue-600 bg-blue-50" },
                  { user: "New student enrolled in", action: "UI/UX Design Fundamentals", time: "2 minutes ago", icon: FiUsers, color: "text-[#111827] bg-blue-50" },
                  { user: "New review on", action: "Complete Web Development Bootcamp", time: "1 hour ago", icon: FiStar, color: "text-[#FEB00A] bg-[#FFEDD5]" },
                  { user: "Payment of ₦120,000 initiated", action: "", time: "1 hour ago", icon: FiDollarSign, color: "text-emerald-500 bg-emerald-50" },
                  { user: "Payment of ₦120,000 initiated", action: "", time: "1 hour ago", icon: FiDollarSign, color: "text-emerald-500 bg-emerald-50" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`p-2.5 rounded-xl h-fit ${item.color}`}><item.icon size={18} /></div>
                    <div>
                      <p className="text-[14px] text-[#111827] leading-tight">{item.user} <br /><span className="font-bold text-[#111827]">{item.action}</span></p>
                      <span className="text-[11px] text-slate-600 font-medium">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-6 lg:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-[#111827] text-lg lg:text-xl">Top Courses</h3>
                <button className="text-[#2563EB] font-bold text-sm cursor-pointer">View full report</button>
              </div>
              <div className="space-y-5">
                {[
                  { id: 1, title: "UI/UX Design Fundamentals", price: "₦120,000", perc: "36%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
                  { id: 2, title: "Digital Marketing Masterclass", price: "₦100,000", perc: "26%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="font-bold text-[#111827] text-sm w-4">{item.id}</span>
                    <div className="w-24 h-10 bg-slate-100 rounded-lg overflow-hidden"><Image src={item.img} width={96} height={40} className="w-24 h-10 object-cover shadow-sm" alt={item.title} /></div>
                    <div className="grow min-w-0"><p className="text-[13px] font-bold text-[#111827] truncate">{item.title}</p></div>
                    <div className="flex gap-1 text-right shrink-0"><p className="text-[13px] font-bold text-[#111827]">{item.price}</p><p className="text-[10px] mt-1 text-slate-600 font-bold">({item.perc})</p></div>
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