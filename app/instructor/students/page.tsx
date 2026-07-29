"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiUsers, FiBook, FiMail, FiCalendar, FiArrowLeft } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useSocket } from "@/hooks/useSocket";

interface AppliedUser {
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  appliedAt: string;
}

interface CourseWithStudents {
  _id: string;
  courseName: string;
  appliedUsers: AppliedUser[];
}

export default function InstructorStudentsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<CourseWithStudents[]>([]);
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

  const fetchStudents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/instructor/students');
      if (res.data.status === 'success') {
        setCourses(res.data.courses || []);
      } else {
        setError("Failed to load students");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Socket event listener for real-time student enrollment
  useEffect(() => {
    if (!socket) return;

    const handleStudentEnrolled = () => {
      fetchStudents();
    };

    socket.on('student:enrolled', handleStudentEnrolled);

    return () => {
      socket.off('student:enrolled', handleStudentEnrolled);
    };
  }, [socket]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.appliedUsers?.length || 0), 0);

  if (isLoading) {
    return (
      <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
        <InstructorSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/students"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="grow space-y-2">
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-48 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
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
        activePath="/instructor/students"
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
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>Students</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Manage and view all your enrolled students
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchStudents}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm" : "bg-[#FFFFFF] p-6 rounded-2xl border border-slate-100 shadow-sm"}>
                <div className="flex items-center gap-4">
                  <div className={isDark ? "p-3 bg-blue-900/30 rounded-xl" : "p-3 bg-blue-100 rounded-xl"}>
                    <FiUsers className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Total Students
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{totalStudents}</h4>
                  </div>
                </div>
              </div>
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm" : "bg-[#FFFFFF] p-6 rounded-2xl border border-slate-100 shadow-sm"}>
                <div className="flex items-center gap-4">
                  <div className={isDark ? "p-3 bg-green-900/30 rounded-xl" : "p-3 bg-green-100 rounded-xl"}>
                    <FiBook className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Total Courses
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{courses.length}</h4>
                  </div>
                </div>
              </div>
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm" : "bg-[#FFFFFF] p-6 rounded-2xl border border-slate-100 shadow-sm"}>
                <div className="flex items-center gap-4">
                  <div className={isDark ? "p-3 bg-purple-900/30 rounded-xl" : "p-3 bg-purple-100 rounded-xl"}>
                    <FiUsers className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                      Avg Students/Course
                    </p>
                    <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {courses.length > 0 ? (totalStudents / courses.length).toFixed(1) : 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses with Students */}
            {courses.length === 0 ? (
              <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-slate-400" size={32} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No students yet</h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  When students enroll in your courses, they'll appear here.
                </p>
                <button
                  onClick={() => router.push('/instructor/create-course')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create a Course
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <FiBook className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{course.courseName}</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {course.appliedUsers?.length || 0} student{course.appliedUsers?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/instructor/course/${course._id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                      >
                        View Course
                      </button>
                    </div>

                    {course.appliedUsers && course.appliedUsers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.appliedUsers.map((student, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'}`}
                          >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                              {student.userName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 grow">
                              <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                                {student.userName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FiMail size={12} />
                                <span className={`truncate ${isDark ? 'text-slate-400' : ''}`}>{student.userEmail}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <FiCalendar size={12} />
                                <span className={isDark ? 'text-slate-500' : ''}>Enrolled {formatDate(student.appliedAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <p className={isDark ? 'text-slate-400' : ''}>No students enrolled in this course yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
