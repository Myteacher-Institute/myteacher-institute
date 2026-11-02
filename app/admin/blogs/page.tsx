"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus, FiMenu, FiEdit2, FiTrash2, FiEye, FiFileText } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  published: boolean;
  author: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBlogsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
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

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/blog/author/my-posts');
      if (res.data.status === 'success') {
        setBlogs(res.data.blogs);
      } else {
        setError("Failed to load blogs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await axiosInstance.delete(`/api/blog/${blogId}`);
      if (res.data.status === 'success') {
        fetchBlogs();
      } else {
        setError(res.data.message || "Failed to delete blog");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete blog");
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
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>Manage Blogs</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Create, edit, and manage blog posts
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/admin/create-blog')}
            className={isDark ? "bg-transparent border border-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors" : "bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"}
          >
            <FiPlus size={18} /> <span className="whitespace-nowrap">Create Blog</span>
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

        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
              <FiFileText className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No blogs yet</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Create your first blog post to share your content.
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className={`rounded-2xl border p-6 transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {blog.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {blog.category}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatDate(blog.createdAt)} • By {blog.author?.name || 'Admin'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/edit-blog/${blog._id}`)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'} transition-colors`}
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>

                <div className="flex items-center gap-4 text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {blog.readTime}
                  </span>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={`px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
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
