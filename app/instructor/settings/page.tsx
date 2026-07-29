"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiSettings, FiUser, FiTrash2, FiAlertTriangle, FiMoon, FiSun, FiCheck, FiX, FiUpload } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import DeleteAccountModal from "@/app/components/DeleteAccountModal";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

export default function InstructorSettingsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "delete" | "bug">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { logout, user, setUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    bio: (user as any)?.bio || "",
    expertise: (user as any)?.expertise || [],
    profilePicture: (user as any)?.profilePicture || ""
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = (file: File) => {
    setUploadError("");
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please upload an image file");
      return;
    }

    // Validate file size (6MB)
    const maxSize = 6 * 1024 * 1024; // 6MB in bytes
    if (file.size > maxSize) {
      setUploadError("Image size must not exceed 6MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setProfileForm({ ...profileForm, profilePicture: base64 });
    };
    reader.onerror = () => {
      setUploadError("Failed to process image");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };


  // Bug report form state
  const [bugForm, setBugForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "critical"
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.patch('/api/instructor/profile', profileForm);
      if (res.data.status === 'success') {
        setSuccess("Profile updated successfully");
        setUser(res.data.instructor, 'instructor');
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };


  const handleReportBug = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post('/api/instructor/report-bug', bugForm);
      if (res.data.status === 'success') {
        setSuccess("Bug reported successfully");
        setBugForm({ title: "", description: "", priority: "medium" });
      } else {
        setError(res.data.message || "Failed to report bug");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to report bug");
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <InstructorSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor/settings"
        onLogout={handleLogout}
      />

    <main className={`grow p-5 lg:p-10 overflow-y-auto w-full ${isDark ? 'text-white' : 'text-[#111827]'}`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden cursor-pointer p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              aria-label="Open sidebar"
            >
              <FiLoader size={20} />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-medium">Settings</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              isDark 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiX className="text-red-600" size={20} />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiCheck className="text-green-600" size={20} />
            <p className="text-green-600 font-medium">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex gap-2 mb-8 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-500 hover:text-[#111827]"
            }`}
          >
            <FiUser className="inline mr-2" size={18} />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "delete"
                ? "border-red-600 text-red-600"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-500 hover:text-[#111827]"
            }`}
          >
            <FiTrash2 className="inline mr-2" size={18} />
            Delete Account
          </button>
          <button
            onClick={() => setActiveTab("bug")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "bug"
                ? "border-orange-600 text-orange-600"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-500 hover:text-[#111827]"
            }`}
          >
            <FiAlertTriangle className="inline mr-2" size={18} />
            Report Bug
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Edit Profile
            </h3>
            <form onSubmit={handleEditProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Profile Picture
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : isDark
                        ? 'border-slate-600 hover:border-slate-500 bg-slate-800'
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {profileForm.profilePicture ? (
                      <div className="space-y-3">
                        <img
                          src={profileForm.profilePicture}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-slate-300"
                        />
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Click or drag to replace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <FiUpload size={32} className={`mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            Click to upload or drag and drop
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            PNG, JPG, GIF up to 6MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Bio
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Expertise (comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.expertise.join(", ")}
                  onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value.split(",").map(s => s.trim()) })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <FiLoader className="animate-spin" size={20} /> : <FiCheck size={20} />}
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Delete Account Tab */}
        {activeTab === "delete" && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-600">
              <FiTrash2 size={20} />
              Delete Account
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All your data including courses, students, and earnings will be permanently deleted.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiTrash2 size={20} />
              Delete Account
            </button>
          </div>
        )}

        {/* Report Bug Tab */}
        {activeTab === "bug" && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-orange-600">
              <FiAlertTriangle size={20} />
              Report Bug
            </h3>
            <form onSubmit={handleReportBug} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Bug Title
                </label>
                <input
                  type="text"
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500' 
                      : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-orange-500'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  placeholder="Brief description of the bug"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  value={bugForm.description}
                  onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500' 
                      : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-orange-500'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none`}
                  placeholder="Detailed description of the bug, steps to reproduce, expected behavior, etc."
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Priority
                </label>
                <select
                  value={bugForm.priority}
                  onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value as any })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-orange-500' 
                      : 'bg-white border-slate-200 text-[#111827] focus:border-orange-500'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <FiLoader className="animate-spin" size={20} /> : <FiAlertTriangle size={20} />}
                Submit Bug Report
              </button>
            </form>
          </div>
        )}
      </main>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleLogout}
      />
    </div>
  );
}
