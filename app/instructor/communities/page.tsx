"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus, FiMenu, FiUsers, FiMessageSquare, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface Community {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  coverImage: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  courses: Array<{
    courseId: string;
    courseName: string;
    category: string;
    price: number;
  }>;
  members: Array<{
    userId: string;
    userName: string;
    joinedAt: Date;
  }>;
  posts: Array<{
    content: string;
    mediaType: string;
    mediaUrl: string;
    likes: Array<{ userId: string; likedAt: Date }>;
    comments: Array<{ userId: string; userName: string; comment: string; commentedAt: Date }>;
    createdAt: Date;
  }>;
  followerCount: number;
  createdAt: Date;
}

export default function InstructorCommunitiesPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    profilePicture: "",
    coverImage: ""
  });
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const fetchCommunities = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/community/all');
      if (res.data.status === 'success') {
        // Filter to show only communities created by this instructor
        const instructorCommunities = res.data.data.filter(
          (community: Community) => community.creator._id === user?._id
        );
        setCommunities(instructorCommunities);
      } else {
        setError("Failed to load communities");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load communities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await axiosInstance.post('/api/community/create', formData);
      if (res.data.status === 'success') {
        setShowCreateForm(false);
        setFormData({ name: "", description: "", profilePicture: "", coverImage: "" });
        fetchCommunities();
      } else {
        setError(res.data.message || "Failed to create community");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create community");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (communityId: string) => {
    if (!confirm("Are you sure you want to delete this community? This action cannot be undone.")) return;

    try {
      const res = await axiosInstance.delete(`/api/community/${communityId}`);
      if (res.data.status === 'success') {
        fetchCommunities();
      } else {
        setError(res.data.message || "Failed to delete community");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete community");
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
        <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>My Communities</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Create and manage your learning communities
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={isDark ? "bg-transparent border border-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors" : "bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"}
          >
            <FiPlus size={18} /> <span className="whitespace-nowrap">Create Community</span>
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
              <FiUsers className="text-blue-600" />
              Create New Community
            </h3>
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Community Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter community name"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={4}
                  placeholder="Describe your community purpose"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Profile Picture URL (optional)
                </label>
                <input
                  type="text"
                  value={formData.profilePicture}
                  onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Cover Image URL (optional)
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-[#111827]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? <FiLoader className="animate-spin" size={18} /> : <FiPlus size={18} />}
                  {isCreating ? 'Creating...' : 'Create Community'}
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
          {communities.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
              <FiUsers className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No communities yet</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Create your first community to engage with your students.
              </p>
            </div>
          ) : (
            communities.map((community) => (
              <div
                key={community._id}
                className={`rounded-2xl border p-6 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {community.name}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {community.followerCount} members
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Created {formatDate(community.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/instructor/community/${community._id}`)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'} transition-colors`}
                      title="View Community"
                    >
                      <FiMessageSquare size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(community._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {community.posts.length} posts
                  </span>
                  {community.courses && community.courses.length > 0 && (
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {community.courses.length} linked courses
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
