"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { IconType } from 'react-icons';
import { FiBell, FiPlus, FiMoreHorizontal, FiArrowUpRight, FiMenu, FiLoader, FiEdit2, FiEye, FiUsers, FiBook, FiDollarSign, FiStar, FiX, FiLogOut } from 'react-icons/fi';
import { activityTracker, type Activity } from '@/utils/activityTracker';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import InstructorSidebar from './InstructorSidebar';
import axiosInstance from '@/lib/axios';
import { useSocket } from '@/hooks/useSocket';
import type { Course, CourseVideo } from '@/types';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: IconType;
  iconColor: string;
  bgColor: string;
}

interface InstructorStatistics {
  totalStudents: number;
  totalCourses: number;
  totalEarnings: number;
  averageRating: number;
  trends?: {
    students?: string;
    courses?: string;
    earnings?: string;
    rating?: string;
  };
}

const StatCard = ({ label, value, trend, icon: Icon, iconColor, bgColor }: StatCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  return (
    <div className={isDark ? "p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-slate-800 border-slate-700" : "p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-[#FFFFFF] border-slate-100"}>
      <div className={`p-2.5 w-fit mt-4 rounded-lg ${bgColor}`}>
        <Icon className={iconColor} size={20} />
      </div>
      <div className="grow">
        <p className={isDark ? "text-xs font-medium uppercase tracking-wider text-slate-400" : "text-xs font-medium uppercase tracking-wider text-[#111827]"}>{label}</p>
        <div className="flex items-center justify-between mt-1">
          <h4 className={isDark ? "text-xl lg:text-2xl font-bold text-white" : "text-xl lg:text-2xl font-bold text-[#111827]"}>{value}</h4>
          <span className="text-[#166534] text-xs font-semibold flex items-center gap-0.5">
            <FiArrowUpRight size={14} /> {trend}
          </span>
        </div>
        <p className={isDark ? "text-[11px] mt-1 text-slate-400" : "text-[11px] mt-1 text-[#111827]"}>vs last month</p>
      </div>
    </div>
  );
};

export default function InstructorDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activities] = useState<Activity[]>(() => activityTracker.getFormattedActivities());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTopCoursesModal, setShowTopCoursesModal] = useState(false);
  const [statistics, setStatistics] = useState<InstructorStatistics | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { socket } = useSocket();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = '/get-started';
  };

  const fetchInstructorCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    setCoursesError(null);
    try {
      const res = await axiosInstance.get('/api/course/instructor-courses');
      if (res.data.status === 'success') {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCoursesError('Failed to load courses. Please try again.');
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  const fetchInstructorStatistics = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await axiosInstance.get('/api/course/instructor-statistics');
      if (res.data.status === 'success') {
        setStatistics(res.data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchInstructorStatisticsSilent = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/api/course/instructor-statistics');
      if (res.data.status === 'success') {
        setStatistics(res.data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  const getPreviewVideo = (course: Course): CourseVideo | null => {
    if (!course.courseVideos || course.courseVideos.length === 0) {
      return null;
    }
    // Find first video where isPreview is true
    const previewVideo = course.courseVideos.find((v: CourseVideo) => v.isPreview === true);
    return previewVideo || null;
  };

  const getYouTubeEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return null;
    // Convert YouTube watch URL to embed URL
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (!match) return null;
    // Add parameters to hide YouTube logo and controls for cleaner preview
    return `https://www.youtube.com/embed/${match[1]}?modestbranding=1&controls=0&showinfo=0&rel=0&autoplay=0&mute=1`;
  };

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleEditCourse = async (course: Course) => {
    setActiveDropdown(null);
    // Navigate to edit page with course ID and edit flag
    router.push(`/instructor/create-course?courseId=${course._id}&edit=true`);
  };

  const handleViewCourse = (course: Course) => {
    router.push(`/instructor/course/${course._id}`);
    setActiveDropdown(null);
  };

  // const handleDeleteClick = (course: any) => {
  //   setCourseToDelete(course);
  //   setShowDeleteModal(true);
  //   setDeletePassword('');
  //   setActiveDropdown(null);
  // };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete || !deletePassword) return;
    
    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete(`/api/course/delete/${courseToDelete._id}`, {
        data: { password: deletePassword }
      });
      
      if (res.data.status === 'success') {
        // Refresh courses list
        fetchInstructorCourses();
        setShowDeleteModal(false);
        setCourseToDelete(null);
        setDeletePassword('');
      } else {
        alert(res.data.message || 'Failed to delete course');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      alert(axiosError.response?.data?.message || 'Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside all dropdowns
      const isOutsideAll = Object.values(dropdownRefs.current).every(
        ref => !ref || !ref.contains(event.target as Node)
      );
      if (isOutsideAll) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial data fetch - run once on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInstructorCourses();
      fetchInstructorStatistics();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchInstructorCourses, fetchInstructorStatistics]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleCourseCreated = () => {
      fetchInstructorCourses();
      fetchInstructorStatisticsSilent();
    };

    const handleCourseUpdated = () => {
      fetchInstructorCourses();
    };

    const handleCourseDeleted = () => {
      fetchInstructorCourses();
      fetchInstructorStatisticsSilent();
    };

    const handleCourseRated = () => {
      fetchInstructorStatisticsSilent();
    };

    socket.on('course:created', handleCourseCreated);
    socket.on('course:updated', handleCourseUpdated);
    socket.on('course:deleted', handleCourseDeleted);
    socket.on('course:rated', handleCourseRated);

    return () => {
      socket.off('course:created', handleCourseCreated);
      socket.off('course:updated', handleCourseUpdated);
      socket.off('course:deleted', handleCourseDeleted);
      socket.off('course:rated', handleCourseRated);
    };
  }, [socket, fetchInstructorCourses, fetchInstructorStatisticsSilent]);

  return (
    <div className={isDark ? "flex min-h-screen font-poppins relative bg-slate-900" : "flex min-h-screen font-poppins relative bg-[#FDFDFD]"}>

      <InstructorSidebar 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor"
        onLogout={handleLogout}
      />

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />

      {/* Delete Course Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className={isDark ? "rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-xl bg-slate-800" : "rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-xl bg-white"}>
            <h3 className={isDark ? "text-xl font-bold mb-2 text-white" : "text-xl font-bold mb-2 text-[#111827]"}>Delete Course</h3>
            <p className={isDark ? "text-sm mb-6 text-slate-400" : "text-sm mb-6 text-slate-600"}>
              Are you sure you want to delete <span className={isDark ? "font-semibold text-white" : "font-semibold text-[#111827]"}>{courseToDelete?.courseName}</span>? This action cannot be undone.
            </p>
            <div className="mb-6">
              <label className={isDark ? "block text-sm font-medium mb-2 text-slate-300" : "block text-sm font-medium mb-2 text-[#111827]"}>Enter your password to confirm</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
                className={isDark ? "w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-white border-slate-200 text-[#111827] placeholder-slate-400"}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className={isDark ? "flex-1 px-4 py-3 rounded-xl border font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-slate-700 text-white hover:bg-slate-700" : "flex-1 px-4 py-3 rounded-xl border font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 text-[#111827] hover:bg-slate-50"}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting || !deletePassword}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <FiLoader size={16} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  'Delete Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className={isDark ? "lg:hidden cursor-pointer p-2 border rounded-lg bg-slate-800 border-slate-700 text-slate-400" : "lg:hidden cursor-pointer p-2 border rounded-lg bg-[#FFFFFF] border-slate-200 text-slate-600"}><FiMenu size={20} /></button>
            <div>
              <h2 className={isDark ? "text-xl lg:text-2xl font-medium text-white" : "text-xl lg:text-2xl font-medium text-[#111827]"}>Welcome back, <span className="font-bold">{user?.name}</span></h2>
              <p className={isDark ? "text-xs lg:text-[15px] text-slate-400" : "text-xs lg:text-[15px] text-[#111827]"}>Here&#39;s what&#39;s happening with your courses today.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" aria-label="View notifications" className={isDark ? "p-3 border rounded-2xl relative cursor-pointer hover:bg-slate-50 bg-slate-800 border-slate-700 text-white" : "p-3 border rounded-2xl relative cursor-pointer hover:bg-slate-50 bg-[#FFFFFF] border-slate-100 text-[#111827]"}><FiBell size={22} /><span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" /></button>
            <button type="button" onClick={() => router.push('/instructor/create-course')} className={isDark ? "grow sm:grow-0 bg-transparent text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border border-slate-700 hover:border-slate-600" : "grow sm:grow-0 bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200"}><FiPlus size={18} /> <span className="whitespace-nowrap">Create New Course</span></button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          {isLoadingStats ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={isDark ? "p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-slate-800 border-slate-700" : "p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-[#FFFFFF] border-slate-100"}>
                  <div className={isDark ? "p-2.5 w-fit mt-4 rounded-lg bg-slate-200 animate-pulse w-10 h-10 bg-slate-700" : "p-2.5 w-fit mt-4 rounded-lg bg-slate-200 animate-pulse w-10 h-10"}></div>
                  <div className="grow">
                    <div className={isDark ? "h-3 bg-slate-200 rounded animate-pulse w-24 mb-3 bg-slate-700" : "h-3 bg-slate-200 rounded animate-pulse w-24 mb-3"}></div>
                    <div className="flex items-center justify-between mt-1">
                      <div className={isDark ? "h-6 bg-slate-200 rounded animate-pulse w-16 bg-slate-700" : "h-6 bg-slate-200 rounded animate-pulse w-16"}></div>
                      <div className={isDark ? "h-4 bg-slate-200 rounded animate-pulse w-12 bg-slate-700" : "h-4 bg-slate-200 rounded animate-pulse w-12"}></div>
                    </div>
                    <div className={isDark ? "h-3 bg-slate-200 rounded animate-pulse w-20 mt-1 bg-slate-700" : "h-3 bg-slate-200 rounded animate-pulse w-20 mt-1"}></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard label="Total Students" value={statistics?.totalStudents || "0"} trend={statistics?.trends?.students || "0%"} icon={FiUsers} iconColor="text-[#0A66C2]" bgColor="bg-[#703BF521]" />
              <StatCard label="Total Courses" value={statistics?.totalCourses || "0"} trend={statistics?.trends?.courses || "0%"} icon={FiBook} iconColor="text-[#166534]" bgColor="bg-[#E7F9F1]" />
              <StatCard label="Total Earnings" value={statistics?.totalEarnings || "₦0"} trend={statistics?.trends?.earnings || "0%"} icon={FiDollarSign} iconColor="text-[#FEB00A]" bgColor="bg-[#FEFCD5]" />
              <StatCard label="Average Rating" value={statistics?.averageRating || "0"} trend={statistics?.trends?.rating || "0"} icon={FiStar} iconColor="text-[#2563EB]" bgColor="bg-[#703BF521]" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className={isDark ? "lg:col-span-2 rounded-3xl lg:rounded-4xl border p-5 lg:p-8 shadow-sm bg-slate-800 border-slate-700" : "lg:col-span-2 rounded-3xl lg:rounded-4xl border p-5 lg:p-8 shadow-sm bg-[#FFFFFF] border-slate-50"}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={isDark ? "font-bold text-lg lg:text-xl text-white" : "font-bold text-lg lg:text-xl text-[#111827]"}>My Courses</h3>
              <button onClick={() => router.push('/instructor/courses')} className="text-[#2563EB] cursor-pointer font-bold text-sm">View all courses</button>
            </div>
            <div className="space-y-6 lg:space-y-8">
              {isLoadingCourses ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between overflow-hidden">
                      <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                        <div className={isDark ? "w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl bg-slate-200 animate-pulse shrink-0 bg-slate-700" : "w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl bg-slate-200 animate-pulse shrink-0"} />
                        <div className="min-w-0 space-y-2">
                          <div className={isDark ? "h-4 bg-slate-200 rounded animate-pulse w-3/4 bg-slate-700" : "h-4 bg-slate-200 rounded animate-pulse w-3/4"} />
                          <div className={isDark ? "h-3 bg-slate-200 rounded animate-pulse w-1/2 bg-slate-700" : "h-3 bg-slate-200 rounded animate-pulse w-1/2"} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0">
                        <div className={isDark ? "hidden sm:inline-block px-4 py-1.5 h-6 bg-slate-200 rounded-full animate-pulse w-20 bg-slate-700" : "hidden sm:inline-block px-4 py-1.5 h-6 bg-slate-200 rounded-full animate-pulse w-20"} />
                        <div className={isDark ? "w-5 h-5 bg-slate-200 rounded animate-pulse bg-slate-700" : "w-5 h-5 bg-slate-200 rounded animate-pulse"} />
                      </div>
                    </div>
                  ))}
                </>
              ) : coursesError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-4">{coursesError}</p>
                  <button
                    onClick={fetchInstructorCourses}
                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className={isDark ? "text-sm mb-4 text-slate-400" : "text-sm mb-4 text-slate-500"}>No courses yet. Create your first course to start teaching!</p>
                  <button
                    onClick={() => router.push('/instructor/create-course')}
                    className={isDark ? "bg-transparent border border-white text-white cursor-pointer px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 mx-auto hover:bg-blue-700 transition-colors" : "bg-blue-500 text-white cursor-pointer px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 mx-auto hover:bg-blue-700 transition-colors"}
                  >
                    <FiPlus size={18} /> Create Course
                  </button>
                </div>
              ) : (
                courses.map((course: Course, i: number) => {
                  const previewVideo = getPreviewVideo(course);
                  const embedUrl = previewVideo ? getYouTubeEmbedUrl(previewVideo.videoUrl) : null;
                  
                  return (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                        {embedUrl ? (
                          <div className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl overflow-hidden shadow-sm shrink-0 relative">
                            <iframe
                              src={embedUrl}
                              className="w-full h-full object-cover"
                              title={course.courseName}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <Image 
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" 
                            width={96} 
                            height={64} 
                            className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl object-cover shadow-sm shrink-0" 
                            alt={course.courseName} 
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className={isDark ? "font-bold text-sm lg:text-[16px] mb-0.5 truncate text-white" : "font-bold text-sm lg:text-[16px] mb-0.5 truncate text-[#111827]"}>{course.courseName}</h4>
                          <p className={isDark ? "text-[10px] lg:text-xs font-medium truncate text-slate-400" : "text-[10px] lg:text-xs font-medium truncate text-[#111827]"}>
                            {course.appliedUsers?.length || 0} students ● {course.courseVideos?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0 relative">
                        <span className="hidden sm:inline-block px-4 py-1.5 text-[11px] font-bold rounded-full bg-[#E7F9F1] text-[#5CC68C]">
                          Published
                        </span>
                        <div className="relative" ref={(el) => { dropdownRefs.current[i] = el; }}>
                          <button
                            onClick={() => handleDropdownToggle(i)}
                            className={isDark ? "cursor-pointer p-1 rounded-lg transition-colors text-white hover:bg-slate-700" : "cursor-pointer p-1 rounded-lg transition-colors text-[#111827] hover:bg-slate-100"}
                          >
                            <FiMoreHorizontal size={20} />
                          </button>
                          {activeDropdown === i && (
                            <div className={isDark ? "absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border py-2 z-50 bg-slate-800 border-slate-700" : "absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border py-2 z-50 bg-white border-slate-100"}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCourse(course);
                                }}
                                className={isDark ? "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-white hover:bg-slate-700" : "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-[#111827] hover:bg-slate-50"}
                              >
                                <FiEdit2 size={16} /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCourse(course);
                                }}
                                className={isDark ? "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-white hover:bg-slate-700" : "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-[#111827] hover:bg-slate-50"}
                              >
                                <FiEye size={16} /> View
                              </button>
                              {/* <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(course);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 size={16} /> Delete
                              </button> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <div className="space-y-8">
            <section className={isDark ? "rounded-3xl lg:rounded-4xl border p-6 lg:p-8 shadow-sm bg-slate-800 border-slate-700" : "rounded-3xl lg:rounded-4xl border p-6 lg:p-8 shadow-sm bg-[#FFFFFF] border-slate-50"}>
              <div className="flex justify-between items-center mb-8">
                <h3 className={isDark ? "font-bold text-lg lg:text-xl text-white" : "font-bold text-lg lg:text-xl text-[#111827]"}>Recent Activity</h3>
                <button className="text-[#2563EB] cursor-pointer font-bold text-sm">View all</button>
              </div>
              <div className="space-y-6">
                {activities.length === 0 ? (
                  <p className={isDark ? "text-sm text-center py-4 text-slate-400" : "text-sm text-center py-4 text-slate-500"}>No recent activities</p>
                ) : (
                  activities.slice(0, 5).map((activity) => {
                    const iconMap: Record<string, IconType> = {
                      'New student enrolled': FiUsers,
                      'New review': FiStar,
                      'Payment': FiDollarSign,
                      'Course created': FiBook,
                      'Course updated': FiEdit2,
                      'Logged out': FiLogOut,
                      'default': FiUsers,
                    };
                    const colorMap: Record<string, string> = {
                      'New student enrolled': 'text-blue-600 bg-blue-50',
                      'New review': 'text-[#FEB00A] bg-[#FFEDD5]',
                      'Payment': 'text-emerald-500 bg-emerald-50',
                      'Course created': 'text-[#111827] bg-blue-50',
                      'Course updated': 'text-blue-600 bg-blue-50',
                      'Logged out': 'text-red-500 bg-red-50',
                      'default': 'text-blue-600 bg-blue-50',
                    };
                    const Icon = iconMap[activity.action] || iconMap['default'];
                    const color = colorMap[activity.action] || colorMap['default'];

                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className={`p-2.5 rounded-xl h-fit ${color}`}><Icon size={18} /></div>
                        <div>
                          <p className={isDark ? "text-[14px] leading-tight text-white" : "text-[14px] leading-tight text-[#111827]"}>{activity.action} <br /><span className={isDark ? "font-bold text-white" : "font-bold text-[#111827]"}>{activity.detail}</span></p>
                          <span className={isDark ? "text-[11px] font-medium text-slate-400" : "text-[11px] font-medium text-slate-600"}>{activity.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className={isDark ? "rounded-3xl lg:rounded-4xl border p-6 lg:p-8 shadow-sm bg-slate-800 border-slate-700" : "rounded-3xl lg:rounded-4xl border p-6 lg:p-8 shadow-sm bg-[#FFFFFF] border-slate-50"}>
              <div className="flex justify-between items-center mb-8">
                <h3 className={isDark ? "font-bold text-lg lg:text-xl text-white" : "font-bold text-lg lg:text-xl text-[#111827]"}>Top Courses</h3>
                <button onClick={() => setShowTopCoursesModal(true)} className="text-[#2563EB] font-bold text-sm cursor-pointer">View full report</button>
              </div>
              <div className="space-y-5">
                {isLoadingCourses ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={isDark ? "w-4 h-4 bg-slate-200 rounded animate-pulse bg-slate-700" : "w-4 h-4 bg-slate-200 rounded animate-pulse"} />
                        <div className={isDark ? "w-24 h-10 bg-slate-200 rounded-lg animate-pulse bg-slate-700" : "w-24 h-10 bg-slate-200 rounded-lg animate-pulse"} />
                        <div className="grow min-w-0 space-y-2">
                          <div className={isDark ? "h-4 bg-slate-200 rounded animate-pulse w-3/4 bg-slate-700" : "h-4 bg-slate-200 rounded animate-pulse w-3/4"} />
                        </div>
                        <div className="flex gap-1 text-right shrink-0">
                          <div className={isDark ? "h-4 bg-slate-200 rounded animate-pulse w-8 bg-slate-700" : "h-4 bg-slate-200 rounded animate-pulse w-8"} />
                        </div>
                      </div>
                    ))}
                  </>
                ) : coursesError ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-red-500 mb-2">{coursesError}</p>
                    <button
                      onClick={fetchInstructorCourses}
                      className="text-sm text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : courses.length === 0 ? (
                  <p className={isDark ? "text-sm text-center py-4 text-slate-400" : "text-sm text-center py-4 text-slate-500"}>No courses yet</p>
                ) : (
                  courses
                    .sort((a: Course, b: Course) => (b.appliedUsers?.length || 0) - (a.appliedUsers?.length || 0))
                    .slice(0, 3)
                    .map((course: Course, index: number) => {
                      const previewVideo = getPreviewVideo(course);
                      const embedUrl = previewVideo ? getYouTubeEmbedUrl(previewVideo.videoUrl) : null;
                      
                      return (
                        <div key={course._id} className="flex items-center gap-2">
                          <span className={isDark ? "font-bold text-sm w-4 text-white" : "font-bold text-sm w-4 text-[#111827]"}>{index + 1}</span>
                          <div className={isDark ? "w-24 h-10 rounded-lg overflow-hidden relative bg-slate-700" : "w-24 h-10 rounded-lg overflow-hidden relative bg-slate-100"}>
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                className="w-full h-full object-cover"
                                title={course.courseName}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <Image
                                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"
                                width={96}
                                height={40}
                                className="w-24 h-10 object-cover shadow-sm"
                                alt={course.courseName}
                              />
                            )}
                          </div>
                          <div className="grow min-w-0">
                            <p className={isDark ? "text-[13px] font-bold truncate text-white" : "text-[13px] font-bold truncate text-[#111827]"}>{course.courseName}</p>
                          </div>
                          <div className="flex gap-1 text-right shrink-0">
                            <p className={isDark ? "text-[13px] font-bold text-white" : "text-[13px] font-bold text-[#111827]"}>{course.appliedUsers?.length || 0}</p>
                            <p className={isDark ? "text-[10px] mt-1 font-bold text-slate-400" : "text-[10px] mt-1 font-bold text-slate-600"}>students</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Top Courses Modal */}
      {showTopCoursesModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className={isDark ? "rounded-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl bg-slate-800" : "rounded-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl bg-white"}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-[#111827]"}>All Courses Report</h3>
              <button
                onClick={() => setShowTopCoursesModal(false)}
                className={isDark ? "cursor-pointer text-slate-400 hover:text-white" : "cursor-pointer text-slate-500 hover:text-slate-700"}
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {isLoadingCourses ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={isDark ? "flex items-center gap-4 p-4 rounded-xl bg-slate-700" : "flex items-center gap-4 p-4 rounded-xl bg-slate-50"}>
                      <div className={isDark ? "w-16 h-12 bg-slate-200 rounded-lg animate-pulse bg-slate-700" : "w-16 h-12 bg-slate-200 rounded-lg animate-pulse"} />
                      <div className="grow min-w-0 space-y-2">
                        <div className={isDark ? "h-4 bg-slate-200 rounded animate-pulse w-3/4 bg-slate-700" : "h-4 bg-slate-200 rounded animate-pulse w-3/4"} />
                        <div className={isDark ? "h-3 bg-slate-200 rounded animate-pulse w-1/2 bg-slate-700" : "h-3 bg-slate-200 rounded animate-pulse w-1/2"} />
                      </div>
                      <div className={isDark ? "w-20 h-8 bg-slate-200 rounded animate-pulse bg-slate-700" : "w-20 h-8 bg-slate-200 rounded animate-pulse"} />
                    </div>
                  ))}
                </>
              ) : coursesError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-4">{coursesError}</p>
                  <button
                    onClick={fetchInstructorCourses}
                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : courses.length === 0 ? (
                <p className={isDark ? "text-sm text-center py-8 text-slate-400" : "text-sm text-center py-8 text-slate-500"}>No courses yet</p>
              ) : (
                courses
                  .sort((a: Course, b: Course) => (b.appliedUsers?.length || 0) - (a.appliedUsers?.length || 0))
                  .map((course: Course, index: number) => {
                    const previewVideo = getPreviewVideo(course);
                    const embedUrl = previewVideo ? getYouTubeEmbedUrl(previewVideo.videoUrl) : null;
                    
                    return (
                      <div key={course._id} className={isDark ? "flex items-center gap-4 p-4 rounded-xl transition-colors bg-slate-700 hover:bg-slate-600" : "flex items-center gap-4 p-4 rounded-xl transition-colors bg-slate-50 hover:bg-slate-100"}>
                        <span className={isDark ? "font-bold text-sm w-6 text-white" : "font-bold text-sm w-6 text-[#111827]"}>{index + 1}</span>
                        <div className={isDark ? "w-16 h-12 rounded-lg overflow-hidden relative shrink-0 bg-slate-700" : "w-16 h-12 rounded-lg overflow-hidden relative shrink-0 bg-slate-100"}>
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              className="w-full h-full object-cover"
                              title={course.courseName}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <Image
                              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"
                              width={64}
                              height={48}
                              className="w-16 h-12 object-cover"
                              alt={course.courseName}
                            />
                          )}
                        </div>
                        <div className="grow min-w-0">
                          <p className={isDark ? "text-sm font-bold truncate text-white" : "text-sm font-bold truncate text-[#111827]"}>{course.courseName}</p>
                          <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>{course.courseVideos?.length || 0} lessons</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>{course.appliedUsers?.length || 0}</p>
                          <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>students</p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}