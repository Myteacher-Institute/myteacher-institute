'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiSearch,
  FiStar,
  FiClock,
  FiUser,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';

import { FaStarHalfAlt } from 'react-icons/fa';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { courseService, BrowseCourse } from '@/services/course.service';

// --- Style Config ---
const TAG_CONFIG: Record<string, string> = {
  bestseller: "bg-emerald-50 text-emerald-600 border-emerald-100",
  popular: "bg-orange-50 text-orange-600 border-orange-100",
  new: "bg-blue-50 text-blue-600 border-blue-100",
  creative: "bg-purple-50 text-purple-600 border-purple-100",
};

const CATEGORIES = ['All', 'Software', 'Data', 'Design', 'Basics'];
const PAGE_SIZE = 9;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format";

// Derive a display tag from the average rating so cards keep a badge.
const getTag = (rating: number): { label: string; type: 'bestseller' | 'popular' | 'new' } => {
  if (rating >= 4.8) return { label: 'Best Seller', type: 'bestseller' };
  if (rating >= 4.5) return { label: 'Popular', type: 'popular' };
  return { label: 'New', type: 'new' };
};

// --- Sub-Component ---
const CourseCard: React.FC<{ course: BrowseCourse; onEnroll: (courseId: string) => void }> = ({ course, onEnroll }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const tag = getTag(course.averageRating || 0);

  // Helper to render the star rating
  const renderStars = (rating: number) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-0.5 text-orange-500">
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) {
            return <FiStar key={i} fill="currentColor" size={14} />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStarHalfAlt key={i} fill="currentColor" size={14} />;
          }
          return <FiStar key={i} size={14} className="text-slate-300" />;
        })}
        <span className="ml-1 text-slate-400 text-xs">{rating}</span>
      </div>
    );
  };

  return (
    <div className={isDark ? "bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group" : "bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"}>
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.previewThumbnail || FALLBACK_IMAGE}
          alt={course.courseName}
          width={512}
          height={176}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* TAG & STARS ABOVE TITLE */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${TAG_CONFIG[tag.type]}`}>
            {tag.label}
          </span>
          {renderStars(course.averageRating || 0)}
        </div>

        <div className="flex justify-between items-start gap-2 mb-5 cursor-pointer ">
          <h3 className={isDark ? "font-bold text-[17px] text-white leading-tight group-hover:text-blue-400 transition-colors" : "font-bold text-[17px] text-[#0F1C2E] leading-tight group-hover:text-blue-700 transition-colors"}>
            {course.courseName}
          </h3>
        </div>

        <p className={isDark ? "text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4" : "text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4"}>
          {course.description}
        </p>

        <div className={isDark ? "flex justify-between items-center gap-3 text-slate-400 text-[11px] font-medium mb-6" : "flex justify-between items-center gap-3 text-slate-400 text-[11px] font-medium mb-6"}>
          <div className="flex items-center gap-1"><FiUser size={13} /> {course.instructorName || 'MyTeacher Institute'}</div>
          <div className="flex items-center gap-1"><FiClock size={13} /> {course.duration} weeks</div>
        </div>

        <div className={isDark ? "mt-auto pt-4 border-t border-slate-700 flex justify-between items-center" : "mt-auto pt-4 border-t border-slate-50 flex justify-between items-center"}>
          <span className={isDark ? "text-xl font-black text-white" : "text-xl font-black text-[#0F1C2E]"}>${course.price}</span>
          <button onClick={() => onEnroll(course._id)} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md cursor-pointer ">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function AllCoursesPage() {
  const [courses, setCourses] = useState<BrowseCourse[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const isDark = theme === 'dark';

  // "Enroll Now" — unauthenticated visitors are routed through the guest auth
  // flow (get-started) and returned here after signing in; authenticated users
  // open the protected MS-Store-style course purchase page.
  const handleEnroll = useCallback(
    (courseId: string) => {
      if (!isAuthenticated) {
        router.push(`/get-started?redirect=${encodeURIComponent(`/course/${courseId}`)}`);
        return;
      }
      router.push(`/course/${courseId}`);
    },
    [isAuthenticated, router]
  );

  const fetchCourses = useCallback(
    async (pageNum: number, searchTerm: string, category: string, append: boolean) => {
      setLoading(true);
      try {
        const res = await courseService.browseCourses({
          page: pageNum,
          limit: PAGE_SIZE,
          search: searchTerm.trim() || undefined,
          category,
        });
        const list = res?.courses ?? [];
        setCourses((prev) => (append ? [...prev, ...list] : list));
        setHasMore(!!res?.pagination?.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    []
  );

  // Initial load + search (debounced) + category changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(1, search, filter, false);
    }, search.trim() ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search, filter, fetchCourses]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchCourses(page + 1, search, filter, true);
  };

  return (
    <div className={isDark ? "bg-slate-900 min-h-screen font-sans pb-20" : "bg-[#F8FAFC] min-h-screen font-sans pb-20"}>
      {/* Hero Header */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className={isDark ? "text-4xl md:text-5xl font-black text-white mb-4 tracking-tight" : "text-4xl md:text-5xl font-black text-[#0F1C2E] mb-4 tracking-tight"}>
          All Courses
        </h1>
        <p className={isDark ? "text-slate-400 font-medium text-lg mb-10" : "text-slate-500 font-medium text-lg mb-10"}>
          Explore and choose your preferred learning path
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10 group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className={isDark ? "w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm focus:ring-4 focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all text-white font-medium" : "w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-600 font-medium"}
          />
        </div>

        {/* AI Banner */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={isDark ? "bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-sm flex items-center gap-3" : "bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-3"}>
            <div className="bg-blue-500 p-1 rounded-full"><FiZap size={14} className="text-white" /></div>
            <span className={isDark ? "text-sm font-semibold text-slate-300" : "text-sm font-semibold text-slate-600"}>Not sure what to learn?</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ">
              Get AI Recommendation
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : (isDark ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-pointer hover:border-blue-500' : 'bg-white text-slate-500 border border-slate-100 cursor-pointer hover:border-blue-200')
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {initialLoading && courses.length === 0 ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-slate-500 text-sm font-medium py-24">
            No courses found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} onEnroll={handleEnroll} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!initialLoading && courses.length > 0 && (
          <div className="flex justify-center mt-16">
            <button
              onClick={loadMore}
              disabled={loading || !hasMore}
              className="flex items-center gap-2 px-8 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Courses'} <FiChevronRight />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
