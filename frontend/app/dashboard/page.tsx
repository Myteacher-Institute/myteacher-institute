"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Award,
  Bot,
  Users,
  Bell,
  Menu,
  X,
  Clock,
  CheckCircle2,
  PlayCircle,
  Code2,
  Database,
  Palette,
  Megaphone,
  User,
  Smartphone,
  Terminal,
  ArrowRight,
  MessageCircle,
  AlertTriangle, // Added for notifications
  Info,          // Added for notifications
} from "lucide-react";

// --- 1. CONSTANTS & MOCK DATA ---
const COURSES = [
  {
    id: 1,
    title: "Advanced React Mastery",
    progress: 68,
    icon: <Code2 size={20} strokeWidth={1.5} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    progress: 34,
    icon: <Database size={20} strokeWidth={1.5} />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    progress: 55,
    icon: <Palette size={20} strokeWidth={1.5} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    progress: 22,
    icon: <Megaphone size={20} strokeWidth={1.5} />,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const RECOMMENDED = [
  {
    t: "ML Basics",
    d: "Next in Data Science",
    i: <Bot size={20} strokeWidth={1.5} />,
    c: "bg-indigo-50 text-indigo-600",
  },
  {
    t: "Mobile Apps",
    d: "Expand React skills",
    i: <Smartphone size={20} strokeWidth={1.5} />,
    c: "bg-rose-50 text-rose-600",
  },
  {
    t: "Backend Dev",
    d: "Server-side logic",
    i: <Terminal size={20} strokeWidth={1.5} />,
    c: "bg-teal-50 text-teal-600",
  },
  {
    t: "Cloud Computing",
    d: "Scale your apps",
    i: <Database size={20} strokeWidth={1.5} />,
    c: "bg-sky-50 text-sky-600",
  },
];

// Updated Notifications to match your image
const NOTIFICATIONS = [
  { 
    id: 1, 
    title: "Assignment Due Soon", 
    description: "React project due in 2 days", 
    type: "warning" 
  },
  { 
    id: 2, 
    title: "New Course Available", 
    description: "Advanced JavaScript just launched", 
    type: "info" 
  },
  { 
    id: 3, 
    title: "Certificate Ready", 
    description: "UI/UX Design certificate is ready", 
    type: "success" 
  },
];

const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: "Dashboard", active: true },
  { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "My Courses" },
  { icon: <LineChart size={18} strokeWidth={1.5} />, label: "Progress" },
  { icon: <Bot size={18} strokeWidth={1.5} />, label: "AI Tutor" },
  { icon: <Award size={18} strokeWidth={1.5} />, label: "Certificates" },
  { icon: <Users size={18} strokeWidth={1.5} />, label: "Mentorship" },
  { icon: <Megaphone size={18} strokeWidth={1.5} />, label: "Community" },
];

// --- 2. REUSABLE ATOMS ---

const StatCard = ({ label, value, icon, iconBgColor }: any) => (
  <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-w-[170px] md:min-w-0 flex-1 snap-center">
    <div className="min-w-0 mr-2">
      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl lg:text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
    <div
      className={`w-10 h-10 lg:w-12 lg:h-12 ${iconBgColor} rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm`}
    >
      {icon}
    </div>
  </div>
);

const CourseCard = ({ title, progress, icon, color, bg }: any) => (
  <div className="bg-white p-3 lg:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors">
    <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-6 min-w-0">
      <div
        className={`w-8 h-8 lg:w-12 lg:h-12 ${bg} ${color} rounded-lg lg:rounded-xl flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <h4 className="font-bold text-[11px] lg:text-base leading-tight line-clamp-2 text-slate-800">
        {title}
      </h4>
    </div>
    <div className="mt-auto">
      <div className="flex justify-between text-[8px] lg:text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
        <span>PROGRESS</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1 lg:h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <button className="w-full py-2 lg:py-3 bg-blue-600 text-white text-[10px] lg:text-sm font-bold rounded-lg lg:rounded-xl active:scale-95 transition-transform hover:bg-blue-700">
        Continue
      </button>
    </div>
  </div>
);

// --- 3. SECTIONS ---

const MentorWidget = () => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
      <span className="text-white">
        <User size={24} strokeWidth={1.5} />
      </span>
    </div>
    <h4 className="text-lg font-bold mb-2 leading-tight text-white">
      Work with a mentor
    </h4>
    <p className="text-blue-100 text-xs mb-6 max-w-xs">
      Get guidance from industry experts Omeke Charles at Myteacher. Accelerate your growth.
    </p>
    <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl shadow-md active:bg-blue-50 transition-colors hover:bg-slate-50">
      Book Now
    </button>
  </div>
);

const RecommendedSection = () => (
  <div className="space-y-3">
    {RECOMMENDED.map((rec, idx) => (
      <div
        key={idx}
        className="bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <div
          className={`w-10 h-10 ${rec.c} rounded-xl flex items-center justify-center shrink-0`}
        >
          {rec.i}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-bold truncate text-slate-800">{rec.t}</h4>
          <p className="text-[11px] text-slate-400 truncate mb-1">{rec.d}</p>
          <button className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    ))}
  </div>
);

// Updated Notification UI to match your image
const NotificationsContent = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-500 fill-yellow-500/10" />;
      case "success":
        return <CheckCircle2 size={20} className="text-green-500 fill-green-500/10" />;
      default:
        return <Info size={20} className="text-blue-500 fill-blue-500/10" />;
    }
  };

  return (
    <div className="space-y-4">
      {NOTIFICATIONS.map((item) => (
        <div 
          key={item.id} 
          className="flex gap-4 items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="shrink-0">
            {getIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] lg:text-[15px] font-bold text-slate-800 leading-tight">
              {item.title}
            </h4>
            <p className="text-[12px] lg:text-[13px] text-slate-500 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>
      ))}
      {NOTIFICATIONS.length === 0 && (
        <p className="text-center text-[12px] text-slate-400 py-4">No new notifications</p>
      )}
    </div>
  );
};

const SidebarNavContent = () => (
  <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
    {SIDEBAR_ITEMS.map((item, i) => (
      <button
        key={i}
        className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
      >
        {item.icon}
        {item.label}
      </button>
    ))}
    <div className="p-4 bg-slate-50 rounded-xl mt-6 border border-slate-100">
        <p className="text-xs text-slate-500">Need help Omeke Charles?</p>
        <button className="flex items-center gap-2 mt-2 text-[11px] font-bold text-blue-600 hover:underline">Chat with Support <ArrowRight size={12} /></button>
    </div>
  </nav>
);


// --- 4. MAIN DASHBOARD ---

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  const handleNotifyToggle = () => {
    if (window.innerWidth < 1024) {
      setNotifyOpen(!notifyOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-slate-200 fixed h-full z-[70] transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>
          <button className="lg:hidden p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(false)}>
            <X size={18} className="text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
            <SidebarNavContent />
        </div>

        <div className="p-6 border-t border-slate-50 shrink-0">
            <button className="w-full text-center text-sm font-bold text-slate-500 py-3 rounded-xl hover:bg-slate-50 transition-colors">Log out Omeke Charles</button>
        </div>
      </aside>

      <main className="lg:ml-64 flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} className="text-slate-700" />
            </button>
            <h2 className="font-bold text-slate-800 text-sm lg:text-base whitespace-nowrap">
              Hello, Omeke Charles!
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-5 relative">
            <div className="relative">
              <button
                onClick={handleNotifyToggle}
                className={`p-2.5 rounded-xl transition-colors lg:cursor-default ${notifyOpen ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50 lg:hover:bg-transparent"}`}
              >
                <Bell size={19} strokeWidth={2} />
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {notifyOpen && (
                <div className="lg:hidden absolute top-16 right-0 w-[calc(100vw-32px)] bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] animate-in fade-in slide-in-from-top-4 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-black text-xl text-slate-800">Notifications</h3>
                        <button onClick={() => setNotifyOpen(false)} className="p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100">
                            <X size={18} className="text-slate-600" />
                        </button>
                    </div>
                    <NotificationsContent />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 lg:gap-3 pl-3 border-l border-slate-100">
              <span className="hidden md:block text-xs font-bold text-slate-700 uppercase tracking-tight">
                Omeke Charles
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shadow-inner shrink-0 border border-slate-200">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Charles"
                  alt="Omeke Charles Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
            <StatCard label="Completed Courses" value="12" icon={<CheckCircle2 size={20} strokeWidth={2.5} />} iconBgColor="bg-green-500" />
            <StatCard label="Active Learning" value="4" icon={<PlayCircle size={20} strokeWidth={2.5} />} iconBgColor="bg-blue-500" />
            <StatCard label="Hours Studied" value="124" icon={<Clock size={20} strokeWidth={2.5} />} iconBgColor="bg-purple-500" />
            <StatCard label="Badges & Awards" value="8" icon={<Award size={20} strokeWidth={2.5} />} iconBgColor="bg-yellow-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Continue Learning Omeke Charles
                </h3>
                <button className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
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
                <RecommendedSection />
              </div>
              
              <div className="bg-blue-600 rounded-[32px] p-8 shadow-xl shadow-blue-100">
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
            <RecommendedSection />
          </div>
        </div>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[60]">
        {mentorOpen && (
          <div className="absolute bottom-20 right-0 w-[calc(100vw-48px)] max-w-[320px] bg-blue-600 rounded-[2rem] p-7 shadow-2xl animate-in slide-in-from-bottom-10 z-[110]">
             <div className="absolute top-5 right-5 z-[120]">
                <button onClick={() => setMentorOpen(false)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30">
                    <X size={16} className="text-white" />
                </button>
             </div>
            <MentorWidget />
          </div>
        )}
        <button
          onClick={() => setMentorOpen(!mentorOpen)}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center border-4 border-white active:scale-95 transition-all z-[100] relative"
        >
          {mentorOpen ? <X size={26} strokeWidth={2.5} /> : <MessageCircle size={26} strokeWidth={2.5} />}
        </button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}