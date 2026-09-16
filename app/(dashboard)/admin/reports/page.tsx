"use client";

import { useEffect, useState } from "react";
import {
  FiFlag,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFilter,
  FiSearch,
  FiMessageSquare,
  FiExternalLink,
} from "react-icons/fi";
import AdminSidebar from "@/app/components/AdminSidebar";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import axiosInstance from "@/lib/axios";

interface InstructorReport {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  instructorId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  instructorName: string;
  reason: string;
  description: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  adminNotes?: string;
  mentorshipId?: {
    _id: string;
    status: string;
    programDuration?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reports, setReports] = useState<InstructorReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<InstructorReport | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get(`/api/reports/instructor${filter !== "all" ? `?status=${filter}` : ""}`);
        if (res.data.status === "success") {
          setReports(res.data.reports);
        } else {
          setError(res.data.message || "Failed to fetch reports");
        }
      } catch (err) {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filter]);

  const handleUpdateStatus = async (reportId: string, newStatus: string, adminNotes?: string) => {
    setUpdatingStatus(reportId);
    try {
      const res = await axiosInstance.patch(`/api/reports/instructor/${reportId}`, {
        status: newStatus,
        adminNotes,
      });

      if (res.data.status === "success") {
        // Refresh reports
        const refreshed = await axiosInstance.get(`/api/reports/instructor${filter !== "all" ? `?status=${filter}` : ""}`);
        if (refreshed.data.status === "success") {
          setReports(refreshed.data.reports);
        }
      } else {
        alert(res.data.message || "Failed to update report status");
      }
    } catch (err) {
      alert("Failed to update report status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredReports = reports.filter((report) =>
    searchQuery.trim() === "" ||
    report.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.studentId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "reviewing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "dismissed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? "bg-slate-900 text-slate-100" : "bg-[#F8FAFC] text-[#1E293B]"}`}>
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
        activePath="/admin/reports"
        onLogout={handleLogout}
      />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto w-full lg:ml-72 min-w-0 z-10 relative">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Instructor Reports</h1>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Review and manage instructor reports from students
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} size={18} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
                    : "bg-white border-slate-200 text-[#1E293B] placeholder-slate-400 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <div className="relative">
              <FiFilter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`} size={18} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`pl-10 pr-8 py-2 rounded-xl border appearance-none cursor-pointer ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                    : "bg-white border-slate-200 text-[#1E293B] focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 animate-pulse ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
              >
                <div className="h-6 w-3/4 rounded mb-4 bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-1/2 rounded mb-2 bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`rounded-2xl border p-8 text-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
            <FiFlag size={48} className={`mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-400"}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-[#1E293B]"}`}>
              No reports found
            </h3>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {searchQuery ? "Try adjusting your search terms" : "No instructor reports have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                        <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                        {report.reason}
                      </h3>
                      <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Student</p>
                      <p className={`font-medium ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                        {report.studentId.name}
                      </p>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {report.studentId.email}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Instructor</p>
                      <p className={`font-medium ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                        {report.instructorName}
                      </p>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {report.instructorId.email}
                      </p>
                    </div>
                  </div>

                  {report.adminNotes && (
                    <div className={`mb-4 p-3 rounded-lg ${isDark ? "bg-slate-700" : "bg-blue-50"}`}>
                      <p className={`text-xs font-semibold mb-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                        Admin Notes
                      </p>
                      <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        {report.adminNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(report._id, "reviewing")}
                          disabled={updatingStatus === report._id}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                        >
                          <FiClock size={16} />
                          {updatingStatus === report._id ? "Processing..." : "Start Review"}
                        </button>
                      </>
                    )}

                    {report.status === "reviewing" && (
                      <>
                        <button
                          onClick={() => {
                            const notes = prompt("Add admin notes (optional):");
                            if (notes !== null) {
                              handleUpdateStatus(report._id, "resolved", notes);
                            }
                          }}
                          disabled={updatingStatus === report._id}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                        >
                          <FiCheckCircle size={16} />
                          {updatingStatus === report._id ? "Processing..." : "Resolve"}
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt("Add admin notes (optional):");
                            if (notes !== null) {
                              handleUpdateStatus(report._id, "dismissed", notes);
                            }
                          }}
                          disabled={updatingStatus === report._id}
                          className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                        >
                          <FiXCircle size={16} />
                          {updatingStatus === report._id ? "Processing..." : "Dismiss"}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        const notes = prompt("Update admin notes:", report.adminNotes || "");
                        if (notes !== null) {
                          handleUpdateStatus(report._id, report.status, notes);
                        }
                      }}
                      disabled={updatingStatus === report._id}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                    >
                      <FiMessageSquare size={16} />
                      Add Notes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}