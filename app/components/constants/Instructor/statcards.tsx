import { useThemeStore } from '@/store/theme.store';

export const StatCard = ({ label, value, icon, iconBgColor }: any) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? "bg-slate-800 p-4 lg:p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between min-w-42.5 md:min-w-0 flex-1 snap-center" : "bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-w-42.5 md:min-w-0 flex-1 snap-center"}>
      <div className="min-w-0 mr-2">
        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className={isDark ? "text-xl lg:text-2xl font-extrabold text-white" : "text-xl lg:text-2xl font-extrabold text-slate-900"}>
          {value}
        </p>
      </div>
      <div
        className={`w-10 h-10 lg:w-12 lg:h-12 ${iconBgColor} rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm`}
      >
        {icon}
      </div>
    </div>
  );
};
