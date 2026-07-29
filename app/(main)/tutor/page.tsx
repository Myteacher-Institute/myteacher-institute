import { useThemeStore } from "@/store/theme.store";
import AiLearn from "@/app/components/AiLearn";

export default function AiLearningAssistant() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <AiLearn />
        </main>
    );
}
