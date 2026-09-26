"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiMenu, FiCheck, FiEyeOff, FiBell, FiClock } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  targetAudience: string;
  priority: string;
  isActive: boolean;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: Date;
  isRead: boolean;
}

export default function InstructorAnnouncementsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/announcement/instructor');
      if (res.data.status === 'success') {
        setAnnouncements(res.data.announcements);
      } else {
        setError("Failed to load announcements");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleMarkAsRead = async (announcementId: string) => {
    try {
      await axiosInstance.patch(`/api/announcement/${announcementId}/read`);
      setAnnouncements(announcements.map(ann => 
        ann._id === announcementId ? { ...ann, isRead: true } : ann
      ));
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleHideAnnouncement = async (announcementId: string) => {
    try {
      await axiosInstance.patch(`/api/announcement/${announcementId}/hide`);
      setAnnouncements(announcements.filter(ann => ann._id !== announcementId));
    } catch (err: any) {
      console.error('Failed to hide announcement:', err);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
        <InstructorSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/announcements"
          onLogout={handleLogout}
        />
        <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
          <div className="flex items-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden cursor-pointer p-2 border rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
            >
              <FiLoader size={20} />
            </button>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-20 w-full bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <InstructorSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor/announcements"
        onLogout={handleLogout}
      />

      <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden cursor-pointer p-2 border rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
              aria-label="Open sidebar"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>Announcements</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Stay updated with important news and updates
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
            <FiBell className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No announcements</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              When there are new announcements, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`rounded-2xl border p-6 transition-colors ${!announcement.isRead ? (isDark ? 'bg-slate-800 border-blue-500' : 'bg-blue-50 border-blue-200') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100')}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!announcement.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {announcement.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <FiClock size={12} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!announcement.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(announcement._id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-green-400 hover:bg-slate-600' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleHideAnnouncement(announcement._id)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      title="Hide announcement"
                    >
                      <FiEyeOff size={16} />
                    </button>
                  </div>
                </div>

                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}