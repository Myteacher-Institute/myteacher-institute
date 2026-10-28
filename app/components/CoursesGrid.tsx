"use client";

import { FiTerminal, FiEdit3, FiPieChart, FiSmartphone, FiStar, FiClock, FiBookOpen } from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { courseService, PopularCourse } from '@/services/course.service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const IconMap = {
  python: FiTerminal,
  design: FiEdit3,
  analytics: FiPieChart,
  marketing: FiSmartphone,
};

// Tag style mapping based on the gradient/tagColor
const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  'bg-[linear-gradient(135deg,#E0F2FE_0%,#BAE6FD_100%)]': {
    bg: 'bg-blue-50/45',
    text: 'text-[#1E40AF]'
  },
  'bg-[linear-gradient(135deg,#EDE9FE_0%,#DDD6FE_100%)]': {
    bg: 'bg-purple-50/45',
    text: 'text-[#7E22CE]'
  },
  'bg-[linear-gradient(135deg,#E8FAF3_0%,#D1FAE5_100%)]': {
    bg: 'bg-green-50/45',
    text: 'text-[#065F46]'
  },
  'bg-[linear-gradient(135deg,#FEF3C7_0%,#FDE68A_100%)]': {
    bg: 'bg-yellow-50/45',
    text: 'text-[#854D0E]'
  }
};

// CourseCard defined inside to keep the page.tsx clean
const CourseCard = ({ course, iconKey, tag, tagColor }: { course: PopularCourse; iconKey: string; tag?: string; tagColor?: string }) => {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const isDark = theme === 'dark';
  const Icon = IconMap[iconKey as keyof typeof IconMap];
  const tagStyle = TAG_STYLES[tagColor || ''];

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Store the current URL to redirect back after authentication
      sessionStorage.setItem('pendingRedirect', window.location.pathname);
      router.push('/get-started');
    } else {
      // TODO: Navigate to course enrollment/payment page
      router.push(`/course/${course._id}`);
    }
  };

  const durationInWeeks = Math.ceil(course.duration / 7);
  const averageRating = course.averageRating || 0;

  return (
    <div className={isDark ? "bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-sm flex flex-col h-full group transition-all hover:shadow-md" : "bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full group transition-all hover:shadow-md"}>
      <div className={`h-36 flex items-center justify-center ${tagColor || 'bg-gradient-to-br from-blue-50 to-blue-100'} relative`}>
        {tag && (
          <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${tagStyle.bg} backdrop-blur-sm ${tagStyle.text}`}>
            {tag}
          </span>
        )}
        <Icon size={44} className="text-[#0F1C2E] stroke-[1.5]" />
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className={isDark ? "font-bold text-[21px] leading-snug mb-4 text-white transition-colors cursor-pointer" : "font-bold text-[21px] leading-snug mb-4 text-[#0F1C2E] transition-colors cursor-pointer"}>
          {course.courseName}
        </h3>

        <div className={isDark ? "flex items-center gap-4 text-slate-300 text-[14px] font-medium mb-6" : "flex items-center gap-4 text-[#4A5E7A] text-[14px] font-medium mb-6"}>
          <div className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> {durationInWeeks} weeks</div>
          <div className="flex items-center gap-1 text-orange-500 font-bold">
            <FiStar fill="currentColor" /> {averageRating.toFixed(1)}
          </div>
        </div>

        <div className={isDark ? "mt-auto pt-4 border-t border-slate-700 flex justify-between items-center" : "mt-auto pt-4 border-t border-slate-50 flex justify-between items-center"}>
          <span className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-[#0F1C2E]"}>${course.price}</span>
          <button
            onClick={handleEnrollClick}
            className="bg-[#1E40AF] text-white px-6 py-2.5 rounded-xl font-bold text-base transition-colors shadow-sm cursor-pointer hover:bg-[#1E3A8A]"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const CoursesGrid = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<PopularCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const response = await courseService.getPopularCourses();
        if (response.status === 'success' && response.courses) {
          setCourses(response.courses);
        }
      } catch (error) {
        console.error('Failed to fetch popular courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  // Icon and tag assignment based on course name
  const getCourseMetadata = (courseName: string) => {
    const name = courseName.toLowerCase();
    if (name.includes('python') || name.includes('data') || name.includes('programming')) {
      return { iconKey: 'python', tag: 'Bestseller', tagColor: 'bg-[linear-gradient(135deg,#E0F2FE_0%,#BAE6FD_100%)]' };
    } else if (name.includes('design') || name.includes('ui') || name.includes('ux') || name.includes('figma')) {
      return { iconKey: 'design', tag: 'Most Popular', tagColor: 'bg-[linear-gradient(135deg,#EDE9FE_0%,#DDD6FE_100%)]' };
    } else if (name.includes('excel') || name.includes('analytics') || name.includes('power bi') || name.includes('business')) {
      return { iconKey: 'analytics', tag: 'New', tagColor: 'bg-[linear-gradient(135deg,#E8FAF3_0%,#D1FAE5_100%)]' };
    } else {
      return { iconKey: 'marketing', tag: 'Trending', tagColor: 'bg-[linear-gradient(135deg,#FEF3C7_0%,#FDE68A_100%)]' };
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-5">
          <div className={isDark ? "flex items-center gap-2 text-emerald-400 bg-emerald-900/30 rounded-md px-3 py-1.5 w-fit font-extrabold text-[10px] uppercase tracking-[0.2em]" : "flex items-center gap-2 text-[#1A8A5C] bg-[#E8FAF3] rounded-md px-3 py-1.5 w-fit font-extrabold text-[10px] uppercase tracking-[0.2em]"}>
            <FiStar className="h-4 w-4" />
            Popular Courses
          </div>
          <h2 className={isDark ? "text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]" : "text-4xl md:text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1]"}>
            Skills the market is hiring for
          </h2>
          <p className={isDark ? "text-slate-400 text-[16px] font-medium max-w-107.5 leading-relaxed" : "text-[#4A5E7A] text-[16px] font-medium max-w-107.5 leading-relaxed"}>
            Curated by industry professionals, updated quarterly with the latest tools and trends.
          </p>
        </div>
        <button className={isDark ? "border-2 border-slate-700 px-8 py-3.5 rounded-2xl font-bold mb-27.5 text-sm text-white transition-all active:scale-95 cursor-pointer" : "border-2 border-slate-100 px-8 py-3.5 rounded-2xl font-bold mb-27.5 text-sm text-[#0F1C2E] transition-all active:scale-95 cursor-pointer"}>
          View all 80+ courses &rarr;
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 animate-pulse bg-gray-200 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => {
            const { iconKey, tag, tagColor } = getCourseMetadata(course.courseName);
            return (
              <CourseCard
                key={course._id}
                course={course}
                iconKey={iconKey}
                tag={tag}
                tagColor={tagColor}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};