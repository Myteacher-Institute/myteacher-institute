"use client";

import { useThemeStore } from "@/store/theme.store";
import AiLearn from "@/app/components/AiLearn";

export default function StudentAITutorPage() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <AiLearn redirectUrl="/student/ai-tutor/tokens/callback" />
        </main>
    );
}