"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiTrendingUp as LineChart,
  FiClock,
  FiAward,
  FiBook,
  FiLoader,
  FiTarget,
  FiCheckCircle,
  FiPlay,
  FiCalendar,
  FiPieChart,
} from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { studentService, StudentStats } from "@/services/student.service";
import { courseService } from "@/services/course.service";
import { Course } from "@/types";
import StudentSidebar from "@/app/components/StudentSidebar";

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-xl ${className}`} />
);

export default function StudentProgressPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          studentService.getStats(),
          courseService.getMyCourses()
        ]);

        if (statsRes.status === 'success' && statsRes.stats) {
          setStats(statsRes.stats);
        }

        if (coursesRes.status === 'success' && coursesRes.courses) {
          setCourses(coursesRes.courses);
        }
      } catch {
        setError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const calculateProgress = (courseId: string) => {
    if (typeof window === 'undefined') return 0;
    const completedKey = `learn_completed_${courseId}`;
    const completedData = localStorage.getItem(completedKey);
    if (completedData) {
      try {
        const completed = JSON.parse(completedData);
        const totalLessons = courses.find(c => c._id === courseId)?.chapters.reduce((acc, chapter) => acc + chapter.videos.length, 0) || 1;
        return Math.round((completed.length / totalLessons) * 100);
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const getCourseProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format';

  const StatCardSkeleton = () => (
    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <Skeleton className={`h-4 w-24 mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <Skeleton className={`h-12 w-20 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
    </div>
  );

  const CourseProgressSkeleton = () => (
    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className={`w-16 h-16 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className="flex-1 space-y-2">
          <Skeleton className={`h-4 w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <Skeleton className={`h-3 w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        </div>
      </div>
      <Skeleton className={`h-3 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
    </div>
  );

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      <StudentSidebar
        isSidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/student/progress"
        onLogout={handleLogout}
      />

      <main className={`grow p-5 lg:p-10 overflow-y-auto w-full lg:ml-72 min-w-0 z-10 relative`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
              <h1 className="text-2xl lg:text-3xl font-bold">My Progress</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Track your learning journey and achievements
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <CourseProgressSkeleton key={i} />)}
            </div>
          </div>
        ) : error ? (
          <div className={`rounded-2xl border p-8 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <p className={`text-red-600 font-medium mb-4`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <FiBook size={24} />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Total Courses
                  </span>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                  {courses.length}
                </p>
              </div>

              <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    <FiCheckCircle size={24} />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Completed
                  </span>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                  {stats?.completedCourses || 0}
                </p>
              </div>

              <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                    <FiTarget size={24} />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    In Progress
                  </span>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                  {stats?.activeLearning || 0}
                </p>
              </div>

              <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <FiAward size={24} />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Badges
                  </span>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                  {stats?.badgesAndAwards || 0}
                </p>
              </div>
            </div>

            {/* Overall Progress */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                Overall Learning Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                      {courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + calculateProgress(course._id), 0) / courses.length) : 0}%
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Progress</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                      {stats?.hoursStudied || 0}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hours Studied</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                      {courses.reduce((acc, course) => acc + course.chapters.reduce((acc, chapter) => acc + chapter.videos.length, 0), 0)}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Lessons</p>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                Course Progress
              </h2>
              <div className="space-y-4">
                {courses.length === 0 ? (
                  <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <FiBook size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                      No courses yet
                    </h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Start your learning journey by enrolling in courses
                    </p>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  courses.map((course) => {
                    const progress = calculateProgress(course._id);
                    const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.videos.length, 0);
                    const completedLessons = Math.round((progress / 100) * totalLessons);
                    const previewVideo = course.chapters[0]?.videos[0];
                    const thumbnailUrl = previewVideo?.videoUrl 
                      ? `https://img.youtube.com/vi/${getYouTubeId(previewVideo.videoUrl)}/hqdefault.jpg` 
                      : FALLBACK_IMAGE;
                    
                    return (
                      <Link
                        key={course._id}
                        href={`/learn/${course._id}`}
                        className={`block rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                          isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={thumbnailUrl}
                                alt={course.courseName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-bold text-lg mb-1 truncate ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                                {course.courseName}
                              </h3>
                              <div className="flex items-center gap-4 text-xs">
                                <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <FiClock size={14} />
                                  <span>{course.duration} weeks</span>
                                </div>
                                <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <FiCalendar size={14} />
                                  <span>{totalLessons} lessons</span>
                                </div>
                              </div>
                            </div>
                            <div className={`ml-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                              progress >= 100 
                                ? 'bg-emerald-500 text-white' 
                                : progress >= 75 
                                ? 'bg-blue-500 text-white' 
                                : progress >= 50 
                                ? 'bg-yellow-500 text-white' 
                                : progress >= 25 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {progress >= 100 ? (
                                <>
                                  <FiCheckCircle size={14} /> Completed
                                </>
                              ) : (
                                `${progress}%`
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                {completedLessons} of {totalLessons} lessons completed
                              </span>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                                {progress}%
                              </span>
                            </div>
                            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                              <div
                                className={`h-full rounded-full transition-all ${getCourseProgressColor(progress)}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {progress >= 100 ? (
                                <>
                                  <FiAward size={14} className="text-emerald-500" />
                                  <span>Certificate earned</span>
                                </>
                              ) : progress > 0 ? (
                                <>
                                  <FiPlay size={14} />
                                  <span>Continue learning</span>
                                </>
                              ) : (
                                <>
                                  <FiTarget size={14} />
                                  <span>Start learning</span>
                                </>
                              )}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold text-blue-600`}>
                              View Details <LineChart size={14} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getYouTubeId(url: string): string {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}