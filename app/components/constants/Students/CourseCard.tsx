import { useThemeStore } from '@/store/theme.store';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface CourseCardProps {
  title: string;
  progress: number;
  icon: ReactNode;
  color: string;
  bg: string;
  courseId?: string;
}

export const CourseCard = ({ title, progress, icon, color, bg, courseId }: CourseCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();

  const handleContinue = () => {
    if (courseId) {
      router.push(`/learn/${courseId}`);
    }
  };

  return (
    <div className={isDark ? "bg-slate-800 p-3 lg:p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col h-full hover:border-blue-900/50 transition-colors" : "bg-white p-3 lg:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors"}>
      <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-6 min-w-0">
        <div
          className={`w-8 h-8 lg:w-12 lg:h-12 ${bg} ${color} rounded-lg lg:rounded-xl flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <h4 className={isDark ? "font-bold text-[11px] lg:text-base leading-tight line-clamp-2 text-white" : "font-bold text-[11px] lg:text-base leading-tight line-clamp-2 text-slate-800"}>
          {title}
        </h4>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-[8px] lg:text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
          <span>PROGRESS</span>
          <span>{progress}%</span>
        </div>
        <div className={isDark ? "h-1 lg:h-2 bg-slate-700 rounded-full overflow-hidden mb-3" : "h-1 lg:h-2 bg-slate-100 rounded-full overflow-hidden mb-3"}>
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button
          onClick={handleContinue}
          className="w-full py-2 lg:py-3 bg-blue-600 text-white text-[10px] lg:text-sm font-bold rounded-lg lg:rounded-xl active:scale-95 transition-transform hover:bg-blue-700 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
