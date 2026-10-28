"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/theme.store';
import { courseService, PopularCourse } from '@/services/course.service';
import { FiClock, FiStar } from 'react-icons/fi';

export default function CategoryPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { category } = useParams();
  const router = useRouter();
  const [courses, setCourses] = useState<PopularCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesByCategory = async () => {
      try {
        const response = await courseService.getPopularCourses();
        if (response.status === 'success' && response.courses) {
          setCourses(response.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByCategory();
  }, [category]);

  const categoryTitle = category?.replace('-', ' ') || 'Courses';

  const handleEnrollClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const durationInWeeks = (duration: number) => Math.ceil(duration / 7);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="py-20 px-6 max-w-7xl mx-auto font-sans">
        <div className="space-y-5 mb-16">
          <h1 className={isDark ? "text-5xl font-black text-white tracking-tight leading-[1.1]" : "text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1]"}>
            {categoryTitle}
          </h1>
          <p className={isDark ? "text-slate-400 text-xl font-medium max-w-2xl leading-relaxed" : "text-[#4A5E7A] text-xl font-medium max-w-2xl leading-relaxed"}>
            Master in-demand skills with our comprehensive courses. Learn from industry experts and get certified.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 animate-pulse bg-gray-200 rounded-3xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className={isDark ? "text-slate-400 text-xl" : "text-[#4A5E7A] text-xl"}>
              No courses available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className={isDark ? "bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-sm flex flex-col h-full group transition-all hover:shadow-md" : "bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full group transition-all hover:shadow-md"}>
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>

                <div className="p-6 flex flex-col grow">
                  <h3 className={isDark ? "font-bold text-2xl leading-snug mb-4 text-white" : "font-bold text-2xl leading-snug mb-4 text-[#0F1C2E]"}>
                    {course.courseName}
                  </h3>

                  <div className={isDark ? "flex items-center gap-4 text-slate-300 text-base font-medium mb-6" : "flex items-center gap-4 text-[#4A5E7A] text-base font-medium mb-6"}>
                    <div className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> {durationInWeeks(course.duration)} weeks</div>
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <FiStar fill="currentColor" /> {(course.averageRating || 0).toFixed(1)}
                    </div>
                  </div>

                  <div className={isDark ? "mt-auto pt-4 border-t border-slate-700 flex justify-between items-center" : "mt-auto pt-4 border-t border-slate-50 flex justify-between items-center"}>
                    <span className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-[#0F1C2E]"}>${course.price}</span>
                    <button
                      onClick={() => handleEnrollClick(course._id)}
                      className="bg-[#1E40AF] text-white px-6 py-2.5 rounded-xl font-bold text-base transition-colors shadow-sm cursor-pointer hover:bg-[#1E3A8A]"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
