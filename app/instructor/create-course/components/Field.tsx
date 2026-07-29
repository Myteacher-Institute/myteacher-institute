import { useThemeStore } from "@/store/theme.store";

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const Field = ({ label, error, children }: FieldProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div>
      <label className={isDark ? "block text-sm font-semibold text-white mb-1.5" : "block text-sm font-semibold text-[#111827] mb-1.5"}>{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
