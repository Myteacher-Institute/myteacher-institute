"use client";

import { FiBell as Bell, FiMenu as MenuIcon, FiX as X } from "react-icons/fi";

export const DashboardHeader = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  notifyOpen, 
  setNotifyOpen,
  NotificationsContent 
}: any) => {
  const handleNotifyToggle = () => {
    if (window.innerWidth < 1024) {
      setNotifyOpen(!notifyOpen);
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon size={22} className="text-slate-700" />
        </button>
        <h2 className="font-bold text-slate-800 text-sm lg:text-base whitespace-nowrap">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 lg:gap-5 relative">
        <div className="relative">
          <button
            onClick={handleNotifyToggle}
            className={`p-2.5 rounded-xl transition-colors lg:cursor-default ${notifyOpen
                ? "bg-blue-50 text-blue-600"
                : "text-slate-400 hover:bg-slate-50 lg:hover:bg-transparent cursor-pointer"
              }`}
          >
            <Bell size={19} strokeWidth={2} />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {notifyOpen && (
            <div className="lg:hidden absolute top-16 right-0 w-[calc(100vw-32px)] bg-white border border-slate-100 shadow-2xl rounded-2xl z-100 animate-in fade-in slide-in-from-top-4 p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-xl text-slate-800">Notifications</h3>
                <button
                  onClick={() => setNotifyOpen(false)}
                  className="p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
              <NotificationsContent />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3 pl-3 border-l border-slate-100">
          <span className="hidden md:block text-xs font-bold text-slate-700 uppercase tracking-tight">
            Admin
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shadow-inner shrink-0 border border-slate-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
