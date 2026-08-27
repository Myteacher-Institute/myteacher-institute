"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiLoader, FiUser, FiTrash2, FiAlertTriangle, FiMoon, FiSun, FiCheck, FiX, FiUpload, FiShare2, FiCopy, FiAward, FiMessageCircle } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import DeleteAccountModal from "@/app/components/DeleteAccountModal";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { mentorService } from "@/services/mentor.service";

export default function InstructorSettingsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "mentor" | "affiliate" | "delete" | "bug">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { logout, user, setUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();

  // ===== Become a Mentor state =====
  const [mentorState, setMentorState] = useState<"loading" | "active" | "inactive">("loading");
  const [isTogglingMentor, setIsTogglingMentor] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    whatsappNumber: "",
    mentorshipBio: "",
    mentorshipPrice: "",
  });

  const loadMentorStatus = async () => {
    try {
      const res = await mentorService.getMentorStatus();
      if (res.isMentor) {
        setMentorState("active");
        setMentorForm({
          whatsappNumber: res.mentorProfile?.whatsappNumber || "",
          mentorshipBio: res.mentorProfile?.mentorshipBio || "",
          mentorshipPrice: res.mentorProfile?.mentorshipPrice ? String(res.mentorProfile.mentorshipPrice) : "",
        });
      } else {
        setMentorState("inactive");
      }
    } catch {
      setMentorState("inactive");
    }
  };

  useEffect(() => {
    if (activeTab === "mentor") {
      const t = setTimeout(loadMentorStatus, 0);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  const handleToggleMentorship = async (activate: boolean) => {
    setIsTogglingMentor(true);
    setError("");
    setSuccess("");
    try {
      if (activate) {
        if (!mentorForm.whatsappNumber.trim()) {
          setError("WhatsApp number is required to activate mentorship");
          setIsTogglingMentor(false);
          return;
        }
        if (!mentorForm.mentorshipPrice || Number(mentorForm.mentorshipPrice) <= 0) {
          setError("Enter your price per session to activate mentorship");
          setIsTogglingMentor(false);
          return;
        }

        const res = await mentorService.becomeMentor({
          isMentor: true,
          whatsappNumber: mentorForm.whatsappNumber.trim(),
          mentorshipBio: mentorForm.mentorshipBio.trim() || undefined,
          mentorshipPrice: Number(mentorForm.mentorshipPrice),
        });
        if (res.status === 'success') {
          setMentorState("active");
          setSuccess(res.message || "Mentorship activated successfully");
        } else {
          setError(res.message || "Failed to activate mentorship");
        }
      } else {
        const res = await mentorService.becomeMentor({ isMentor: false });
        if (res.status === 'success') {
          setMentorState("inactive");
          setSuccess(res.message || "Mentorship deactivated");
        } else {
          setError(res.message || "Failed to deactivate mentorship");
        }
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Failed to update mentorship status");
    } finally {
      setIsTogglingMentor(false);
    }
  };

  // Affiliate account state
  const [affiliateState, setAffiliateState] = useState<"loading" | "active" | "inactive">("loading");
  const [affiliateId, setAffiliateId] = useState<string>("");
  const [isActivating, setIsActivating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const affiliateLink = affiliateId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?affiliate=${affiliateId}`
    : "";

  const loadAffiliateStatus = async () => {
    try {
      const res = await axiosInstance.get("/api/affiliate/status?userType=instructor");
      const affiliate = res.data?.affiliate;
      if (affiliate?.affiliate_id) {
        setAffiliateId(affiliate.affiliate_id);
        setAffiliateState("active");
      } else {
        setAffiliateState("inactive");
      }
    } catch {
      setAffiliateState("inactive");
    }
  };

  useEffect(() => {
    if (activeTab === "affiliate") {
      const t = setTimeout(loadAffiliateStatus, 0);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  const handleActivateAffiliate = async () => {
    setIsActivating(true);
    setError("");
    setSuccess("");
    try {
      const res = await axiosInstance.post("/api/affiliate/activate", { userType: "instructor" });
      if (res.data?.affiliate?.affiliate_id) {
        setAffiliateId(res.data.affiliate.affiliate_id);
        setAffiliateState("active");
        setSuccess("Affiliate account activated successfully");
      } else {
        setError(res.data?.message || "Failed to activate affiliate account");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Failed to activate affiliate account");
    } finally {
      setIsActivating(false);
    }
  };

  const handleCopyAffiliateLink = () => {
    if (!affiliateLink) return;
    navigator.clipboard.writeText(affiliateLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Profile form state
  const instructorUser = (user ?? {}) as {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    expertise?: string[];
    profilePicture?: string;
  };
  const [profileForm, setProfileForm] = useState({
    name: instructorUser.name || "",
    email: instructorUser.email || "",
    phone: instructorUser.phone || "",
    bio: instructorUser.bio || "",
    expertise: instructorUser.expertise || [] as string[],
    profilePicture: instructorUser.profilePicture || ""
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const handleFileUpload = async (file: File) => {
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

    // Upload the file directly — the backend saves it to disk and returns a URL,
    // so no base64 ever goes through the JSON profile endpoint.
    setIsUploadingPicture(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await axiosInstance.post('/api/instructor/profile-picture', formData);
      if (res.data.status === 'success') {
        setProfileForm(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      } else {
        setUploadError(res.data.message || "Failed to upload image");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setUploadError(message || "Failed to upload image");
    } finally {
      setIsUploadingPicture(false);
    }
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
      // Profile picture is uploaded separately via /api/instructor/profile-picture —
      // don't send it (or a stale value) through the JSON profile update.
      const res = await axiosInstance.patch('/api/instructor/profile', {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        bio: profileForm.bio,
        expertise: profileForm.expertise,
      });
      if (res.data.status === 'success') {
        setSuccess("Profile updated successfully");
        setUser(res.data.instructor, 'instructor');
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Failed to update profile");
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
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Failed to report bug");
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
            onClick={() => setActiveTab("mentor")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "mentor"
                ? "border-blue-600 text-blue-600"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-500 hover:text-[#111827]"
            }`}
          >
            <FiAward className="inline mr-2" size={18} />
            Become a Mentor
          </button>
          <button
            onClick={() => setActiveTab("affiliate")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "affiliate"
                ? "border-blue-600 text-blue-600"
                : isDark
                ? "border-transparent text-slate-400 hover:text-white"
                : "border-transparent text-slate-500 hover:text-[#111827]"
            }`}
          >
            <FiShare2 className="inline mr-2" size={18} />
            Affiliate
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
                      disabled={isUploadingPicture}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                    />
                    {isUploadingPicture ? (
                      <div className="space-y-3 py-2">
                        <FiLoader size={32} className="mx-auto animate-spin text-blue-500" />
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Uploading picture...
                        </p>
                      </div>
                    ) : profileForm.profilePicture ? (
                      <div className="space-y-3">
                        <Image
                          src={profileForm.profilePicture}
                          alt="Profile preview"
                          width={96}
                          height={96}
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

        {/* Become a Mentor Tab */}
        {activeTab === "mentor" && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FiAward className="text-blue-600" />
              Become a Mentor
            </h3>

            {mentorState === "loading" && (
              <div className="flex items-center gap-3 text-slate-500">
                <FiLoader className="animate-spin text-blue-600" size={20} />
                <span className="text-sm">Loading mentorship status...</span>
              </div>
            )}

            {mentorState === "inactive" && (
              <div className="space-y-6">
                <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Activate your mentorship account to appear in the mentors directory.
                    Students will discover you, request your guidance, and pay for sessions
                    directly — 70% of every payment goes to you. A valid WhatsApp number is
                    required so students can chat with you once a mentorship starts.
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    WhatsApp Number (international format)
                  </label>
                  <input
                    type="tel"
                    value={mentorForm.whatsappNumber}
                    onChange={(e) => setMentorForm({ ...mentorForm, whatsappNumber: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="+2348012345678"
                  />
                  <p className={`text-xs mt-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <FiMessageCircle size={14} /> We verify this number is on WhatsApp before activating your account
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Price per Session (₦)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={mentorForm.mentorshipPrice}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorshipPrice: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="e.g. 25000"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Mentorship Bio
                  </label>
                  <textarea
                    rows={4}
                    value={mentorForm.mentorshipBio}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorshipBio: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-[#111827] placeholder-slate-400 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                    placeholder="Describe what students can expect from your mentorship — goals you help with, your experience, session structure..."
                  />
                </div>
                <button
                  onClick={() => handleToggleMentorship(true)}
                  disabled={isTogglingMentor}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isTogglingMentor ? <FiLoader className="animate-spin" size={20} /> : <FiAward size={20} />}
                  Activate Mentorship
                </button>
              </div>
            )}

            {mentorState === "active" && (
              <div className="space-y-6">
                <div className="rounded-xl p-4 bg-green-50 border border-green-200">
                  <p className="text-green-700 text-sm font-medium">
                    <FiCheck className="inline mr-1" size={16} />
                    Mentorship account is active — students can now find and request you as their mentor
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={mentorForm.whatsappNumber}
                      onChange={(e) => setMentorForm({ ...mentorForm, whatsappNumber: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-[#111827]'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Price per Session (₦)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={mentorForm.mentorshipPrice}
                      onChange={(e) => setMentorForm({ ...mentorForm, mentorshipPrice: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-200 text-[#111827]'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Mentorship Bio
                  </label>
                  <textarea
                    rows={4}
                    value={mentorForm.mentorshipBio}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorshipBio: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-200 text-[#111827]'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none`}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleMentorship(true)}
                    disabled={isTogglingMentor}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isTogglingMentor ? <FiLoader className="animate-spin" size={20} /> : <FiCheck size={20} />}
                    Update Mentor Profile
                  </button>
                  <button
                    onClick={() => router.push('/instructor/mentor-requests')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    View Requests
                  </button>
                  <button
                    onClick={() => handleToggleMentorship(false)}
                    disabled={isTogglingMentor}
                    className="border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    {isTogglingMentor ? <FiLoader className="animate-spin" size={20} /> : <FiX size={20} />}
                    Deactivate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Affiliate Tab */}
        {activeTab === "affiliate" && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FiShare2 className="text-blue-600" />
              Affiliate Account
            </h3>

            {affiliateState === "loading" && (
              <div className="flex items-center gap-3 text-slate-500">
                <FiLoader className="animate-spin text-blue-600" size={20} />
                <span className="text-sm">Loading affiliate status...</span>
              </div>
            )}

            {affiliateState === "inactive" && (
              <div className="space-y-4">
                <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Activate your affiliate account to generate a unique referral
                    link. You earn commissions when students enroll in courses
                    through your link.
                  </p>
                </div>
                <button
                  onClick={handleActivateAffiliate}
                  disabled={isActivating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isActivating ? <FiLoader className="animate-spin" size={20} /> : <FiShare2 size={20} />}
                  Activate Affiliate Account
                </button>
              </div>
            )}

            {affiliateState === "active" && (
              <div className="space-y-6">
                <div className={`rounded-xl p-4 bg-green-50 border border-green-200`}>
                  <p className="text-green-700 text-sm font-medium">
                    <FiCheck className="inline mr-1" size={16} />
                    Affiliate account is active
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Affiliate ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={affiliateId}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-[#111827]'} font-mono`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Referral Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={affiliateLink}
                      className={`flex-1 px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600 text-blue-400' : 'bg-slate-50 border-slate-200 text-blue-600'} font-medium`}
                    />
                    <button
                      onClick={handleCopyAffiliateLink}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                        copiedLink ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <FiCopy size={18} />
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Earnings
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    ₦{(user as { affiliate_money?: number })?.affiliate_money ?? 0}
                  </p>
                </div>
              </div>
            )}
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
                  onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value as "low" | "medium" | "high" | "critical" })}
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
