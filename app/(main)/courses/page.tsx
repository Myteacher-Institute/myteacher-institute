import { useThemeStore } from "@/store/theme.store";
import Courses from "@/app/components/Courses";

export default function Course() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <Courses />
        </main>
    );
}
