"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiLoader, FiEdit2, FiUsers, FiPlay, FiDownload, FiFileText, FiCode, FiHelpCircle, FiMenu } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { LogoutConfirmModal } from "@/app/components/LogoutConfirmModal";

export default function CourseViewPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { logout } = useAuthStore();

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = '/get-started';
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/course/${courseId}`);
        if (res.data.status === "success" && res.data.course) {
          setCourse(res.data.course);
        } else {
          setError("Failed to load course");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEdit = () => {
    router.push(`/instructor/create-course?courseId=${courseId}&edit=true`);
  };

  const getYouTubeEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return null;
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getDriveViewUrl = (driveUrl: string) => {
    if (!driveUrl) return undefined;
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/view` : driveUrl;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#FDFDFD]">
        <InstructorSidebar 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/courses"
          onLogout={handleLogout}
        />
        <main className="grow p-5 lg:p-10 overflow-y-auto w-full">
          {/* Course Overview Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 mb-8">
            <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Videos Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 mb-8">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
            {[1, 2].map((i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="aspect-video bg-slate-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 mb-8">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-200 rounded-full mt-2 animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 mb-8">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                    <div className="min-w-0 space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Students Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-[#FDFDFD]">
        <InstructorSidebar 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/courses"
          onLogout={handleLogout}
        />
        <main className="grow p-5 lg:p-10 overflow-y-auto w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Course not found"}</p>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
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
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="lg:hidden cursor-pointer p-2 bg-[#FFFFFF] border border-slate-200 rounded-lg text-slate-600">
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl text-[#111827] font-medium">Course Details</h2>
              <p className="text-[#111827] text-xs lg:text-[15px]">View and manage your course content</p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white cursor-pointer px-5 lg:px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
          >
            <FiEdit2 size={18} /> <span className="whitespace-nowrap">Edit Course</span>
          </button>
        </header>
        {/* Course Overview */}
        <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-4">{course.courseName}</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">{course.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Price</p>
              <p className="text-lg font-bold text-[#111827]">₦{course.price?.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-lg font-bold text-[#111827]">{course.duration}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Students</p>
              <p className="text-lg font-bold text-[#111827]">{course.appliedUsers?.length || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lessons</p>
              <p className="text-lg font-bold text-[#111827]">{course.courseVideos?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Course Videos */}
        {course.courseVideos && course.courseVideos.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiPlay className="text-blue-600" />
              Course Videos
            </h2>
            <div className="space-y-6">
              {course.courseVideos.map((video: any, index: number) => {
                const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
                return (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="aspect-video bg-slate-100">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          title={video.videoTitle}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          Video not available
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#111827] mb-2">{video.videoTitle}</h3>
                      <p className="text-sm text-slate-600 mb-2">{video.videoDescription}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {video.isPreview && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Preview
                          </span>
                        )}
                        {video.isProgrammingVideo && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            Programming
                          </span>
                        )}
                        {video.videoDuration && (
                          <span>{video.videoDuration} mins</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Course Requirements */}
        {course.courseRequirements && course.courseRequirements.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Requirements
            </h2>
            <ul className="space-y-3">
              {course.courseRequirements.map((req: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Programming Codes */}
        {course.programmingCodes && course.programmingCodes.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiCode className="text-blue-600" />
              Programming Codes
            </h2>
            <div className="space-y-4">
              {course.programmingCodes.map((code: any, index: number) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#111827] mb-2">{code.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{code.description}</p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{code.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Assets */}
        {course.assets && course.assets.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiDownload className="text-blue-600" />
              Course Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.assets.map((asset: any, index: number) => {
                const viewUrl = getDriveViewUrl(asset.url);
                return (
                  <a
                    key={index}
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiFileText className="text-blue-600" size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#111827] truncate">{asset.name}</p>
                        <p className="text-xs text-slate-500">Click to view/download</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Quizzes */}
        {course.quizzes && course.quizzes.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiHelpCircle className="text-blue-600" />
              Quizzes
            </h2>
            <div className="space-y-6">
              {course.quizzes.map((quiz: any, quizIndex: number) => (
                <div key={quizIndex} className="border border-slate-200 rounded-xl p-4">
                  <h3 className="font-semibold text-[#111827] mb-4">
                    Q{quizIndex + 1}: {quiz.question}
                  </h3>
                  <div className="space-y-2">
                    {quiz.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          optIndex === quiz.correctAnswer
                            ? "bg-green-50 border-green-300 text-green-700"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                        {option}
                        {optIndex === quiz.correctAnswer && (
                          <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enrolled Students */}
        {course.appliedUsers && course.appliedUsers.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl lg:rounded-4xl border border-slate-50 p-5 lg:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Enrolled Students ({course.appliedUsers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.appliedUsers.map((user: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
