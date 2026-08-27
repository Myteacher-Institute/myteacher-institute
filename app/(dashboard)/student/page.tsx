"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiCheckCircle as CheckCircle2,
  FiPlayCircle as PlayCircle,
  FiClock as Clock,
  FiAward as Award,
  FiBook,
  FiAward,
  FiTrendingUp,
  FiPlay as PlayIcon,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { activityTracker, Activity } from "@/utils/activityTracker";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { courseService } from "@/services/course.service";
import { studentService, StudentStats } from "@/services/student.service";
import { Course } from "@/types";
import { StatCard } from "@/app/components/constants/Students/statcards";
import { CourseCard } from "@/app/components/constants/Students/CourseCard";
import { MentorWidget } from "@/app/components/constants/Students/MentorWidget";
import { RecommendedSection } from "@/app/components/constants/Students/RecommendedSection";
import { NotificationsContent } from "@/app/components/constants/Students/NotificationsContent";
import StudentSidebar from "@/app/components/StudentSidebar";
import { DashboardHeader } from "@/app/components/constants/Students/DashboardHeader";
import { FloatingActionButton } from "@/app/components/constants/Students/FloatingActionButton";
import { RecommendationModal } from "@/app/components/constants/Students/RecommendationModal";
import CursorFollower from "@/app/components/CursorFollower";

interface UserProfile {
  recommendations?: string[];
  recommendationsProvided?: boolean;
}

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [statsError, setStatsError] = useState("");
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const t = setTimeout(() => {
      setActivities(activityTracker.getFormattedActivities());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await courseService.getMyCourses();
        if (res.status === "success" && res.courses) {
          setMyCourses(res.courses);
        } else {
          setCoursesError(res.message || "Could not load your courses");
        }
      } catch {
        setCoursesError("Could not load your courses. Please try again.");
      } finally {
        setLoadingCourses(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await studentService.getStats();
        if (res.status === "success" && res.stats) {
          setStats(res.stats);
        } else {
          setStatsError(res.message || "Could not load your statistics");
        }
      } catch {
        setStatsError("Could not load your statistics. Please try again.");
      } finally {
        setLoadingStats(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await studentService.getProfile();
        if (res.status === "success" && res.user) {
          // Show recommendation modal if user hasn't provided recommendations
          // Only check backend status to ensure consistency with MongoDB
          if (!res.user.recommendationsProvided) {
            setShowRecommendationModal(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleRecommendationsSubmit = async (recommendations: string[]) => {
    try {
      const res = await studentService.updateRecommendations(recommendations);
      if (res.status === "success") {
        setShowRecommendationModal(false);
      }
    } catch (error) {
      console.error('Error updating recommendations:', error);
    }
  };

  const handleLogout = async () => {
    activityTracker.clearActivities();
    await logout();
    window.location.href = '/get-started';
  };

  return (
    <div className={`flex min-h-screen font-sans overflow-x-hidden ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      <CursorFollower />
      <StudentSidebar
        isSidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/student"
        onLogout={handleLogout}
      />

      <main className="lg:ml-72 flex-1 flex flex-col min-w-0 z-10 relative">
        <DashboardHeader
          setSidebarOpen={setSidebarOpen}
          notifyOpen={notifyOpen}
          setNotifyOpen={setNotifyOpen}
          NotificationsContent={NotificationsContent}
        />

        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loadingStats ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className={`min-w-[200px] rounded-2xl border p-4 lg:p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-4 w-24 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  </div>
                  <div className={`h-8 w-16 rounded-lg animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                </div>
              ))
            ) : statsError ? (
              <div className={`col-span-4 rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{statsError}</p>
              </div>
            ) : stats ? (
              <>
                <StatCard
                  label="Completed Courses"
                  value={stats.completedCourses.toString()}
                  icon={<CheckCircle2 size={20} strokeWidth={2.5} />}
                  iconBgColor="bg-green-500"
                />
                <StatCard
                  label="Active Learning"
                  value={stats.activeLearning.toString()}
                  icon={<PlayCircle size={20} strokeWidth={2.5} />}
                  iconBgColor="bg-blue-500"
                />
                <StatCard
                  label="Hours Studied"
                  value={stats.hoursStudied.toString()}
                  icon={<Clock size={20} strokeWidth={2.5} />}
                  iconBgColor="bg-purple-500"
                />
                <StatCard
                  label="Badges & Awards"
                  value={stats.badgesAndAwards.toString()}
                  icon={<Award size={20} strokeWidth={2.5} />}
                  iconBgColor="bg-yellow-500"
                />
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg lg:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Continue Learning
                </h3>
                <button className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-6">
                {loadingCourses ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className={`rounded-2xl border p-3 lg:p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-6">
                        <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                        <div className={`h-3 lg:h-4 flex-1 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      </div>
                      <div className={`h-1 lg:h-2 rounded-full mb-3 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      <div className={`h-8 lg:h-10 rounded-lg lg:rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    </div>
                  ))
                ) : coursesError ? (
                  <div className={`col-span-2 rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{coursesError}</p>
                  </div>
                ) : myCourses.length === 0 ? (
                  <div className={`col-span-2 rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      You have not purchased any courses yet.
                    </p>
                    <Link
                      href="/courses"
                      className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  myCourses.map((course) => {
                    // Calculate progress from localStorage
                    let progress = 0;
                    try {
                      const completedRaw = localStorage.getItem(`learn_completed_${course._id}`);
                      if (completedRaw) {
                        const completed = new Set(JSON.parse(completedRaw));
                        // Estimate total lessons based on course structure
                        const totalLessons = course.chapters?.reduce((sum, ch) => sum + (ch.videos?.length || 0), 0) || 
                                            course.courseVideos?.length || 1;
                        progress = totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0;
                      }
                    } catch (e) {
                      console.error('Error calculating progress:', e);
                    }
                    
                    return (
                      <CourseCard
                        key={course._id}
                        courseId={course._id}
                        title={course.courseName}
                        progress={progress}
                        icon={<PlayIcon size={20} strokeWidth={1.5} />}
                        color="text-blue-600"
                        bg="bg-blue-50"
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-10">
              <div className="space-y-6">
                <h3 className={`text-lg lg:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Recommended For You
                </h3>
                <RecommendedSection />
              </div>

              <div className={`rounded-4xl p-8 shadow-xl ${isDark ? 'bg-blue-700 shadow-blue-900/20' : 'bg-blue-600 shadow-blue-100'}`}>
                <MentorWidget />
              </div>

              <div className="space-y-6">
                <h3 className={`text-lg lg:text-xl font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No recent activities</p>
                  ) : (
                    activities.slice(0, 5).map((activity) => {
                      const iconMap: Record<string, IconType> = {
                        'Course enrolled': FiBook,
                        'Lesson completed': CheckCircle2,
                        'Achievement unlocked': FiAward,
                        'Progress milestone': FiTrendingUp,
                        'default': FiBook,
                      };
                      const colorMap: Record<string, string> = {
                        'Course enrolled': 'text-blue-600 bg-blue-50',
                        'Lesson completed': 'text-green-600 bg-green-50',
                        'Achievement unlocked': 'text-yellow-600 bg-yellow-50',
                        'Progress milestone': 'text-purple-600 bg-purple-50',
                        'default': 'text-blue-600 bg-blue-50',
                      };
                      const Icon = iconMap[activity.action] || iconMap['default'];
                      const color = colorMap[activity.action] || colorMap['default'];

                      return (
                        <div key={activity.id} className="flex gap-4">
                          <div className={`p-2.5 rounded-xl h-fit ${color}`}><Icon size={18} /></div>
                          <div>
                            <p className={`text-[14px] leading-tight ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>{activity.action} <br /><span className={`font-bold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>{activity.detail}</span></p>
                            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{activity.time}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className={`text-lg lg:text-xl font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Notifications
                </h3>
                <NotificationsContent />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-12 pb-10">
            <h3 className={`text-lg lg:text-xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Recommended for you
            </h3>
            <RecommendedSection />
          </div>
        </div>
      </main>

      <FloatingActionButton mentorOpen={mentorOpen} setMentorOpen={setMentorOpen} />

      <RecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => setShowRecommendationModal(false)}
        onSubmit={handleRecommendationsSubmit}
      />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}