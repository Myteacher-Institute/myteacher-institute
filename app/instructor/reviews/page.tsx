"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiStar, FiMenu, FiMessageSquare } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  ratedAt: Date;
  courseName: string;
  courseId: string;
  averageRating: number;
}

export default function InstructorReviewsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/get-started';
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get('/api/course/instructor-reviews');
      if (res.data.status === 'success') {
        setReviews(res.data.reviews);
      } else {
        setError("Failed to load reviews");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        size={16}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
        <InstructorSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePath="/instructor/reviews"
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
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-20 w-full bg-slate-200 rounded animate-pulse"></div>
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
        activePath="/instructor/reviews"
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
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className={`text-xl lg:text-2xl font-medium ${isDark ? 'text-white' : 'text-[#111827]'}`}>Course Reviews</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                See what students are saying about your courses
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchReviews}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
            <FiMessageSquare className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={48} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>No reviews yet</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              When students review your courses, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`rounded-2xl border p-6 transition-colors ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-[#FFFFFF] border-slate-100 hover:bg-slate-50'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {review.userName}
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatDate(review.ratedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className={`mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="text-xs font-medium">Course: </span>
                  <span className="text-xs">{review.courseName}</span>
                </div>

                {review.comment && (
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}