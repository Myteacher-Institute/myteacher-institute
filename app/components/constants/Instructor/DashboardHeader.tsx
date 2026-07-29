"use client";

import { FiBell as Bell, FiMenu as MenuIcon, FiX as X } from "react-icons/fi";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

export const DashboardHeader = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  notifyOpen, 
  setNotifyOpen,
  NotificationsContent 
}: any) => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleNotifyToggle = () => {
    if (window.innerWidth < 1024) {
      setNotifyOpen(!notifyOpen);
    }
  };

  return (
    <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-100'}`}>
      <div className="flex items-center gap-3">
        <button
          className={`lg:hidden p-2 rounded-lg cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon size={22} className={isDark ? 'text-slate-300' : 'text-slate-700'} />
        </button>
        <h2 className={`font-bold text-sm lg:text-base whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Hello, {user?.name || 'Instructor'}!
        </h2>
      </div>

      <div className="flex items-center gap-3 lg:gap-5 relative">
        <div className="relative">
          <button
            onClick={handleNotifyToggle}
            className={`p-2.5 rounded-xl transition-colors lg:cursor-default ${notifyOpen
                ? isDark
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-50 text-green-600'
                : isDark
                ? 'text-slate-400 hover:bg-slate-800 lg:hover:bg-transparent cursor-pointer'
                : 'text-slate-400 hover:bg-slate-50 lg:hover:bg-transparent cursor-pointer'
              }`}
          >
            <Bell size={19} strokeWidth={2} />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {notifyOpen && (
            <div className={`lg:hidden absolute top-16 right-0 w-[calc(100vw-32px)] border shadow-2xl rounded-2xl z-100 animate-in fade-in slide-in-from-top-4 p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-5">
                <h3 className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>Notifications</h3>
                <button
                  onClick={() => setNotifyOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer ${isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-50 text-slate-600'}`}
                >
                  <X size={18} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                </button>
              </div>
              <NotificationsContent />
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 lg:gap-3 pl-3 border-l ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <span className={`hidden md:block text-xs font-bold uppercase tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            {user?.name || 'Instructor'}
          </span>
          <div className={`w-9 h-9 rounded-xl overflow-hidden shadow-inner shrink-0 border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-green-100 border-green-200'}`}>
            <img
              src={user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Instructor'}`}
              alt={user?.name || 'Instructor Avatar'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
