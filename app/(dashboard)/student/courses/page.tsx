"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlay as PlayIcon,
  FiClock as Clock,
  FiAward as Award,
  FiBook,
  FiLoader,
  FiStar,
  FiSearch,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { courseService } from "@/services/course.service";
import { Course } from "@/types";
import StudentSidebar from "@/app/components/StudentSidebar";

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-xl ${className}`} />
);

export default function StudentCoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useThemeStore();
  const { logout } = useAuthStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await courseService.getMyCourses();
        if (res.status === "success" && res.courses) {
          setCourses(res.courses);
        } else {
          setError(res.message || "Could not load your courses");
        }
      } catch {
        setError("Could not load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // const filteredCourses = useMemo(() => {
  //   if (searchQuery.trim() === "") {
  //     return courses;
  //   } else {
  //     return courses.filter(course =>
  //       course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       course.description.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }
  // }, [searchQuery, courses]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <span className="flex items-center gap-0.5 text-orange-500">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < fullStars || (i === fullStars && hasHalfStar) ? 'fill-current' : 'text-slate-300'}
          />
        ))}
      </span>
    );
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

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format';

  const CourseCardSkeleton = () => (
    <div className={`rounded-2xl border overflow-hidden flex ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <Skeleton className={`w-48 h-32 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className="flex-1 p-5 space-y-4">
        <Skeleton className={`h-6 w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <Skeleton className={`h-4 w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className="flex items-center gap-4">
          <Skeleton className={`h-4 w-16 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <Skeleton className={`h-4 w-16 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        </div>
        <Skeleton className={`h-2 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      <StudentSidebar
        isSidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/student/courses"
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
              <h1 className="text-2xl lg:text-3xl font-bold">My Courses</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Continue your learning journey
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`relative flex-1 sm:flex-none`}>
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-white border-slate-200 text-[#1E293B] placeholder-slate-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
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
        ) : courses.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <FiBook size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
              {searchQuery ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start your learning journey by enrolling in courses'}
            </p>
            {!searchQuery && (
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {courses.filter(course =>
              searchQuery.trim() === "" ||
              course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((course) => {
              const progress = calculateProgress(course._id);
              const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.videos.length, 0);
              const previewVideo = course.chapters[0]?.videos[0];
              const thumbnailUrl = previewVideo?.videoUrl
                ? `https://img.youtube.com/vi/${getYouTubeId(previewVideo.videoUrl)}/hqdefault.jpg`
                : FALLBACK_IMAGE;

              return (
                <Link
                  key={course._id}
                  href={`/learn/${course._id}`}
                  className={`block rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex ${
                    isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="relative w-48 h-32 flex-shrink-0 group">
                    <Image
                      src={thumbnailUrl}
                      alt={course.courseName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                        <PlayIcon size={18} className="text-blue-600 ml-1" />
                      </div>
                    </div>

                    {/* Progress badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        progress > 0
                          ? 'bg-emerald-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {progress > 0 ? `${progress}%` : 'New'}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>
                      {course.courseName}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(course.averageRating || 0)}
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ({course.averageRating?.toFixed(1) || '0'})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs mb-4">
                      <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock size={14} />
                        <span>{course.duration} weeks</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Award size={14} />
                        <span>{course.certificate ? 'Certificate' : 'No Certificate'}</span>
                      </div>
                    </div>

                    {progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#1E293B]'}`}>{progress}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-semibold text-blue-600`}>
                        {progress > 0 ? (
                          <>
                            Continue <FiMoreHorizontal size={14} />
                          </>
                        ) : (
                          <>
                            Start <FiMoreHorizontal size={14} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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