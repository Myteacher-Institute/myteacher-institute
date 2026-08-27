import { FiArrowRight as ArrowRight, FiBook, FiTrendingUp, FiAward, FiTarget } from "react-icons/fi";
import { useThemeStore } from '@/store/theme.store';
import { useEffect, useState } from 'react';
import { studentService } from '@/services/student.service';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  courseName: string;
  description: string;
  price: number;
  duration: number;
  averageRating: number;
  previewThumbnail?: string;
}

const getCourseIcon = (index: number) => {
  const icons = [
    <FiBook key="book" size={20} strokeWidth={1.5} />,
    <FiTrendingUp key="trending" size={20} strokeWidth={1.5} />,
    <FiAward key="award" size={20} strokeWidth={1.5} />,
    <FiTarget key="target" size={20} strokeWidth={1.5} />
  ];
  return icons[index % icons.length];
};

const getCourseColors = (index: number) => {
  const colors = [
    { light: 'bg-indigo-50 text-indigo-600', dark: 'bg-indigo-900/30 text-indigo-400' },
    { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-900/30 text-rose-400' },
    { light: 'bg-teal-50 text-teal-600', dark: 'bg-teal-900/30 text-teal-400' },
    { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-900/30 text-sky-400' }
  ];
  return colors[index % colors.length];
};

export const RecommendedSection = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecommendedCourses = async () => {
      try {
        setLoading(true);
        const res = await studentService.getRecommendedCourses();
        if (res.status === 'success' && res.courses) {
          setCourses(res.courses);
        } else {
          setError('Failed to load recommendations');
        }
      } catch (err) {
        console.error('Error loading recommended courses:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedCourses();
  }, []);

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`p-3 lg:p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-3/4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-500'}`}>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-500'}`}>
        <p className="text-sm">No recommendations available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((course, idx) => {
        const colors = getCourseColors(idx);
        const icon = getCourseIcon(idx);
        
        return (
          <div
            key={course._id}
            onClick={() => handleCourseClick(course._id)}
            className={isDark ? "bg-slate-800 p-3 lg:p-4 rounded-2xl border border-slate-700 flex items-center gap-3 hover:bg-slate-700 cursor-pointer transition-colors" : "bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"}
          >
            <div
              className={`w-10 h-10 ${isDark ? colors.dark : colors.light} rounded-xl flex items-center justify-center shrink-0`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={isDark ? "text-[13px] font-bold truncate text-white" : "text-[13px] font-bold truncate text-slate-800"}>{course.courseName}</h4>
              <p className="text-[11px] text-slate-400 truncate mb-1">{course.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                  View <ArrowRight size={12} />
                </span>
                {course.averageRating > 0 && (
                  <span className="text-[10px] text-slate-400">★ {course.averageRating.toFixed(1)}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};