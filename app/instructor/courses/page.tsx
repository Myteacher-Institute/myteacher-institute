'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiMoreHorizontal, FiEdit2, FiEye, FiPlus, FiMenu } from 'react-icons/fi';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import axiosInstance from '@/lib/axios';
import DeleteModal from '@/app/components/DeleteModal';
import InstructorSidebar from '@/app/components/InstructorSidebar';
import { LogoutConfirmModal } from '@/app/components/LogoutConfirmModal';
import type { Course, CourseVideo } from '@/types';

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadedCourseIds, setLoadedCourseIds] = useState<Set<number>>(new Set());
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const courseItemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = '/get-started';
  };

  const fetchInstructorCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    try {
      const res = await axiosInstance.get('/api/course/instructor-courses');
      if (res.data.status === 'success') {
        setAllCourses(res.data.courses);
        // Initially load first 3 courses
        const initialCourses = res.data.courses.slice(0, 3);
        setCourses(initialCourses);
        const initialIds = new Set([0, 1, 2]);
        setLoadedCourseIds(initialIds);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCoursesError('Failed to load courses');
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInstructorCourses();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [user?._id, fetchInstructorCourses]);

  // Intersection Observer for progressive loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (!loadedCourseIds.has(index) && allCourses[index]) {
              setLoadedCourseIds((prev) => new Set([...prev, index]));
              setCourses((prev) => {
                const newCourses = [...prev];
                if (!newCourses.some((c) => c._id === allCourses[index]._id)) {
                  newCourses.push(allCourses[index]);
                }
                return newCourses;
              });
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    // Observe all course items
    Object.entries(courseItemRefs.current).forEach(([index, ref]) => {
      if (ref && !loadedCourseIds.has(parseInt(index))) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [allCourses, loadedCourseIds, courses]);

  const getPreviewVideo = (course: Course): CourseVideo | null => {
    if (!course.courseVideos || course.courseVideos.length === 0) {
      return null;
    }
    const previewVideo = course.courseVideos.find((v: CourseVideo) => v.isPreview === true);
    return previewVideo || null;
  };

  const getYouTubeEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return null;
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        let videoId = '';
        if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.slice(1);
        } else {
          videoId = url.searchParams.get('v') || '';
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch {
      console.error('Invalid YouTube URL:', videoUrl);
    }
    return null;
  };

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleEditCourse = (course: Course) => {
    router.push(`/instructor/edit-course/${course._id}`);
  };

  const handleViewCourse = (course: Course) => {
    router.push(`/instructor/course/${course._id}`);
  };

  // const handleDeleteClick = (course: any) => {
  //   setCourseToDelete(course);
  //   setShowDeleteModal(true);
  //   setActiveDropdown(null);
  // };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete || !deletePassword) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await axiosInstance.delete(`/api/course/delete/${courseToDelete._id}`, {
        data: { password: deletePassword }
      });

      if (res.data.status === 'success') {
        setShowDeleteModal(false);
        setDeletePassword('');
        setCourseToDelete(null);
        fetchInstructorCourses();
      } else {
        alert(res.data.message || 'Failed to delete course');
      }
    } catch (error: unknown) {
      console.error('Delete course error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      alert(axiosError.response?.data?.message || 'Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null && dropdownRefs.current[activeDropdown]) {
        const ref = dropdownRefs.current[activeDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <InstructorSidebar 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor/courses"
        onLogout={handleLogout}
      />

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />

      <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className={`lg:hidden cursor-pointer p-2 border rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}>
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>My Courses</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>Manage all your courses in one place</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/instructor/create-course')}
            className={isDark ? "bg-transparent border border-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors" : "bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"}
          >
            <FiPlus size={18} /> <span className="whitespace-nowrap">Create New Course</span>
          </button>
        </header>

        <div className={`rounded-3xl lg:rounded-4xl border p-5 lg:p-8 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-50'}`}>
          <div className="space-y-6 lg:space-y-8">
            {isLoadingCourses ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                      <div className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl bg-slate-200 animate-pulse shrink-0" />
                      <div className="min-w-0 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0">
                      <div className="hidden sm:inline-block px-4 py-1.5 h-6 bg-slate-200 rounded-full animate-pulse w-20" />
                      <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : coursesError ? (
              <p className="text-sm text-red-500 text-center py-8">{coursesError}</p>
            ) : allCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500 mb-4">No courses yet. Create your first course!</p>
                <button
                  onClick={() => router.push('/instructor/create-course')}
                  className={isDark ? "bg-transparent border border-blue-600 text-white cursor-pointer px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 mx-auto hover:bg-blue-600 transition-colors" : "bg-blue-600 text-white cursor-pointer px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 mx-auto hover:bg-blue-700 transition-colors"}
                >
                  <FiPlus size={18} /> Create Course
                </button>
              </div>
            ) : (
              allCourses.map((course: Course, i: number) => {
                const isLoaded = loadedCourseIds.has(i);
                const previewVideo = getPreviewVideo(course);
                const embedUrl = previewVideo ? getYouTubeEmbedUrl(previewVideo.videoUrl) : null;
                
                return (
                  <div 
                    key={i} 
                    ref={(el) => { courseItemRefs.current[i] = el; }}
                    data-index={i}
                    className="flex items-center justify-between group"
                  >
                    {isLoaded ? (
                      <>
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
                            <h4 className={`font-bold text-sm lg:text-[16px] mb-0.5 truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{course.courseName}</h4>
                            <p className={`text-[10px] lg:text-xs font-medium truncate ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
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
                              className={`cursor-pointer p-1 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-slate-700' : 'text-[#111827] hover:bg-slate-100'}`}
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
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#111827] hover:bg-slate-50 transition-colors"
                                >
                                  <FiEdit2 size={16} /> Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#111827] hover:bg-slate-50 transition-colors"
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
                      </>
                    ) : (
                      <div className="flex items-center justify-between overflow-hidden">
                        <div className="flex items-center gap-3 lg:gap-5 min-w-0">
                          <div className="w-16 h-12 lg:w-24 lg:h-16 rounded-xl lg:rounded-2xl bg-slate-200 animate-pulse shrink-0" />
                          <div className="min-w-0 space-y-2">
                            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 lg:gap-6 ml-2 shrink-0">
                          <div className="hidden sm:inline-block px-4 py-1.5 h-6 bg-slate-200 rounded-full animate-pulse w-20" />
                          <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletePassword('');
              setCourseToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
            courseName={courseToDelete?.courseName || ''}
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            isDeleting={isDeleting}
          />
        )}
      </main>
    </div>
  );
}
