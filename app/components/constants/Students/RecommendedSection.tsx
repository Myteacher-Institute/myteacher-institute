import { FiArrowRight as ArrowRight } from "react-icons/fi";
import { useThemeStore } from '@/store/theme.store';

// Add the RECOMMENDED data directly here
const RECOMMENDED = [
  {
    t: "ML Basics",
    d: "Next in Data Science",
    i: <Bot size={20} strokeWidth={1.5} />,
    c: "bg-indigo-50 text-indigo-600",
    cDark: "bg-indigo-900/30 text-indigo-400",
  },
  {
    t: "Mobile Apps",
    d: "Expand React skills",
    i: <Smartphone size={20} strokeWidth={1.5} />,
    c: "bg-rose-50 text-rose-600",
    cDark: "bg-rose-900/30 text-rose-400",
  },
  {
    t: "Backend Dev",
    d: "Server-side logic",
    i: <Terminal size={20} strokeWidth={1.5} />,
    c: "bg-teal-50 text-teal-600",
    cDark: "bg-teal-900/30 text-teal-400",
  },
  {
    t: "Cloud Computing",
    d: "Scale your apps",
    i: <Database size={20} strokeWidth={1.5} />,
    c: "bg-sky-50 text-sky-600",
    cDark: "bg-sky-900/30 text-sky-400",
  },
];

// You also need to import the icons used in RECOMMENDED
import { FiCpu as Bot, FiSmartphone as Smartphone, FiTerminal as Terminal, FiDatabase as Database } from "react-icons/fi";

export const RecommendedSection = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      {RECOMMENDED.map((rec, idx) => (
        <div
          key={idx}
          className={isDark ? "bg-slate-800 p-3 lg:p-4 rounded-2xl border border-slate-700 flex items-center gap-3 hover:bg-slate-700 cursor-pointer transition-colors" : "bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"}
        >
          <div
            className={`w-10 h-10 ${isDark ? rec.cDark : rec.c} rounded-xl flex items-center justify-center shrink-0`}
          >
            {rec.i}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={isDark ? "text-[13px] font-bold truncate text-white" : "text-[13px] font-bold truncate text-slate-800"}>{rec.t}</h4>
            <p className="text-[11px] text-slate-400 truncate mb-1">{rec.d}</p>
            <button className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
              View <ArrowRight size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};