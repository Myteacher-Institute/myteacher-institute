"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiDollarSign, FiTrendingUp, FiBook, FiUsers, FiCalendar, FiArrowLeft } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useSocket } from "@/hooks/useSocket";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface CourseEarnings {
  _id: string;
  courseName: string;
  price: number;
  studentCount: number;
  totalRevenue: number;
  instructorShare: number;
  companyShare: number;
}

interface MonthlyEarnings {
  month: string;
  revenue: number;
  instructorEarnings: number;
}

interface EarningsData {
  totalRevenue: number;
  totalInstructorEarnings: number;
  totalCompanyEarnings: number;
  totalStudents: number;
  courses: CourseEarnings[];
  monthlyEarnings: MonthlyEarnings[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function InstructorEarningsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { socket } = useSocket();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/instructor/earnings');
      if (res.data.status === 'success') {
        setEarnings(res.data.earnings);
      } else {
        setError("Failed to load earnings");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load earnings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  // Socket event listener for real-time earnings updates
  useEffect(() => {
    if (!socket) return;

    const handleEarningsUpdated = () => {
      fetchEarnings();
    };

    socket.on('earnings:updated', handleEarningsUpdated);

    return () => {
      socket.off('earnings:updated', handleEarningsUpdated);
    };
  }, [socket]);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const pieData = [
    { name: 'Your Share', value: earnings?.totalInstructorEarnings || 0 },
    { name: 'Company Share', value: earnings?.totalCompanyEarnings || 0 },
  ];

  if (isLoading) {
    return (
      <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
        <InstructorSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/earnings"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {[1, 2].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
                <div className={`h-64 rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
              ))}
            </div>
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
        activePath="/instructor/earnings"
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
              <FiLoader size={20} />
            </button>
            <div>
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>Earnings</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Track your revenue and course performance
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchEarnings}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FiDollarSign className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Total Revenue
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {formatCurrency(earnings?.totalRevenue || 0)}
                    </h4>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FiTrendingUp className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Your Earnings
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {formatCurrency(earnings?.totalInstructorEarnings || 0)}
                    </h4>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <FiBook className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Total Courses
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {earnings?.courses?.length || 0}
                    </h4>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <FiUsers className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Total Students
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {earnings?.totalStudents || 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Monthly Earnings Chart */}
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  <FiCalendar className="text-blue-600" />
                  Monthly Earnings (Last 6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earnings?.monthlyEarnings || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748B"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#64748B"
                      fontSize={12}
                      tickFormatter={(value: any) => value ? `₦${value.toLocaleString()}` : ''}
                    />
                    <Tooltip 
                      formatter={(value: any) => value ? formatCurrency(value) : ''}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : '#FFFFFF', 
                        border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Total Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="instructorEarnings" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Your Earnings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Share Pie Chart */}
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  <FiDollarSign className="text-green-600" />
                  Revenue Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => value ? formatCurrency(value) : ''}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : '#FFFFFF', 
                        border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Share (70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Company Share (30%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course-wise Earnings */}
            <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                <FiBook className="text-purple-600" />
                Course-wise Earnings
              </h3>
              
              {earnings?.courses && earnings.courses.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={earnings.courses}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="courseName" 
                        stroke="#64748B"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="#64748B"
                        fontSize={12}
                        tickFormatter={(value: any) => value ? `₦${value.toLocaleString()}` : ''}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? formatCurrency(value) : ''}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#FFFFFF', 
                          border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="totalRevenue" fill="#3B82F6" name="Total Revenue" />
                      <Bar dataKey="instructorShare" fill="#10B981" name="Your Earnings" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-8 space-y-4">
                    {earnings.courses.map((course) => (
                      <div
                        key={course._id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-100 rounded-xl">
                            <FiBook className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{course.courseName}</h4>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {course.studentCount} student{course.studentCount !== 1 ? 's' : ''} • ₦{course.price.toLocaleString()} per course
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{formatCurrency(course.instructorShare)}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your earnings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <FiBook className="mx-auto mb-4" size={48} />
                  <p>No courses yet. Create your first course to start earning!</p>
                  <button
                    onClick={() => router.push('/instructor/create-course')}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
