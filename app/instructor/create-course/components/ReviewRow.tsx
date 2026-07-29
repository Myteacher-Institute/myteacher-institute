import { useThemeStore } from "@/store/theme.store";

interface ReviewRowProps {
  label: string;
  value: string;
  multiline?: boolean;
}

export const ReviewRow = ({ label, value, multiline }: ReviewRowProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#111827]"} ${multiline ? "leading-relaxed" : ""}`}>
        {value || <span className="text-slate-300 font-normal italic">—</span>}
      </p>
    </div>
  );
};
