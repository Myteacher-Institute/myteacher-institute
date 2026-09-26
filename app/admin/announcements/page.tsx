"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus, FiMenu, FiSend, FiCheck, FiX, FiBell } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
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
  readBy: Array<{ userId: string; readAt: Date }>;
}

export default function AdminAnnouncementsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    priority: "medium"
  });
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
      const res = await axiosInstance.get('/api/announcement/all');
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await axiosInstance.post('/api/announcement/create', formData);
      if (res.data.status === 'success') {
        setShowCreateForm(false);
        setFormData({ title: "", content: "", targetAudience: "all", priority: "medium" });
        fetchAnnouncements();
      } else {
        setError(res.data.message || "Failed to create announcement");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create announcement");
    } finally {
      setIsCreating(false);
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
        <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
          <div className="flex items-center gap-4 mb-10">
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
                Create and manage announcements for instructors
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={isDark ? "bg-transparent border border-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors" : "bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"}
          >
            <FiPlus size={18} /> <span className="whitespace-nowrap">Create Announcement</span>
          </button>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {showCreateForm && (
          <div className={`rounded-2xl border p-6 mb-10 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              <FiBell className="text-blue-600" />
              Create New Announcement
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={4}
                  placeholder="Enter announcement content"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="all">All Users</option>
                    <option value="instructors">Instructors Only</option>
                    <option value="students">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}
                  {isCreating ? 'Creating...' : 'Send Announcement'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`px-6 py-3 rounded-xl font-semibold ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-[#111827] hover:bg-slate-200'} transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
              <FiBell className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No announcements yet</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Create your first announcement to keep instructors informed.
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`rounded-2xl border p-6 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {announcement.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {announcement.targetAudience}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDate(announcement.createdAt)} • By {announcement.createdBy.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {announcement.isActive ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <FiCheck size={16} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <FiX size={16} /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {announcement.content}
                </p>

                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Read by {announcement.readBy?.length || 0} instructors
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}